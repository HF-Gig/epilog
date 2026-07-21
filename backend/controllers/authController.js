import { supabase, slackClient } from "../config/clients.js";
import pkgSlack from "@slack/web-api";
import crypto from "crypto";
import { generateToken, verifyToken } from "../config/tokenHelper.js";
const { WebClient } = pkgSlack;

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Name, email, and password are required");
    }

    let authUser = null;
    let authSession = null;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
        },
      },
    });

    if (authError) {
      console.warn(
        `[Supabase Auth Signup Warning] ${authError.message}. Falling back to database-only user creation.`,
      );
    } else {
      authUser = authData.user;
      authSession = authData.session;
    }

    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const { data: userData, error: dbError } = await supabase
      .from("users")
      .upsert(
        {
          name,
          email,
          hashed_password: hashedPassword,
          workspace_id: "0",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "email" },
      )
      .select()
      .single();

    if (dbError) {
      res.status(500);
      throw new Error(`Database user creation failed: ${dbError.message}`);
    }

    const token = generateToken(userData.id, userData.workspace_id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: authUser || {
        id: userData.id,
        email,
        user_metadata: { display_name: name },
      },
      session: authSession || {
        access_token:
          "mock-jwt-token-" + Math.random().toString(36).substring(7),
        expires_in: 3600,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (!authError) {
      const { data: dbUser } = await supabase
        .from("users")
        .select("id, workspace_id")
        .eq("email", email)
        .maybeSingle();

      const userId = dbUser?.id || authData.user.id;
      const workspaceId = dbUser?.workspace_id || "0";
      const token = generateToken(userId, workspaceId);

      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        token,
        user: authData.user,
        session: authData.session,
      });
    }

    console.warn(
      `[Supabase Auth Login Warning] ${authError.message}. Falling back to database-only verification.`,
    );

    const { data: dbUser, error: dbError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (dbError || !dbUser) {
      res.status(400);
      throw new Error(authError.message || "Invalid login credentials");
    }

    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    if (
      dbUser.hashed_password !== hashedPassword &&
      dbUser.hashed_password !== "EMAIL_SIGNUP_USER"
    ) {
      res.status(400);
      throw new Error("Invalid login credentials");
    }

    const token = generateToken(dbUser.id, dbUser.workspace_id);

    res.status(200).json({
      success: true,
      message: "User logged in successfully (Database Fallback)",
      token,
      user: {
        id: dbUser.id,
        email: dbUser.email,
        user_metadata: { display_name: dbUser.name },
      },
      session: {
        access_token:
          "mock-jwt-token-" + Math.random().toString(36).substring(7),
        expires_in: 3600,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const slackOAuth = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Mock Slack OAuth connection endpoint triggered",
    });
  } catch (error) {
    next(error);
  }
};

export const slackCallback = async (req, res, next) => {
  try {
    const { code, state, error } = req.query;

    if (error) {
      res.status(400);
      throw new Error(`Slack OAuth Error: ${error}`);
    }

    if (!code) {
      res.status(400);
      throw new Error("No authorization code provided by Slack");
    }

    console.log(`[Slack OIDC Callback] Exchanging authorization code: ${code}`);

    const exchangeRes = await slackClient.oauth.v2.access({
      client_id: process.env.SLACK_CLIENT_ID || "",
      client_secret: process.env.SLACK_CLIENT_SECRET || "",
      code,
      redirect_uri: `${process.env.APP_URL}/api/auth/callback/slack`,
    });

    if (!exchangeRes.ok) {
      res.status(400);
      throw new Error(`Slack Token Exchange Failed: ${exchangeRes.error}`);
    }

    const { access_token, authed_user, team } = exchangeRes;
    const userToken = authed_user?.access_token || access_token;

    console.log(
      "[Slack OIDC Callback] Fetching Slack user details via OpenID Connect...",
    );
    const userClient = new WebClient(userToken);
    const userInfoRes = await userClient.openid.connect.userInfo();

    if (!userInfoRes.ok) {
      res.status(400);
      throw new Error(`Slack UserInfo Retrieval Failed: ${userInfoRes.error}`);
    }

    const userEmail = userInfoRes.email;
    const userName = userInfoRes.name || userInfoRes.nickname || "Slack User";
    const userAvatar = userInfoRes.picture || "";

    console.log(
      `[Slack OIDC Callback] Upserting workspace connection for team: ${team?.name} into Supabase...`,
    );
    const { data: dbData, error: dbError } = await supabase
      .from("workspaces")
      .upsert(
        {
          team_id: team?.id || "unknown_team",
          slack_team_id: team?.id || "unknown_team",
          team_name: team?.name || "Unknown Workspace",
          slack_team_name: team?.name || "Unknown Workspace",
          owner_email: userEmail,
          owner_name: userName,
          owner_avatar: userAvatar,
          access_token: access_token || "",
          user_access_token: authed_user?.access_token || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "team_id" },
      )
      .select();

    if (dbError) {
      res.status(500);
      throw new Error(`Supabase Upsert Failed: ${dbError.message}`);
    }

    res.status(200).json({
      success: true,
      message: "Slack workspace connected successfully",
      workspace: dbData?.[0] || { team_id: team?.id, team_name: team?.name },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyUserToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(401);
      throw new Error("Token is required");
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(401);
      throw new Error("Invalid or expired token");
    }

    let workspaceName = "Personal Workspace";
    if (decoded.workspace_id && decoded.workspace_id !== "0") {
      const { data: wsData } = await supabase
        .from("workspaces")
        .select("team_name")
        .eq("team_id", decoded.workspace_id)
        .maybeSingle();
      if (wsData && wsData.team_name) {
        workspaceName = wsData.team_name;
      }
    }

    res.status(200).json({
      success: true,
      user_id: decoded.user_id,
      workspace_id: decoded.workspace_id,
      workspace_name: workspaceName,
    });
  } catch (error) {
    next(error);
  }
};
