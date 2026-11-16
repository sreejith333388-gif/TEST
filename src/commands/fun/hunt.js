const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { renderPanel, v2Reply } = require('../../utils/ui');
const { addCoins } = require('../../database/economy');

const finds = [
  { name: 'rabbit', min: 20, max: 90 }, { name: 'fox', min: 50, max: 150 },
  { name: 'boar', min: 80, max: 220 }, { name: 'deer', min: 100, max: 260 },
  { name: 'nothing this time', min: 0, max: 0 }
];
function result() {
  const found = finds[Math.floor(Math.random() * finds.length)];
  const coins = found.max ? Math.floor(Math.random() * (found.max - found.min + 1)) + found.min : 0;
  return { found, coins };
}
module.exports = {
  name: 'hunt', aliases: ['search'], cooldown: 30,
  data: new SlashCommandBuilder().setName('hunt').setDescription('Go on a lighthearted, text-based hunt for coins.'),
  async execute(i, client) {
    const { found, coins } = result();
    if (coins) await addCoins(i.guildId, i.user.id, coins);
    return v2Reply(i, client, 'Hunt complete', coins ? `You found a **${found.name}** and earned **${coins} coins**.` : 'You came back empty-handed. Try again after the cooldown.');
  },
  async executePrefix(m, args, client) {
    const { found, coins } = result();
    if (coins) await addCoins(m.guild.id, m.author.id, coins);
    return m.reply({ components: [renderPanel(client, 'Hunt complete', coins ? `You found a **${found.name}** and earned **${coins} coins**.` : 'You came back empty-handed. Try again after the cooldown.')], flags: MessageFlags.IsComponentsV2 });
  }
};
