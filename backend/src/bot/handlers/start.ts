import { Context, Markup } from "telegraf";
import { addLangPickerMessage } from "../utils/state";

export async function handleStart(ctx: Context) {
  const msg = await ctx.reply(
    "Tilni tanlang / Выберите язык / Choose language:",
    Markup.inlineKeyboard([
      Markup.button.callback("🇺🇿 O'zbekcha", "lang_uz"),
      Markup.button.callback("🇷🇺 Русский", "lang_ru"),
      Markup.button.callback("🇬🇧 English", "lang_en"),
    ])
  );
  addLangPickerMessage(ctx.from!.id, msg.chat.id, msg.message_id);
}
