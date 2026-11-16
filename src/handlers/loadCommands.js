const fs = require('node:fs');
const path = require('node:path');

function loadCommands(client, directory) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      loadCommands(client, fullPath);
      continue;
    }
    if (!entry.name.endsWith('.js')) continue;
    const command = require(fullPath);
    if (!command.name || typeof command.execute !== 'function') {
      throw new Error(`Invalid command module: ${fullPath}`);
    }
    client.commands.set(command.name, command);
    for (const alias of command.aliases || []) client.commands.set(alias, command);
  }
}

module.exports = { loadCommands };
