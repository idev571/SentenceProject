import fs from "fs";
import path from "path";

const LOG_FILE = path.join(__dirname, "../../../../logs/requests.log");

function ensureLogDir() {
  const dir = path.dirname(LOG_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function logRequest(userId: number, username: string | undefined, word: string, lang: string) {
  ensureLogDir();
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] user:${userId} @${username || "unknown"} lang:${lang} word:"${word}"\n`;
  fs.appendFileSync(LOG_FILE, line);
  console.log(line.trim());
}
