const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { renderPanel, v2Reply } = require('../../utils/ui');
const { stop, getSession } = require('../../systems/music/player');
function run(guild, member) {
  const session = getSession(guild.id);
  if (!session) throw new Error('There is no active music session.');
  if (session.connection.joinConfig.channelId !== member.voice?.channelId) throw new Error('Join the bot’s voice channel to control playback.');
  stop(guild.id);
  return 'Stopped playback and cleared the queue.';
}
module.exports = {
  name: 'stop', aliases: ['music-stop'], cooldown: 3,
  data: new SlashCommandBuilder().setName('stop').setDescription('Stop playback and clear the queue.'),
  async execute(i, client) {
    try { return v2Reply(i, client, 'Music control', run(i.guild, i.member)); }
    catch (e) { return v2Reply(i, client, 'Unable to stop', e.message); }
  },
  async executePrefix(m, args, client) {
    try { return m.reply({ components: [renderPanel(client, 'Music control', run(m.guild, m.member))], flags: MessageFlags.IsComponentsV2 }); }
    catch (e) { return m.reply({ components: [renderPanel(client, 'Unable to stop', e.message)], flags: MessageFlags.IsComponentsV2 }); }
  }
};
