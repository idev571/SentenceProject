import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { LANGUAGE_CONFIG, Language } from "../constants/languages";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const TEMP_DIR = path.join(__dirname, "../../../../temp");

function ensureTempDir() {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
}

export async function generateAudio(
  word: string,
  lang: Language,
): Promise<string | null> {
  ensureTempDir();
  const filePath = path.join(TEMP_DIR, `${Date.now()}_audio.mp3`);
  const config = LANGUAGE_CONFIG[lang];
  const response = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: word,
  });
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(filePath, buffer);
  return filePath;
}

export async function generateSentence(
  word: string,
  lang: Language,
): Promise<string | null> {
  const config = LANGUAGE_CONFIG[lang];
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: config.sentencePrompt },
      { role: "user", content: word },
    ],
  });
  return response.choices[0].message.content || "";
}

export async function generateImage(word: string, lang: Language): Promise<string | null> {
  ensureTempDir();
  // Translate to English for better image generation
  let englishWord = word;
  if (lang !== "en") {
    const translation = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Translate the given word to English. Reply with only the English word, nothing else." },
        { role: "user", content: word },
      ],
    });
    englishWord = translation.choices[0].message.content?.trim() || word;
  }
  const filePath = path.join(TEMP_DIR, `${Date.now()}_image.png`);
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: `A clean, colorful illustration of "${englishWord}". Cartoon educational style. DO NOT include any text, letters, words, or writing in the image.`,
    n: 1,
    size: "1024x1024",
  });
  const imageUrl = response.data![0].url!;
  const imageResponse = await fetch(imageUrl);
  const buffer = Buffer.from(await imageResponse.arrayBuffer());
  fs.writeFileSync(filePath, buffer);
  return filePath;
}
