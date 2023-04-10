<template>
  <header class="bg-sky-900 text-white">
    <nav>
      <ul>
        <li class="title">NPC Achievements</li>
        <li><nuxt-link to="/">Home</nuxt-link></li>
      </ul>
    </nav>
  </header>
  <NuxtPage />
  <footer class="bg-sky-900 text-white">
    <p>NPC Achievements, copyright 2023</p>
  </footer>
</template>

<style scoped>
.title {
  font-size: 1.5rem;
  font-weight: 700;
}
nav {
  padding: 1rem;
}
nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}
nav li {
  margin-right: 1rem;
}
</style>
