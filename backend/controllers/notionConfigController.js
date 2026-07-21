import { supabase } from "../config/clients.js";
import pkgNotion from "@notionhq/client";

const { Client: NotionClient } = pkgNotion;

/**
 * POST /api/notion/config
 * Save (upsert) a workspace's Notion database ID and API key.
 * Body: { workspace_id, database_id, api_key, label? }
 */
export const saveNotionConfig = async (req, res, next) => {
  try {
    const { workspace_id, database_id, api_key, label } = req.body;

    if (!workspace_id || !database_id || !api_key) {
      res.status(400);
      throw new Error("workspace_id, database_id, and api_key are required");
    }

    // Strip any dashes/spaces from the database_id (Notion IDs are sometimes formatted)
    const cleanDbId = database_id.replace(/[-\s]/g, "");

    const { data, error } = await supabase
      .from("notion_configs")
      .upsert(
        {
          workspace_id,
          database_id: cleanDbId,
          api_key,
          label: label || "My Notion DB",
          is_active: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "workspace_id" }
      )
      .select()
      .single();

    if (error) {
      res.status(500);
      throw new Error(`Failed to save Notion config: ${error.message}`);
    }

    res.status(200).json({
      success: true,
      message: "Notion configuration saved successfully",
      config: {
        id: data.id,
        workspace_id: data.workspace_id,
        database_id: data.database_id,
        label: data.label,
        is_active: data.is_active,
        updated_at: data.updated_at,
        // Never return the raw api_key
        api_key: "****" + api_key.slice(-4),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/notion/config?workspace_id=xxx
 * Fetch the Notion config for a workspace. API key is masked.
 */
export const getNotionConfig = async (req, res, next) => {
  try {
    const { workspace_id } = req.query;

    if (!workspace_id) {
      res.status(400);
      throw new Error("workspace_id query param is required");
    }

    const { data, error } = await supabase
      .from("notion_configs")
      .select("id, workspace_id, database_id, label, is_active, updated_at")
      .eq("workspace_id", workspace_id)
      .maybeSingle();

    if (error) {
      res.status(500);
      throw new Error(`Failed to fetch Notion config: ${error.message}`);
    }

    if (!data) {
      return res.status(200).json({
        success: true,
        configured: false,
        config: null,
      });
    }

    res.status(200).json({
      success: true,
      configured: true,
      config: data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/notion/config
 * Remove the Notion config for a workspace.
 * Body: { workspace_id }
 */
export const deleteNotionConfig = async (req, res, next) => {
  try {
    const { workspace_id } = req.body;

    if (!workspace_id) {
      res.status(400);
      throw new Error("workspace_id is required");
    }

    const { error } = await supabase
      .from("notion_configs")
      .delete()
      .eq("workspace_id", workspace_id);

    if (error) {
      res.status(500);
      throw new Error(`Failed to delete Notion config: ${error.message}`);
    }

    res.status(200).json({
      success: true,
      message: "Notion configuration removed successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/notion/test
 * Test provided Notion credentials by fetching the database metadata.
 * Body: { database_id, api_key }
 * Returns the database title on success.
 */
export const testNotionConfig = async (req, res, next) => {
  try {
    const { database_id, api_key } = req.body;

    if (!database_id || !api_key) {
      res.status(400);
      throw new Error("database_id and api_key are required");
    }

    const cleanDbId = database_id.replace(/[-\s]/g, "");

    // Create a one-off Notion client with the provided key
    const testClient = new NotionClient({ auth: api_key });

    let dbInfo;
    try {
      dbInfo = await testClient.databases.retrieve({ database_id: cleanDbId });
    } catch (notionError) {
      res.status(400);
      throw new Error(
        `Notion connection failed: ${notionError.message || "Invalid credentials or database ID"}`
      );
    }

    // Extract title from Notion database object
    const titleArr = dbInfo?.title;
    const dbTitle =
      titleArr && titleArr.length > 0
        ? titleArr.map((t) => t.plain_text).join("")
        : "Untitled Database";

    res.status(200).json({
      success: true,
      message: "Notion connection successful",
      database_title: dbTitle,
      database_id: cleanDbId,
    });
  } catch (error) {
    next(error);
  }
};
