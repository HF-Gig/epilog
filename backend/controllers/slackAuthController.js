import { supabase } from "../config/clients.js";
import pkgSlack from "@slack/web-api";
import { generateToken } from "../config/tokenHelper.js";
const { WebClient } = pkgSlack;

export const redirectToSlackAuth = (req, res) => {
  const clientId = process.env.SLACK_CLIENT_ID || "";
  const redirectUri = process.env.SLACK_REDIRECT_URI || "";

  const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=commands,reactions:read,channels:history,users:read&user_scope=users:read.email&redirect_uri=${encodeURIComponent(
    redirectUri,
  )}&state=mock-state-123`;

  console.log("[Slack OAuth] Redirecting client to Slack authorization page");
  res.redirect(slackAuthUrl);
};

export const handleSlackCallback = async (req, res, next) => {
  try {
    const { code, error } = req.query;

    if (error || !code) {
      console.warn(
        `[Slack OAuth Callback] Authorization rejected or failed: ${error || "no code"}`,
      );
      return res.redirect("http://localhost:5173/signup?error=slack_denied");
    }

    console.log(
      `[Slack OAuth Callback] Requesting token exchange using code: ${code}`,
    );

    const params = new URLSearchParams({
      client_id: process.env.SLACK_CLIENT_ID || "",
      client_secret: process.env.SLACK_CLIENT_SECRET || "",
      code,
      redirect_uri: process.env.SLACK_REDIRECT_URI || "",
    });

    const response = await fetch("https://slack.com/api/oauth.v2.access", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const tokenData = await response.json();

    if (!response.ok || !tokenData.ok) {
      console.error("[Slack OAuth Callback] Token exchange failed:", tokenData);
      return res.redirect(
        "http://localhost:5173/signup?error=slack_token_exchange_failed",
      );
    }

    console.log(
      "[Slack OAuth Callback] Token exchange successful! Fetching user metadata...",
    );

    const botToken = tokenData.access_token;
    const userToken = tokenData.authed_user?.access_token || botToken;
    const tempSlackClient = new WebClient(userToken);
    let ownerEmail = "";
    let ownerName = "Slack User";
    let ownerAvatar = "";

    if (tokenData.authed_user?.id) {
      try {
        const userProfile = await tempSlackClient.users.info({
          user: tokenData.authed_user.id,
        });
        if (userProfile.ok && userProfile.user) {
          ownerEmail = userProfile.user.profile?.email || "";
          ownerName =
            userProfile.user.real_name || userProfile.user.name || "Slack User";
          ownerAvatar =
            userProfile.user.profile?.image_512 ||
            userProfile.user.profile?.image_192 ||
            "";
        }
      } catch (err) {
        console.warn(
          "[Slack OAuth Callback] Failed to fetch user profile metrics:",
          err.message,
        );
      }
    }

    console.log(
      `[Slack OAuth Callback] Upserting team credentials into Supabase workspaces table...`,
    );

    const { data: dbData, error: dbError } = await supabase
      .from("workspaces")
      .upsert(
        {
          team_id: tokenData.team?.id || "unknown_team",
          slack_team_id: tokenData.team?.id || "unknown_team",
          team_name: tokenData.team?.name || "Unknown Workspace",
          slack_team_name: tokenData.team?.name || "Unknown Workspace",
          owner_email: ownerEmail || "owner@slack-workspace.com",
          owner_name: ownerName,
          owner_avatar: ownerAvatar,
          access_token: botToken,
          user_access_token: tokenData.authed_user?.access_token || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "team_id" },
      )
      .select();

    if (dbError) {
      res.status(500);
      throw new Error(`Supabase workspaces upsert failed: ${dbError.message}`);
    }

    const targetEmail = ownerEmail || `${tokenData.authed_user?.id || "unknown"}@slack.com`;

    console.log(
      `[Slack OAuth Callback] Checking if user already exists in Supabase 'users' table...`,
    );
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", targetEmail)
      .maybeSingle();

    if (checkError) {
      console.warn(`[Slack OAuth Callback] Existing user check warning: ${checkError.message}`);
    }

    const isLogin = !!existingUser;

    console.log(
      `[Slack OAuth Callback] Registering/updating user in Supabase 'users' table...`,
    );
    const { data: userData, error: userDbError } = await supabase
      .from("users")
      .upsert(
        {
          name: ownerName,
          email: targetEmail,
          hashed_password: "SLACK_OAUTH_USER",
          workspace_id: tokenData.team?.id || "0",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      )
      .select()
      .single();

    if (userDbError) {
      res.status(500);
      throw new Error(`Supabase users upsert failed: ${userDbError.message}`);
    }

    const token = generateToken(userData.id, userData.workspace_id);

    res.redirect(
      `http://localhost:5173/?success=${isLogin ? "slack_login" : "slack_signup"}&token=${token}&name=${encodeURIComponent(ownerName)}&email=${encodeURIComponent(targetEmail)}`,
    );
  } catch (err) {
    next(err);
  }
};
