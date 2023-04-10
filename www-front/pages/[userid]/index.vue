<script setup>
definePageMeta({
  validate: async (route) => {
    // Check if the id is made up of digits
    return /^\d+$/.test(route.params.userid);
  },
});

const route = useRoute();

const userId = route.params.userid || false;

if (!userId) {
  throw createError({
    statusCode: 404,
    message: 'Not found',
  });
}

// fetch achievements from service http api
const { data: achievements, error: userachievementserror } = await useFetch(
  `/api/${userId}/achievements`
);

if (!achievements || userachievementserror.value !== null) {
  throw createError({
    statusCode: 500,
    message: 'Could not load user achievements',
  });
}

// fetch user settings from service http api
const { data: userSettings, error: usersettingserror } = await useFetch(
  `/api/${userId}/settings`
);

const settings = userSettings?.value || {};

if (!settings || usersettingserror.value !== null) {
  throw createError({
    statusCode: 500,
    message: 'Could not load user settings',
  });
}

const user = {
  id: userId,
  name: settings.PUBLIC_NAME || '?',
  avatar: settings.PUBLIC_AVATAR || 'https://via.placeholder.com/48',
  settings: { ...settings },
};
</script>

<template>
  <div class="header bg-sky-900 text-white">
    <h1 class="text-3xl font-bold">
      <span class="user">
        <img
          class="avatar rounded-full"
          :src="user.avatar"
          width="48"
          height="48"
        />{{ user.name }} </span
      >'s achievements
    </h1>
  </div>
  <div class="content p-8">
    <div class="achievement-list">
      <AchievementsListItem
        v-for="achievement in achievements"
        :key="achievement.id"
        :achievement="achievement"
        :user="user"
      />
    </div>
  </div>
</template>

<style scoped>
.avatar {
  margin-right: 1rem;
  vertical-align: middle;
  display: inline;
}
.header {
  text-align: center;
  padding: 16px;
}
.user {
  font-variant: small-caps;
  text-decoration: underline;
}
</style>
