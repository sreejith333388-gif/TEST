const { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, MessageFlags } = require('discord.js');

function renderPanel(client, title, description) {
  const color = Number.isInteger(client.config.color) ? client.config.color : 0x9b00ff;
  return new ContainerBuilder()
    .setAccentColor(color)
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`# ${title}\n${description}`))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`**${client.config.name}** · Aishu <3`));
}

function v2Reply(interaction, client, title, description, ephemeral = true) {
  return interaction.reply({
    components: [renderPanel(client, title, description)],
    flags: MessageFlags.IsComponentsV2 | (ephemeral ? MessageFlags.Ephemeral : 0)
  });
}

module.exports = { renderPanel, v2Reply };
