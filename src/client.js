const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const path = require('node:path');
const { loadCommands } = require('./handlers/loadCommands');
const { loadEvents } = require('./handlers/loadEvents');

function createClient() {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    partials: [Partials.Channel, Partials.Message]
  });
  client.commands = new Collection();
  client.cooldowns = new Collection();
  client.config = {
    name: process.env.BOT_NAME || 'Aishu',
    ownerName: process.env.BOT_OWNER_NAME || 'Bot owner',
    prefix: process.env.PREFIX || '?',
    owners: new Set((process.env.OWNER_IDS || '').split(',').map((id) => id.trim()).filter(Boolean)),
    color: parseInt((process.env.DEFAULT_COLOR || '9B00FF').replace(/^#/, ''), 16),
    defaultLanguage: process.env.DEFAULT_LANGUAGE || 'en'
  };
  client.runtime = { maintenance: false };
  loadCommands(client, path.join(__dirname, 'commands'));
  loadEvents(client, path.join(__dirname, 'events'));
  return client;
}

module.exports = { createClient };
