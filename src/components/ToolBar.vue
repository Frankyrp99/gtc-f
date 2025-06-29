<template>
  <div>
    <q-toolbar class="fixed-toolbar">
      <div class="container-global row items-center justify-between">
        <q-toolbar-title class="text-bold q-mt-md">
          Gestión de Trámites Catastrales
        </q-toolbar-title>
        <q-btn-dropdown
          size="sm"
          color="black"
          icon="account_circle"
          label="Cuenta"
          dropdown-icon="arrow_drop_down"
          class="q-mr-sm"
        >
          <q-list>
            <q-item clickable v-close-popup @click="logout">
              <q-item-section avatar>
                <q-icon name="login" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Cerrar Sesión</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="user.isAdmin || user.isDirector" clickable v-close-popup to="/Admin">
              <q-item-section avatar>
                <q-icon name="admin_panel_settings" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Gestión de Usuarios</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="user.isAdmin || user.isDirector" clickable v-close-popup to="/Gestionar Entidad">
              <q-item-section avatar>
                <q-icon name="admin_panel_settings" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Gestión de Entidades </q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup to="/About">
              <q-item-section avatar>
                <q-icon name="info" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Acerca de</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </q-toolbar>

    <!-- Aquí iría el contenido, como el carrusel -->
    <div class="container-global q-mt-lg">
      <!-- Carrusel o contenido debajo de la toolbar -->
      <YourCarouselComponent />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from 'src/boot/axios';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const router = useRouter();
const user = ref({ role: 'invitado', isAdmin: false, isViewerOnly: false, isDirector:false });

const fetchUserData = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    const config = {
      headers: {
        Authorization: `Token ${authToken}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await api.get('/api/users', config);

    // Verificar si la petición fue exitosa
    if (response.status === 200) {
      user.value.role = response.data.role;
      user.value.isAdmin = response.data.role === 'admin';
      user.value.isDirector = response.data.role === 'director';
      user.value.isViewerOnly = response.data.role === 'especialista';
      console.log('Datos del usuario obtenidos correctamente.');
    } else {
      console.error(
        `Error al obtener los datos del usuario: Estado ${response.status}`
      );
    }
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
  }
};

// Función para cerrar sesión
const logout = () => {
  // 1. Eliminar token de autenticación
  localStorage.removeItem('authToken');

  // 2. Mostrar notificación
  $q.notify({
    type: 'positive',
    message: 'Sesión cerrada correctamente',
    icon: 'check',
    position: 'top',
  });

  // 3. Redirigir al login después de un breve retraso
  setTimeout(() => {
    router.push('/');
  }, 1000);
};

onMounted(fetchUserData);
</script>
<style scoped>
.fixed-toolbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000; /* Asegura que la toolbar esté encima de otros elementos */
  background-color: rgb(
    245,
    242,
    242
  ); /* Color de fondo para que la toolbar sea visible sobre el contenido */
  /* box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1); /*Añade una sombra para darle más definición */
}

.container-global {
  width: 100%; /* Usamos un ancho del 100% por defecto */
  max-width: 1600px; /* Limita el ancho máximo a 1600px */
  margin: 0 auto; /* Centra el contenedor */
  padding: 0 20px; /* Añade un pequeño padding para evitar que el contenido toque los bordes */
}

.q-mt-lg {
  margin-top: 70px; /* Añade un margen superior para el contenido debajo de la toolbar */
}

@media (max-width: 1600px) {
  .container-global {
    width: 95%; /* Ajusta el ancho en pantallas más pequeñas */
  }
}

@media (max-width: 1200px) {
  .container-global {
    width: 90%;
  }
}

@media (max-width: 992px) {
  .container-global {
    width: 85%;
  }
}

@media (max-width: 768px) {
  .container-global {
    width: 80%;
  }
}

@media (max-width: 576px) {
  .container-global {
    width: 100%; /* En pantallas muy pequeñas, que ocupe el 100% del ancho */
    padding: 0 0px; /* Reduce el padding en móviles */
  }
}
</style>
