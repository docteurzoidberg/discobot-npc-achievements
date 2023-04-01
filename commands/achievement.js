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
      .setName('create')
      .setDescription('Crée un haut-fait')
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

  //edit
  .addSubcommand(subcommand =>
    subcommand
      .setName('edit')
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

  //list (by tag if any)
  .addSubcommand(subcommand =>
    subcommand
      .setName('list')
      .setDescription('Lister les hauts-faits')
      .addStringOption(option =>
        option
          .setName('tags')
          .setDescription('Restreindre a la/aux categories suivantes')
          .setAutocomplete(true)
      )
  )

  //show all achievements (matching one or more tags if any)
  .addSubcommand(subcommand =>
    subcommand
      .setName('showlist')
      .setDescription('Affiche ses hauts-faits (publics) sur le channel')
      .addStringOption(option =>
        option
          .setName('tags')
          .setDescription('Restreindre a la/les categorie(s) suivante(s)')
          .setAutocomplete(true)
      )
  )
  
  //show one achievement
  //TODO: need user confirm if achievement is private
  
  .addSubcommand(subcommand =>
    subcommand
      .setName('show')
      .setDescription('Affiche un haut-fait sur le channel')
      .addStringOption(option =>
        option
          .setName('id')
          .setDescription('ID de l\'achievement')
          .setRequired(true)
          .setAutocomplete(true)
      )
  )

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
          .setAutocomplete(true)
      )
  )

  //undone
  .addSubcommand(subcommand =>
    subcommand
      .setName('undone')
      .setDescription('Annule la validation d\'un haut-fait')
      .addStringOption(option =>
        option
          .setName('id')
          .setDescription('ID de l\'achievement')
          .setRequired(true)
          .setAutocomplete(true)
      )
  )

  //delete
  //TODO: user confirm
  .addSubcommand(subcommand =>
    subcommand
      .setName('delete')
      .setDescription('Supprimer un haut-fait')
      .addStringOption(option =>
        option
          .setName('id')
          .setDescription('ID de l\'achievement')
          .setRequired(true)
          .setAutocomplete(true)
      )
  )

  //undelete
  .addSubcommand(subcommand =>
    subcommand
      .setName('undelete')
      .setDescription('Annule la suppression d\'un haut-fait')
      .addStringOption(option =>
        option
          .setName('id')
          .setDescription('ID de l\'achievement')
          .setRequired(true)
          .setAutocomplete(true)
      )
  )

  //tags
  .addSubcommandGroup(group =>
    group
      .setName('tag')
      .setDescription('Gestion des tags/catégories')
  

    //add tag
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Ajout un tag/catégorie a un haut-fait')
        .addStringOption(option =>
          option
            .setName('id')
            .setDescription('ID de l\'achievement')
            .setRequired(true)
            .setAutocomplete(true))
        .addStringOption(option =>
          option
            .setName('tag')
            .setDescription('Tag/catégorie')
            .setRequired(true)
            .setAutocomplete(true)
        )
    )

    //remove tag 
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Supprime un tag/catégorie d\'un haut-fait')
        .addStringOption(option =>
          option
            .setName('id')
            .setDescription('ID de l\'achievement')
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption(option =>
          option
            .setName('tag')
            .setDescription('Tag/catégorie')
            .setRequired(true)
            .setAutocomplete(true)
        )   
    )

    //list tags
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('Liste les tags/catégories')
    )
  )

  //settings
  .addSubcommandGroup(group =>
    group
      .setName('settings')
      .setDescription('Gestion des paramètres')
      .addSubcommand(subcommand =>
        subcommand
          .setName('list')
          .setDescription('Affiche les paramètres utilisateur')
      )
      .addSubcommand(subcommand =>
        subcommand
          .setName('announce_create')
          .setDescription('Active/désactive l\'annonce de création de haut-fait publics')
          .addBooleanOption(option =>
            option
              .setName('value')
              .setDescription('Valeur')
          )
      )
      .addSubcommand(subcommand =>
        subcommand
          .setName('announce_update')
          .setDescription('Active/désactive l\'annonce de modification de haut-fait publics')
          .addBooleanOption(option =>
            option
              .setName('value')
              .setDescription('Valeur')
          )
      )
      .addSubcommand(subcommand =>
        subcommand
          .setName('announce_complete')
          .setDescription('Active/désactive l\'annonce de validation de haut-fait publics')
          .addBooleanOption(option =>
            option
              .setName('value')
              .setDescription('Valeur')
          )
      )
      .addSubcommand(subcommand =>
        subcommand
          .setName('announce_undone')
          .setDescription('Active/désactive l\'annonce d\'annulation de validation de haut-fait publics')
          .addBooleanOption(option =>
            option
              .setName('value')
              .setDescription('Valeur')
          )
      )
      .addSubcommand(subcommand =>
        subcommand
          .setName('announce_delete')
          .setDescription('Active/désactive l\'annonce de suppression de haut-fait publics')
          .addBooleanOption(option =>
            option
              .setName('value')
              .setDescription('Valeur')
          ) 
      )
      .addSubcommand(subcommand =>
        subcommand
          .setName('announce_undelete')
          .setDescription('Active/désactive l\'annonce d\'annulation de suppression de haut-fait publics')
          .addBooleanOption(option =>
            option
              .setName('value')
              .setDescription('Valeur')
          )
      )
  );

