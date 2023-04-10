const apiUrl = process.env.NUXT_PUBLIC_API_URL || 'http://localhost:5000';
const fetchUrl = `${apiUrl}/achievement`;

const getUserSettings = async (userId: string) => {
  const response = await fetch(`${fetchUrl}/${userId}/settings`);
  const settings = await response.json();
  return settings;
};

export default defineEventHandler((event) => {
  const userId = event.context.params?.userid;
  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID should be an integer',
    });
  }
  return getUserSettings(userId);
});
