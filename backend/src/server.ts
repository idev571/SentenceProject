import express from "express";
import cors from "cors";
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

app.post("/api/audio", async (req, res) => {
  const { word, lang } = req.body as { word: string; lang: Language };
  const filePath = await generateAudio(word, lang);
  if (!filePath) {
    res.status(503).json({ error: "Audio not available" });
    return;
  }
  res.sendFile(filePath);
});

app.post("/api/sentence", async (req, res) => {
  const { word, lang } = req.body as { word: string; lang: Language };
  const sentence = await generateSentence(word, lang);
  if (!sentence) {
    res.status(503).json({ error: "Sentence not available" });
    return;
  }
  res.json({ sentence });
});

app.post("/api/image", async (req, res) => {
  const { word } = req.body as { word: string };
  const filePath = await generateImage(word);
  if (!filePath) {
    res.status(503).json({ error: "Image not available" });
    return;
  }
  res.sendFile(filePath);
});

app.listen(config.port, () => {
  console.log(`API server running on port ${config.port}`);
});

bot.launch().then(async () => {
  await bot.telegram.setMyName("World of Words");
  console.log("Bot ishga tushdi! Nomi: World of Words");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
