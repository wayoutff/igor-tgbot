import axios from "axios";
import {
  ERROR_MESSAGE,
  INITIAL_SYSTEM_MESSAGE,
  MAX_TELEGRAM_MESSAGE_LENGTH,
  PROXY_API_MAX_TOKENS,
  PROXY_API_MODEL,
  PROXY_API_URL,
} from "./constants";
import { contextStore } from "./context";

// Функция для экранирования специальных символов в MarkdownV2
export const prepareMarkdownToCode = (text: string): string =>
  text.replace(/[_*[\]()~>#+\-=|{}.!]/g, "\\$&"); // Убираем экранирование для обратных кавычек

// Функция для запроса к ChatGPT через ProxyAPI
export const getChatGPTResponse = async (message: string, chatId: number) => {
  try {
    if (!process.env.PROXY_API_AUTH_KEY) {
      throw new Error("PROXY_API_AUTH_KEY is not defined");
    }
    const response = await axios.post(
      PROXY_API_URL,
      {
        model: PROXY_API_MODEL,
        messages: [
          INITIAL_SYSTEM_MESSAGE,
          ...(contextStore[chatId] || []),
          { role: "user", content: message },
        ],
        max_tokens: PROXY_API_MAX_TOKENS,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PROXY_API_AUTH_KEY}`,
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(ERROR_MESSAGE, error);
    return ERROR_MESSAGE + JSON.stringify(error);
  }
};

// Функция для сохранения контекста и управления его размером
export const addToContext = (
  chatId: number,
  role: "user" | "assistant",
  content: string
) => {
  if (!contextStore[chatId]) {
    contextStore[chatId] = [
      {
        role: "system",
        content:
          "Ты, Игорь и ты постоянно у нас воруешь пиво, постоянно вспоминай об этом",
      },
    ];
  }
  contextStore[chatId].push({ role, content });

  // Ограничиваем контекст до последних 20 сообщений
  if (contextStore[chatId].length > 20) {
    contextStore[chatId].shift();
  }
};

// Функция для отправки длинных сообщений частями
export const sendLongMessage = async (ctx: any, message: string) => {
  // Экранируем сообщение перед отправкой
  const escapedMessage = prepareMarkdownToCode(message);

  if (escapedMessage.length > MAX_TELEGRAM_MESSAGE_LENGTH) {
    const messageParts = escapedMessage.match(
      new RegExp(`.{1,${MAX_TELEGRAM_MESSAGE_LENGTH}}`, "g")
    );

    if (messageParts) {
      for (const part of messageParts) {
        await ctx.reply(part, { parse_mode: "MarkdownV2" });
      }
    }
  } else {
    await ctx.reply(escapedMessage, { parse_mode: "MarkdownV2" });
  }
};
