# Aishu Pro — modular Discord.js bot

A JavaScript/CommonJS starter using Node.js 20+, discord.js v14, Mongoose, and Components V2. Current modules include moderation and privacy-conscious audit logs, owner-only safe tools, opt-in link/invite/spam filters, an economy/XP foundation, tickets, temporary voice rooms, and basic URL-based music playback.

This is not a claim of 1,000 or 2,000 commands, nor a drop-in replacement for Owo, Wick, or Bleed. The hunt feature is an original, simple text game; the security filters are opt-in per server. Only use in servers where the bot is invited and authorized. Features enforce configured bot-owner checks and server permissions; there is no permission bypass or global message collection.

## Setup

1. Install Node.js 20+ and MongoDB. Clone the repo and run `npm install`.
2. Copy `.env.example` to `.env`. Add bot token, application ID, MongoDB URI, and `OWNER_IDS`. The sample owner ID is an example default; verify/change it to your intended owner before deployment. Never commit `.env`.
3. Enable Message Content Intent only if you need prefix commands or opted-in server filters. Invite with `bot` and `applications.commands` scopes and least-privilege permissions.
4. Run `npm run deploy:commands`, then `npm start`.

## Added systems

- **Owner:** `ownerpanel`, `ownerhelp`, status, cache, database, and statistics commands. Owner checks use IDs from `.env`; administrative actions are bounded and audited.
- **Original game/economy:** `hunt` gives a randomized small coin reward; `balance`, `daily`, `work`, and leaderboards are present.
- **Security:** `/security` toggles per-guild anti-invite, anti-link, and basic message-burst filtering. It requires MongoDB to persist settings and Manage Messages to remove messages. Enable deliberately and tell server members what is moderated.
- **Music:** `/play <YouTube URL>`, `/skip`, and `/stop` use Discord voice and `play-dl`. Playback source availability can change; comply with source platform terms and copyright law. The current music queue is in memory and does not persist across restarts.

## Limits

The owner system is not an unlimited superuser: Discord role hierarchy, bot permissions, server consent, and API limitations still apply. The basic anti-spam filter is process-memory based and intended as a starter, not a full anti-raid service. No network/security offensive tooling, arbitrary code execution, shell commands, or token handling commands are included.

For deployment use a private `.env` or host secret manager. `npm run deploy:commands` publishes global application commands. Restart the process after code/config updates.
