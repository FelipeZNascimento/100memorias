<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <header>
    <img alt="100 Memorias logo" class="logo" src="@/assets/header.jpg" />
  </header>
  <section class="content">
    <RouterView />
  </section>
</template>

<style scoped>
header {
  flex: 0;
  max-height: 100vh;
  line-height: 1.5;

  .logo {
    width: 100%;
  }
}

.content {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 4px;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    flex-direction: column;
    place-items: center;
  }
}
</style>
