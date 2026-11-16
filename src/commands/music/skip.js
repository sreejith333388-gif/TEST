const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');
const { renderPanel, v2Reply } = require('../../utils/ui');
const { skip, getSession } = require('../../systems/music/player');
function run(guild, member) {
  const session = getSession(guild.id);
  if (!session) throw new Error('There is no active music session.');
  if (session.connection.joinConfig.channelId !== member.voice?.channelId) throw new Error('Join the bot’s voice channel to control playback.');
  if (!session.player.state.status || !skip(guild.id)) throw new Error('Nothing is currently playing.');
  return 'Skipped the current track.';
}
module.exports = {
  name: 'skip', aliases: ['music-skip'], cooldown: 3,
  data: new SlashCommandBuilder().setName('skip').setDescription('Skip the current track (in the bot voice channel).'),
  async execute(i, client) {
    try { return v2Reply(i, client, 'Music control', run(i.guild, i.member)); }
    catch (e) { return v2Reply(i, client, 'Unable to skip', e.message); }
  },
  async executePrefix(m, args, client) {
    try { return m.reply({ components: [renderPanel(client, 'Music control', run(m.guild, m.member))], flags: MessageFlags.IsComponentsV2 }); }
    catch (e) { return m.reply({ components: [renderPanel(client, 'Unable to skip', e.message)], flags: MessageFlags.IsComponentsV2 }); }
  }
};
