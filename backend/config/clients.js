import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";
import pkgSlack from "@slack/web-api";
import pkgNotion from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();

const { WebClient } = pkgSlack;
const { Client: NotionClient } = pkgNotion;

export const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_ANON_KEY || "",
);

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN || "");

export const notionClient = new NotionClient({
  auth: process.env.NOTION_API_KEY || "",
});
