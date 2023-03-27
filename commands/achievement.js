require('dotenv').config();

const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

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
      .addIntegerOption(option =>
        option
          .setName('points')
          .setDescription('Points de l\'achievement'))
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
          .setName('id')
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
          .setDescription('URL de l\'image de l\'achievement'))
      .addIntegerOption(option =>
        option
          .setName('points')
          .setDescription('Points de l\'achievement')))

  //rm
  .addSubcommand(subcommand =>
    subcommand
      .setName('rm')
      .setDescription('Supprime un achievement')
      .addStringOption(option =>
        option
          .setName('id')
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
          .setName('id')
          .setDescription('ID de l\'achievement')
          .setRequired(true)));

async function add(client, interaction) {
  
  const username  = client.users.cache.get(interaction.user.id).username; //TODO: check if user exists
  const title = interaction.options.getString('title');
  const description = interaction.options.getString('description');
  const image = interaction.options.getString('image') || '';
  const points = interaction.options.getInteger('points') || 0;
  const private = interaction.options.getBoolean('private') || false;

  //TODO: validation ?
  const achievement = {
    title: title,
    description: description,
    image: image,
    points: points,
    private: private
  };
  try {
    await api.addUserAchievement(username, achievement);
    interaction.reply({content: `Haut fait ajouté !`});
  } catch (error) {
    console.error('Erreur lors de la commande add', error);
  }
}

async function update(client, interaction) {
  
  const username  = client.users.cache.get(interaction.user.id).username; //TODO: check if user exists
  const id = interaction.options.getString('id');
  const title = interaction.options.getString('title');
  const description = interaction.options.getString('description');
  const image = interaction.options.getString('image') || '';
  const points = interaction.options.getInteger('points') || 0;
  const private = interaction.options.getBoolean('private') || false;

  //TODO: validation ?
  const achievement = {
    id: id,
    title: title,
    description: description,
    image: image,
    points: points,
    private: private
  };
  try {
    await api.updateUserAchievement(username, achievement);
    interaction.reply({content: `Haut fait [${id}] modifié !`});
  } catch (error) {
    console.error('Erreur lors de la commande add', error);
  }
}

async function rm(client, interaction) {
  const username  = client.users.cache.get(interaction.user.id).username; //TODO: check if user exists
  const id = interaction.options.getString('id');
  try {
    await api.deleteUserAchievement(username, id);
    interaction.reply({content: `Haut fait [${id}] supprimé !`});
  } catch (error) {
    console.error('Erreur lors de la commande rm', error);
  }
}

async function ls(client, interaction) {
  const username  = client.users.cache.get(interaction.user.id).username; //TODO: check if user exists
  try {
    const achievements = await api.getUserAchievements(username);

    const msg = 
      `Liste des hauts faits de ${username}:`
      + achievements.map(achievement => `\n${achievement.id}> [${achievement.title}] ${achievement.description} (${achievement.points} points)`).join('');

/*

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`Hauts faits de ${username}`)
      .setDescription('Liste des hauts faits')
      .addFields(
        { name: 'Haut fait 1', value: 'Description 1' },
        { name: 'Haut fait 2', value: 'Description 2' },
        { name: 'Haut fait 3', value: 'Description 3' },
      )
      .setTimestamp()
    
    interaction.reply({content: "toto", embeds: [embed]});*/
    interaction.reply({content: msg});
  } catch (error) {
    console.error('Erreur lors de la commande ls', error);
  }
}

async function complete(client, interaction) {
  const username  = client.users.cache.get(interaction.user.id).username; //TODO: check if user exists
  const id = interaction.options.getString('id');
  try {
    await api.completeUserAchievement(username, id);
    interaction.reply({content: `Haut fait [${id}] complété !`});
  } catch (error) {
    console.error('Erreur lors de la commande complete', error);
  }
}

module.exports = {
	data: commands,
  async execute(client, interaction) {
    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case 'add':
        return await add(client, interaction);
      case 'update':
        return await update(client, interaction);
      case 'rm':
        return await rm(client, interaction);
      case 'ls':
        return await ls(client, interaction);
      case 'complete':
        return await complete(client, interaction);
      default:
        interaction.reply({content: `Désolé mais, la commande ${subcommand} n'existe pas ou n'est pas encore implementée :(`, ephemeral: true});
        break;
    }
  }
};