const shiftCharCode = Δ => c => String.fromCharCode(c.charCodeAt(0) + Δ);
const toFullWidth = str => str.replace(/[!-~]/g, shiftCharCode(0xFEE0));
const toHalfWidth = str => str.replace(/[！-～]/g, shiftCharCode(-0xFEE0));

//⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
const horizontalRule = '⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯';

//🏷TAG1 🏷TAG2
const formatTag = tag => {
  //italic & uppercase
  return `🏷*${tag.toLocaleUpperCase()}*`;
}

//ＡＡＡ> ☐ [First Achievement] You did something! (+10xp) 🏷TAG1 🏷TAG2
//ＨＫＭ> ☑ [pwet] tutututu (+0xp) 🔒
const formatAchievementInList = (achievement, showId) => {
  //achievementid
  const achievementId = showId ?  `${toFullWidth(achievement.id)}> ` : '';  
  //complete or incomplete
  const achievementCompleted = achievement.dateCompleted ? '☑' : '☐';
  //lock if private
  const achievementPrivate = achievement.private ? ' 🔒' : '';
  //include formated tag list if any
  const achievementTagsText = achievement.tags ? ` ${achievement.tags.map(tag => formatTag(tag)).join(' ')}` : '';
  //format achievement text
  const achievementText = `[__**${achievement.title}**__] ${achievement.description} (+${achievement.xp}xp)`
  //strike through if completed
  const striked = achievement.dateCompleted ? '~~' : '';
  //
  return `\n${achievementId}${achievementCompleted} ${striked}${achievementText}${achievementPrivate}${achievementTagsText}${striked}`
} 

//2022-12-28
const formatDate = (date) => {
  const d = new Date(date);
  //adds 0 if month or day is < 10
  const addZero = (n) => n < 10 ? `0${n}` : n;
  return `${d.getFullYear()}-${addZero(d.getMonth()+1)}-${addZero(d.getDate())}`;
}

//parse iso string to date
const parseDate = (date) => {
  try { 
    return new Date(date);
  }
  catch(e) {
    console.error('Error parsing date', e);
    return new Date();
  }
}

const formatSettings = (settings) => {
  const announceCreate = settings.ANNOUNCE_CREATE ? '✅' : '❌';
  const announceUpdate = settings.ANNOUNCE_UPDATE ? '✅' : '❌';
  const announceComplete = settings.ANNOUNCE_COMPLETE ? '✅' : '❌';
  const announceUndone = settings.ANNOUNCE_UNDONE ? '✅' : '❌';
  const announceDelete = settings.ANNOUNCE_DELETE ? '✅' : '❌';
  const announceUndelete = settings.ANNOUNCE_UNDELETE ? '✅' : '❌';
  return `Annoncer:\n${announceCreate} **Création**\n${announceUpdate} **Modification**\n${announceComplete} **Validation**\n${announceUndone} **Annulation de validation**\n${announceDelete} **Suppression**\n${announceUndelete} **Annulation de suppression** `;
}

