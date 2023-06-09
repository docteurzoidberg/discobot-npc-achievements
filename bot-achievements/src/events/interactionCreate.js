//this module handles all the interactions
module.exports = {
  name: 'interactionCreate',
  async execute(client, interaction) {
    //command
    if (interaction.isCommand()) {
      client.logger.info(
        `<${
          interaction.user.tag
        }> used command ${interaction.commandName.toUpperCase()} in #${interaction.channel.name.toUpperCase()}`
      );

      //await interaction.deferReply({ephemeral: false}).catch(()=>{});
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      if (!command.execute) return;
      try {
        await command.execute(client, interaction);
      } catch (error) {
        client.logger.error(error);
        await interaction.reply({
          content:
            "Erreur lors de l'execution de la commande. (Dire a l'admin de look les logs) !",
          ephemeral: true,
        });
      }
    }
    //autocomplete
    else if (interaction.isAutocomplete()) {
      //read auto complete focused field name from interaction for logging
      const focusedFieldName = interaction.options
        .getFocused(true)
        ?.name.toUpperCase();
      client.logger.info(
        `<${
          interaction.user.tag
        }> triggered AUTOCOMPLETE for field ${focusedFieldName} in command ${interaction.commandName.toUpperCase()} in #${interaction.channel.name.toUpperCase()}`
      );

      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      if (!command.autocomplete) return;

      try {
        await command.autocomplete(client, interaction);
      } catch (error) {
        client.logger.error(error);
      }
    }
    //unhandled interaction
    else {
      client.logger.warn(
        `<${
          interaction.user.tag
        }> in #${interaction.channel.name.toUpperCase()} triggered an unhandled interaction: ` +
          interaction.name.toUpperCase()
      );
    }
    return;
  },
};
