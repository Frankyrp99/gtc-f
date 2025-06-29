<template>
  <div class="q-pa-lg relative-position">
    <div>
      <q-table
        bordered
        dense
        virtual-scroll
        title="Registros"
        title-class="text-bold"
        :rows="rows"
        :columns="columns"
        row-key="id"
        :filter="search"
        no-data-label="No hay registros disponibles."
        no-results-label="No se encontraron resultados para tu búsqueda."
        :loading="isLoading"
      >
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>

        <template v-slot:top-right>
          <div class="row q-gutter-md">
            <q-btn

              label="Crear Registro"
              color="black"
              size="sm"
              align="left"
              class="text-bold"
              dense
              :to="{ name: 'NewRegistro' }"
            />
            <q-input
              dense
              outlined
              v-model="search"
              placeholder="Buscar"
              debounce-delay="300"
            />
          </div>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              @mouseover="showTooltip($event, col.name, props.row[col.field])"
              @mouseout="hideTooltip"

              :class="{
                'estado-entregado':
                  col.name === 'Estado' && col.value === 'Entregado',
                'estado-cancelado':
                  col.name === 'Estado' && col.value === 'Cancelado',
              }"

            >
              {{ col.value }}
            </q-td>
            <q-td auto-width class="q-gutter-sm">
              <q-btn
                
                color="positive"
                icon="edit"
                size="sm"
                flat
                dense
                @click="editRow(props.row)"
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

      <!-- Diálogo de edición actualizado -->
      <q-dialog v-model="editDialogOpen" persistent @hide="selectedRow = null">
        <q-card style="min-width: 350px" v-if="selectedRow">
          <q-card-section>
            <div class="text-h6">Editar Solicitud</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-form
              ref="editFormRef"
              @submit="onUpdateSolicitud"
              class="q-gutter-md"
            >
              <!-- SECCIÓN 1: DATOS DE LA SOLICITUD -->
              <div class="form-section">
                <p class="section-title">Datos de la Solicitud</p>
                <div class="row q-col-gutter-md">
                  <div class="col-12">
                    <q-input
                      v-model="selectedRow.numero_orden"
                      label="Número de Orden *"
                      outlined
                      dense
                      :rules="[requiredRule, alphanumericRule]"
                    />
                  </div>
                  <div class="col-12">
                    <q-input
                      v-model="selectedRow.numero_certificado"
                      label="Número de Certificado *"
                      outlined
                      dense
                      :rules="[requiredRule, alphanumericRule]"
                    />
                  </div>
                  <div class="col-12">
                    <q-input
                      v-model="selectedRow.fecha_entrada"
                      label="Fecha de Entrada"
                      outlined
                      dense
                      :rules="[dateFormatRule]"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover>
                            <q-date
                              color="black"
                              v-model="selectedRow.fecha_entrada"
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
                  <div class="col-12">
                    <q-input
                      v-model="selectedRow.nombre_apellidos"
                      label="Nombre y Apellidos *"
                      outlined
                      dense
                      :rules="[requiredRule]"
                    />
                  </div>
                  <div class="col-12">
                    <q-select
                      v-model="selectedRow.persona"
                      label="Tipo de Persona *"
                      :options="['Natural', 'Jurídica']"
                      outlined
                      dense
                      :rules="[requiredRule]"
                    />
                  </div>
                  <div class="col-12">
                    <q-input
                      v-model="selectedRow.direccion"
                      label="Dirección Completa *"
                      outlined
                      dense
                      :rules="[requiredRule]"
                    />
                  </div>
                  <div class="col-12">
                    <q-select
                      outlined
                      dense
                      v-model="selectedRow.asentamiento"
                      label="Asentamiento *"
                      :options="[
                        'Los Micros',
                        'San Miguel de Nuevitas',
                        'Playa Santa Lucía',
                        'Camalote',
                        'Centro Histórico',
                        'Número 1 Tarafa',
                        'Zona Industrial',
                      ]"
                      :rules="[requiredRule]"
                    />
                  </div>
                </div>
              </div>

              <!-- SECCIÓN 3: PROCESAMIENTO -->
              <div class="form-section">
                <p class="section-title">Procesamiento</p>
                <div class="row q-col-gutter-md">
                  <div class="col-12">
                    <q-input
                      v-model="selectedRow.personal_atencion"
                      label="Personal Encargado *"
                      outlined
                      dense
                      :rules="[requiredRule]"
                    />
                  </div>
                  <div class="col-12">
                    <q-select
                      v-model="selectedRow.estado"
                      label="Estado *"
                      :options="[
                        'En Proceso',
                        'Para Imprimir',
                        'Entregado',
                        'Cancelado',
                      ]"
                      outlined
                      dense
                      :rules="[requiredRule]"
                    />
                  </div>
                  <div class="col-12" v-if="showFechaEntregaEdit">
                    <q-input
                      v-model="selectedRow.fecha_entrega"
                      label="Fecha de Entrega"
                      outlined
                      dense
                      :rules="[fechaEntregaRuleEdit, dateFormatRule]"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover>
                            <q-date
                              color="black"
                              v-model="selectedRow.fecha_entrega"
                              mask="YYYY-MM-DD"
                            />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>

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

      <!-- Tooltip personalizado -->
      <div
        v-if="showingTooltip"
        class="tooltip"
        :style="{ left: tooltipLeft + 'px', top: tooltipTop + 'px' }"
      >
        {{ tooltipContent }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';

interface SolicitudType {
  id: number;
  numero_orden: string;
  numero_certificado: string;
  nombre_apellidos: string;
  direccion: string;
  fecha_entrada: string;
  personal_atencion: string;
  estado: string;
  asentamiento: string;
  persona: string;
  fecha_entrega: string | null;
  tiempo_proceso: string;
}

const $q = useQuasar();
const search = ref('');
const user = ref({ role: 'invitado', isAdmin: false, isViewerOnly: false });
const rows = ref<SolicitudType[]>([]);
const selectedRow = ref<SolicitudType | null>(null);
const isLoading = ref(false);
const editDialogOpen = ref(false);
const showingTooltip = ref(false);
const tooltipLeft = ref(0);
const tooltipTop = ref(0);
const tooltipContent = ref('');
const editFormRef = ref();

const columns = [
  {
    name: 'Número Orden',
    label: 'Noº de Orden',
    field: 'numero_orden',
    sortable: true,
    align: 'left',
    filter: true,
  },
  {
    name: 'Número Certificado',
    label: 'Noº de Certificado',
    field: 'numero_certificado',
    sortable: true,
    align: 'left',
    filter: true,
  },
  {
    name: 'Nombre Apellidos',
    label: 'Nombre y Apellidos',
    field: 'nombre_apellidos',
    sortable: true,
    align: 'left',
    filter: true,
    classes: 'texto-truncado',
  },
  {
    name: 'Dirección',
    label: 'Dirección',
    field: 'direccion',
    sortable: true,
    align: 'left',
    filter: true,
    classes: 'texto-truncado',
  },
  {
    name: 'Fecha Entrada',
    label: 'Fecha de Entrada',
    field: 'fecha_entrada',
    sortable: true,
    align: 'left',
    filter: true,
  },
  {
    name: 'Personal Encargado',
    label: 'Personal Encargado',
    field: 'personal_atencion',
    sortable: true,
    align: 'left',
    filter: true,
    classes: 'texto-truncado',
  },
  {
    name: 'Estado',
    label: 'Estado',
    field: 'estado',
    sortable: true,
    align: 'left',
    filter: true,
  },
  {
    name: 'Asentamiento',
    label: 'Asentamiento',
    field: 'asentamiento',
    sortable: true,
    align: 'left',
    filter: true,
  },
  {
    name: 'Persona',
    label: 'Persona',
    field: 'persona',
    sortable: true,
    align: 'left',
    filter: true,
  },
  {
    name: 'Fecha Entrega',
    label: 'Fecha Entrega',
    field: 'fecha_entrega',
    sortable: true,
    align: 'left',
    filter: true,
  },
  {
    name: 'Tiempo Proceso',
    label: 'Tiempo Proceso en Días',
    field: 'tiempo_proceso',
    sortable: true,
    align: 'left',
    filter: true,
  },
];

// Reglas de validación
const requiredRule = (val: string) => !!val || 'Campo obligatorio';
const dateFormatRule = (val: string) =>
  !val || /^\d{4}-\d{2}-\d{2}$/.test(val) || 'Formato YYYY-MM-DD';
const alphanumericRule = (val: string) =>
  !val || /^[0-9\s]+$/.test(val) || 'Solo  números';

// Mostrar fecha de entrega condicionalmente
const showFechaEntregaEdit = computed(() => {
  return (
    selectedRow.value?.estado === 'Entregado' ||
    selectedRow.value?.estado === 'Cancelado'
  );
});

// Regla especial para fecha de entrega
const fechaEntregaRuleEdit = (val: string) => {
  if (showFechaEntregaEdit.value && !val) {
    return 'Campo obligatorio para este estado';
  }
  return true;
};

function showTooltip(event: MouseEvent, fieldName: string, fieldValue: string) {
  tooltipLeft.value = event.clientX;
  tooltipTop.value = event.clientY;
  tooltipLeft.value -= 75;
  tooltipTop.value += 20;
  tooltipContent.value = `${fieldName}: ${fieldValue}`;
  showingTooltip.value = true;
}

function hideTooltip() {
  showingTooltip.value = false;
}

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
      user.value.isViewerOnly = response.data.role === 'especialista';

    } else {
      console.error(
        `Error al obtener los datos del usuario: Estado ${response.status}`
      );
    }
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
  }
};
async function fetchSolicitudes() {
  isLoading.value = true;
  try {
    const authToken = localStorage.getItem('authToken');
    const config = {
      headers: {
        Authorization: `Token ${authToken}`,
        'Content-Type': 'application/json',
      },
    };
    const response = await api.get('api/Solicitudes/',config);
    rows.value = response.data;

  } catch (error) {
    console.error('Error al obtener las solicitudes:', error);
  } finally {
    isLoading.value = false;
    fetchUserData();
  }
}

