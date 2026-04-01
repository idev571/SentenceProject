import { Language } from "../../common/constants/languages";

export type UserState = "waiting_for_language" | "waiting_for_word" | "processing";

const userLanguages = new Map<number, Language>();
const userWords = new Map<number, string>();
const userStates = new Map<number, UserState>();
const langPickerMessages = new Map<number, { chatId: number; messageId: number }[]>();

export function setUserState(userId: number, state: UserState) {
  userStates.set(userId, state);
}

export function getUserState(userId: number): UserState | undefined {
  return userStates.get(userId);
}

export function setUserLanguage(userId: number, lang: Language) {
  userLanguages.set(userId, lang);
}

export function getUserLanguage(userId: number): Language | undefined {
  return userLanguages.get(userId);
}

export function setUserWord(userId: number, word: string) {
  userWords.set(userId, word);
}

export function getUserWord(userId: number): string | undefined {
  return userWords.get(userId);
}

export function addLangPickerMessage(userId: number, chatId: number, messageId: number) {
  const messages = langPickerMessages.get(userId) || [];
  messages.push({ chatId, messageId });
  langPickerMessages.set(userId, messages);
}

export function getLangPickerMessages(userId: number) {
  return langPickerMessages.get(userId) || [];
}

export function clearLangPickerMessages(userId: number) {
  langPickerMessages.delete(userId);
}
