<script setup lang="ts">
import FooterComponent from 'src/components/FooterComponent.vue';
</script>

<template>
  <q-layout view="hHh lpR fff" class="bg-grey-1">
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer class="container-global bg-grey-1">
      <FooterComponent />
    </q-footer>
  </q-layout>
</template>