//generate embed for achievement
const generateAchievementEmbed = (achievement, username) => {

  //TODO: dates

  const color = achievement.dateCompleted ? '#eb3feb' : '#68cbc5';
  const footerStatus = achievement.dateCompleted ? `✅ Accompli par` : '✎ Crée par';
  const footerPrivate = achievement.private ? ' 🔒' : '';
  const footer = `${footerStatus} ${username}${footerPrivate}`;

  const timestamp = achievement.dateCompleted != null ? parseDate(achievement.dateCompleted) : parseDate(achievement.dateCreated);
  
  const embed = new EmbedBuilder()
    .setTitle(`[**${achievement.title}**]`)
    .setDescription(achievement.description)
    .setColor(color)
    .setFooter({text: footer})
    .setTimestamp(timestamp);
    
  if(achievement.dateCompleted) {
    embed.addFields(
      {name: 'Créé', value: '📅 '+ formatDate(parseDate(achievement.dateCreated)), inline: true},
      {name: 'Accompli', value: '📅 '+ formatDate(parseDate(achievement.dateCompleted)), inline: true}
    );
  }
  
  embed.addFields({name: 'XP', value: ':100: ' + achievement.xp.toString(), inline: true});
  
  if(achievement.tags && achievement.tags.length > 0) {
    embed.addFields({name: 'Tags', value: achievement.tags.map(tag => formatTag(tag)).join(' '), inline: true});
  }

  embed.addFields({name: 'ID', value: ':id: '+ achievement.id, inline: true});

  if(achievement.image) {
    embed.setImage(achievement.image);
  }

  return embed;
}

//return array of tags from string
const extractTagList = (tags) => {

  //tags are separated by one of any valid separator and/or spaces
  //if no separator is found, tags are considered as a single string
  //tags are case insensitive in the command but are stored in lowercase

  //tags is a string
  if(!tags) {
    return [];
  }

  //string to array
  const tagsArr = tags.split('');

  const validStringSeparators = ['🔖', '🏷️', '🏷', ',', ';', '|', ' '];
  const separator = validStringSeparators.find(separator => tagsArr.includes(separator));
  if(separator) {
    return tags.split(separator).map(tag => tag.toLowerCase().trim()).filter(tag => tag !== '');
  } else {
    return [tags.toLowerCase()];
  }
}


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


/* COMMANDS */

async function commandAdd(client, interaction) {
  
  const title = interaction.options.getString('title');
  const description = interaction.options.getString('description');
  const image = interaction.options.getString('image') || '';
  const xp = interaction.options.getInteger('xp') || 0;
  const private = interaction.options.getBoolean('private') || false;

  //TODO: validation ?
  const newAchievement = {
    title: title,
    description: description,
    image: image,
    xp: xp,
    private: private
  };

  try {

    //get user settings for announce public creation
    const settings = await api.getUserSettings(interaction.user.id);
    const achievement = await api.addUserAchievement(interaction.user.id, newAchievement);
    const embed = generateAchievementEmbed(achievement, interaction.user.username);

    if(private || !settings.ANNOUNCE_CREATE) {
      //confirm achievement creation in private
      interaction.reply({content: `Haut-fait [${achievement.title}] ajouté !`, embeds: [embed], ephemeral: true});
    }
    else {
      //announce achievement creation in command channel
      //(use same format as in show command)
      interaction.reply({content: `${interaction.member} a ajouté ce haut-fait a accomplir dans sa liste:`, embeds: [embed]});
    }
  } catch (error) {
    console.error('Erreur lors de la commande create', error);
  }
}

