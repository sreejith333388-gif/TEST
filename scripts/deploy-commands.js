const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

async function main() {
  if (!process.env.BOT_TOKEN || !process.env.CLIENT_ID) {
    throw new Error('BOT_TOKEN and CLIENT_ID are required to deploy slash commands.');
  }
  const root = path.join(__dirname, '..', 'src', 'commands');
  const payload = [];
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (entry.name.endsWith('.js')) {
        const command = require(file);
        if (command.data) payload.push(command.data.toJSON());
      }
    }
  }
  walk(root);
  const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: payload });
  console.log(`Deployed ${payload.length} slash commands.`);
}

main().catch((error) => {
  console.error('Slash command deployment failed:', error);
  process.exit(1);
});
