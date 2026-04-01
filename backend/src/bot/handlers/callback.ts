import { Telegraf } from "telegraf";
import fs from "fs";
import { Markup } from "telegraf";
import { generateImage, generateSentence } from "../../common/utils/openai";
import { LANGUAGE_CONFIG, Language } from "../../common/constants/languages";
import {
  setUserLanguage,
  setUserState,
  getUserLanguage,
  getUserWord,
  getLangPickerMessages,
  clearLangPickerMessages,
} from "../utils/state";

export function registerCallbacks(bot: Telegraf) {
  // Language selection
  bot.action(/^lang_(.+)$/, async (ctx) => {
    const lang = ctx.match[1] as Language;
    const userId = ctx.from.id;
    setUserLanguage(userId, lang);
    setUserState(userId, "waiting_for_word");

    const l = LANGUAGE_CONFIG[lang].labels;
    await ctx.answerCbQuery(`${l.name}!`);
    await ctx.editMessageText(`✅ ${l.name}\n\n${l.enterWord}`);

    // Delete all other language picker messages
    const currentMsgId = ctx.callbackQuery.message?.message_id;
    const pickerMessages = getLangPickerMessages(userId);
    for (const msg of pickerMessages) {
      if (msg.messageId !== currentMsgId) {
        try {
          await ctx.telegram.deleteMessage(msg.chatId, msg.messageId);
        } catch {}
      }
    }
    clearLangPickerMessages(userId);
  });

  // Generate image button
  bot.action(/^gen_image_(\d+)$/, async (ctx) => {
    const userId = Number(ctx.match[1]);
    if (ctx.from.id !== userId) return ctx.answerCbQuery();

    const lang = getUserLanguage(userId);
    const word = getUserWord(userId);
    if (!lang || !word) return ctx.answerCbQuery();

    const l = LANGUAGE_CONFIG[lang].labels;
    await ctx.answerCbQuery(l.loadingImage);

    try {
      const imagePath = await generateImage(word, lang);

      if (imagePath) {
        await ctx.replyWithPhoto(
          { source: fs.createReadStream(imagePath) },
          {
            caption: `🖼 "${word}"`,
            ...Markup.inlineKeyboard([
              Markup.button.callback(l.makeSentence, `gen_sentence_${userId}`),
            ]),
          },
        );
        fs.unlinkSync(imagePath);
      } else {
        await ctx.reply(
          `🖼 ${l.noImage}`,
          Markup.inlineKeyboard([
            Markup.button.callback(l.makeSentence, `gen_sentence_${userId}`),
          ]),
        );
      }
    } catch (error) {
      console.error("Xatolik:", error);
      await ctx.reply(l.error);
    }
  });

  // Make sentence button
  bot.action(/^gen_sentence_(\d+)$/, async (ctx) => {
    const userId = Number(ctx.match[1]);
    if (ctx.from.id !== userId) return ctx.answerCbQuery();

    const lang = getUserLanguage(userId);
    const word = getUserWord(userId);
    if (!lang || !word) return ctx.answerCbQuery();

    const l = LANGUAGE_CONFIG[lang].labels;
    await ctx.answerCbQuery(l.loadingSentence);

    try {
      const sentence = await generateSentence(word, lang);

      if (sentence) {
        await ctx.reply(`📝 ${sentence}`);
      } else {
        await ctx.reply(`📝 ${l.noSentence}`);
      }

      setUserState(userId, "waiting_for_word");
      await ctx.reply(`\n${l.enterWord}`);
    } catch (error) {
      console.error("Xatolik:", error);
      setUserState(userId, "waiting_for_word");
      await ctx.reply(l.error);
    }
  });
}
