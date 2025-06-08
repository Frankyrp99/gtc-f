<template>
  <div
    class="row justify-around"
    style="margin-top: 30px; margin-bottom: 30px; margin-left: 20px"
  >
    <div>
      <p class="text-bold text-body1">Nuevo Usuario</p>
      <p class="text-bold text-body2" style="color: grey">
        Introduce los datos del usuario
      </p>
    </div>
    <q-form @submit="onSubmit" id="form">
      <div class="q-gutter-md column justify-center items-center">
        <div>
          <div><p class="text-bold text-body2">Correo Electrónico</p></div>

          <q-input
            style="width: 250px"
            autogrow
            outlined
            dense
            class="form-item"
            v-model="form.email"
            label="Introduce el correo electrónico"
            :rules="email_Rules"
          />
        </div>
        <div>
          <div><p class="text-bold text-body2">Contraseña</p></div>
          <q-input
            style="width: 250px"
            outlined
            dense
            v-model="form.password"
            label="Introduce la contraseña"
            :rules="password_Rules"
          />
        </div>
        <div>
          <div><p class="text-bold text-body2">Rol del Usuario</p></div>
          <q-select
            v-model="form.role"
            label="Cargo"
            outlined
            dense
            emit-value
            map-options
            :options="['admin', 'especialista', 'invitado']"
          />
        </div>
      </div>
      <q-separator inset class="container" />
      <div class="row justify-end items-center">
        <q-btn
          rounded
          size="sm"
          label="Volver"
          class="form-item text-weight-bolder"
          color="primary"
          style="margin-top: 20px; margin-bottom: 20px; margin-right: 10px"
          @click="goBack"
        />
        <q-btn
          rounded
          size="sm"
          label="Guardar"
          type="submit"
          class="form-item text-weight-bolder"
          color="primary"
          style="margin-top: 20px; margin-bottom: 20px"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';

interface Form {
  email: string;
  password: string;
  role: string;
}
type Rule = (value: string) => boolean | string;
const form = reactive<Form>({
  email: '',
  password: '',
  role: '',
});

const $q = useQuasar();
const router = useRouter();
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

//metodos

//watchers

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

    const response = await api.post('/api/users/list/', form, config);

    if (response) {
      console.log('Formulario enviado con éxito:');
      $q.notify({
        type: 'positive',
        message: '¡Usuario Registrado con Éxito !',
        position: 'top-right',
      });
      $q.loading.hide();
      router.push('/Admin');
    } else {
      $q.loading.hide();
      $q.notify({
        type: 'negative',
        message: 'Hubo un error al enviar el formulario. ',
        position: 'top-right',
      });
    }
  } catch (error) {
    $q.loading.hide();
    let errorMessage =
      'Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.';
    if (error) {
      errorMessage = 'Hubo un error al enviar el formulario: ';
    }
    $q.notify({
      type: 'negative',
      message: errorMessage,
      position: 'top-right',
    });
    console.error('Error al enviar el formulario:', error);
  }
}
</script>
