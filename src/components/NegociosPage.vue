<template>
  <q-page class="q-pa-sm">
    <div class="row q-gutter-lg justify-center">
      <q-card
        v-for="(business, index) in businesses"
        :key="index"
        class="col-12 col-md-3 col-sm-4 rounded-card"
        @click="redirectBusinessDetails(business)"
        @mouseover="hoverAll = index"
        @mouseleave="hoverAll = null"
        :class="{ 'hover-zoom': hoverAll === index }"
      >
        <q-card-section>
          <div class="text-h6 text-center text-bold">{{ business.nombre }}</div>
          <q-img class="rounded-image" :src="business.image" />
          <div class="text-caption text-grey-7">{{ business.category }}</div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from 'src/boot/axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const hoverAll = ref<number | null>(null);
type BusinessType = {
  id: number;
  nombre: string;
  category: string;
  description: string;
  contacto: string;
  image: string;
};

const businesses = ref<BusinessType[]>([]);

async function loadBusinesses() {
  try {
    const response = await api.get('/api/Negocios/');
    businesses.value = response.data;
  } catch (error) {
    console.error('Error al cargar negocios:', error);
  }
}

function redirectBusinessDetails(business: BusinessType) {
  console.log(`Redireccionando a detalles del negocio: ${business.id}`);
  router.push({
    name: 'NegocioDetalles',
    params: { id: business.id },
  });
}

onMounted(loadBusinesses);
</script>
<style scoped>
.rounded-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  margin: 15px 10px;
}
.hover-zoom {
  transform: scale(1.05);
}
.custom-col-all {
  flex: 0 0 auto;
  margin-right: 15px;
  width: 180px;
}
.rounded-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  position: relative;
}
</style>
