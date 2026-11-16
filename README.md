# Aishu Pro — Discord.js foundation

A JavaScript/CommonJS starter for a modular Discord bot using Node.js 20+, discord.js v14, and optional MongoDB persistence. It includes a command/event loader, slash and prefix command routing, Components V2 response helpers, cooldowns, owner checks, guild command configuration, and slash-command deployment.

This repository is a working foundation, not a claim that every feature in an expansive feature wishlist (such as thousands of commands or hundreds of games) is already implemented. Feature systems should be added and tested as separate modules.

## Requirements

- Node.js 20 or newer
- A Discord application and bot
- MongoDB, optional for the starter modules

## Setup

1. Clone the repository and install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and fill in the bot token, application ID, prefix, and owner IDs. `OWNER_IDS` accepts comma-separated Discord user IDs. Keep `.env` private; it is ignored by git.
3. In the Discord Developer Portal, enable **Message Content Intent** if you want prefix commands. Enable only the intents and permissions your enabled features require.
4. Invite the bot with `bot` and `applications.commands` scopes and the least-privilege permissions needed.
5. Run `npm run deploy:commands` to publish slash commands, then `npm start`.

If `MONGODB_URI` is blank, the bot starts without MongoDB; database-dependent guild settings use defaults and are not persistent. Set a MongoDB connection string to enable persistence.

## Configuration

See `.env.example`. The bot name, prefix, token, application ID, owners, language, UI color, support link, website, and status are read from environment variables. Never commit `.env` or put secrets in source code.

## Included starter commands

- Prefix and slash: `help`, `ping`, `botinfo`
- Owner-only: `health`
- Guild-specific prefix and command disabling are represented in the MongoDB guild configuration model.

The `health` command is read-only. This starter intentionally does not expose remote code evaluation, shell/terminal execution, permission bypasses, or broad message collection. Do not enable privileged intents or collect message content beyond what your server features need and have permission to use.

## Components V2

Responses use the reusable `src/utils/ui.js` Components V2 helper (no EmbedBuilder). Any future interactive component must have a stable, namespaced custom ID and an authorization check in its handler. Avoid placing secrets or personal data in custom IDs.

## Deployment

### Generic host / Pterodactyl / PlumeHost

Create a Node.js 20+ application, upload/clone the repository, install dependencies, configure environment variables in the host panel, run `npm run deploy:commands` once after command changes, and use `npm start` as the startup command. Keep the process manager's restart policy enabled. Do not upload `.env` to a public repository.

### Docker

Build with `docker build -t aishu-pro .`, then run with your environment supplied securely by your deployment platform (for example, `docker run --env-file .env aishu-pro`). Do not bake credentials into the image.

## Adding features

Place command modules beneath `src/commands/<category>/`. Export `data` (a SlashCommandBuilder), `name`, optional `aliases`, optional `ownerOnly`/`permissions`/`cooldown`, and `execute(interaction, client)` plus `executePrefix(message, args, client)` as needed. Place event modules under `src/events/`. Keep handlers small, validate all inputs, enforce least privilege, and add tests before production use.

## License

No license has been specified yet.