async function commandUpdate(client, interaction) {
  //TODO: public announce for update ?
  const id = interaction.options.getString('id') || '';
  const title = interaction.options.getString('title')|| '';
  const description = interaction.options.getString('description') || '';
  const image = interaction.options.getString('image') || '';
  const xp = interaction.options.getInteger('xp') || null;
  const private = interaction.options.getBoolean('private') || null;


  if(id=='') {
    interaction.reply({content: `L'ID du haut-fait est requis !`, ephemeral: true});
    return;
  }

  const achievement = await api.getUserAchievementById(interaction.user.id, id);
  if(!achievement) {
    interaction.reply({content: `Haut-fait [${id}] introuvable !`, ephemeral: true});
    return;
  }
 
  const newAchievement = {
    id: id,
  };

  if(title!='') {
    newAchievement.title = title;
  }
  if(description!='') {
    newAchievement.description = description;
  }
  if(image!='') {
    newAchievement.image = image;
  }
  if(xp!=null) {
    newAchievement.xp = xp;
  }
  if(private!=null) {
    newAchievement.private = private;
  }

  try {
    //get user settings for announce public update
    const settings = await api.getUserSettings(interaction.user.id);
    const updatedachievement = await api.updateUserAchievement(interaction.user.id, newAchievement);
    const embed = generateAchievementEmbed(updatedachievement, interaction.user.username);

    if(private || !settings.ANNOUNCE_UPDATE) {
      //confirm achievement creation in private
      interaction.reply({content: `Haut fait [${id}] modifié !`, embeds: [embed], ephemeral: true});
    }
    else {
      //announce achievement creation in command channel
      interaction.reply({content: `${interaction.member} a mis a jour le haut-fait:`, embeds: [embed]});
    }
  } catch (error) {
    console.error('Erreur lors de la commande update', error);
  }
}

async function commandDelete(client, interaction) {
  //TODO: public announce for deletion ?
  const id = interaction.options.getString('id');
  try {
     //get user settings for announce public update
     const settings = await api.getUserSettings(interaction.user.id);
     const deletedachievement = await api.deleteUserAchievement(interaction.user.id, id);
     const embed = generateAchievementEmbed(deletedachievement, interaction.user.username);

      if(deletedachievement.private || !settings.ANNOUNCE_DELETE) {
        //confirm achievement creation in private
        interaction.reply({content: `Haut fait [${id}] supprimé !`, embeds: [embed], ephemeral: true});
      }
      else {
        //announce achievement creation in command channel
        interaction.reply({content: `${interaction.member} a supprimé le haut-fait:`, embeds: [embed]});
      }
  } catch (error) {
    console.error('Erreur lors de la commande delete', error);
  }
}

//show achievements in current channel
async function commandShowAchievement(client, interaction) {
  const username  = client.users.cache.get(interaction.user.id).username; //TODO: check if user exists
  const userId = interaction.user.id;
  const achievementId = interaction.options.getString('id');

  try {
    const achievement = await api.getUserAchievementById(userId, achievementId);
    if(!achievement) {
      interaction.reply({content: `Désolé mais je ne trouce pas le haut-fait [${achievementId}]`, ephemeral: true});
      return;
    }
    const embed = generateAchievementEmbed(achievement, username);
    const msg = `Voici un haut-fait de ${username}:`;
    interaction.reply({content: msg, embeds: [embed]});
  } catch (error) {
    console.error('Erreur lors de la commande show', error);
  }
}

//show achievements (filter containing at leach one of the tag(s) if any) in current channel
async function commandShowList(client, interaction) {

  const username  = client.users.cache.get(interaction.user.id).username; //TODO: check if user exists

  //retrieve tags from options (if any)
  const tags = interaction.options.getString('tags') || false;

  const tagList = extractTagList(tags);
  
  try {

    let achievements = await api.getUserAchievements(interaction.user.id);
    if(achievements.length === 0) {
      interaction.reply({content: `Aucun haut-fait a montrer :(`, ephemeral: true});
      return;
    }
   
    if(tagList.length > 0) {
      //filter achievements by tags
      //!\ achievement.tags may not exists
      achievements = achievements.filter(achievement => achievement.tags && achievement.tags.some(tag => tagList.includes(tag)));
      if(achievements.length === 0) {
        const includedTagsText = `${tagList.map(tag => formatTag(tag)).join(' ')}`;
        interaction.reply({content: `Désolé mais je ne trouve pas haut-fait correspondant aux tags ${includedTagsText}`, ephemeral: true});
        return;
      }
    }

    const includedTagsText = tagList.length > 0 ? ` incluants un des tags suivants: ${tagList.map(tag => formatTag(tag)).join(' ')}` : '';
    const msg =
      `Hauts-faits de ${username}${includedTagsText}:\n${horizontalRule}`
      + achievements.map(achievement => formatAchievementInList(achievement)).join('');
    
    interaction.reply({content: msg});
  } catch (error) {
    console.error('Erreur lors de la commande showList', error);
  }
}

