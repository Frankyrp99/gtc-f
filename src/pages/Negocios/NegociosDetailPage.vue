<template>
  <q-page class="q-pa-sm">
    <div class="container-global">
      <div class="bread">
        <q-breadcrumbs align="left">
          <q-breadcrumbs-el icon="home" class="text-primary" to="/" />
          <q-breadcrumbs-el :label="selectedBusiness?.nombre" />
        </q-breadcrumbs>
      </div>
      <div class="text-h5 row justify-between align-center container-mid">
        <div class="image-container">
          <q-img
            :src="selectedBusiness.image"
            :ratio="16 / 9"
            class="product-image"
          />
        </div>
        <div class="details-container">
          <div class="text-bold mb-2">Nombre:</div>
          <div class="text-h6 text-center text-grey-7">
            {{ selectedBusiness.nombre }}
          </div>
          <div class="text-bold mb-2">Categoría:</div>
          <p class="text-h6 text-center text-grey-7">
            {{ selectedBusiness.category }}
          </p>

          <div class="text-bold mb-2">Descripción:</div>
          <div class="descripcion-contenedor">
            <p class="text-body1 text-left text-grey-7 datos-recurso">
              {{ selectedBusiness.description }}
            </p>
          </div>
          <a
            :href="'https://wa.me/' + selectedBusiness.contacto"
            target="_blank"
            class="whatsapp-link"
          >
            <q-btn
              size="sm"
              color="positive"
              label="WhatsApp"
              class="whatsapp-button"
            />
          </a>
        </div>
      </div>

      <q-card-actions align="center"> </q-card-actions>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from 'src/boot/axios';
import { useRoute } from 'vue-router';

type BusinessType = {
  id?: number;
  nombre?: string;
  category?: string;
  description?: string;
  contacto?: string;
  image?: string;
};

const route = useRoute();
const selectedBusiness = ref<BusinessType>({});
const id = route.params.id;
async function loadBusiness() {
  try {
    const response = await api.get<BusinessType>(`/api/Negocios/${id}/`);
    selectedBusiness.value = response.data;
    console.log(selectedBusiness);
  } catch (error) {
    console.error('Error al cargar negocio:', error);
    // Mostrar un mensaje de error al usuario
    alert('Error al cargar el negocio. Por favor, inténtelo de nuevo.');
  }
}

onMounted(loadBusiness);
</script>
<style scoped>
.bread {
  margin-bottom: 20px;
}
.image-container {
  flex: 1;
}
.product-image {
  width: 100%;
  border-radius: 25px;
  height: 80vh;
}
.details-container {
  flex: 1;
  margin-left: 30px;
}
/* Responsive design */
@media (max-width: 768px) {
  .container-mid {
    flex-direction: column;
    padding-top: 20px;
  }
  .bread {
    margin-left: 10px;
    margin-bottom: 0px;
  }
  .product-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
  }

  .image-container {
    width: 100%; /* Prevents it from becoming too small */
  }

  .details-container {
    flex: 1; /* Ocupará el espacio restante del contenedor padre */
    width: 100%; /* Asegura que ocupe el 100% del ancho del contenedor padre */
    padding: 20px 20px; /* Añade espacio interno sin afectar el ancho externo */
    box-sizing: border-box; /* Incluye padding en el ancho total para que no se desborde */
    margin-left: 0px;
  }

  .product-image {
    width: 100%;
    border-radius: 25px;
    object-fit: cover; /* Ensures the image covers the container */
    height: 350px;
  }
  .buttons-container {
    max-width: 100%;
  }
}
</style>
