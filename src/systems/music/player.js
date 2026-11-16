const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, NoSubscriberBehavior, VoiceConnectionStatus, entersState } = require('@discordjs/voice');
const play = require('play-dl');

const sessions = new Map();
function getSession(guildId) { return sessions.get(guildId); }
function createSession(guild, voiceChannel) {
  const connection = joinVoiceChannel({ channelId: voiceChannel.id, guildId: guild.id, adapterCreator: guild.voiceAdapterCreator, selfDeaf: true });
  const player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Pause } });
  const session = { connection, player, queue: [], busy: false };
  connection.subscribe(player);
  player.on(AudioPlayerStatus.Idle, () => { session.busy = false; void next(guild.id); });
  player.on('error', (error) => { console.error('Music player error:', error.message); session.busy = false; void next(guild.id); });
  connection.on(VoiceConnectionStatus.Disconnected, async () => {
    try { await Promise.race([entersState(connection, VoiceConnectionStatus.Signalling, 5_000), entersState(connection, VoiceConnectionStatus.Connecting, 5_000)]); }
    catch { session.queue.length = 0; sessions.delete(guild.id); connection.destroy(); }
  });
  sessions.set(guild.id, session);
  return session;
}
async function next(guildId) {
  const session = sessions.get(guildId);
  if (!session || session.busy || !session.queue.length) return;
  const track = session.queue.shift();
  session.busy = true;
  try {
    const stream = await play.stream(track.url);
    session.player.play(createAudioResource(stream.stream, { inputType: stream.type, metadata: { title: track.title } }));
  } catch (error) {
    session.busy = false;
    console.error('Could not stream track:', error.message);
    void next(guildId);
  }
}
async function enqueue(guild, voiceChannel, url, requestedBy) {
  if (!await play.yt_validate(url)) throw new Error('For this starter, provide a valid public YouTube video URL.');
  const info = await play.video_basic_info(url);
  const title = info.video_details.title || 'Untitled track';
  const session = getSession(guild.id) || createSession(guild, voiceChannel);
  if (session.connection.joinConfig.channelId !== voiceChannel.id) throw new Error('The bot is already playing in another voice channel in this server.');
  session.queue.push({ url, title, requestedBy });
  if (!session.busy) void next(guild.id);
  return { title, position: session.queue.length };
}
function skip(guildId) {
  const s = sessions.get(guildId);
  if (!s) return false;
  s.player.stop(true);
  return true;
}
function stop(guildId) {
  const s = sessions.get(guildId);
  if (!s) return false;
  s.queue.length = 0;
  s.player.stop(true);
  s.connection.destroy();
  sessions.delete(guildId);
  return true;
}
module.exports = { enqueue, skip, stop, getSession };
