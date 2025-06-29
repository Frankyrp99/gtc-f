<template>
  <q-page class="q-pa-sm">
    <div class="bread">
      <q-btn
      icon="arrow_back"
            outline
            rounded
            label="Volver"
            class="q-mr-sm"
            size="sm"
            @click="$router.back()"
          />
    </div>

    <div class="q-gutter-y-md" v-if="user.entidad">
      <GestionOpcionesEntidad
        tipo="ASENTAMIENTO"
        :opciones-entidad="user.opciones_entidad"
        @actualizado="actualizarOpciones"
      />

      <GestionOpcionesEntidad
        tipo="PERSONAL"
        :opciones-entidad="user.opciones_entidad"
        @actualizado="actualizarOpciones"
      />
    </div>

    <div v-else class="text-center q-pa-lg">
      <q-icon name="warning" size="xl" color="warning" />
      <p class="q-mt-md text-h6">Su usuario no tiene una entidad asignada</p>
      <p class="text-grey-7">Contacte al administrador del sistema</p>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from 'src/boot/axios';

import GestionOpcionesEntidad from 'src/components/GestionOpcionesEntidad.vue';


 
// Define la interfaz de usuario
interface User {
  id: number;
  email: string;
  role: string;
  entidad: {
    id: number;
    nombre: string;
    director_general: number;
  } | null;
  opciones_entidad: Array<{
    id: number;
    tipo: string;
    valor: string;
  }>;
}

const user = ref<User>({
  id: 0,
  email: '',
  role: '',
  entidad: null,
  opciones_entidad: []
});

// Función para obtener datos del usuario
const fetchUserData = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await api.get('/api/users', {
      headers: {
        Authorization: `Token ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      user.value = response.data;
    }
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
  }
};

// Función para recargar opciones después de cambios
const actualizarOpciones = async () => {
  await fetchUserData();
};

onMounted(async () => {
  await fetchUserData();
});
</script>
