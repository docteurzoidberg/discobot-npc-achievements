const apiUrl = process.env.NUXT_PUBLIC_API_URL || 'http://localhost:5000';
const fetchUrl = `${apiUrl}/achievement`;

const getAchievements = async (userId: string) => {
  const response = await fetch(`${fetchUrl}/${userId}/publicachievements`);
  const achievements = await response.json();
  return achievements;
};

export default defineEventHandler((event) => {
  const userId = event.context.params?.userid;
  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID should be an integer',
    });
  }
  return getAchievements(userId);
});
