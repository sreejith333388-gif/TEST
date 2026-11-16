const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');
const { renderPanel, v2Reply } = require('../../utils/ui');
const { enqueue } = require('../../systems/music/player');

async function request(guild, member, url, client) {
  const voice = member.voice?.channel;
  if (!voice) throw new Error('Join a voice channel first.');
  const me = guild.members.me;
  const perms = voice.permissionsFor(me);
  if (!perms?.has([PermissionFlagsBits.Connect, PermissionFlagsBits.Speak])) throw new Error('I need Connect and Speak permissions in your voice channel.');
  const item = await enqueue(guild, voice, url, member.id);
  return `Added **${item.title}** to the queue (position ${item.position}).`;
}
module.exports = {
  name: 'play', aliases: ['musicplay'], cooldown: 8,
  data: new SlashCommandBuilder().setName('play').setDescription('Play a public YouTube video in your voice channel.')
    .addStringOption(o => o.setName('url').setDescription('Public YouTube video URL').setRequired(true).setMaxLength(300)),
  async execute(i, client) {
    try { return v2Reply(i, client, 'Music queue', await request(i.guild, i.member, i.options.getString('url'), client)); }
    catch (e) { return v2Reply(i, client, 'Unable to play', e.message); }
  },
  async executePrefix(m, args, client) {
    try { return m.reply({ components: [renderPanel(client, 'Music queue', await request(m.guild, m.member, args[0], client))], flags: MessageFlags.IsComponentsV2 }); }
    catch (e) { return m.reply({ components: [renderPanel(client, 'Unable to play', e.message)], flags: MessageFlags.IsComponentsV2 }); }
  }
};
