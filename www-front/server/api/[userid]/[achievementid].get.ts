const apiUrl = process.env.NUXT_PUBLIC_API_URL || 'http://localhost:5000';
const fetchUrl = `${apiUrl}/achievement`;

const getAchievement = async (userId: string, achievementId: string) => {
  const response = await fetch(
    `${fetchUrl}/${userId}/achievements/${achievementId}`
  );
  const achievement = await response.json();
  return achievement;
};

export default defineEventHandler((event) => {
  const userId = event.context.params?.userid;
  const achievementId = event.context.params?.achievementid;
  if (!userId || !achievementId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID should be an integer',
    });
  }
  return getAchievement(userId, achievementId);
});
