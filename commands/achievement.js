require('dotenv').config();

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed, ReactionUserManager } = require('discord.js');

const api = require('../lib/api');

const commands = new SlashCommandBuilder()
  .setName('achievement')
  .setDescription('Gere les achievements personnels !')
  
  //add
  .addSubcommand(subcommand =>
    subcommand
      .setName('add')
      .setDescription('Ajoute un achievement')
      .addStringOption(option =>
        option
          .setName('title')
          .setDescription('Nom de l\'achievement')
          .setRequired(true))
      .addStringOption(option =>
        option
          .setName('description')
          .setDescription('Description de l\'achievement')
          .setRequired(true))
      .addStringOption(option =>
        option
          .setName('image')
          .setDescription('URL de l\'image de l\'achievement'))
      .addBooleanOption(option =>
        option
          .setName('private')
          .setDescription('Rendre l\'achievement privé ?')))


  //update
  .addSubcommand(subcommand =>
    subcommand
      .setName('update')
      .setDescription('Modifie un achievement')
      .addStringOption(option =>
        option
          .setName('achievementid')
          .setDescription('ID de l\'achievement')
          .setRequired(true))
      .addStringOption(option =>
        option
          .setName('title')
          .setDescription('Nom de l\'achievement'))
      .addStringOption(option =>
        option
          .setName('description')
          .setDescription('Description de l\'achievement'))
      .addStringOption(option =>
        option
          .setName('image')
          .setDescription('URL de l\'image de l\'achievement')))

  //rm
  .addSubcommand(subcommand =>
    subcommand
      .setName('rm')
      .setDescription('Supprime un achievement')
      .addStringOption(option =>
        option
          .setName('achievementid')
          .setDescription('ID de l\'achievement')
          .setRequired(true)))

  //list
  .addSubcommand(subcommand =>
    subcommand
      .setName('ls')
      .setDescription('Liste les achievements'))

  //complete
  .addSubcommand(subcommand =>
    subcommand
      .setName('complete')
      .setDescription('Complete un achievement')
      .addStringOption(option =>
        option
          .setName('achievementid')
          .setDescription('ID de l\'achievement')
          .setRequired(true)))
    

module.exports = {

	data: commands,

  async execute(client, interaction) {
    const subcommand = interaction.options.getSubcommand();
    interaction.reply({content: `Subcommand: ${subcommand}`, ephemeral: true});

  },
};