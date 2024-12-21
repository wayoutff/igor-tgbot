import "./config";
import { Context, Telegraf } from "telegraf";
import express from "express";

import { TRIGGER_NAMES } from "./constants";
import { addToContext, getChatGPTResponse, sendLongMessage } from "./utils";

const bot = new Telegraf(process.env.TELEGRAM_BOT_KEY || "");

const app = express();
app.use(express.json());

bot.telegram.getMe().then((botInfo) => {
  const botUsername = botInfo.username;

  const handleMessage = async (
    ctx: Context,
    message: string,
    chatId: number
  ) => {
    const userMessage = message.replace(`@${botUsername}`, "").trim();
    const gptResponse = await getChatGPTResponse(userMessage, chatId);

    // Сохраняем сообщение пользователя и ответ бота в контексте
    addToContext(chatId, "user", userMessage);
    addToContext(chatId, "assistant", gptResponse);

    await sendLongMessage(ctx, gptResponse);
  };

  bot.on("text", async (ctx) => {
    const message = ctx.message.text;
    const chatId = ctx.chat.id;

    const isReply = ctx?.message?.reply_to_message?.from?.id === botInfo.id;
    // Проверяем, является ли сообщение реплаем или содержит упоминание бота
    if (
      isReply ||
      message.includes(`@${botUsername}`) ||
      TRIGGER_NAMES.some((phrase) => message.startsWith(phrase))
    ) {
      await handleMessage(ctx, message, chatId);
    }
  });

  bot.launch();

  // Express сервер для Webhook
  app.post("/webhook", (req, res) => {
    bot.handleUpdate(req.body, res);
  });

  app.listen(process.env.PORT || 3006, () => {
    console.log(`Бот запущен на порту ${process.env.PORT || 3006}`);
  });
});
