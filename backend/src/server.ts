import bot from "./bot/bot";

bot.launch().then(async () => {
  await bot.telegram.setMyName("World of Words");
  console.log("Bot ishga tushdi! Nomi: World of Words");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
