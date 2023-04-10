const apiUrl = process.env.NUXT_PUBLIC_API_URL || 'http://localhost:5000';
const fetchUrl = `${apiUrl}/achievement`;

//use http api to fetch users
const getUsers = async () => {
  const response = await fetch(`${fetchUrl}/users`);
  console.log(response);
  const users = await response.json();
  return users;
};

export default defineEventHandler(() => getUsers());
