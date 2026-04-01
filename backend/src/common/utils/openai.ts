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
  const langInstructions: Record<Language, string> = {
    uz: "Pronounce this word clearly in Uzbek language with correct Uzbek pronunciation for kids to understand.",
    ru: "Pronounce this word clearly in Russian language with correct Russian pronunciation for kids to understand.",
    en: "Pronounce this word clearly in English for kids to understand.",
  };
  const response = await openai.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: "alloy",
    input: word,
    instructions: langInstructions[lang],
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

export async function generateImage(
  word: string,
  lang: Language,
): Promise<string | null> {
  ensureTempDir();
  // Generate a visual scene description for better image generation
  const translation = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Describe a simple visual scene that represents the meaning of the given word. Reply with only the scene description in English, max 15 words. No abstract concepts — describe only objects, people, animals, or nature. Never mention any text, letters, signs, books, or writing.",
      },
      { role: "user", content: word },
    ],
  });
  const sceneDescription = translation.choices[0].message.content?.trim() || word;
  const filePath = path.join(TEMP_DIR, `${Date.now()}_image.png`);
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: `${sceneDescription}. Style: flat vector cartoon for children, bright colors, clean background. CRITICAL: The image must contain ZERO text, ZERO letters, ZERO numbers, ZERO words, ZERO signs, ZERO writing of any kind. Only visual elements.`,
    n: 1,
    size: "1024x1024",
  });
  const imageUrl = response.data![0].url!;
  const imageResponse = await fetch(imageUrl);
  const buffer = Buffer.from(await imageResponse.arrayBuffer());
  fs.writeFileSync(filePath, buffer);
  return filePath;
}
