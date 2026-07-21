import { supabase, ai, slackClient } from "../config/clients.js";
import pkgNotion from "@notionhq/client";

const { Client: NotionClient } = pkgNotion;

// Asynchronous background execution function
const processAndSyncThread = async (channel, ts, team_id) => {
  try {
    console.log(
      `[Webhook Background] Fetching Slack conversation replies for channel: ${channel}, ts: ${ts}`,
    );

    const repliesRes = await slackClient.conversations.replies({
      channel,
      ts,
    });

    if (!repliesRes.messages || repliesRes.messages.length === 0) {
      console.warn("[Webhook Background] No conversation replies retrieved.");
      return;
    }

    // Gather thread context
    const threadText = repliesRes.messages
      .map((msg) => `${msg.user || "User"}: ${msg.text}`)
      .join("\n\n");

    console.log(
      "[Webhook Background] Generating structured summary using Google Gemini...",
    );
    const prompt = `You are a senior technical writer and software engineer.
Analyze the following Slack discussion thread and compile it into a clean, professional, and factual markdown wiki document.

Rules:
1. DO NOT generate placeholder templates, generic headers, or empty checklist items (avoid "[Insert Date]", "To be updated", "[Pending]", etc.).
2. Extract the actual issue, the root cause, and the fix/resolution from the conversation. If a resolution is stated, mark the status as "Resolved".
3. Keep the document clear, concise, and focused on the facts discussed. Do not invent details not present in the thread.
4. Structure the output with a clear title (using a single # heading), a brief summary of the issue, the root cause/fix details, and the resolution status.

Discussion Thread:
${threadText}`;

    const aiRes = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
    });

    const summary = aiRes.text || "Failed to compile summary.";
    const documentTitle =
      summary.split("\n")[0].replace(/[#*]/g, "").trim() ||
      "Epilog Sync Document";

    console.log(
      "[Webhook Background] Looking up Notion config for workspace:",
      team_id,
    );

    // Look up workspace-specific Notion credentials
    const { data: notionConfig, error: configError } = await supabase
      .from("notion_configs")
      .select("database_id, api_key")
      .eq("workspace_id", team_id)
      .eq("is_active", true)
      .maybeSingle();

    if (configError || !notionConfig) {
      console.warn(
        "[Webhook Background] No Notion config found for workspace:",
        team_id,
        "— skipping Notion push.",
      );
      await supabase.from("wiki_syncs").insert({
        channel_id: channel,
        message_ts: ts,
        workspace_id: team_id,
        title: "[Skipped] Notion not configured",
        status: "failed",
        error_message: "No Notion configuration found for this workspace",
        synced_at: new Date().toISOString(),
        source: "slack",
      });
      return;
    }

    const workspaceNotionClient = new NotionClient({
      auth: notionConfig.api_key,
    });

    console.log(
      "[Webhook Background] Pushing compiled wiki page into Notion...",
    );
    const notionRes = await workspaceNotionClient.pages.create({
      parent: { database_id: notionConfig.database_id },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: documentTitle,
              },
            },
          ],
        },
      },
      children: [
        {
          object: "block",
          type: "heading_1",
          heading_1: {
            rich_text: [
              {
                type: "text",
                text: { content: documentTitle },
              },
            ],
          },
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: { content: summary.substring(0, 2000) },
              },
            ],
          },
        },
      ],
    });

    console.log(
      "[Webhook Background] Logging execution history to Supabase...",
    );
    const firstMessageText = repliesRes.messages[0]?.text || "";
    const slackPreviewSnippet = firstMessageText.substring(0, 300);

    const { error: dbError } = await supabase.from("wiki_syncs").insert({
      channel_id: channel,
      message_ts: ts,
      workspace_id: team_id,
      title: documentTitle,
      status: "completed",
      synced_at: new Date().toISOString(),
      markdown: summary,
      slack_preview: slackPreviewSnippet,
      source: "slack",
      notion_page_id: notionRes.id,
    });

    if (dbError) {
      console.error(
        "[Webhook Background] Supabase logging error:",
        dbError.message,
      );
    } else {
      console.log("[Webhook Background] Thread sync logged successfully!");
    }
  } catch (error) {
    console.error("[Webhook Background] Execution failed:", error.message);
  }
};

export const handleSlackWebhook = async (req, res, next) => {
  try {
    // 🌟 ADD THIS TEMPORARY LOG TO EXPOSE THE PAYLOAD 🌟
    console.log(
      "[Slack Webhook Triggered] Full Incoming Body:",
      JSON.stringify(req.body, null, 2),
    );

    const { type, challenge, event, team_id } = req.body;

    // Slack Endpoint Verification Challenge
    if (type === "url_verification") {
      console.log(
        "[Slack Webhook] Responding to challenge verification request",
      );
      return res.status(200).json({ challenge });
    }

    // Process event callback
    if (type === "event_callback" && event) {
      const { type: eventType, reaction, item } = event;

      if (eventType === "reaction_added") {
        // Look up this workspace's configured trigger emojis from the DB
        // Slack sends reaction names without the colon, e.g. "memo" for 📝
        let activeTriggers = ["memo", "pencil2"]; // safe default fallback

        if (team_id && team_id !== "unknown") {
          const { data: triggerRows } = await supabase
            .from("workspace_triggers")
            .select("emoji")
            .eq("workspace_id", team_id)
            .eq("is_active", true);

          if (triggerRows && triggerRows.length > 0) {
            // DB stores the emoji character (e.g. 📝); Slack sends the name (e.g. "memo")
            // We store the Slack reaction name directly when the user types it in the Triggers tab
            activeTriggers = triggerRows.map((r) => r.emoji);
          }
        }

        console.log(
          `[Slack Webhook] Reaction '${reaction}' received. Active triggers:`,
          activeTriggers,
        );

        if (activeTriggers.includes(reaction)) {
          const { channel, ts } = item;

          // Return 200 immediately to Slack to prevent webhook timeout
          res
            .status(200)
            .json({ success: true, message: "Sync job initiated" });

          // Trigger background summarization task asynchronously
          processAndSyncThread(channel, ts, team_id || "unknown").catch(
            (err) => {
              console.error(
                "[Slack Webhook] Background task unhandled error:",
                err,
              );
            },
          );
          return;
        }
      }
    }

    res.status(200).json({ success: true, message: "Event skipped" });
  } catch (error) {
    next(error);
  }
};
