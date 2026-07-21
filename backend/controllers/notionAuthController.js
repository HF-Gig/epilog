import { supabase } from "../config/clients.js";

export const redirectToNotionAuth = (req, res) => {
  const { workspaceId } = req.query;

  if (!workspaceId) {
    return res.status(400).json({
      success: false,
      message: "Missing workspaceId query parameter",
    });
  }

  const clientId = process.env.NOTION_CLIENT_ID || "";
  const redirectUri = process.env.NOTION_REDIRECT_URI || "";
  const authUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&state=${workspaceId}`;

  console.log(`[Notion OAuth] Redirecting workspace ${workspaceId} to Notion authorization page`);
  res.redirect(authUrl);
};

export const handleNotionCallback = async (req, res, next) => {
  try {
    const { code, state: workspaceId, error } = req.query;

    if (error) {
      res.status(400);
      throw new Error(`Notion OAuth error: ${error}`);
    }

    if (!code) {
      res.status(400);
      throw new Error("No authorization code returned from Notion");
    }

    if (!workspaceId) {
      res.status(400);
      throw new Error("Missing state parameter (workspaceId)");
    }

    console.log(`[Notion OAuth Callback] Exchanging authorization code for workspace: ${workspaceId}`);

    const clientId = process.env.NOTION_CLIENT_ID || "";
    const clientSecret = process.env.NOTION_CLIENT_SECRET || "";
    const redirectUri = process.env.NOTION_REDIRECT_URI || "";
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    // Server-to-server POST exchange to Notion token endpoint
    const response = await fetch("https://api.notion.com/v1/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      res.status(400);
      throw new Error(data.error_description || data.error || "Notion token exchange failed");
    }

    const { access_token, duplicated_template_id, bot_id } = data;
    const targetFolderId = duplicated_template_id || bot_id || null;

    console.log(`[Notion OAuth Callback] Upserting connection info into Supabase for workspace: ${workspaceId}`);

    // Upsert Notion connection metadata into Supabase integrations table
    const { error: dbError } = await supabase
      .from("integrations")
      .upsert(
        {
          workspace_id: workspaceId,
          platform: "notion",
          api_token: access_token,
          target_folder_id: targetFolderId,
          is_active: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "workspace_id,platform" }
      );

    if (dbError) {
      res.status(500);
      throw new Error(`Supabase Upsert Failed: ${dbError.message}`);
    }

    console.log("[Notion OAuth Callback] Notion successfully connected! Redirecting to dashboard.");
    res.redirect("http://localhost:5173/dashboard?success=notion_connected");
  } catch (error) {
    next(error);
  }
};
