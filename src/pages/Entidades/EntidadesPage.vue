<template>
  <div class="q-pa-lg">
    <ToolBar />
    <q-table
      title="Gestión de Entidades"
      title-class="text-bold"
      :rows="entidades"
      :columns="columns"
      row-key="id"
      :filter="search"
      dense
      no-data-label="No hay entidades disponibles."
      no-results-label="No se encontraron resultados para tu búsqueda."
      :loading="isLoading"
      loading-label="Cargando..."
      rows-per-page-label="Entidades por Página"
    >
      <template v-slot:top-right>
        <div class="row q-gutter-md">
          <q-btn
            v-if="user.isAdmin"
            color="black"
            icon="add"
            size="sm"
            align="left"
            dense
            label="Nueva Entidad"
            class="text-bold"
            @click="openCreateDialog"
          />
          <q-input dense outlined v-model="search" placeholder="Buscar" />
        </div>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>

          <q-td auto-width>
            <q-btn
              color="positive"
              icon="edit"
              size="sm"
              flat
              dense
              @click="editEntidad(props.row)"
            />
            <q-btn
              v-if="user.isAdmin"
              color="negative"
              icon="delete"
              size="sm"
              class="q-ml-sm"
              flat
              dense
              @click="eliminar(props.row)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- Diálogo de edición/creación -->
    <q-dialog v-model="editDialogOpen" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">
            {{ editForm.id ? 'Editar Entidad' : 'Nueva Entidad' }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="saveEntidad" class="q-gutter-md">
            <div class="column justify-end q-gutter-md">
              <q-input
                outlined
                dense
                v-model="editForm.nombre"
                label="Nombre *"
                placeholder="Nombre de la entidad"
                :rules="[(val: string) => !!val || 'Campo obligatorio']"
              />
            </div>
            <q-separator class="q-my-lg" />

            <!-- BOTONES -->
            <div class="row justify-end q-gutter-md">
              <q-btn
                v-close-popup
                label="Cancelar"
                color="black"
                dense
                size="sm"
                class="text-color"
              />
              <q-btn
                class="text-color"
                type="submit"
                :label="editForm.id ? 'Guardar' : 'Crear'"
                dense
                size="sm"
                color="primary"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import ToolBar from 'src/components/ToolBar.vue';

// Definición del tipo para Entidades
type EntidadType = {
  id: number;
  nombre: string;
};

const $q = useQuasar();
const search = ref('');
const entidades = ref<EntidadType[]>([]);
const isLoading = ref(true);
const user = ref({
  role: 'especialista',
  isAdmin: false,
  entidad_id: null as number | null,
});

// Columnas de la tabla
const columns = [
  {
    name: 'id',
    label: 'ID',
    field: 'id',
    sortable: true,
    align: 'left',
  },
  {
    name: 'nombre',
    label: 'Nombre',
    field: 'nombre',
    sortable: true,
    filter: true,
    align: 'left',
  },
];

// Obtener datos del usuario
const fetchUserData = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await api.get('/api/users', {
      headers: { Authorization: `Token ${authToken}` },
    });

    if (response.status === 200) {
      user.value.role = response.data.role;
      user.value.isAdmin = response.data.role === 'admin';
      user.value.entidad_id = response.data.entidad_id || null;
    }
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
  }
};

// Cargar entidades
const fetchEntidades = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    let url = '/api/entidades/';
    let response;

    // Si es director, cargar solo su entidad
    if (user.value.role === 'director' && user.value.entidad_id) {
      url = `/api/entidadDirector/${user.value.entidad_id}/`;
      response = await api.get(url, {
        headers: { Authorization: `Token ${authToken}` },
      });
      // Convertimos el objeto único en un array de un elemento
      entidades.value = [response.data];
    } else {
      response = await api.get(url, {
        headers: { Authorization: `Token ${authToken}` },
      });
      entidades.value = response.data;
    }
  } catch (error) {
    console.error('Error al obtener entidades:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchUserData();
  await fetchEntidades();
});

// Diálogo y formulario
const editDialogOpen = ref(false);
const editForm = reactive({
  id: null as number | null,
  nombre: '',
});

const openCreateDialog = () => {
  editForm.id = null;
  editForm.nombre = '';
  editDialogOpen.value = true;
};

// CORRECCIÓN: Añadir tipo al parámetro entidad
const editEntidad = (entidad: EntidadType) => {
  editForm.id = entidad.id;
  editForm.nombre = entidad.nombre;
  editDialogOpen.value = true;
};

// Guardar entidad (crear o actualizar)
const saveEntidad = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    const config = {
      headers: { Authorization: `Token ${authToken}` },
    };

    if (editForm.id) {
      // Director usa endpoint especial
      if (user.value.role === 'director') {
        await api.put(`/api/entidadDirector/${editForm.id}/`, editForm, config);
      } else {
        // Admin usa endpoint normal
        await api.put(`/api/entidades/${editForm.id}/`, editForm, config);
      }

      // Actualizar la lista
      const index = entidades.value.findIndex((e) => e.id === editForm.id);
      if (index !== -1) {
        entidades.value[index].nombre = editForm.nombre;
      }

      $q.notify({
        type: 'positive',
        message: '¡Entidad actualizada correctamente!',
        position: 'top-right',
      });
    } else {
      // Solo admin puede crear nuevas entidades
      if (!user.value.isAdmin) {
        $q.notify({
          type: 'warning',
          message: 'Solo administradores pueden crear entidades',
          position: 'top-right',
        });
        return;
      }

      const response = await api.post('/api/entidades/', editForm, config);
      entidades.value.push(response.data);

      $q.notify({
        type: 'positive',
        message: '¡Entidad creada correctamente!',
        position: 'top-right',
      });
    }

    editDialogOpen.value = false;
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al guardar la entidad',
      position: 'top-right',
    });
    console.error('Error al guardar entidad:', error);
  }
};

// CORRECCIÓN: Añadir tipo al parámetro entidad
const eliminar = async (entidad: EntidadType) => {
  try {
    // Solo admin puede eliminar entidades
    if (!user.value.isAdmin) {
      $q.notify({
        type: 'warning',
        message: 'Solo administradores pueden eliminar entidades',
        position: 'top-right',
      });
      return;
    }

    const authToken = localStorage.getItem('authToken');
    const config = {
      headers: { Authorization: `Token ${authToken}` },
    };

    await $q
      .dialog({
        title: 'Eliminar Entidad',
        message: '¿Estás seguro de eliminar esta entidad?',
        cancel: true,
        persistent: true,
      })
      .onOk(async () => {
        await api.delete(`/api/entidades/${entidad.id}/`, config);
        entidades.value = entidades.value.filter((e) => e.id !== entidad.id);

        $q.notify({
          type: 'positive',
          message: 'Entidad eliminada correctamente',
          position: 'top-right',
        });
      });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al eliminar la entidad',
      position: 'top-right',
    });
    console.error('Error al eliminar entidad:', error);
  }
};
</script>

<style scoped>
.text-bold {
  font-weight: bold;
}
.q-pa-lg {
  padding: 24px;
}
.q-table {
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
.text-color {
  color: #1976d2;
}
</style>
