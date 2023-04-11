require('dotenv').config();

const fs = require('fs');

const DB_PATH = (process.env.DATA_PATH || './data') + '/achievements';
const DB_VERSION = 2;

const defaultUserSettings = {
  ANNOUNCE_CREATE: true,
  ANNOUNCE_COMPLETE: true,
  ANNOUNCE_DELETE: true,
  ANNOUNCE_UPDATE: true,
  ANNOUNCE_UNDONE: true,
  ANNOUNCE_UNDELETE: true,
  PUBLIC_NAME: 'John Doe',
  PUBLIC_AVATAR: 'https://i.imgur.com/0y0y0y0.png',
  PUBLIC_MEMBER: '<Member not set>',
};

function _uuid() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 3; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function _checkUserId(userId) {
  //must be set, a valid number, with a minimum length of 18
  if (!userId) throw new Error('userId is required');
  if (isNaN(userId)) throw new Error('userId must be a number');
  if (userId.length < 18)
    throw new Error('userId must be at least 18 characters');
}

function _checkAchievementId(achievementId) {
  //must be set. a valid string, with a length of 3
  if (!achievementId) throw new Error('achievementId is required');
  if (typeof achievementId !== 'string')
    throw new Error('achievementId must be a string');
  if (achievementId.length !== 3)
    throw new Error('achievementId must be 3 characters');
}

function _checkTag(tag) {
  //must be a valid string, with a minimum length of 1. max length of 20
  if (!tag) throw new Error('tag is required');
  if (typeof tag !== 'string') throw new Error('tag must be a string');
  if (tag.length < 1) throw new Error('tag must be at least 1 character');
  if (tag.length > 20) throw new Error('tag must be less than 20 characters');
}

function _checkAchievement(achievement) {
  //must be an achievement object
  if (!achievement) throw new Error('achievement is required');
  if (!achievement.id) throw new Error('achievement.id is required');
}

function _checkUserSettings(settings) {
  //must be an object
  if (!settings) throw new Error('settings is required');
  if (typeof settings !== 'object')
    throw new Error('settings must be an object');
}

async function getUsers() {
  const userIds = [];
  const files = await fs.promises.readdir(DB_PATH);
  files.forEach((file) => {
    if (file.endsWith('.json')) {
      const userId = file.substring(0, file.length - 5);
      userIds.push(userId);
    }
  });

  //for each user load the database and get the user settings
  const users = [];
  for (let i = 0; i < userIds.length; i++) {
    const db = await _loadUserDatabase(userIds[i]);
    users.push({
      id: userIds[i],
      dateCreated: db.dateCreated,
      name: db.settings.PUBLIC_NAME || 'John Doe',
      avatar: db.settings.PUBLIC_AVATAR || 'https://i.imgur.com/0y0y0y0.png',
      member: db.settings.PUBLIC_MEMBER || '<Member not set>',
    });
  }
  return users;
}

async function _loadUserDatabase(userId) {
  //one user per file
  const databaseFile = `${DB_PATH}/${userId}.json`;

  //create file if not exists
  if (!fs.existsSync(databaseFile)) {
    await _saveUserDatabase(userId, {
      version: DB_VERSION,
      dateCreated: new Date(),
      dateUpdated: null,
      achievements: [],
      settings: defaultUserSettings,
    });
  }

  //read from file
  const json = await fs.promises.readFile(databaseFile, 'utf8');
  let db = {};
  try {
    //parse json
    db = JSON.parse(json);
  } catch (error) {
    throw new Error(`Error parsing database file: ${error}`);
  }
  return db;
}

async function _saveUserDatabase(userId, db) {
  //one user per file
  const databaseFile = `${DB_PATH}/${userId}.json`;

  //TODO: check db version changes
  db.version = DB_VERSION;
  db.dateUpdated = new Date();
  if (!db.achievements) {
    db.achievements = [];
  }
  if (!db.settings) {
    db.settings = defaultUserSettings;
  }

  try {
    return await fs.promises.writeFile(
      databaseFile,
      JSON.stringify(db, null, 2)
    );
  } catch (error) {
    throw new Error(`Error writing database file: ${error}`);
  }
}

