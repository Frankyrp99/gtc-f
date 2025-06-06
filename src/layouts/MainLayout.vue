<script setup lang="ts">
import FooterComponent from 'src/components/FooterComponent.vue';
</script>

<template>
  <q-layout view="hHh lpR fff" class="git">
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer class="container-global">
      <FooterComponent />
    </q-footer>
  </q-layout>
</template>
<style scoped>
.git {
  background-image: linear-gradient(rgb(245, 242, 242), rgb(245, 242, 242));
}
</style>
