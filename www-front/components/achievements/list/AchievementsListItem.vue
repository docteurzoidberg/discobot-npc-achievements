<script setup>
//display a single achievement in a list of achievements
//achievement data is passed in as a prop
//this component is used in the achievements/[userid].vue page

const props = defineProps(['achievement', 'user']);

console.log(props.achievement);
console.log(props.user);

const baseAchievementRoute = `${props.user.id}`;

const isImageValid = (image) => {
  //check image is an valid url and valid extension
  if (!image || image === '') return false;
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
  const validRegex = new RegExp(
    `^https?:\/\/.*\.(${validExtensions.join('|')})$`,
    'i'
  );

  return validRegex.test(image);
};

//use a tailwind grind to display achievement image in first column and title and description in second column
</script>

<template>
  <div class="achievement-list-item">
    <div class="col1">
      <img
        v-if="isImageValid(props.achievement?.image)"
        :src="props.achievement.image"
        width="64"
        height="64"
      />
      <img
        v-else
        src="https://via.placeholder.com/64"
        alt="placeholder image"
      />
    </div>
    <div class="col2">
      <NuxtLink
        :to="`${baseAchievementRoute}/${props.achievement?.id}`"
        class="text-xl font-bold"
      >
        {{ props.achievement?.title }}
      </NuxtLink>
      <p>{{ props.achievement?.description }}</p>
      <div>
        <!-- tags -->
        <span
          v-for="tag in props.achievement?.tags"
          :key="tag"
          class="tag rounded-full"
          >🏷{{ tag }}</span
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.achievement-list-item {
  display: grid;
  grid-template-columns: 64px 1fr;
  grid-gap: 1rem;
  margin-bottom: 1rem;
}

.tag {
  background-color: #f7fafc;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 400;
  text-transform: uppercase;
}
</style>
