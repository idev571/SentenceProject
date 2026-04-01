import { Context, Markup } from "telegraf";
import fs from "fs";
import { generateAudio } from "../../common/utils/openai";
import { logRequest } from "../../common/utils/logger";
import { LANGUAGE_CONFIG } from "../../common/constants/languages";
import {
  getUserLanguage,
  getUserState,
  setUserWord,
  setUserState,
  addLangPickerMessage,
} from "../utils/state";

export async function handleWord(ctx: Context) {
  const word = (ctx.message as any).text;
  if (!word || word.startsWith("/")) return;

  const userId = ctx.from!.id;
  const lang = getUserLanguage(userId);
  const state = getUserState(userId);

  if (!lang || state === "waiting_for_language") {
    addLangPickerMessage(userId, ctx.chat!.id, ctx.message!.message_id);
    const msg = await ctx.reply(
      LANGUAGE_CONFIG.uz.labels.chooseLang,
      Markup.inlineKeyboard([
        Markup.button.callback("🇺🇿 O'zbekcha", "lang_uz"),
        Markup.button.callback("🇷🇺 Русский", "lang_ru"),
        Markup.button.callback("🇬🇧 English", "lang_en"),
      ]),
    );
    addLangPickerMessage(userId, msg.chat.id, msg.message_id);
    return;
  }

  if (state !== "waiting_for_word") {
    await ctx.reply(LANGUAGE_CONFIG[lang].labels.busy);
    return;
  }

  setUserWord(userId, word);
  setUserState(userId, "processing");
  logRequest(userId, ctx.from!.username, word, lang);

  await ctx.reply(`"${word}" — ${LANGUAGE_CONFIG[lang].labels.preparing}`);

  try {
    const audioPath = await generateAudio(word, lang);
    const l = LANGUAGE_CONFIG[lang].labels;

    if (audioPath) {
      await ctx.replyWithAudio(
        { source: fs.createReadStream(audioPath) },
        {
          caption: `🔊 "${word}"`,
          ...Markup.inlineKeyboard([
            Markup.button.callback(l.makeImage, `gen_image_${userId}`),
          ]),
        },
      );
      fs.unlinkSync(audioPath);
    } else {
      await ctx.reply(
        `🔊 ${l.noAudio}`,
        Markup.inlineKeyboard([
          Markup.button.callback(l.makeImage, `gen_image_${userId}`),
        ]),
      );
    }
  } catch (error) {
    console.error("Xatolik:", error);
    setUserState(userId, "waiting_for_word");
    await ctx.reply(LANGUAGE_CONFIG[lang].labels.error);
  }
}
