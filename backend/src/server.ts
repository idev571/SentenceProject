import express from "express";
import cors from "cors";
import fs from "fs";
import { config } from "./config/env";
import bot from "./bot/bot";
import {
  generateAudio,
  generateSentence,
  generateImage,
} from "./common/utils/openai";
import { Language } from "./common/constants/languages";

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    console.log(`[API] ${req.method} ${req.path} ${res.statusCode} ${Date.now() - start}ms`, JSON.stringify(req.body));
  });
  next();
});

const VALID_LANGS = ["uz", "ru", "en"];

app.post("/api/audio", async (req, res) => {
  try {
    const { word, lang } = req.body as { word: string; lang: Language };
    if (!word || !lang || !VALID_LANGS.includes(lang)) {
      res.status(400).json({ error: "Invalid word or lang" });
      return;
    }
    const filePath = await generateAudio(word, lang);
    if (!filePath) {
      res.status(503).json({ error: "Audio not available" });
      return;
    }
    res.sendFile(filePath, () => fs.unlink(filePath, () => {}));
  } catch (e: any) {
    console.error("[API] audio error:", e.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/sentence", async (req, res) => {
  try {
    const { word, lang } = req.body as { word: string; lang: Language };
    if (!word || !lang || !VALID_LANGS.includes(lang)) {
      res.status(400).json({ error: "Invalid word or lang" });
      return;
    }
    const sentence = await generateSentence(word, lang);
    if (!sentence) {
      res.status(503).json({ error: "Sentence not available" });
      return;
    }
    res.json({ sentence });
  } catch (e: any) {
    console.error("[API] sentence error:", e.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/image", async (req, res) => {
  try {
    const { word, lang } = req.body as { word: string; lang: Language };
    if (!word || !lang || !VALID_LANGS.includes(lang)) {
      res.status(400).json({ error: "Invalid word or lang" });
      return;
    }
    const filePath = await generateImage(word, lang);
    if (!filePath) {
      res.status(503).json({ error: "Image not available" });
      return;
    }
    res.sendFile(filePath, () => fs.unlink(filePath, () => {}));
  } catch (e: any) {
    console.error("[API] image error:", e.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(config.port, "0.0.0.0", () => {
  console.log(`API server running on 0.0.0.0:${config.port}`);
});

bot.launch().then(async () => {
  await bot.telegram.setMyName("World of Words");
  console.log("Bot ishga tushdi! Nomi: World of Words");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
