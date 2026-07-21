import { supabase } from "../config/clients.js";

/**
 * GET /api/triggers?workspace_id=xxx
 * Returns all active trigger emojis for the workspace.
 */
export const getTriggers = async (req, res, next) => {
  try {
    const { workspace_id } = req.query;
    if (!workspace_id) {
      res.status(400);
      throw new Error("workspace_id query param is required");
    }

    const { data, error } = await supabase
      .from("workspace_triggers")
      .select("id, emoji, is_active, created_at")
      .eq("workspace_id", workspace_id)
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (error) {
      res.status(500);
      throw new Error(`Failed to fetch triggers: ${error.message}`);
    }

    res.status(200).json({
      success: true,
      triggers: (data || []).map((r) => r.emoji),
      raw: data || [],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/triggers
 * Add a trigger emoji for the workspace.
 * Body: { workspace_id, emoji }
 */
export const addTrigger = async (req, res, next) => {
  try {
    const { workspace_id, emoji } = req.body;
    if (!workspace_id || !emoji) {
      res.status(400);
      throw new Error("workspace_id and emoji are required");
    }

    const { data, error } = await supabase
      .from("workspace_triggers")
      .upsert(
        { workspace_id, emoji, is_active: true },
        { onConflict: "workspace_id,emoji" }
      )
      .select()
      .single();

    if (error) {
      res.status(500);
      throw new Error(`Failed to add trigger: ${error.message}`);
    }

    res.status(201).json({
      success: true,
      message: `Trigger '${emoji}' added`,
      trigger: data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/triggers
 * Remove a trigger emoji for the workspace.
 * Body: { workspace_id, emoji }
 */
export const removeTrigger = async (req, res, next) => {
  try {
    const { workspace_id, emoji } = req.body;
    if (!workspace_id || !emoji) {
      res.status(400);
      throw new Error("workspace_id and emoji are required");
    }

    const { error } = await supabase
      .from("workspace_triggers")
      .delete()
      .eq("workspace_id", workspace_id)
      .eq("emoji", emoji);

    if (error) {
      res.status(500);
      throw new Error(`Failed to remove trigger: ${error.message}`);
    }

    res.status(200).json({
      success: true,
      message: `Trigger '${emoji}' removed`,
    });
  } catch (error) {
    next(error);
  }
};
