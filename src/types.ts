export type TContextStore = {
  [chatId: string]: Array<{ role: string; content: string }>;
};
