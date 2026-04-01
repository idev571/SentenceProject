import fs from "fs";
import path from "path";

const LOG_FILE = path.join(__dirname, "../../../../logs/requests.log");

function ensureLogDir() {
  const dir = path.dirname(LOG_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function timestamp() {
  return new Date().toISOString();
}

export function logRequest(userId: number, username: string | undefined, word: string, lang: string) {
  ensureLogDir();
  const line = `[${timestamp()}] [BOT] user:${userId} @${username || "unknown"} lang:${lang} word:"${word}"`;
  fs.appendFileSync(LOG_FILE, line + "\n");
  console.log(line);
}

export function logApi(method: string, path: string, body: any, status: number, ms: number) {
  ensureLogDir();
  const bodyStr = JSON.stringify(body);
  const line = `[${timestamp()}] [API] ${method} ${path} ${status} ${ms}ms body:${bodyStr}`;
  fs.appendFileSync(LOG_FILE, line + "\n");
  console.log(line);
}
