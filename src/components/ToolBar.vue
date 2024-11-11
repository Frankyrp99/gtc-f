<template>
  <div>
    <q-toolbar class="fixed-toolbar">
      <div class="container-global row items-center justify-between">
        <q-toolbar-title class="text-bold q-mt-md"> Sabinal </q-toolbar-title>
        <q-btn
          size="sm"
          color="black"
          icon="account_circle"
          to="/Nuevo Negocio"
        />
      </div>
    </q-toolbar>

    <!-- Aquí iría el contenido, como el carrusel -->
    <div class="container-global q-mt-lg">
      <!-- Carrusel o contenido debajo de la toolbar -->
      <YourCarouselComponent />
    </div>
  </div>
</template>

<script setup lang="ts"></script>
<style scoped>
.fixed-toolbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000; /* Asegura que la toolbar esté encima de otros elementos */
  background-color: white; /* Color de fondo para que la toolbar sea visible sobre el contenido */
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
