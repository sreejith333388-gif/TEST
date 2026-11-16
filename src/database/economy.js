const EconomyUser = require('../database/models/EconomyUser');
const LevelUser = require('../database/models/LevelUser');

async function getEconomyUser(guildId, userId) {
  return EconomyUser.findOneAndUpdate({ guildId, userId }, { $setOnInsert: { guildId, userId, wallet: 0, bank: 0 } }, { upsert: true, new: true, setDefaultsOnInsert: true }).lean();
}

async function addCoins(guildId, userId, amount) {
  if (!Number.isFinite(amount)) return null;
  const entry = await getEconomyUser(guildId, userId);
  const nextWallet = Number(entry.wallet || 0) + Number(amount);
  await EconomyUser.updateOne({ guildId, userId }, { $set: { wallet: nextWallet } }, { upsert: true });
  return nextWallet;
}

async function setWallet(guildId, userId, amount) {
  await EconomyUser.updateOne({ guildId, userId }, { $set: { wallet: Math.max(0, Number(amount) || 0) } }, { upsert: true });
}

async function getLevelUser(guildId, userId) {
  return LevelUser.findOneAndUpdate({ guildId, userId }, { $setOnInsert: { guildId, userId, xp: 0, level: 1 } }, { upsert: true, new: true, setDefaultsOnInsert: true }).lean();
}

function getLevelFromXp(xp) {
  return Math.floor(Math.sqrt(xp / 50)) + 1;
}

async function awardXp(guildId, userId, amount) {
  const record = await getLevelUser(guildId, userId);
  const nextXp = Number(record.xp || 0) + Number(amount || 0);
  const nextLevel = getLevelFromXp(nextXp);
  await LevelUser.updateOne({ guildId, userId }, { $set: { xp: nextXp, level: nextLevel } }, { upsert: true });
  return { xp: nextXp, level: nextLevel };
}

module.exports = { getEconomyUser, addCoins, setWallet, getLevelUser, getLevelFromXp, awardXp };
