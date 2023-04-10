<script setup>
definePageMeta({
  validate: async (route) => {
    return /^\d+$/.test(route.params.userid);
  },
});

const route = useRoute();

const userId = route.params.userid || false;
if (!userId) {
  throw createError({
    statusCode: 404,
    message: 'User not found',
  });
}
console.log('userId: ', userId);

const achievementId = route.params.achievementid || false;
if (!achievementId) {
  throw createError({
    statusCode: 500,
    message: 'AchievementID not found',
  });
}

console.log('achievementId: ', achievementId);

const fetchUrl = `/api/${userId}/${achievementId}`;
console.log('fetchUrl: ', fetchUrl);

const { data: achievement, error: error } = await useFetch(fetchUrl);

console.log('achievement: ', achievement);

if (!achievement || error.value !== null) {
  throw createError({
    statusCode: 404,
    message: 'Achievement not found',
  });
}
</script>

<template>
  <div>
    <h1>{{ achievement.title }}</h1>
    <p>
      {{ achievement.description }}
    </p>
  </div>
</template>