async function commandList(client, interaction) {
  //get tags if any
  let tags = interaction.options.getString('tags') || false;

  const tagList = extractTagList(tags);

  try {
    
    let achievements = await api.getUserAchievements(interaction.user.id);

    if(tagList.length > 0) {
      //filter achivement matching any tags if tags are provided
      //!\\ achievement.tags may not exists and tags are case insensitive
      achievements = achievements.filter(achievement => achievement.tags && achievement.tags.some(tag => tagList.includes(tag)));
    }

    if(achievements.length === 0) {
      if(tagList.length > 0) {
        const tagListMsg = tagList.map(tag => formatTag(tag)).join(' ');
        const plural = tagList.length > 1 ? 'un des tags' : 'le tag';
        interaction.reply({content: `Je n'ai trouvé aucun haut-fait comportant ${plural} ${tagListMsg}`, ephemeral: true});
        return;
      } else {
        interaction.reply({content: `Aucun haut-fait pour le moment`, ephemeral: true});
        return;
      }
    }

    const msgWithTagsHeader = `Hauts-faits comprenant un des tags ${tagList.map(tag => `${formatTag(tag)}`).join(' ')}\n${horizontalRule}`;
    const msgWithoutTagsHeader = `Haut faits:\n${horizontalRule}`;
    const achievementList = achievements.map(achievement => formatAchievementInList(achievement, true)).join('');

    const msg = tagList.length > 0 ? msgWithTagsHeader + achievementList : msgWithoutTagsHeader + achievementList;

    interaction.reply({content: msg, ephemeral: true});
  } catch (error) {
    console.error('Erreur lors de la commande list', error);
  }
}

async function commandComplete(client, interaction) {
  const id = interaction.options.getString('id');
  try {
    
    const achievement = await api.getUserAchievementById(interaction.user.id, id);

    //inconnu
    if(achievement === undefined) {
      interaction.reply({content: `Haut-fait [${id}] introuvable !`, ephemeral: true});
      return;
    }
    
    //deja complete
    if(achievement.dateCompleted !== null && achievement.dateCompleted !== undefined) {
      interaction.reply({content: `Haut-fait [${id}] déjà complété !`, ephemeral: true});
      return;
    }

    const username  = client.users.cache.get(interaction.user.id).username; //TODO: check if user exists
    const settings = await api.getUserSettings(interaction.user.id);
    const embed = generateAchievementEmbed(achievement, username);
    const completedachievement = await api.completeUserAchievement(interaction.user.id, id);
    
    if(completedachievement.private || !settings.ANNOUNCE_COMPLETE) {
      interaction.reply({content: `Haut-fait complété !`, embeds: [embed], ephemeral: true});
      return;
    } 
    
    interaction.reply({content: `${interaction.member} viens de completer le haut-fait:`, embeds: [embed]});
    
  } catch (error) {
    console.error('Erreur lors de la commande complete', error);
  }
}

async function commandUndone(client, interaction) {
  const id = interaction.options.getString('id');
  try {
    const achievement = await api.getUserAchievementById(interaction.user.id, id);
    const username = client.users.cache.get(interaction.user.id).username; //TODO: check if user exists
    const embed = generateAchievementEmbed(achievement, username);
    const settings = await api.getUserSettings(interaction.user.id);
   
    if(achievement === undefined) {
      interaction.reply({content: `Haut-fait [${id}] introuvable !`, ephemeral: true});
      return;
    }
    if(achievement.dateCompleted === undefined) {
      interaction.reply({content: `Haut-fait [${id}] déjà incomplet !`, ephemeral: true});
      return;
    }

    const undonedachievement = await api.uncompleteUserAchievement(interaction.user.id, id);

    if(undonedachievement.private || !settings.ANNOUNCE_UNDONE) {
      interaction.reply({content: `Haut-fait invalidé !`, embeds: [embed], ephemeral: true});
      return;
    }

    interaction.reply({content: `${interaction.member} viens d'invalider le haut-fait:`, embeds: [embed]});
  } catch (error) {
    console.error('Erreur lors de la commande uncomplete', error);
  }
}

