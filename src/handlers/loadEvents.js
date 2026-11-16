const fs = require('node:fs');
const path = require('node:path');

function loadEvents(client, directory) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      loadEvents(client, fullPath);
      continue;
    }
    if (!entry.name.endsWith('.js')) continue;
    const event = require(fullPath);
    if (!event.name || typeof event.execute !== 'function') {
      throw new Error(`Invalid event module: ${fullPath}`);
    }
    const listener = (...args) => event.execute(...args, client);
    event.once ? client.once(event.name, listener) : client.on(event.name, listener);
  }
}

module.exports = { loadEvents };
