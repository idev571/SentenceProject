export const LANGUAGE_CONFIG = {
  uz: {
    ttsPrefix: "O'zbek tilida o'qing: ",
    sentencePrompt:
      "Siz o'zbek tili o'qituvchisisiz. Foydalanuvchi bergan so'z bilan bitta oddiy gap tuzing. Faqat gapni yozing, boshqa hech narsa yozmang.",
    labels: {
      name: "O'zbekcha",
      enterWord: "So'z kiriting:",
      enterNewWord: "Yangi so'z kiriting:",
      preparing: "tayyorlanmoqda...",
      makeImage: "🖼 Rasm yaratish",
      makeSentence: "📝 Gap tuzish",
      loadingImage: "🖼 Rasm tayyorlanmoqda...",
      loadingSentence: "📝 Gap tuzilmoqda...",
      noAudio: "Audio hozircha mavjud emas (OpenAI ulanmagan)",
      noImage: "Rasm hozircha mavjud emas (OpenAI ulanmagan)",
      noSentence: "Gap hozircha mavjud emas (OpenAI ulanmagan)",
      busy: "Avvalgi so'z bilan ish tugamagan. Tugashini kuting yoki /reinput buyrug'ini yuboring.",
      error: "Xatolik yuz berdi. Qaytadan urinib ko'ring.",
      chooseLang: "Avval tilni tanlang / Выберите язык / Choose language:",
    },
  },
  ru: {
    ttsPrefix: "Прочитайте по-русски: ",
    sentencePrompt:
      "Вы учитель русского языка. Составьте одно простое предложение с данным словом. Напишите только предложение, ничего больше.",
    labels: {
      name: "Русский",
      enterWord: "Введите слово:",
      enterNewWord: "Введите новое слово:",
      preparing: "подготавливается...",
      makeImage: "🖼 Создать картинку",
      makeSentence: "📝 Составить предложение",
      loadingImage: "🖼 Создаётся картинка...",
      loadingSentence: "📝 Составляется предложение...",
      noAudio: "Аудио пока недоступно (OpenAI не подключен)",
      noImage: "Изображение пока недоступно (OpenAI не подключен)",
      noSentence: "Предложение пока недоступно (OpenAI не подключен)",
      busy: "Предыдущее слово ещё обрабатывается. Дождитесь завершения или отправьте /reinput.",
      error: "Произошла ошибка. Попробуйте ещё раз.",
      chooseLang: "Avval tilni tanlang / Выберите язык / Choose language:",
    },
  },
  en: {
    ttsPrefix: "",
    sentencePrompt:
      "You are an English teacher. Create one simple sentence using the given word. Write only the sentence, nothing else.",
    labels: {
      name: "English",
      enterWord: "Enter a word:",
      enterNewWord: "Enter a new word:",
      preparing: "preparing...",
      makeImage: "🖼 Generate image",
      makeSentence: "📝 Make a sentence",
      loadingImage: "🖼 Generating image...",
      loadingSentence: "📝 Making a sentence...",
      noAudio: "Audio not available yet (OpenAI not connected)",
      noImage: "Image not available yet (OpenAI not connected)",
      noSentence: "Sentence not available yet (OpenAI not connected)",
      busy: "Previous word is still in progress. Wait for it to finish or send /reinput.",
      error: "An error occurred. Please try again.",
      chooseLang: "Avval tilni tanlang / Выберите язык / Choose language:",
    },
  },
};

export type Language = keyof typeof LANGUAGE_CONFIG;
