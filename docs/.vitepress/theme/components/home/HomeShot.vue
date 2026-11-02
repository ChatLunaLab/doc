<script setup lang="ts">
import AppWindow from './AppWindow.vue'

defineProps<{ page: string, path: string, alt: string, eager?: boolean }>()
</script>

<template>
  <AppWindow :url="`127.0.0.1:5028${path}`">
    <img class="shot is-light" :src="`/home/${page}-light.webp`" width="1280" height="760" :loading="eager ? 'eager' : 'lazy'" decoding="async" :alt="alt">
    <img class="shot is-dark" :src="`/home/${page}-dark.webp`" width="1280" height="760" :loading="eager ? 'eager' : 'lazy'" decoding="async" :alt="alt">
  </AppWindow>
</template>

<style scoped>
.shot {
  display: block;
  width: 100%;
  height: auto;
}

.shot.is-dark,
.dark .shot.is-light {
  display: none;
}

.dark .shot.is-dark {
  display: block;
}
</style>
