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

const achievementId = route.params.achievementid || false;
if (!achievementId) {
  throw createError({
    statusCode: 500,
    message: 'AchievementID not found',
  });
}

const fetchUrl = `/api/${userId}/${achievementId}`;

const { data: achievement, error: error } = await useFetch(fetchUrl);

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
