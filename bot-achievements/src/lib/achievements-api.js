require('dotenv').config();
const fetch = require('node-fetch');

const API_URL = process.env.API_URL || 'http://localhost:5000';

async function getUserAchievementById(userId, achievementId) {
  const response = await fetch(
    `${API_URL}/${userId}/achievements/${achievementId}`
  );
  const json = await response.json();
  return json;
}

async function getUserAchievements(userId) {
  const response = await fetch(`${API_URL}/${userId}/achievements`);
  const json = await response.json();
  return json;
}

async function getUserSettings(userId) {
  const response = await fetch(`${API_URL}/${userId}/settings`);
  const json = await response.json();
  return json;
}

async function addUserAchievement(userId, data) {
  const response = await fetch(`${API_URL}/${userId}/achievements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const json = await response.json();
  return json;
}

//POST /users/:userId/achievements/:achievementId/complete
async function completeUserAchievement(userId, achievementId) {
  const url = `${API_URL}/${userId}/achievements/${achievementId}/complete`;
  const response = await fetch(url, {
    method: 'POST',
  });
  const json = await response.json();
  return json;
}

//POST /users/:userId/achievements/:achievementId/uncomplete
async function uncompleteUserAchievement(userId, achievementId) {
  const url = `${API_URL}/${userId}/achievements/${achievementId}/uncomplete`;
  const response = await fetch(url, {
    method: 'POST',
  });
  const json = await response.json();
  return json;
}

//POST /users/:userId/achievements/:achievementId/tags
async function addTagToUserAchievement(userId, achievementId, tag) {
  const url = `${API_URL}/${userId}/achievements/${achievementId}/tags`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    //BODY contains tag object { tag: 'tagname' }
    body: JSON.stringify({
      tag: tag,
    }),
  });
  const json = await response.json();
  return json;
}

//DELETE /users/:userId/achievements/:achievementId/tags
async function removeTagFromUserAchievement(userId, achievementId, tag) {
  const url = `${API_URL}/${userId}/achievements/${achievementId}/tags`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    //BODY contains tag object { tag: 'tagname' }
    body: JSON.stringify({
      tag: tag,
    }),
  });
  const json = await response.json();
  return json;
}

async function updateUserAchievement(userId, achievementId, data) {
  const response = await fetch(
    `${API_URL}/${userId}/achievements/${achievementId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );
  const json = await response.json();
  return json;
}

async function updateUserSettings(userId, data) {
  const response = await fetch(`${API_URL}/${userId}/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const json = await response.json();
  return json;
}

async function deleteUserAchievement(userId, achievementId) {
  const response = await fetch(
    `${API_URL}/${userId}/achievements/${achievementId}`,
    {
      method: 'DELETE',
    }
  );
  const json = await response.json();
  return json;
}

async function undeleteUserAchievement(userId, achievementId) {
  const response = await fetch(
    `${API_URL}/${userId}/achievements/${achievementId}/undelete`,
    {
      method: 'POST',
    }
  );
  const json = await response.json();
  return json;
}

module.exports = {
  getUserAchievementById,
  getUserAchievements,
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
