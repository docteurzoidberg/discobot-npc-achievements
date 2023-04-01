require('dotenv').config();

const fs = require('fs');

const databasePath = process.env.DATABASE_PATH || './data';

function uuid() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 3; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

async function loadUserDatabase(userId) {

    const databaseFile = `${databasePath}/${userId}.json`;
    if (!fs.existsSync(databaseFile)) {
        await saveUserDatabase(userId,  {
            dateCreated: new Date(),
            achievements: []
        });
    }

    const json = await fs.promises.readFile(databaseFile, 'utf8');
    let db = {};
    try {
        db = JSON.parse(json);
    } catch (error) {
        throw new Error(`Error parsing database file: ${error}`);
    }
    return db;
}

async function saveUserDatabase(userId, db) {
    const databaseFile = `${databasePath}/${userId}.json`;
    const newdb = {
        ...db,
        version: 2,
        dateUpdated: new Date(),
    };
    try {
        return await fs.promises.writeFile(databaseFile, JSON.stringify(newdb, null, 2));
    } catch (error) {
        throw new Error(`Error writing database file: ${error}`);
    }
}

async function getUserAchievementById(userId, achievementId) {
    const db = await loadUserDatabase(userId);
    return db.achievements.find(a => a.id.toLowerCase() === achievementId.toLowerCase());
}

async function getUserAchievements(userId) {;
    const db = await loadUserDatabase(userId);
    //filter out deleted achievements
    return db.achievements.filter(a => a.dateDeleted === undefined);
}

async function addUserAchievement(userId, achievement) {
    
    //TODO: check achievement data
    
    const db = await loadUserDatabase(userId);
    
    //check for duplicate id
    let newId = uuid();
    let needId = true;
    while(needId){
        let found = -1;
        db.achievements.forEach((element, index) => {
            if(element.id.toLowerCase() === newId.toLowerCase()) {
                found = index;
            }
        });
        if(found !== -1) {
            newId = uuid();
        } else {
            needId = false;
        }
    }

    const achievementBase = {
        id: newId,
        dateCreated: new Date(),
        tags: []
    };

    const newAchievement = {...achievementBase, ...achievement};

    db.achievements.push(newAchievement);
    await saveUserDatabase(userId, db);
}

async function updateUserAchievement(userId, achievement) {

    const db = await loadUserDatabase(userId);

    let found = -1;
    db.achievements.forEach((element, index) => {
        if(element.id.toLowerCase() === achievement.id.toLowerCase()) {
            found = index;
        }
    });
    if(found === -1) {
        throw new Error(`Error updating achievement: ${achievementid} not found`);
    }

    const achievementOveride = {
        dateUpdated:new Date()
    };

    const achievementUpdate = {...achievement, ...achievementOveride};

    //update database achievement
    db.achievements[found] = achievementUpdate;
    await saveUserDatabase(userId, db);
}

async function addTagUserAchievement(userId, achievementId, tag) {

  //check tag not already added
  if(achievement.tags.find(t => t.toLowerCase() === tag.toLowerCase())) {
      throw new Error(`Error addTagUserAchievement: achievement ${achievementId} already has tag: ${tag}`);
  }

  //tag sanity check
  if(tag.length > 20) {
      throw new Error(`Error addTagUserAchievement: tag too long: ${tag}`);
  }
  //check for invalid characters
  if(!tag.match(/^[a-zA-Z0-9]+$/)) {
      throw new Error(`Error addTagUserAchievement: tag contains invalid characters: ${tag}`);
  }

  //load db
  const db = await loadUserDatabase(userId);

  //find achievement
  let found = -1;
  db.achievements.forEach((element, index) => {
      if(element.id.toLowerCase() === achievementId.toLowerCase()) {
          found = index;
      }
  });
  if(found === -1) {
      throw new Error(`Error addTagUserAchievement: achievement ${achievementId} not found`);
  }
  
  const achievement = db.achievements[found];
  if(!achievement.tags) achievement.tags = [];

  //update stuff
  achievement.tags.push(tag.toLowerCase());
  achievement.dateUpdated = new Date();

  //update database achievement
  db.achievements[found] = achievement;
  await saveUserDatabase(userId, db);
}

async function removeTagUserAchievement(userId, achievementId, tag) {
    
  //load db
  const db = await loadUserDatabase(userId);

  //find achievement
  let found = -1;
  db.achievements.forEach((element, index) => {
      if(element.id.toLowerCase() === achievementId.toLowerCase()) {
          found = index;
      }
  });
  if(found === -1) {
    throw new Error(`Error addTagUserAchievement: achievement ${achievementId} not found`);
  }
  
  const achievement = db.achievements[found];
  if(!achievement.tags) achievement.tags = [];

    //check tag exists
  if(!achievement.tags.find(t => t.toLowerCase() === tag.toLowerCase())) {
    throw new Error(`Error addTagUserAchievement: achievement ${achievementId} has no '${tag}' tag`);
  }

  //update stuff
  achievement.tags = achievement.tags.filter(t => t.toLowerCase() !== tag.toLowerCase());
  achievement.dateUpdated = new Date()
  
  //update database achievement
  db.achievements[found] = achievement;
  await saveUserDatabase(userId, db);
}

async function completeUserAchievement(userId, achievementId) {
    const db = await loadUserDatabase(userId);
    let found = -1;
    db.achievements.forEach((element, index) => {
        if(element.id.toLowerCase() === achievementId.toLowerCase()) {
            found = index;
        }
    });
    if(found === -1) {
        throw new Error(`Error updating achievement: ${achievementId} not found`);
    }

    let achievement = db.achievements[found];
    achievement.dateCompleted = new Date();
    
    //update database achievement
    db.achievements[found] = achievement;
    await saveUserDatabase(userId, db);
}

async function deleteUserAchievement(userId, achievementId) {
    const db = await loadUserDatabase(userId);
    let found = -1;
    db.achievements.forEach((element, index) => {
        if(element.id.toLowerCase() === achievementId.toLowerCase()) {
            found = index;
        }
    });
    if(found === -1) {
        throw new Error(`Error updating achievement: ${achievementId} not found`);
    }

    let achievement = db.achievements[found];
    achievement.dateDeleted = new Date();
    
    //update database achievement
    db.achievements[found] = achievement;
    await saveUserDatabase(userId, db);
}

module.exports = {
    getUserAchievementById, getUserAchievements, addUserAchievement, updateUserAchievement, completeUserAchievement, deleteUserAchievement, addTagUserAchievement, removeTagUserAchievement
};