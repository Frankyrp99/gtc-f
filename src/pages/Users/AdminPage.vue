<template>
  <div class="q-pa-lg">
    <ToolBar />
    <q-table
      title="Lista de Usuarios"
      title-class="text-bold "
      :rows="users"
      :columns="columns"
      row-key="nombre"
      :filter="search"
      dense
      no-data-label="No hay datos disponibles."
      no-results-label="No se encontraron resultados para tu búsqueda."
      :loading="isLoading"
      loading-label="Cargando..."
      rows-per-page-label="Usuarios por Página"
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
            label="Gestionar Entidades"
            class="text-bold"
            to="/entidades"
          />
          <q-btn
            color="black"
            icon="add"
            size="sm"
            align="left"
            dense
            label="Nuevo Usuario"
            class="text-bold"
            to="/Nuevo Usuario"
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
              @click="editUser(props.row)"
            />
            <q-btn
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
    <!-- Dialog for editing user details -->
    <!-- Diálogo de edición -->
    <q-dialog v-model="editDialogOpen" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Editar Solicitud</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="saveEditUser()" class="q-gutter-md">
            <div class="column justify-end q-gutter-md">
              <q-input
                outlined
                dense
                v-model="editForm.email"
                label="Email *"
                readonly
              />
              <q-select
                v-if="user.isAdmin"
                outlined
                dense
                v-model="editForm.role"
                label="Rol del Usuario *"
                emit-value
                map-options
                :options="[
                  { label: 'Director', value: 'director' },
                  { label: 'Especialista', value: 'especialista' },
                ]"
              />
              <q-select
                v-if="user.isAdmin"
                outlined
                dense
                v-model="editForm.entidad"
                label="Entidad"
                emit-value
                map-options
                :options="entidadesOptions"
                option-value="value"
                option-label="label"
              />
              <q-input
                v-else
                outlined
                dense
                readonly
                label="Rol del Usuario *"
                :model-value="'Especialista'"
              />
              <q-input
                outlined
                dense
                v-model="editForm.password"
                label="Nueva Contraseña *"
                placeholder="Introduce la contraseña"
                :type="isPwd ? 'password' : 'text'"
              >
              </q-input>
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
                label="Guardar"
                dense
                size="sm"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import ToolBar from 'src/components/ToolBar.vue';

const $q = useQuasar();
const search = ref('');
const users = ref<UsersType[]>([]);

const isLoading = ref(true);
const isPwd = ref(true);
const user = ref({
  role: 'especialista',
  isAdmin: false,
  isDirector: false,
  entidad: null as { id: number } | null,
});
const entidades = ref<EntidadType[]>([]);

type UsersType = {
  id: string;
  email: string;
  role: string;
  entidad?: {
    id: number;
    nombre: string;
  };
};

const columns = computed(() => {
  const baseColumns = [
    {
      name: 'email',
      label: 'Email',
      field: 'email',
      sortable: true,
      filter: true,
      align: 'left',
    },
    {
      name: 'role',
      label: 'Cargo',
      field: 'role',
      align: 'left',
      sortable: true,
      filter: true,
      format: (value: string) => {
        if (value === 'admin') return 'Administrador';
        if (value === 'especialista') return 'Especialista';
        if (value === 'director') return 'Director';
        return value;
      },
    },
  ];

  if (user.value.isAdmin) {
    baseColumns.push({
      name: 'entidad',
      label: 'Entidad',
      field: (row: UsersType) => {
        if (row.entidad) {
          const entidad = entidades.value.find((e) => e.id === row.entidad);
          return entidad ? entidad.nombre : 'Sin entidad';
        }
        return 'Sin entidad';
      },
      align: 'left',
      sortable: true,
      filter: true,
    });
  }

  return baseColumns;
});

type EntidadType = {
  id: number;
  nombre: string;
};

const entidadesOptions = computed(() => {
  return entidades.value.map((ent) => ({
    label: ent.nombre,
    value: ent.id,
  }));
});

const fetchCurrentUser = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    const config = {
      headers: {
        Authorization: `Token ${authToken}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await api.get('/api/users', config);
    if (response.status === 200) {
      user.value = {
        role: response.data.role,
        isAdmin: response.data.role === 'admin',
        isDirector: response.data.role === 'director',
        entidad: response.data.entidad,
      };
    }
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
  }
};

const fetchEntidades = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    const config = {
      headers: { Authorization: `Token ${authToken}` },
    };
    const response = await api.get('/api/entidades/', config);
    entidades.value = response.data;
  } catch (error) {
    console.error('Error al obtener entidades:', error);
  }
};

const fetchUsers = async () => {
  try {
    isLoading.value = true;
    const authToken = localStorage.getItem('authToken');
    const config = {
      headers: {
        Authorization: `Token ${authToken}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await api.get('/api/users/list', config);
    users.value = response.data || [];
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching users:', error);
    users.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchCurrentUser();
  await fetchUsers();
  if (user.value.isAdmin) {
    await fetchEntidades();
  }
});

// Diálogo de edición
const editDialogOpen = ref(false);
const editForm = reactive({
  id: '',
  email: '',
  entidad: null as number | null,
  role: '',
  password: '',
});

const editUser = (selectedUser: UsersType) => {
  editForm.id = selectedUser.id;
  editForm.email = selectedUser.email;
  editForm.role = selectedUser.role;
  editForm.password = '';
  editForm.entidad = selectedUser.entidad?.id || null;

  editDialogOpen.value = true;
};

async function saveEditUser() {
  try {
    const authToken = localStorage.getItem('authToken');
    const config = {
      headers: {
        Authorization: `Token ${authToken}`,
        'Content-Type': 'application/json',
      },
    };

    // Preparar objeto completo para PUT
    const userData = {
      email: editForm.email,
      role: editForm.role,
      entidad: editForm.entidad,
      password: editForm.password || undefined, // Enviar solo si hay contraseña
    };

    await api.put(`/api/users/${editForm.id}/`, userData, config);

    // Actualizar UI
    const index = users.value.findIndex((u) => u.id === editForm.id);
    if (index !== -1) {
      users.value[index] = {
        ...users.value[index],
        role: editForm.role,
        entidad: entidades.value.find((e) => e.id === editForm.entidad),
      };
    }

    $q.notify({
      type: 'positive',
      message: '¡Usuario Actualizado Correctamente!',
      position: 'top-right',
    });

    editDialogOpen.value = false;
  } catch (error: any) {
    let errorMessage = 'Error al actualizar el usuario';
    if (error.response?.data) {
      errorMessage = Object.values(error.response.data).flat().join(', ');
    }
    $q.notify({
      type: 'negative',
      message: errorMessage,
      position: 'top-right',
    });
  }
}

async function eliminar(selectedUser: { id: string }) {
  try {
    const authToken = localStorage.getItem('authToken');
    const config = {
      headers: {
        Authorization: `Token ${authToken}`,
        'Content-Type': 'application/json',
      },
    };

    await $q
      .dialog({
        title: 'Eliminar Usuario',
        message: '¿Estás seguro de eliminar este usuario?',
        cancel: true,
        persistent: true,
      })
      .onOk(async () => {
        await api.delete(`/api/users/${selectedUser.id}/`, config);
        users.value = users.value.filter((u) => u.id !== selectedUser.id);
        $q.notify({
          type: 'positive',
          message: '¡Usuario Eliminado Correctamente!',
          position: 'top-right',
        });
      });
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: 'Error al eliminar el usuario',
      position: 'top-right',
    });
  }
}
</script>