async function getUserAchievementById(userId, achievementId) {
  _checkUserId(userId);
  _checkAchievementId(achievementId);
  const db = await _loadUserDatabase(userId);
  return db.achievements.find(
    (a) => a.id.toLowerCase() === achievementId.toLowerCase()
  );
}

async function getUserAchievements(userId, showDeleted) {
  _checkUserId(userId);
  const db = await _loadUserDatabase(userId);
  //filter out deleted achievements ?
  if (!showDeleted) return db.achievements.filter((a) => !a.dateDeleted);
  return db.achievements;
}

async function getUserPublicAchievements(userId) {
  _checkUserId(userId);
  const db = await _loadUserDatabase(userId);
  //filter out deleted achievements
  const achievements = db.achievements.filter((a) => !a.dateDeleted);
  //filter out private achievements
  return achievements.filter((a) => !a.private);
}

async function getUserSettings(userId) {
  _checkUserId(userId);
  const db = await _loadUserDatabase(userId);
  const settings = {
    ...defaultUserSettings,
    ...db.settings,
  };
  return settings;
}

async function updateUserSettings(userId, settings) {
  _checkUserId(userId);
  _checkUserSettings(settings);

  const db = await _loadUserDatabase(userId);
  db.settings = {
    ...defaultUserSettings,
    ...db.settings,
    ...settings,
  };
  await _saveUserDatabase(userId, db);
  return db.settings;
}

async function addUserAchievement(userId, achievement) {
  _checkUserId(userId);
  _checkAchievement(achievement);

  const db = await _loadUserDatabase(userId);

  //check for duplicate id
  let newId = _uuid();
  let needId = true;
  while (needId) {
    let found = -1;
    db.achievements.forEach((element, index) => {
      if (element.id.toLowerCase() === newId.toLowerCase()) {
        found = index;
      }
    });
    if (found !== -1) {
      newId = _uuid();
    } else {
      needId = false;
    }
  }

  const achievementBase = {
    id: newId,
    dateCreated: new Date(),
    dateUpdated: null,
    dateDeleted: null,
    dateCompleted: null,
    tags: [],
  };

  const newAchievement = { ...achievementBase, ...achievement };

  db.achievements.push(newAchievement);
  await _saveUserDatabase(userId, db);
  return newAchievement;
}

async function updateUserAchievement(userId, achievement) {
  _checkUserId(userId);
  _checkAchievement(achievement);

  const db = await _loadUserDatabase(userId);
  let found = -1;
  db.achievements.forEach((element, index) => {
    if (element.id.toLowerCase() === achievement.id.toLowerCase()) {
      found = index;
    }
  });
  if (found === -1) {
    throw new Error(`Error updating achievement: ${achievement.id} not found`);
  }

  //update stuff
  const achievementUpdate = { ...db.achievements[found], ...achievement };

  //update database achievement
  db.achievements[found] = achievementUpdate;
  await _saveUserDatabase(userId, db);
  return achievementUpdate;
}

async function addTagToUserAchievement(userId, achievementId, tag) {
  _checkUserId(userId);
  _checkAchievementId(achievementId);
  _checkTag(tag);

  const db = await _loadUserDatabase(userId);

  //load achievement
  const achievement = await getUserAchievementById(userId, achievementId);
  if (!achievement) {
    throw new Error(
      `Error addTagUserAchievement: achievement ${achievementId} not found`
    );
  }

  if (!achievement.tags) {
    achievement.tags = [];
  }

  //check tag not already added
  if (achievement.tags.find((t) => t.toLowerCase() === tag.toLowerCase())) {
    throw new Error(
      `Error addTagUserAchievement: achievement ${achievementId} already has tag: ${tag}`
    );
  }

  //tag sanity check
  if (tag.length > 20) {
    throw new Error(`Error addTagUserAchievement: tag too long: ${tag}`);
  }
  //check for invalid characters
  if (!tag.match(/^[a-zA-Z0-9]+$/)) {
    throw new Error(
      `Error addTagUserAchievement: tag contains invalid characters: ${tag}`
    );
  }

  //update stuff
  achievement.tags.push(tag.toLowerCase());
  achievement.dateUpdated = new Date();

  //update database achievement
  for (let i = 0; i < db.achievements.length; i++) {
    if (db.achievements[i].id.toLowerCase() === achievement.id.toLowerCase()) {
      db.achievements[i] = achievement;
      break;
    }
  }

  await _saveUserDatabase(userId, db);
  return achievement;
}

