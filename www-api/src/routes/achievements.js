/* express middleware for all methods of lib/achievements.js */

const achievementsApi = require('../lib/achievements');

async function getUsers(req, res) {
  const users = await achievementsApi.getUsers();
  return res.status(200).json(users);
}

async function getUserAchievementById(req, res) {
  const { userId, achievementId } = req.params;
  if (!userId) return res.status(400).json({ error: 'userId is required' });
  if (!achievementId)
    return res.status(400).json({ error: 'achievementId is required' });

  const achievement = await achievementsApi.getUserAchievementById(
    userId,
    achievementId
  );
  return res.status(200).json(achievement);
}

async function getUserAchievements(req, res) {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ error: 'userId is required' });
  const achievements = await achievementsApi.getUserAchievements(userId);
  return res.status(200).json(achievements);
}

async function getUserPublicAchievements(req, res) {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  const achievements = await achievementsApi.getUserPublicAchievements(userId);
  return res.status(200).json(achievements);
}

async function getUserSettings(req, res) {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  const settings = await achievementsApi.getUserSettings(userId);
  return res.status(200).json(settings);
}

async function updateUserSettings(req, res) {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ error: 'userId is required' });
  const settings = req.body;
  if (!settings)
    return res.status(400).json({ error: 'settings are required' });
  const savedSettings = await achievementsApi.updateUserSettings(
    userId,
    settings
  );
  return res.status(200).json(savedSettings);
}

async function addUserAchievement(req, res) {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  const achievement = req.body;
  if (!achievement)
    return res.status(400).json({ error: 'achievement is required' });

  const addedAchievement = await achievementsApi.addUserAchievement(
    userId,
    achievement
  );
  return res.status(200).json(addedAchievement);
}

async function updateUserAchievement(req, res) {
  const { userId, achievementId } = req.params;
  if (!userId) return res.status(400).json({ error: 'userId is required' });
  if (!achievementId)
    return res.status(400).json({ error: 'achievementId is required' });

  const achievement = req.body;
  //TODO: validate achievement
  if (!achievement)
    return res.status(400).json({ error: 'achievement is required' });

  const updatedAchievement = await achievementsApi.updateUserAchievement(
    userId,
    achievement
  );
  return res.status(200).json(updatedAchievement);
}

async function completeUserAchievement(req, res) {
  const { userId, achievementId } = req.params;
  if (!userId) return res.status(400).json({ error: 'userId is required' });
  if (!achievementId)
    return res.status(400).json({ error: 'achievementId is required' });
  const achievement = await achievementsApi.completeUserAchievement(
    userId,
    achievementId
  );
  return res.status(200).json(achievement);
}

async function uncompleteUserAchievement(req, res) {
  const { userId, achievementId } = req.params;
  if (!userId) return res.status(400).json({ error: 'userId is required' });
  if (!achievementId)
    return res.status(400).json({ error: 'achievementId is required' });

  const achievement = await achievementsApi.uncompleteUserAchievement(
    userId,
    achievementId
  );
  return res.status(200).json(achievement);
}

async function deleteUserAchievement(req, res) {
  const { userId, achievementId } = req.params;
  if (!userId) return res.status(400).json({ error: 'userId is required' });
  if (!achievementId)
    return res.status(400).json({ error: 'achievementId is required' });

  const achievement = await achievementsApi.deleteUserAchievement(
    userId,
    achievementId
  );
  return res.status(200).json(achievement);
}

async function undeleteUserAchievement(req, res) {
  const { userId, achievementId } = req.params;
  if (!userId) return res.status(400).json({ error: 'userId is required' });
  if (!achievementId)
    return res.status(400).json({ error: 'achievementId is required' });

  const achievement = await achievementsApi.undeleteUserAchievement(
    userId,
    achievementId
  );
  return res.status(200).json(achievement);
}

//body contains: { tag: 'tagname' }
async function addTagToUserAchievement(req, res) {
  const { userId, achievementId } = req.params;
  const tag = req.body.tag;

  console.log('addTagToUserAchievement', userId, achievementId, tag);

  if (!userId) return res.status(400).json({ error: 'userId is required' });
  if (!achievementId)
    return res.status(400).json({ error: 'achievementId is required' });
  if (!req.body.tag) return res.status(400).json({ error: 'tag is required' });

  const updatedAchievement = await achievementsApi.addTagToUserAchievement(
    userId,
    achievementId,
    tag
  );
  return res.status(200).json(updatedAchievement);
}

//body contains: { tag: 'tagname' }
async function removeTagFromUserAchievement(req, res) {
  const { userId, achievementId } = req.params;
  const tag = req.body.tag;

  if (!userId) return res.status(400).json({ error: 'userId is required' });
  if (!achievementId)
    return res.status(400).json({ error: 'achievementId is required' });
  if (!req.body.tag) return res.status(400).json({ error: 'tag is required' });

  const updatedAchievement = await achievementsApi.removeTagFromUserAchievement(
    userId,
    achievementId,
    tag
  );
  return res.status(200).json(updatedAchievement);
}

const router = require('express').Router();
router.get('/users', getUsers);
router.get('/:userId/achievements/:achievementId', getUserAchievementById);
router.get('/:userId/publicachievements', getUserPublicAchievements);
router.get('/:userId/achievements', getUserAchievements);
router.get('/:userId/settings', getUserSettings);
router.put('/:userId/settings', updateUserSettings);
router.post('/:userId/achievements', addUserAchievement);
router.put('/:userId/achievements/:achievementId', updateUserAchievement);
router.put(
  '/:userId/achievements/:achievementId/complete',
  completeUserAchievement
);
router.put(
  '/:userId/achievements/:achievementId/uncomplete',
  uncompleteUserAchievement
);
router.delete('/:userId/achievements/:achievementId', deleteUserAchievement);
router.put(
  '/:userId/achievements/:achievementId/undelete',
  undeleteUserAchievement
);
router.post(
  '/:userId/achievements/:achievementId/tags',
  addTagToUserAchievement
);
router.delete(
  '/:userId/achievements/:achievementId/tags',
  removeTagFromUserAchievement
);

module.exports = router;
