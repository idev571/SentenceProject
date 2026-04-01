import { Telegraf } from "telegraf";
import { config } from "../config/env";
import { handleStart } from "./handlers/start";
import { handleWord } from "./handlers/message";
import { registerCallbacks } from "./handlers/callback";
import { setUserState, getUserLanguage, getUserState } from "./utils/state";
import { LANGUAGE_CONFIG } from "../common/constants/languages";

const bot = new Telegraf(config.botToken);

bot.start((ctx) => {
  setUserState(ctx.from.id, "waiting_for_language");
  return handleStart(ctx);
});

bot.command("lang", (ctx) => {
  setUserState(ctx.from.id, "waiting_for_language");
  return handleStart(ctx);
});

bot.command("reinput", async (ctx) => {
  const userId = ctx.from.id;
  const lang = getUserLanguage(userId);
  const state = getUserState(userId);

  if (!lang || state === "waiting_for_language") {
    await ctx.reply("Avval tilni tanlang / Выберите язык / Choose language: /start");
    return;
  }

  setUserState(userId, "waiting_for_word");
  await ctx.reply(LANGUAGE_CONFIG[lang].labels.enterNewWord);
});

registerCallbacks(bot);
bot.on("text", handleWord);

export default bot;
