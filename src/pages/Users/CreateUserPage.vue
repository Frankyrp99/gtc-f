<template>
  <q-page class="q-pa-sm">
    <div class="bread">
      <q-breadcrumbs align="left">
        <q-breadcrumbs-el icon="home" class="text-primary" to="/" />
        <q-breadcrumbs-el label="Nuevo Usuario" class="text-bold" />
      </q-breadcrumbs>
    </div>

    <div class="form-container">
      <div class="form-header">
        <p class="text-bold text-h6">Nuevo Usuario</p>
        <p class="text-caption text-grey-7">Introduce los datos del usuario</p>
      </div>

      <q-form @submit="onSubmit" class="form-content">
        <!-- SECCIÓN: DATOS DEL USUARIO -->
        <div class="form-section">
          <p class="section-title">Datos del Usuario</p>
          <div class="row q-col-gutter-md">
            <div class="col-md-6 col-xs-12">
              <q-input
                outlined
                dense
                v-model="form.email"
                label="Correo Electrónico *"
                placeholder="Introduce el correo electrónico"
                :rules="email_Rules"
              />
            </div>
            <div class="col-md-6 col-xs-12">
              <q-input
                outlined
                dense
                v-model="form.password"
                label="Contraseña *"
                placeholder="Introduce la contraseña"
                :type="isPwd ? 'password' : 'text'"
                :rules="password_Rules"
              >
              </q-input>
            </div>
          </div>
          <div class="row q-col-gutter-md q-mt-sm">
            <div class="col-md-6 col-xs-12">
              <q-select
                outlined
                dense
                v-model="form.role"
                label="Rol del Usuario *"
                emit-value
                map-options
                :options="[

                  { label: 'Especialista', value: 'especialista' },
                  { label: 'Director', value: 'director' },
                ]"
              />
            </div>
          </div>
        </div>

        <q-separator class="q-my-lg" />

        <!-- BOTONES -->
        <div class="form-actions">
          <q-btn
            outline
            rounded
            label="Volver"
            class="q-mr-sm"
            size="sm"
            @click="goBack"
          />
          <q-btn
            rounded
            label="Guardar"
            type="submit"
            color="black"
            size="sm"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';

const router = useRouter();
const $q = useQuasar();
const isPwd = ref(true);

interface Form {
  email: string;
  password: string;
  role: string;
}
type Rule = (value: string) => boolean | string;
const form = reactive<Form>({
  email: '',
  password: '',
  role: 'especialista', // Valor por defecto
});

const goBack = () => {
  router.back();
};

const email_Rules: Rule[] = [
  (v) => !!v || 'El Email es requerido',
  (v) =>
    /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v) ||
    'El Email no es válido',
];
const password_Rules: Rule[] = [(v) => !!v || 'La Contraseña es requerida'];

async function onSubmit() {
  if (!form.email || !form.password) {
    $q.notify({
      type: 'negative',
      message: 'Por favor complete todos los campos',
      position: 'top-right',
    });
    return;
  }

  try {
    const authToken = localStorage.getItem('authToken');
    const config = {
      headers: {
        Authorization: `Token ${authToken}`,
        'Content-Type': 'application/json',
      },
    };

    $q.loading.show();

     await api.post('/api/users/list/', {
      email: form.email,
      password: form.password,
      role: form.role
    }, config);

    $q.notify({
      type: 'positive',
      message: '¡Usuario Registrado con Éxito!',
      position: 'top-right',
    });

    router.push('/Admin');
  } catch (error) {
    let errorMessage = 'Error al crear el usuario';

    

    $q.notify({
      type: 'negative',
      message: errorMessage,
      position: 'top-right',
    });
  } finally {
    $q.loading.hide();
  }
}
</script>

<style scoped>
.form-container {
  max-width: 800px;
  margin: 30px auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.form-header {
  margin-bottom: 25px;
  text-align: center;
}

.form-content {
  padding: 15px;
}

.form-section {
  margin-bottom: 30px;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.section-title {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
  color: #333;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
