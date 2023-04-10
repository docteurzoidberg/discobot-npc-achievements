const apiUrl = process.env.NUXT_PUBLIC_API_URL || 'http://localhost:5000';
const fetchUrl = `${apiUrl}/achievement`;

const getUser = async (userId: Number) => {
  const response = await fetch(`${fetchUrl}/users/${userId}`);
  const user = await response.json();
  return user;
};

export default defineEventHandler((event) => {
  const userId = parseInt(event.context.params?.userid) as Number;
  if (!Number.isInteger(userId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID should be an integer',
    });
  }
  return getUser(userId);
});
