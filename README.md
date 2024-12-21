## Бот-ассистент с ChatGPT, который работает через платформу ProxyAPI.ru

### Перед началом

1. Необходим ключ API: https://console.proxyapi.ru/keys
2. создать .env файл со значением PROXY_API_KEY

### для локального запуска понадобится сделать .env.local

```
TELEGRAM_BOT_KEY=ключ телеграмм-бота
PROXY_API_AUTH_KEY=ключ proxyAPI
PORT=порт express приложения
```

### Запуск

Docker:

```
docker compose up -d
```

Local prod:

```
npm start
```

Local dev:

```
npm run dev
```
