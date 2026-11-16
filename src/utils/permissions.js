function isOwner(userId, client) {
  return client.config.owners.has(userId);
}

module.exports = { isOwner };
