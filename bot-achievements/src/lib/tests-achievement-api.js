//use achievement.js module and compare each method result  against the results of new http achievement-api.js api to validate the api is working as expected

const achievementApi = require('./achievement-api');

const testUserId = '1234';
const testAchievementId = 'AAA';
const newtag = 'tag3';

const testNewAchievement = {
  title: 'TestNewAchievement',
  description: 'TestNewDescription',
  tags: ['tag1', 'tag2'],
  xp: 100,
};

const defaultUserSettings = {
  ANNOUNCE_CREATE: true,
  ANNOUNCE_UPDATE: true,
  ANNOUNCE_COMPLETE: true,
  ANNOUNCE_UNDONE: true,
  ANNOUNCE_DELETE: true,
  ANNOUNCE_UNDELETE: true,
};

let testNewAchievementId = null;

async function compareAchievements(achievementA, achievementB) {
  if (achievementA.id !== achievementB.id) {
    throw new Error('id mismatch');
  }
  if (achievementA.title !== achievementB.title) {
    throw new Error('title mismatch');
  }
  if (achievementA.description !== achievementB.description) {
    throw new Error('description mismatch');
  }
  if (achievementA.xp !== achievementB.xp) {
    throw new Error('xp mismatch');
  }
  if (achievementA.private !== achievementB.private) {
    throw new Error('private mismatch');
  }
  if (achievementA.tags.length !== achievementB.tags.length) {
    throw new Error('tags length mismatch');
  }
  for (let i = 0; i < achievementA.tags.length; i++) {
    if (achievementA.tags[i] !== achievementB.tags[i]) {
      throw new Error('tag mismatch');
    }
  }
}

async function testGetUserAchievementById() {
  const shouldGet = {
    title: 'testTitle',
    description: 'testDescription',
  };
  const apiAchievement = await achievementApi.getUserAchievementById(
    userId,
    achievementId
  );
  //should return an achievement
  if (!apiAchievement) {
    throw new Error('achievement not found');
  }
  //check title match
  if (apiAchievement.title !== shouldGet.title) {
    throw new Error('title mismatch');
  }
  //check description match
  if (apiAchievement.description !== shouldGet.description) {
    throw new Error('description mismatch');
  }
}

async function testGetUserAchievements() {
  const apiAchievements = await achievementApi.getUserAchievements(userId);
  //should return a list of achievements with length > 0
  if (!apiAchievements || apiAchievements.length === 0) {
    throw new Error('no achievements found');
  }
  //should find achievement specified in achievementId
  const achievement = apiAchievements.find((a) => a.id === achievementId);
}

async function testGetUserSettings() {
  const apiSettings = await achievementApi.getUserSettings(userId);

  //compare settings to default settings
  if (apiSettings.ANNOUNCE_CREATE !== defaultUserSettings.ANNOUNCE_CREATE) {
    throw new Error('ANNOUNCE_CREATE mismatch');
  }
  if (apiSettings.ANNOUNCE_UPDATE !== defaultUserSettings.ANNOUNCE_UPDATE) {
    throw new Error('ANNOUNCE_UPDATE mismatch');
  }
  if (apiSettings.ANNOUNCE_COMPLETE !== defaultUserSettings.ANNOUNCE_COMPLETE) {
    throw new Error('ANNOUNCE_COMPLETE mismatch');
  }
  if (apiSettings.ANNOUNCE_UNDONE !== defaultUserSettings.ANNOUNCE_UNDONE) {
    throw new Error('ANNOUNCE_UNDONE mismatch');
  }
  if (apiSettings.ANNOUNCE_DELETE !== defaultUserSettings.ANNOUNCE_DELETE) {
    throw new Error('ANNOUNCE_DELETE mismatch');
  }
  if (apiSettings.ANNOUNCE_UNDELETE !== defaultUserSettings.ANNOUNCE_UNDELETE) {
    throw new Error('ANNOUNCE_UNDELETE mismatch');
  }
}

async function testAddUserAchievement() {
  const apiAchievement = await achievementApi.addUserAchievement(
    userId,
    testNewAchievement
  );

  //should return an achievement
  if (!apiAchievement) {
    throw new Error('achievement not found in api return');
  }

  //get list of achievements, should find achievement
  const achievements = await achievements.getUserAchievements(userId);
  const achievement = achievements.find((a) => a.id === apiAchievement.id);
  if (!achievement) {
    throw new Error('achievement not found in user achievements');
  }

  //get achievement by id, should find achievement
  const achievementById = await achievements.getUserAchievementById(
    userId,
    apiAchievement.id
  );
  if (!achievementById) {
    throw new Error('achievement not found in user achievements by id');
  }

  //check achievement matches

  if (testNewAchievement.title !== achievement.title) {
    throw new Error('title mismatch from achievement in list');
  }
  if (testNewAchievement.title !== achievementById.title) {
    throw new Error('title mismatch from achievement in achievement by id');
  }

  if (testNewAchievement.description !== achievement.description) {
    throw new Error('title mismatch from achievement in list');
  }
  if (testNewAchievement.description !== achievementById.description) {
    throw new Error('title mismatch from achievement in achievement by id');
  }

  //check dateCreated is set
  if (
    achievement.dateCreated === null ||
    achievement.dateCreated === undefined
  ) {
    throw new Error('dateCreated not set');
  }

  //check dateDeleted is not set
  if (
    achievement.dateDeleted !== null &&
    achievement.dateDeleted !== undefined
  ) {
    throw new Error('dateDeleted set');
  }

  //check tags
  if (achievement.tags.length !== testNewAchievement.tags.length) {
    throw new Error('tags length mismatch');
  }
  for (let i = 0; i < achievement.tags.length; i++) {
    if (achievement.tags[i] !== testNewAchievement.tags[i]) {
      throw new Error('tag mismatch');
    }
  }
}

