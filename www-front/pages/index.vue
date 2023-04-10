<script setup>
const fetchUrl = `/api/users`;
const { data: users, pending, error, refresh } = await useFetch(fetchUrl);
console.log('error: ', error);
if (!users || error.value) {
  throw createError({
    statusCode: 500,
    message: 'Could not load users',
  });
}
</script>

<template>
  <div>
    <h1>Users:</h1>
    <div>
      <ul>
        <li v-for="user in users" :key="user.id">
          <NuxtLink class="link text-xl" :to="`/${user.id}`">
            <img
              :src="user.avatar"
              alt="avatar"
              class="avatar p-1 rounded-full"
              height="32"
              width="32"
            />
            <span class="name">
              {{ user.name }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* avatar in vertical middle aligned */
.avatar {
  vertical-align: middle;
  display: inline;
}
.name {
  text-decoration: underline;
}
</style>
