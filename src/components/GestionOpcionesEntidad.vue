<template>
  <div class="form-container">
    <div class="form-header">
      <p class="text-bold text-h6">{{ titulo }}</p>
      <p class="text-caption text-grey-7">
        {{ descripcion }}
      </p>
    </div>

    <q-form @submit="agregarOpcion" class="form-content">
      <div class="form-section">
        <div class="row q-col-gutter-md">
          <div class="col-9">
            <q-input
              outlined
              dense
              v-model="nuevaOpcion"
              :label="`Nuevo ${tipo === 'ASENTAMIENTO' ? 'Asentamiento' : 'Personal'}`"
              :placeholder="`Ingrese un nuevo ${tipo === 'ASENTAMIENTO' ? 'asentamiento' : 'personal'}`"
              required
              
            />
          </div>
          <div class="col-3">
            <q-btn
              rounded
              label="Agregar"
              type="submit"
              color="black"
              size="sm"
              class="q-mt-sm"
            />
          </div>
        </div>
      </div>
    </q-form>

    <div class="form-section q-mt-md">
      <p class="section-title">Listado Actual</p>
      <q-list bordered separator>
        <q-item v-for="(opcion, index) in opcionesFiltradas" :key="index">
          <q-item-section>
            <q-item-label>{{ opcion.valor }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              flat
              round
              dense
              color="negative"
              icon="delete"
              @click="eliminarOpcion(opcion.id)"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed,onMounted } from 'vue';
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';

const $q = useQuasar();

// Define la interfaz para las opciones
interface OpcionEntidad {
  id: number;
  tipo: string;
  valor: string;
}

const props = defineProps({
  tipo: {
    type: String,
    required: true,
    validator: (value: string) => ['ASENTAMIENTO', 'PERSONAL'].includes(value)
  },
  opcionesEntidad: {
    type: Array as () => OpcionEntidad[],
    required: true
  }
});

const emit = defineEmits(['actualizado']);

const nuevaOpcion = ref('');
const opciones = ref<OpcionEntidad[]>([...props.opcionesEntidad]);
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
// Filtrar opciones por tipo
const opcionesFiltradas = computed(() => {
  return opciones.value.filter(op => op.tipo === props.tipo);
});

const titulo = computed(() => {
  return props.tipo === 'ASENTAMIENTO'
    ? 'Gestión de Asentamientos'
    : 'Gestión de Personal Encargado';
});

const descripcion = computed(() => {
  return props.tipo === 'ASENTAMIENTO'
    ? 'Agregue y gestione los asentamientos disponibles para su entidad'
    : 'Agregue y gestione el personal encargado para su entidad';
});



const agregarOpcion = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    const config = {
      headers: {
        Authorization: `Token ${authToken}`,
        'Content-Type': 'application/json'
      }
    };

    const response = await api.post(
      '/api/Entidades/',
      {
        tipo: props.tipo,
        valor: nuevaOpcion.value
      },
      config
    );

    if (response.status === 201) {
      $q.notify({
        type: 'positive',
        message: 'Opción agregada correctamente',
        position: 'bottom-right'
      });

      // Agregar a la lista local
      opciones.value.push({
        id: response.data.id,
        tipo: props.tipo,
        valor: nuevaOpcion.value
      });

      // Limpiar el campo
      nuevaOpcion.value = '';

      // Emitir evento para que el padre sepa que se actualizó
      emit('actualizado');
    }
  } catch (error) {
    console.error('Error al agregar opción:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al agregar opción. Verifique que no exista ya.',
      position: 'bottom-right'
    });
  }
};

const eliminarOpcion = async (id: number) => {
  try {
    const authToken = localStorage.getItem('authToken');
    const config = {
      headers: {
        Authorization: `Token ${authToken}`
      }
    };

    const response = await api.delete(`/api/Entidades/${id}/`, config);

    if (response.status === 204) {
      $q.notify({
        type: 'positive',
        message: 'Opción eliminada correctamente',
        position: 'bottom-right'
      });

      // Eliminar de la lista local
      opciones.value = opciones.value.filter(op => op.id !== id);

      // Emitir evento para que el padre sepa que se actualizó
      emit('actualizado');
    }
  } catch (error) {
    console.error('Error al eliminar opción:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al eliminar opción',
      position: 'bottom-right'
    });
  }
};
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
onMounted(async () => {
  await fetchUserData();
});
</script>

<style scoped>
/* Estilos igual que antes */
</style>