async function commandUndelete(client, interaction) {
  const id = interaction.options.getString('id');
  try {
    const achievement = await api.getUserAchievementById(interaction.user.id, id);
    const username  = client.users.cache.get(interaction.user.id).username; //TODO: check if user exists
    const settings = await api.getUserSettings(interaction.user.id);
    const embed = generateAchievementEmbed(achievement, username, settings);

    if(achievement === undefined) {
      interaction.reply({content: `Haut-fait [${id}] introuvable !`, ephemeral: true});
      return;
    }
    if(!achievement.dateDeleted) {
      interaction.reply({content: `Haut-fait [${id}] déjà visible !`, ephemeral: true});
      return;
    }
    await api.undeleteUserAchievement(interaction.user.id, id);

    if(achievement.private || !settings.ANNOUNCE_UNDELETE) {
      interaction.reply({content: `Haut-fait [${id}] restauré !`, embeds: [embed], ephemeral: true});
      return;
    }

    interaction.reply({content: `${interaction.member} viens de restaurer le haut-fait:`, embeds: [embed]});
  } catch (error) {
    console.error('Erreur lors de la commande undelete', error);
  }
}

async function commandTagAdd(client, interaction) {
  const id = interaction.options.getString('id');
  const tag = interaction.options.getString('tag');
  try {
    const achievement = await api.getUserAchievementById(interaction.user.id, id);
    if(achievement === undefined) {
      interaction.reply({content: `Haut-fait [${id}] introuvable !`, ephemeral: true});
      return;
    }
    if(achievement.tags.includes(tag)) {
      interaction.reply({content: `Haut-fait [${id}] déjà taggé avec [${tag}] !`, ephemeral: true});
      return;
    }
    await api.addTagToUserAchievement(interaction.user.id, id, tag);
    interaction.reply({content: `Haut-fait [${id}] taggé avec [${tag}] !`});
  } catch (error) {
    console.error('Erreur lors de la commande addTag', error);
  }
}

async function commandTagRemove(client, interaction) {
  const id = interaction.options.getString('id');
  const tag = interaction.options.getString('tag');
  try {
    const achievement = await api.getUserAchievementById(interaction.user.id, id);
    if(achievement === undefined) {
      interaction.reply({content: `Haut-fait [${id}] introuvable !`, ephemeral: true});
      return;
    }
    if(!achievement.tags.includes(tag)) {
      interaction.reply({content: `Haut-fait [${id}] n'est pas taggé avec [${tag}] !`, ephemeral: true});
      return;
    }
    await api.removeTagFromUserAchievement(interaction.user.id, id, tag);
    interaction.reply({content: `Haut-fait [${id}] détaggé de [${tag}] !`});
  } catch (error) {
    console.error('Erreur lors de la commande removeTag', error);
  }
}

async function commandTagList(client, interaction) {
 
  try {

    const achievements = await api.getUserAchievements(interaction.user.id);

    //get unique tag name and count of occurences for each unique tag in user achievements
    //tags array may not be present in some achievements
    const tags = achievements.reduce((acc, achievement) => {
      if(achievement.tags) {
        achievement.tags.forEach(tag => {
          if(acc[tag]) {
            acc[tag]++;
          } else {
            acc[tag] = 1;
          }
        });
      }
      return acc;
    }, {});

    //sort tags by count
    const uniqueTags = Object.keys(tags).sort((a, b) => tags[b] - tags[a]);

    //show list of tag name and occurence count
    const msg =
      `Voici la liste des tags utilisés:\n${horizontalRule}`
      + uniqueTags.map(tag => `\n${formatTag(tag)} (${tags[tag]} occurence(s))`).join('');

    interaction.reply({content: msg, ephemeral: true});
  } catch (error) {
    console.error('Erreur lors de la commande listTags', error);
  }
}

async function commandSettingsAnnounceCreate(client, interaction) {
  const value = interaction.options.getBoolean('value');
  try {
    const settings = await api.getUserSettings(interaction.user.id);
    settings.ANNOUNCE_CREATE = value;
    await api.updateUserSettings(interaction.user.id, settings);
    interaction.reply({content: `Paramètre ANNOUNCE_CREATE mis à jour sur ${value.toString().toLocaleUpperCase()}!`, ephemeral: true});
  }
  catch (error) {
    console.error('Erreur lors de la commande settingsAnnounceCreate', error);
  }
}

