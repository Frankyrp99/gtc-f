<template>
  <q-page class="q-pa-sm">
    <div
      class="row justify-around"
      style="margin-top: 30px; margin-bottom: 30px"
    >
      <div>
        <p class="text-bold text-body1">Formulario de Negocio</p>
        <p class="text-bold text-body2" style="color: grey">
          Introduce los datos del negocio
        </p>
      </div>

      <q-form @submit="onSubmit" id="form">
        <div class="q-gutter-md row justify-center items-center">
          <div class="q-gutter-xl q-gutter-y-md row justify-around">
            <div class="column q-gutter-md-y-sm">
              <div><p class="text-bold text-body2">Nombre del negocio</p></div>
              <q-input
                style="width: 200px"
                autogrow
                outlined
                dense
                v-model="form.nombre"
                label="Ej: Mi Negocio"
                class="form-item"
              />
            </div>
            <div class="column q-gutter-md-y-sm">
              <div><p class="text-bold text-body2">Contacto</p></div>
              <q-input
                style="width: 200px"
                autogrow
                outlined
                dense
                v-model="form.contacto"
                label="Ej: (123) 456-7890"
                class="form-item"
                input-class="text-right"
                mask="(##) ###-####"
                unmasked-value
                hint="Ejemplo: (123) 456-7890"
                required
              />
            </div>
            <div class="column q-gutter-md-y-sm">
              <div>
                <p class="text-bold text-body2">Categoria</p>
              </div>
              <q-input
                style="width: 200px"
                autogrow
                outlined
                dense
                v-model="form.category"
                label="Ej: Cafe"
                class="form-item"
                required
              />
            </div>
          </div>
          <div class="content-div">
            <div>
              <p class="text-bold text-body2">Descripción del negocio</p>
            </div>
            <div>
              <q-input
                autogrow
                outlined
                dense
                v-model="form.description"
                label="Describe tu negocio"
                required
              />
            </div>
          </div>

          <div>
            <div>
              <div>
                <p class="text-bold text-body2" style="width: 200px">
                  Imagen del negocio
                </p>
              </div>
              <q-uploader
                color="white"
                text-color="black"
                accept=".jpg, .jpeg, .png"
                label="Sube una imagen"
                counter
                max-files="1"
                max-size="10485760"
                v-model="form.image"
              />
            </div>
          </div>
        </div>
        <q-separator inset class="container" />
        <div class="row justify-end items-center">
          <q-btn
            rounded
            size="sm"
            label="Volver"
            class="form-item text-weight-bolder"
            color="black"
            style="margin-top: 20px; margin-bottom: 20px; margin-right: 10px"
            @click="$router.back()"
          />
          <q-btn
            rounded
            size="sm"
            label="Guardar"
            type="submit"
            class="form-item text-weight-bolder"
            color="black"
            style="margin-top: 20px; margin-bottom: 20px"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';

const router = useRouter();

const form = reactive({
  nombre: '',
  contacto: '',
  category: '',
  description: '',
  image: null,
});
const $q = useQuasar();

function onSubmit() {
  api
    .post('/api/Negocios/', form)
    .then(() => {
      console.log('Formulario enviado con éxito:');
      router.push({ name: 'Negocio' });
      $q.loading.hide();
    })
    .catch((error) => {
      if (error.response && error.response.status === 400) {
        $q.notify({
          type: 'negative',
          message: 'Hubo un error al enviar el formulario.',
          position: 'bottom-right',
        });
      } else {
        $q.loading.hide();
        $q.notify({
          type: 'negative',
          message:
            'Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.',
          position: 'bottom-right',
        });
      }
      console.error('Error al enviar el formulario:', error);
    });
  $q.notify({
    type: 'positive',
    message: '¡Negocio Registrado con Éxito !',
    position: 'bottom-right',
  });
}
</script>

<style scoped>
.container-global {
  display: flex;
  flex-direction: column;
  min-height: calc(
    100vh - 56px
  ); /* Ajuste para quitar el espacio de la barra superior */
}

.q-form {
  max-width: 800px;
  margin: auto;
}

@media (max-width: 768px) {
  .q-form {
    padding: 20px;
  }
}
</style>
