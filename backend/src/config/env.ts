import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

if (!process.env.BOT_TOKEN) throw new Error("BOT_TOKEN is required in .env");
if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is required in .env");

export const config = {
  botToken: process.env.BOT_TOKEN,
  openaiApiKey: process.env.OPENAI_API_KEY,
  port: Number(process.env.PORT) || 3098,
};
