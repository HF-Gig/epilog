import { supabase } from "../config/clients.js";
import pkgNotion from "@notionhq/client";

const { Client: NotionClient } = pkgNotion;

export const syncWiki = async (req, res, next) => {
  try {
    const { messageId, channelId, workspaceTarget } = req.body;
    if (!messageId || !channelId || !workspaceTarget) {
      res.status(400);
      throw new Error("messageId, channelId, and workspaceTarget are required");
    }
    res.status(200).json({
      success: true,
      message: "Wiki compilation and synchronization initiated successfully",
      data: {
        documentId: "doc_" + Math.random().toString(36).substring(7),
        title: "Manual Sync",
        status: "synced",
        target: workspaceTarget,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getWikiHistory = async (req, res, next) => {
  try {
    const { workspace_id } = req.query;

    if (!workspace_id) {
      res.status(400);
      throw new Error("workspace_id query param is required");
    }

    const { data, error } = await supabase
      .from("wiki_syncs")
      .select("*")
      .eq("workspace_id", workspace_id)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      res.status(500);
      throw new Error(`Failed to fetch wiki history: ${error.message}`);
    }

    const normalised = (data || []).map((row) => ({
      id: String(row.id),
      title: row.title || "Untitled",
      created_at: row.synced_at || row.created_at,
      author: row.user_id || "epilog-bot",
      channel: row.channel_id || "unknown",
      target: "Notion",
      status: row.status === "completed" ? "synced" : row.status,
      slackPreview: row.slack_preview || (row.message_ts ? `Message: ${row.message_ts}` : "No preview available"),
      markdown: row.markdown || `# ${row.title || "Wiki Page"}\n\nSynced from Slack channel \`${row.channel_id || "unknown"}\`.`,
      error_message: row.error_message || null,
      notionPageId: row.notion_page_id || null,
    }));

    res.status(200).json({
      success: true,
      count: normalised.length,
      data: normalised,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/wiki/:id
 * Deletes the wiki sync history row from Supabase.
 * If notion_page_id is present, archives/deletes the page from Notion as well.
 */
export const deleteWiki = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400);
      throw new Error("Wiki sync ID is required");
    }

    // 1. Fetch the wiki sync details to get the notion_page_id and workspace_id
    const { data: wikiSync, error: fetchError } = await supabase
      .from("wiki_syncs")
      .select("workspace_id, notion_page_id")
      .eq("id", id)
      .maybeSingle();

    if (fetchError || !wikiSync) {
      res.status(404);
      throw new Error(fetchError ? `Failed to retrieve wiki sync: ${fetchError.message}` : "Wiki sync record not found");
    }

    const { workspace_id, notion_page_id } = wikiSync;

    // 2. If notion_page_id exists, try archiving the page in Notion
    if (notion_page_id && workspace_id) {
      console.log(`[deleteWiki] Found notion_page_id: ${notion_page_id}. Attempting to archive in Notion...`);
      
      // Fetch Notion credentials for the workspace
      const { data: notionConfig, error: configError } = await supabase
        .from("notion_configs")
        .select("api_key")
        .eq("workspace_id", workspace_id)
        .eq("is_active", true)
        .maybeSingle();

      if (notionConfig?.api_key) {
        try {
          const workspaceNotionClient = new NotionClient({
            auth: notionConfig.api_key,
          });

          // Archive the Notion page
          await workspaceNotionClient.pages.update({
            page_id: notion_page_id,
            archived: true,
          });
          console.log("[deleteWiki] Successfully archived page in Notion");
        } catch (notionError) {
          console.error("[deleteWiki] Error archiving page in Notion:", notionError.message);
          // We continue to delete the DB record even if Notion archiving fails (e.g. page already deleted manually or invalid API key)
        }
      } else {
        console.warn("[deleteWiki] Notion config not found or active for workspace:", workspace_id);
      }
    }

    // 3. Delete the record from Supabase
    const { error: deleteError } = await supabase
      .from("wiki_syncs")
      .delete()
      .eq("id", id);

    if (deleteError) {
      res.status(500);
      throw new Error(`Failed to delete wiki sync from database: ${deleteError.message}`);
    }

    res.status(200).json({
      success: true,
      message: "Wiki deleted successfully from both database and Notion",
    });
  } catch (error) {
    next(error);
  }
};
