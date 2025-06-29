<template>
  <q-page class="q-pa-sm">
    <div class="bread">
      <q-breadcrumbs align="left">
        <q-breadcrumbs-el icon="home" class="text-primary" to="/" />
        <q-breadcrumbs-el label="Formulario de Solicitud" class="text-bold" />
      </q-breadcrumbs>
    </div>

    <div class="form-container">
      <div class="form-header">
        <p class="text-bold text-h6">Formulario de Solicitud</p>
        <p class="text-caption text-grey-7">
          Introduce los detalles de tu solicitud
        </p>
      </div>

      <q-form @submit="onSubmit" ref="formRef" class="form-content">
        <!-- SECCIÓN 1: DATOS DE LA SOLICITUD -->
        <div class="form-section">
          <p class="section-title">Datos de la Solicitud</p>
          <div class="row q-col-gutter-md">
            <div class="col-md-4 col-sm-6 col-xs-12">
              <q-input
                outlined
                dense
                v-model="form.numero_orden"
                label="Número de Orden *"
                placeholder="Ej: N001"
                required
                :rules="[requiredRule, alphanumericRule]"
              />
            </div>
            <div class="col-md-4 col-sm-6 col-xs-12">
              <q-input
                outlined
                dense
                v-model="form.numero_certificado"
                label="Número de Certificado *"
                placeholder="Ej: C001"
                required
                :rules="[requiredRule, alphanumericRule]"
              />
            </div>
            <div class="col-md-4 col-sm-6 col-xs-12">
              <q-input
                outlined
                dense
                v-model="form.fecha_entrada"
                label="Fecha de Entrada"
                placeholder="Ej: 2023-05-15"
                :rules="[dateFormatRule]"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover>
                      <q-date
                        color="black"
                        v-model="form.fecha_entrada"
                        mask="YYYY-MM-DD"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
        </div>

        <!-- SECCIÓN 2: DATOS PERSONALES -->
        <div class="form-section">
          <p class="section-title">Datos Personales</p>
          <div class="row q-col-gutter-md">
            <div class="col-md-6 col-xs-12">
              <q-input
                outlined
                dense
                v-model="form.nombre_apellidos"
                label="Nombre y Apellidos *"
                placeholder="Ej: Juan Pérez García"
                required
                :rules="[requiredRule]"
              />
            </div>
            <div class="col-md-6 col-xs-12">
              <q-select
                outlined
                dense
                v-model="form.persona"
                label="Tipo de Persona *"
                :options="['Natural', 'Jurídica']"
                required
                :rules="[requiredRule]"
              />
            </div>
          </div>
          <div class="row q-col-gutter-md q-mt-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                dense
                v-model="form.direccion"
                label="Dirección Completa *"
                placeholder="Introduce tu dirección completa"
                required
                :rules="[requiredRule]"
              />
            </div>
          </div>
          <div class="row q-col-gutter-md q-mt-sm">
            <div class="col-md-6 col-xs-12">
              <q-select
                outlined
                dense
                v-model="form.asentamiento"
                label="Asentamiento *"
                :options="asentamientosOptions"
                required
                :rules="[requiredRule]"
              />
            </div>
          </div>
        </div>

        <!-- SECCIÓN 3: PROCESAMIENTO -->
        <div class="form-section">
          <p class="section-title">Procesamiento</p>
          <div class="row q-col-gutter-md">
            <div class="col-md-4 col-sm-6 col-xs-12">
              <q-select
                outlined
                dense
                v-model="form.personal_atencion"
                label="Personal Encargado *"
                :options="personalOptions"
                required
                :rules="[requiredRule]"
              />
            </div>
            <div class="col-md-4 col-sm-6 col-xs-12">
              <q-select
                outlined
                dense
                v-model="form.estado"
                label="Estado *"
                :options="[
                  'En Proceso',
                  'Para Imprimir',
                  'Entregado',
                  'Cancelado',
                ]"
                required
                :rules="[requiredRule]"
              />
            </div>
            <div class="col-md-4 col-sm-6 col-xs-12" v-if="showFechaEntrega">
              <q-input
                outlined
                dense
                v-model="form.fecha_entrega"
                label="Fecha de Entrega"
                placeholder="Ej: 2023-05-15"
                :rules="[fechaEntregaRule, dateFormatRule]"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover>
                      <q-date
                        color="black"
                        v-model="form.fecha_entrega"
                        mask="YYYY-MM-DD"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
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
            @click="$router.back()"
          />
          <q-btn
            rounded
            label="Enviar Solicitud"
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
import { reactive, watch, computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';

const router = useRouter();
const $q = useQuasar();
const formRef = ref();

const asentamientosOptions = ref<string[]>([]);
const personalOptions = ref<string[]>([]);

const user = ref({
  id: 0,
  email: '',
  role: '',
  entidad: null as { id: number; nombre: string } | null,
  opciones_entidad: [] as Array<{ id: number; tipo: string; valor: string }>,
});
interface OpcionEntidad {
  id: number;
  tipo: string;
  valor: string;
}


interface Form {
  entidad?: string;
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
  entidad: '',
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

// Reglas de validación
const requiredRule = (val: string) => !!val || 'Campo obligatorio';
const dateFormatRule = (val: string) =>
  !val || /^\d{4}-\d{2}-\d{2}$/.test(val) || 'Formato YYYY-MM-DD';
const alphanumericRule = (val: string) =>
  !val || /^[0-9\s]+$/.test(val) || 'Solo  números';

// Regla especial para fecha de entrega
const fechaEntregaRule = (val: string) => {
  if (showFechaEntrega.value && !val) {
    return 'Campo obligatorio para este estado';
  }
  return true;
};

const showFechaEntrega = computed(() => {
  return form.estado === 'Entregado' || form.estado === 'Cancelado';
});

watch(
  () => form.fecha_entrega,
  (newValue) => {
    if (newValue === null || newValue === '') {
      form.fecha_entrega = null;
    }
  },
  { immediate: true }
);

watch(
  () => form.estado,
  (newEstado) => {
    // Resetear la fecha si cambia el estado a uno no requerido
    if (newEstado !== 'Entregado' && newEstado !== 'Cancelado') {
      form.fecha_entrega = '';
    }
  }
);

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

    if (response.status === 200) {
      // Asignar todos los datos del usuario directamente
      Object.assign(user.value, response.data);

      // Procesar las opciones de la entidad
      processOpcionesEntidad(response.data.opciones_entidad);

      if (response.data.entidad ) {
        form.entidad = response.data.entidad.toString(); // Convertir a string
        console.log('Entidad asignada:', form.entidad);
      }

      console.log('Datos del usuario obtenidos correctamente.', response);
    } else {
      console.error(`Error al obtener datos: Estado ${response.status}`);
    }


  } catch (error: unknown) {
    console.error('Error al obtener datos del usuario:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al cargar datos de usuario',
      position: 'bottom-right',
    });
  }
};