function editRow(row: SolicitudType) {
  selectedRow.value = row;
  editDialogOpen.value = true;
}

function eliminar(row: SolicitudType) {
  $q.dialog({
    title: 'Eliminar Solicitud',
    message: '¿Estás seguro de eliminar esta solicitud?',
    cancel: true,

    persistent: true,
  }).onOk(async () => {
    isLoading.value = true;
    try {
      await api.delete(`/api/Solicitudes/${row.id}/`);
      rows.value = rows.value.filter((item) => item.id !== row.id);
      $q.notify({
        type: 'positive',
        message: 'Solicitud eliminada correctamente',
        position: 'bottom-right',
      });
    } catch (error) {
      console.error('Error al eliminar la solicitud:', error);
      $q.notify({
        type: 'negative',
        message: 'Hubo un error al eliminar la solicitud',
        position: 'bottom-right',
      });
    } finally {
      isLoading.value = false;
    }
  });
}

async function onUpdateSolicitud() {
  const valid = await editFormRef.value.validate();
  if (!valid) {
    $q.notify({
      type: 'negative',
      message: 'Por favor, complete los campos requeridos correctamente',
      position: 'bottom-right',
    });
    return;
  }
  isLoading.value = true;
  try {
    if (!selectedRow.value) {
      throw new Error('No se ha seleccionado una solicitud');
    }

    const response = await api.put(
      `/api/Solicitudes/${selectedRow.value.id}/`,
      {
        ...selectedRow.value,
      }
    );

    const index = rows.value.findIndex((row) => row.id === response.data.id);
    if (index !== -1) {
      Object.assign(rows.value[index], response.data);
    }

    editDialogOpen.value = false;
    $q.notify({
      type: 'positive',
      message: 'Solicitud actualizada correctamente',
      position: 'bottom-right',
    });
  } catch (error) {
    console.error('Error al actualizar la solicitud:', error);
    $q.notify({
      type: 'negative',
      message: 'Hubo un error al actualizar la solicitud',
      position: 'bottom-right',
    });
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  await fetchSolicitudes();
});
</script>

<style scoped>
.texto-truncado {
  max-width: 200px;
  word-wrap: break-word;
  word-break: break-all;
}

.relative-position {
  position: relative;
}

.form-section {
  margin-bottom: 20px;
  padding: 15px;
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

.estado-entregado {
  background-color: #c8e6c9; /* Verde claro */
  font-weight: bold;
  color: #1b5e20; /* Texto verde oscuro */
}

.estado-cancelado {
  background-color: #ffcdd2; /* Rojo claro */
  font-weight: bold;
  color: #b71c1c; /* Texto rojo oscuro */
}
.tooltip {
  position: fixed;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 5px;
  padding: 10px;
  font-size: 14px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  pointer-events: none;
}

.tooltip::after {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent rgba(255, 255, 255, 0.95) transparent;
}
</style>