async function removeTagFromUserAchievement(userId, achievementId, tag) {
  const db = await _loadUserDatabase(userId);
  const achievement = await getUserAchievementById(userId, achievementId);

  if (!achievement) {
    throw new Error(
      `Error addTagUserAchievement: achievement ${achievementId} not found`
    );
  }

  if (!achievement.tags) {
    achievement.tags = [];
  }

  //check tag exists
  if (!achievement.tags.find((t) => t.toLowerCase() === tag.toLowerCase())) {
    throw new Error(
      `Error addTagUserAchievement: achievement ${achievementId} has no '${tag}' tag`
    );
  }

  //update stuff
  achievement.tags = achievement.tags.filter(
    (t) => t.toLowerCase() !== tag.toLowerCase()
  );
  achievement.dateUpdated = new Date();

  //update database achievement
  for (let i = 0; i < db.achievements.length; i++) {
    if (db.achievements[i].id.toLowerCase() === achievement.id.toLowerCase()) {
      db.achievements[i] = achievement;
      break;
    }
  }

  await _saveUserDatabase(userId, db);
  return achievement;
}

async function completeUserAchievement(userId, achievementId) {
  const db = await _loadUserDatabase(userId);
  let found = -1;
  db.achievements.forEach((element, index) => {
    if (element.id.toLowerCase() === achievementId.toLowerCase()) {
      found = index;
    }
  });
  if (found === -1) {
    throw new Error(`Error updating achievement: ${achievementId} not found`);
  }

  let achievement = db.achievements[found];
  achievement.dateCompleted = new Date();

  //update database achievement
  db.achievements[found] = achievement;
  await _saveUserDatabase(userId, db);
  return achievement;
}

async function uncompleteUserAchievement(userId, achievementId) {
  const db = await _loadUserDatabase(userId);
  let found = -1;
  db.achievements.forEach((element, index) => {
    if (element.id.toLowerCase() === achievementId.toLowerCase()) {
      found = index;
    }
  });
  if (found === -1) {
    throw new Error(`Error updating achievement: ${achievementId} not found`);
  }
  if (!db.achievements[found].dateCompleted) {
    throw new Error(
      `Error updating achievement: ${achievementId} not completed`
    );
  }

  let achievement = db.achievements[found];
  achievement.dateCompleted = null;

  //update database achievement
  db.achievements[found] = achievement;
  await _saveUserDatabase(userId, db);
  return achievement;
}

async function deleteUserAchievement(userId, achievementId) {
  const db = await _loadUserDatabase(userId);
  let found = -1;
  db.achievements.forEach((element, index) => {
    if (element.id.toLowerCase() === achievementId.toLowerCase()) {
      found = index;
    }
  });
  if (found === -1) {
    throw new Error(`Error updating achievement: ${achievementId} not found`);
  }

  let achievement = db.achievements[found];
  achievement.dateDeleted = new Date();

  //update database achievement
  db.achievements[found] = achievement;
  await _saveUserDatabase(userId, db);
  return achievement;
}

async function undeleteUserAchievement(userId, achievementId) {
  const db = await _loadUserDatabase(userId);
  let found = -1;
  db.achievements.forEach((element, index) => {
    if (element.id.toLowerCase() === achievementId.toLowerCase()) {
      found = index;
    }
  });
  if (found === -1) {
    throw new Error(`Error updating achievement: ${achievementId} not found`);
  }
  if (!db.achievements[found].dateDeleted) {
    throw new Error(`Error updating achievement: ${achievementId} not deleted`);
  }

  let achievement = db.achievements[found];
  achievement.dateDeleted = null;

  //update database achievement
  db.achievements[found] = achievement;
  await _saveUserDatabase(userId, db);
  return achievement;
}

module.exports = {
  getUsers,
  getUserAchievementById,
  getUserAchievements,
  getUserPublicAchievements,
  getUserSettings,
  updateUserSettings,
  addUserAchievement,
  updateUserAchievement,
  completeUserAchievement,
  uncompleteUserAchievement,
  deleteUserAchievement,
  undeleteUserAchievement,
  addTagToUserAchievement,
  removeTagFromUserAchievement,
};