async function commandSettingsAnnounceUpdate(client, interaction) {
  const value = interaction.options.getBoolean('value');
  try {
    const settings = await api.getUserSettings(interaction.user.id);
    settings.ANNOUNCE_UPDATE = value;
    await api.updateUserSettings(interaction.user.id, settings);
    interaction.reply({content: `Paramètre ANNOUNCE_UPDATE mis à jour sur ${value.toString().toLocaleUpperCase()}!`, ephemeral: true});
  }
  catch (error) {
    console.error('Erreur lors de la commande settingsAnnounceUpdate', error);
  }
}

async function commandSettingsAnnounceComplete(client, interaction) {
  const value = interaction.options.getBoolean('value');
  try {
    const settings = await api.getUserSettings(interaction.user.id);
    settings.ANNOUNCE_COMPLETE = value;
    await api.updateUserSettings(interaction.user.id, settings);
    interaction.reply({content: `Paramètre ANNOUNCE_COMPLETE mis à jour sur ${value.toString().toLocaleUpperCase()}!`, ephemeral: true});
  }
  catch (error) {
    console.error('Erreur lors de la commande settingsAnnounceComplete', error);
  }
}

async function commandSettingsAnnounceUncomplete(client, interaction) {
  const value = interaction.options.getBoolean('value');
  try {
    const settings = await api.getUserSettings(interaction.user.id);
    settings.ANNOUNCE_UNDONE = value;
    await api.updateUserSettings(interaction.user.id, settings);
    interaction.reply({content: `Paramètre ANNOUNCE_UNDONE mis à jour sur ${value.toString().toLocaleUpperCase()}!`, ephemeral: true});
  }
  catch (error) {
    console.error('Erreur lors de la commande settingsAnnounceUncomplete', error);
  }
}

async function commandSettingsAnnounceDelete(client, interaction) {
  const value = interaction.options.getBoolean('value');
  try {
    const settings = await api.getUserSettings(interaction.user.id);
    settings.ANNOUNCE_DELETE = value;
    await api.updateUserSettings(interaction.user.id, settings);
    interaction.reply({content: `Paramètre ANNOUNCE_DELETE mis à jour sur ${value.toString().toLocaleUpperCase()}!`, ephemeral: true});
  }
  catch (error) {
    console.error('Erreur lors de la commande settingsAnnounceDelete', error);
  }
}

async function commandSettingsAnnounceUndelete(client, interaction) {
  const value = interaction.options.getBoolean('value');
  try {
    const settings = await api.getUserSettings(interaction.user.id);
    settings.ANNOUNCE_UNDELETE = value;
    await api.updateUserSettings(interaction.user.id, settings);
    interaction.reply({content: `Paramètre ANNOUNCE_UNDELETE mis à jour sur ${value.toString().toLocaleUpperCase()}!`, ephemeral: true});
  }
  catch (error) {
    console.error('Erreur lors de la commande settingsAnnounceUndelete', error);
  }
}

async function commandSettingsList(client, interaction) {
  try {
    const settings = await api.getUserSettings(interaction.user.id);
    const msg =
      `Voici la liste des paramètres:\n${horizontalRule}\n${formatSettings(settings)}`;
    interaction.reply({content: msg, ephemeral: true});
  }
  catch (error) {
    console.error('Erreur lors de la commande settingsList', error);
  }
}

//get ids from all achievements for auto complete
async function getAllAchievementIds(client, interaction) {
  const achievements = await api.getUserAchievements(interaction.user.id);
  //order by dateCreated desc
  achievements.sort((a, b) => b.dateCreated - a.dateCreated);
  return achievements.map(achievement => achievement.id); 
}

//get all not completed achievements and returns only ids for auto complete
async function getCanCompleteAchievementIds(client, interaction) {
  const achievements = await api.getUserAchievements(interaction.user.id);
  //order by dateCreated asc
  achievements.sort((a, b) => a.dateCreated - b.dateCreated);
  return achievements.filter(achievement => !achievement.dateCompleted).map(achievement => achievement.id.toLocaleUpperCase());
}
 
//get all completed achievements and returns only ids for auto complete
async function getCanUndeleteAchievementIds(client, interaction) {
  const achievements = await api.getUserAchievements(interaction.user.id, true);
  //order by dateDeleted desc
  achievements.sort((a, b) => b.dateDeleted - a.dateDeleted);
  return achievements.filter(achievement => achievement.dateDeleted != null).map(achievement => achievement.id.toLocaleUpperCase());
}

