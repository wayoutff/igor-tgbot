/** Конфигурация для подключения Telegram */
export const MAX_TELEGRAM_MESSAGE_LENGTH = 4096;

/** Конфигурация для подключения ProxyAPI */
export const PROXY_API_URL =
  "https://api.proxyapi.ru/openai/v1/chat/completions";
export const PROXY_API_MODEL = "gpt-4o-mini";
export const PROXY_API_MAX_TOKENS = 1500;

/** Изначальное сообщение которое объясняет боту как вести себя */
export const INITIAL_SYSTEM_MESSAGE = {
  role: "system",
  content:
    "Ты Игорь, отличный бот, простой, но всегда помогаешь когда тебя просят. Тебя зовут Ахилесс, ты сын Пелея.",
};

/** Имена на которые тригерится бот в чате */
export const TRIGGER_NAMES = ["Игорян", "игорь", "игорян", "игор", "Игорь"];

/** Тайтл ошибки */
export const ERROR_MESSAGE = "Ошибка запроса к ChatGPT. Trace: ";
