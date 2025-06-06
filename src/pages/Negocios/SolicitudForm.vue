<template>
  <q-page class="q-pa-sm">
    <div class="bread">
      <q-breadcrumbs align="left">
        <q-breadcrumbs-el icon="home" class="text-primary" to="/" />
        <q-breadcrumbs-el label="Formulario de Solicitud" class="text-bold" />
      </q-breadcrumbs>
    </div>

    <div
      class="row justify-around"
      style="margin-top: 30px; margin-bottom: 30px"
    >
      <div>
        <p class="text-bold text-body1">Formulario de Solicitud</p>
        <p class="text-bold text-body2" style="color: grey">
          Introduce los detalles de tu solicitud
        </p>
      </div>

      <q-form @submit="onSubmit" id="form">
        <div class="q-gutter-md row justify-center items-center">
          <div class="q-gutter-xl q-gutter-y-md row justify-around">
            <div class="column q-gutter-md-y-sm">
              <div><p class="text-bold text-body2">Número de Orden</p></div>
              <q-input
                style="width: 200px"
                autogrow
                outlined
                dense
                v-model="form.numero_orden"
                label="Ej: N001"
                class="form-item"
                required
              />
            </div>
            <div class="column q-gutter-md-y-sm">
              <div>
                <p class="text-bold text-body2">Número de Certificado</p>
              </div>
              <q-input
                style="width: 200px"
                autogrow
                outlined
                dense
                v-model="form.numero_certificado"
                label="Ej: C001"
                class="form-item"
                required
              />
            </div>
            <div class="column q-gutter-md-y-sm">
              <div><p class="text-bold text-body2">Nombre y Apellidos</p></div>
              <q-input
                style="width: 200px"
                autogrow
                outlined
                dense
                v-model="form.nombre_apellidos"
                label="Ej: Juan Pérez García"
                class="form-item"
                required
              />
            </div>
          </div>

          <div class="content-div">
            <div><p class="text-bold text-body2">Dirección</p></div>
            <q-input
              autogrow
              outlined
              dense
              v-model="form.direccion"
              label="Introduce tu dirección completa"
              class="form-item"
              required
            />
          </div>
          <div class="q-gutter-xl q-gutter-y-md row justify-around">
            <div class="column q-gutter-md-y-sm">
              <div><p class="text-bold text-body2">Fecha de Entrada</p></div>
              <q-input
                style="width: 200px"
                outlined
                dense
                v-model="form.fecha_entrada"
                label="Ej: 2023-05-15"
                class="form-item"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="form.fecha_entrada" mask="YYYY-MM-DD">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Cerrar" color="primary" />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <div class="column q-gutter-md-y-sm">
              <div><p class="text-bold text-body2">Personal Encargado</p></div>
              <q-input
                style="width: 200px"
                autogrow
                outlined
                dense
                v-model="form.personal_atencion"
                label="Ej: Tc. Ana Gómez"
                class="form-item"
                required
              />
            </div>

            <div class="column q-gutter-md-y-sm">
              <div><p class="text-bold text-body2">Estado</p></div>
              <q-select
                style="width: 200px"
                v-model="form.estado"
                label="Selecione una Opción"
                class="form-item"
                outlined
                dense
                emit-value
                map-options
                :options="[
                  'En Proceso',
                  'Para Imprimir',
                  'Entregado',
                  'Cancelado',
                ]"
                required
              />
            </div>
          </div>
          <div class="q-gutter-xl q-gutter-y-md row justify-around">
            <div class="column q-gutter-md-y-sm">
              <div><p class="text-bold text-body2">Asentamiento</p></div>
              <q-input
                style="width: 200px"
                autogrow
                outlined
                dense
                v-model="form.asentamiento"
                label="Ej: Nuevitas"
                class="form-item"
                required
              />
            </div>

            <div class="column q-gutter-md-y-sm">
              <div><p class="text-bold text-body2">Persona</p></div>
              <q-select
                style="width: 200px"
                v-model="form.persona"
                label="Selecione una Opción"
                class="form-item"
                outlined
                dense
                emit-value
                map-options
                :options="['Natural', 'Jurídica']"
                required
              />
            </div>

            <div class="column q-gutter-md-y-sm">
              <div><p class="text-bold text-body2">Fecha de Entrega</p></div>
              <q-input
                style="width: 200px"
                outlined
                dense
                v-model="form.fecha_entrega"
                label="Ej: 2023-05-15"
                class="form-item"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="form.fecha_entrega" mask="YYYY-MM-DD">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Cerrar" color="primary" />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
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
            color="white"
            text-color="black"
            style="margin-top: 20px; margin-bottom: 20px; margin-right: 10px"
            @click="$router.back()"
          />
          <q-btn
            rounded
            size="sm"
            label="Enviar Solicitud"
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
import { reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';

const router = useRouter();
const $q = useQuasar();



interface Form {
  numero_orden?: string;
  numero_certificado?: string;
  nombre_apellidos?: string;
  direccion?: string;
  fecha_entrada?: string;
  personal_atencion?: string;
  estado?: string;
  asentamiento?: string;
  persona?: string;
  fecha_entrega?: string | null;
  tiempo_proceso?: string;
}

const form: Form = reactive({
  numero_orden: '',
  numero_certificado: '',
  nombre_apellidos: '',
  direccion: '',
  fecha_entrada: '',
  personal_atencion: '',
  estado: '',
  asentamiento: '',
  persona: '',
  fecha_entrega: '',
  tiempo_proceso: '0',
});

watch(
  () => form.fecha_entrega,
  (newValue) => {
    if (newValue === null || newValue === '') {
      form.fecha_entrega = null;
    }
  },
  { immediate: true } // Esto asegura que se ejecute el watcher al inicializar la componente
);

function onSubmit() {
  $q.loading.show();

 
  api
    .post('/api/Solicitudes/', form)
    .then(() => {
      $q.notify({
        type: 'positive',
        message: 'Solicitud enviada con éxito.',
        position: 'bottom-right',
      });
      router.push({ name: 'index' });
    })
    .catch((error) => {
      $q.notify({
        type: 'negative',
        message:
          'Hubo un error al enviar la solicitud. Por favor, inténtalo de nuevo.',
        position: 'bottom-right',
      });
      console.error('Error al enviar la solicitud:', error);
    })
    .finally(() => {
      $q.loading.hide();
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
  width: 100%;
  max-width: 800px;
  color: black;
  background-color: #fff;
  border-radius: 8px;
  margin: auto;
  padding: 35px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .q-form {
    padding: 20px;
  }
}
</style>
