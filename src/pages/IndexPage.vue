<template>
  <q-page>
    <ToolBar />
    <NegociosPage />
  </q-page>
</template>

<script setup>
import ToolBar from 'src/components/ToolBar.vue';
import NegociosPage from 'src/components/NegociosPage.vue';
</script>
<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.centered-image {
  max-width: 100%;
  height: auto;
}
</style>
