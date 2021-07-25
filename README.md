# 哈們機器人

A telegram chatbot which will only reply "**哈們**".

## install

```bash
yarn install
```

## config

There are some environment variables that Hadoor will use:

1. `TOKEN`: Telegram bot's API token
2. `URL`: Public host name (starts with `https://`)
3. `DB_ENDPOINT`: MongoDB endpoint

In local development:

1. `dotenv` is used, so you can only create a file called `.env` in root directory. `dotenv` will work as expect.
2. you may need a free reverse proxy (EX: [localtunnel](https://github.com/localtunnel/localtunnel), [ngrok](https://ngrok.com/)) in order to create a public `https://` URL.

For more information about dotenv, visit [dotenv](https://github.com/motdotla/dotenv#readme).

## start server

In production:

```bash
yarn start
```

In development:

```bash
yarn dev
```

Default server will be listening on port 8000.
