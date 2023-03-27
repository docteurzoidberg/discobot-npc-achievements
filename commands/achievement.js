require('dotenv').config();

const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

const api = require('../lib/api');

const commands = new SlashCommandBuilder()
  .setName('achievement')
  .setDescription('Gere les haut-faits personnels !')
  
  //add
  .addSubcommand(subcommand =>
    subcommand
      .setName('add')
      .setDescription('Ajouter un haut-fait a accomplir')
      .addStringOption(option =>
        option
          .setName('title')
          .setDescription('Titre du haut-fait')
          .setRequired(true))
      .addStringOption(option =>
        option
          .setName('description')
          .setDescription('Description du haut-fait')
          .setRequired(true))
      .addStringOption(option =>
        option
          .setName('image')
          .setDescription('URL de l\'image'))
      .addIntegerOption(option =>
        option
          .setName('xp')
          .setDescription('XP rapportée'))
      .addBooleanOption(option =>
        option
          .setName('private')
          .setDescription('Rendre privé ?')))


  //update
  .addSubcommand(subcommand =>
    subcommand
      .setName('update')
      .setDescription('Modifier un haut-fait')
      .addStringOption(option =>
        option
          .setName('id')
          .setDescription('ID du haut-fait')
          .setRequired(true)
          .setAutocomplete(true))
      .addStringOption(option =>
        option
          .setName('title')
          .setDescription('Titre du haut-fait'))
      .addStringOption(option =>
        option
          .setName('description')
          .setDescription('Description du haut-fait'))
      .addStringOption(option =>
        option
          .setName('image')
          .setDescription('URL de l\'image'))
      .addIntegerOption(option =>
        option
          .setName('xp')
          .setDescription('XP rapportée'))
      .addBooleanOption(option =>
        option
          .setName('private')
          .setDescription('Rendre privé ?')))


  //rm
  .addSubcommand(subcommand =>
    subcommand
      .setName('delete')
      .setDescription('Supprimer un haut-fait de sa liste')
      .addStringOption(option =>
        option
          .setName('id')
          .setDescription('ID de l\'achievement')
          .setRequired(true)
          .setAutocomplete(true)))

  //list
  .addSubcommand(subcommand =>
    subcommand
      .setName('list')
      .setDescription('Lister les hauts-faits')
      .addStringOption(option =>
        option
          .setName('user')
          .setDescription('Nom de l\'utilisateur')))

  //complete
  .addSubcommand(subcommand =>
    subcommand
      .setName('complete')
      .setDescription('Complete un haut-fait')
      .addStringOption(option =>
        option
          .setName('id')
          .setDescription('ID de l\'achievement')
          .setRequired(true)
          .setAutocomplete(true)));

const shiftCharCode = Δ => c => String.fromCharCode(c.charCodeAt(0) + Δ);
const toFullWidth = str => str.replace(/[!-~]/g, shiftCharCode(0xFEE0));
const toHalfWidth = str => str.replace(/[！-～]/g, shiftCharCode(-0xFEE0));

//return size of characters in string 
//full width characters (2 bytes) and half width characters (1 byte)
const mbStrWidth = input => {
  let len = 0;
  for (let i = 0; i < input.length; i++) {
      let code = input.charCodeAt(i);
      if ((code >= 0x0020 && code <= 0x1FFF) || (code >= 0xFF61 && code <= 0xFF9F)) {
          len += 1;
      } else if ((code >= 0x2000 && code <= 0xFF60) || (code >= 0xFFA0)) {
          len += 2;
      } else {
          len += 0;
      }
  }
  return len;
};

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
    if(private) {
      interaction.reply({content: `Haut-fait [${achievement.title}] ajouté !`, ephemeral: true});
    }
    else {
      interaction.reply({content: `${interaction.member} a ajouté un haut-fait a accomplir dans sa liste !\n[${achievement.title}] ${achievement.description} (+${achievement.points}xp) !`});
    }
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
    console.error('Erreur lors de la commande update', error);
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
      + achievements.map(achievement => `\n${toFullWidth(achievement.id)}> [${achievement.title}] ${achievement.description} (+${achievement.points}xp)`).join('');

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
    interaction.reply({content: msg, ephemeral: true});
  } catch (error) {
    console.error('Erreur lors de la commande list', error);
  }
}

async function complete(client, interaction) {
  const username  = client.users.cache.get(interaction.user.id).username; //TODO: check if user exists
  const id = interaction.options.getString('id');
  try {
    
    const achievement = await api.getUserAchievementById(username, id);

    //inconnu
    if(achievement === undefined) {
      interaction.reply({content: `Haut-fait [${id}] introuvable !`, ephemeral: true});
      return;
    }
    
    //deja complete
    if(achievement.dateCompleted !== undefined) {
      interaction.reply({content: `Haut-fait [${id}] déjà complété !`, ephemeral: true});
      return;
    }

    await api.completeUserAchievement(username, id);
    
    //privé -> reponse qu'a l'utilisateur
    if(achievement.private) {
      interaction.reply({content: `Haut-fait [${achievement.title}] complété !`, ephemeral: true});
      return;
    }

    //public -> reponse dans le channel ou a été lancé la commande
    interaction.reply({content: `${interaction.member} a complété un haut-fait de sa liste !\n[${achievement.title}] ${achievement.description} (+${achievement.points}xp) !`});
  } catch (error) {
    console.error('Erreur lors de la commande complete', error);
  }
}

//get ids from all achievements
async function getAllAchievementIds(client, interaction) {
  const username  = client.users.cache.get(interaction.user.id).username; //TODO: check if user exists
  const achievements = await api.getUserAchievements(username);
  return achievements.map(achievement => achievement.id); 
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
      case 'delete':
        return await rm(client, interaction);
      case 'ls':
      case 'list':
        return await ls(client, interaction);
      case 'complete':
        return await complete(client, interaction);
      default:
        interaction.reply({content: `Désolé mais, la commande ${subcommand} n'existe pas ou n'est pas encore implementée :(`, ephemeral: true});
        break;
    }
  },
  async autocomplete(client, interaction) {
		const focusedOption = interaction.options.getFocused(true);
    let choices = [];
    switch(focusedOption.name) {
      case 'id':
        choices = await getAllAchievementIds(client, interaction);
        break;
      default:
        break;
    }
		const filtered = choices.filter(choice => choice.startsWith(focusedOption.value));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
  }
	
};