//get all completed achievements and returns only ids for auto complete
async function getCanUncompleteAchievementIds(client, interaction) {
  const achievements = await api.getUserAchievements(interaction.user.id);
  //order by dateCompleted desc
  achievements.sort((a, b) => b.dateCompleted - a.dateCompleted);
  return achievements.filter(achievement => achievement.dateCompleted).map(achievement => achievement.id.toLocaleUpperCase());
}

//get unique tag names from all achievements for auto complete
async function getAllAchievementTags(client, interaction) {
  const achievements = await api.getUserAchievements(interaction.user.id);
  const tags = achievements.reduce((acc, achievement) => {
    if(achievement.tags) {
      achievement.tags.forEach(tag => {
        if(!acc.includes(tag)) {
          acc.push(tag.toLocaleUpperCase());
        }
      });
    }
    return acc;
  }, []);
  return tags;
}

module.exports = {
	data: commands,
  async execute(client, interaction) {
    const subcommand = interaction.options.getSubcommand();
    let group = interaction.options.getSubcommandGroup();

    if(!group) group = 'achievement';
 
    switch (group) {
      case 'settings':
        switch (subcommand) {
          case 'list':
            return await commandSettingsList(client, interaction);
          case 'announce_create':
            return await commandSettingsAnnounceCreate(client, interaction);
          case 'announce_delete':
            return await commandSettingsAnnounceDelete(client, interaction);
          case 'announce_update':
            return await commandSettingsAnnounceUpdate(client, interaction);
          case 'announce_complete':
            return await commandSettingsAnnounceComplete(client, interaction);
          case 'announce_undelete':
            return await commandSettingsAnnounceUndelete(client, interaction);
          case 'announce_undone':
            return await commandSettingsAnnounceUncomplete(client, interaction);
          default:
            interaction.reply({content: `Désolé mais, la commande ${subcommand} n'existe pas ou n'est pas encore implementée :(`, ephemeral: true});
            break;
        }
        break;
      case 'tag':
        switch (subcommand) {
          case 'add':
            return await commandTagAdd(client, interaction);
          case 'remove':
            return await commandTagRemove(client, interaction);
          case 'list':
            return await commandTagList(client, interaction);
          default:
            interaction.reply({content: `Désolé mais, la commande ${subcommand} n'existe pas ou n'est pas encore implementée :(`, ephemeral: true});
            break;
        }
        break;
      default:
        switch (subcommand) {
          case 'list': 
            return await commandList(client, interaction);
          case 'create':
            return await commandAdd(client, interaction);
          case 'edit':
            return await commandUpdate(client, interaction);
          case 'delete':
            return await commandDelete(client, interaction);
          case 'undelete':
            return await commandUndelete(client, interaction);
          case 'complete':
            return await commandComplete(client, interaction);
          case 'undone':
            return await commandUndone(client, interaction);
          case 'show':
            return await commandShowAchievement(client, interaction);
          case 'showlist':
            return await commandShowList(client, interaction);
          default:
            interaction.reply({content: `Désolé mais, la commande ${subcommand} n'existe pas ou n'est pas encore implementée :(`, ephemeral: true});
            break;
        }
        break;
    }
  },
  async autocomplete(client, interaction) {
		const focusedOption = interaction.options.getFocused(true);
    let choices = [];
    switch(focusedOption.name) {
      case 'id':
        //check subcommand name to know which list to return
        const subcommand = interaction.options.getSubcommand();
        if(subcommand === 'complete') {
          choices = await getCanCompleteAchievementIds(client, interaction);
        } else if(subcommand === 'undone') {
          choices = await getCanUncompleteAchievementIds(client, interaction);
        } else if(subcommand === 'undelete') {
          choices = await getCanUndeleteAchievementIds(client, interaction);
        } else {
          choices = await getAllAchievementIds(client, interaction);
        } 
        break;
      case 'tag':
      case 'tags':
        choices = await getAllAchievementTags(client, interaction);
      default:
        break;
    }

		const filtered = choices.filter(choice => choice.startsWith(focusedOption.value));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
  }
};