async function testUpdateUserAchievement() {
  const testNewAchievementUpdated = {
    title: 'test2',
    description: 'test2',
  };

  const updatedAchievement = await achievementApi.updateUserAchievement(
    userId,
    achievementId,
    testNewAchievementUpdated
  );

  //should return an achievement
  if (!updatedAchievement) {
    throw new Error('achievement not found in api return');
  }

  //get list of achievements, should find achievement
  const achievements = await achievementsApi.getUserAchievements(userId);
  const achievement = achievements.find((a) => a.id === achievementId);
  if (!achievement) {
    throw new Error('achievement not found in user achievements');
  }

  //get achievement by id, should find achievement
  const achievementById = await achievementsApi.getUserAchievementById(
    userId,
    achievementId
  );

  if (!achievementById) {
    throw new Error('achievement not found in user achievements by id');
  }

  //compare achievement to updated achievement
  if (!compareAchievements(updatedAchievement, achievement)) {
    throw new Error('achievementById and in list mismatch');
  }

  //check title matches
  if (testNewAchievementUpdated.title !== updatedAchievement.title) {
    throw new Error('title mismatch ');
  }

  //check description matches
  if (
    testNewAchievementUpdated.description !== updatedAchievement.description
  ) {
    throw new Error('description mismatch ');
  }
}

async function testDeleteUserAchievement() {
  const userAchievements1 = await achievementsApi.getUserAchievements(userId);
  //verify achievement exists before delete
  if (!userAchievements1.find((a) => a.id === achievementId)) {
    throw new Error('achievement not found');
  }

  await achievementsApi.deleteUserAchievement(userId, achievementId);

  //check achievement was deleted
  const userAchievements2 = await achievementsApi.getUserAchievements(userId);
  const achievement = userAchievements2.find((a) => a.id === achievementId);

  if (userAchievements2.find((a) => a.id === achievementId)) {
    //check for dateDeleted
    if (
      achievement.dateDeleted !== null &&
      achievement.dateDeleted !== undefined
    ) {
      throw new Error('achievement not deleted');
    }
  }
}

async function testUndeleteUserAchievement() {
  const achievement1 = await achievementsApi.getUserAchievementById(
    userId,
    achievementId
  );

  //check achievement was deleted
  if (
    achievement1.dateDeleted === null ||
    achievement1.dateDeleted === undefined
  ) {
    throw new Error('achievement not deleted');
  }

  await achievementsApi.undeleteUserAchievement(userId, achievementId);

  const achievement2 = await achievementsApi.getUserAchievementById(
    userId,
    achievementId
  );

  //check achievement was undeleted
  if (
    achievement2.dateDeleted !== null &&
    achievement2.dateDeleted !== undefined
  ) {
    throw new Error('achievement not undeleted');
  }
}

async function testCompleteUserAchievement() {
  const achievement = await achievementsApi.completeUserAchievement(
    userId,
    achievementId
  );

  //check achievement was completed
  if (achievement.dateCompleted === null) {
    throw new Error('achievement not completed');
  }
}

async function testUncompleteUserAchievement() {
  const achievement = await achievementsApi.uncompleteUserAchievement(
    userId,
    achievementId
  );
  //check achievement was uncompleted
  if (achievement.dateCompleted !== null) {
    throw new Error('achievement not completed');
  }
}

async function testAddTagToUserAchievement() {
  //check achievement before add tag
  const achievement = await achievementsApi.getUserAchievementById(
    userId,
    achievementId
  );
  //check tag does not exist before add tag
  if (achievement.tags.find((t) => t === tag)) {
    throw new Error('tag already exists');
  }

  await achievementsApi.addTagToUserAchievement(userId, achievementId, tag);

  //check achievement after add tag
  const achievement2 = await achievementsApi.getUserAchievementById(
    userId,
    achievementId
  );

  //check tag exists after add tag
  if (!achievement2.tags.find((t) => t === tag)) {
    throw new Error('tag not added');
  }
}

async function testRemoveTagFromUserAchievement() {
  //check achievement before remove tag
  const achievement = await achievementsApi.getUserAchievementById(
    userId,
    achievementId
  );
  //check tag exists before remove tag
  if (!achievement.tags.find((t) => t === tag)) {
    throw new Error('tag does not exist');
  }

  await achievementsApi.removeTagFromUserAchievement(
    userId,
    achievementId,
    tag
  );

  //check achievement after remove tag
  const achievement2 = await achievementsApi.getUserAchievementById(
    userId,
    achievementId
  );

  //check tag does not exist after remove tag
  if (achievement2.tags.find((t) => t === tag)) {
    throw new Error('tag not removed');
  }
}