const processOpcionesEntidad = (opciones: OpcionEntidad[]) => {
  // Filtrar y mapear asentamientos
  asentamientosOptions.value = opciones
    .filter((op) => op.tipo === 'ASENTAMIENTO')
    .map((op) => op.valor);

  // Filtrar y mapear personal
  personalOptions.value = opciones
    .filter((op) => op.tipo === 'PERSONAL')
    .map((op) => op.valor);
};



async function onSubmit() {
  // Validar el formulario antes de enviar
  const valid = formRef.value.validate();
  if (!valid) {
    $q.notify({
      type: 'negative',
      message: 'Por favor, complete los campos requeridos',
      position: 'bottom-right',
    });
    return;
  }

  $q.loading.show();

  try {
    await api.post('/api/Solicitudes/', form);
    console.log('Formulario enviado:', form);

    $q.notify({
      type: 'positive',
      message: 'Solicitud enviada con éxito.',
      position: 'bottom-right',
    });
    router.push({ name: 'index' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      $q.notify({
        type: 'negative',
        message: 'Hubo un error al enviar la solicitud. Por favor, inténtalo de nuevo.',
        position: 'bottom-right',
      });
      console.error('Error al enviar la solicitud:', error);
    } else {
      console.error('Error desconocido:', error);
    }
  } finally {
    $q.loading.hide();
  }
}

onMounted(async () => {
  await fetchUserData();
});
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
