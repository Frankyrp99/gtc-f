<template>
      <!-- Contenido principal -->
      <div class="main-content">
      <!-- Sección de carrusel (simulada) -->
      <div class="page-section">
        <div style="height: 400px; background: #f0f0f0; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
          <h2>Área de Carrusel</h2>
        </div>
      </div>

      <!-- Sección "Acerca de" -->
      <div id="about" class="page-section">
        <h2 class="section-title">Acerca de la Aplicación</h2>

        <p class="about-description">
          La aplicación de Gestión de Trámites Catastrales es una solución digital diseñada para optimizar
          y modernizar los procesos relacionados con el catastro en el municipio de Nuevitas, Camagüey, Cuba.
          Nuestra plataforma permite a los ciudadanos realizar trámites catastrales de manera eficiente,
          reduciendo tiempos de espera y mejorando la transparencia en los procesos.
        </p>

        <h3 class="section-title">Características Principales</h3>

        <div class="features-grid">
          <div class="feature-card">
            <q-icon name="description" />
            <h3>Solicitudes Digitales</h3>
            <p>Envío y seguimiento de solicitudes catastrales completamente digitales, sin necesidad de papel.</p>
          </div>

          <div class="feature-card">
            <q-icon name="track_changes" />
            <h3>Seguimiento en Tiempo Real</h3>
            <p>Monitoreo del estado de cada trámite en cualquier momento y desde cualquier dispositivo.</p>
          </div>

          <div class="feature-card">
            <q-icon name="notifications" />
            <h3>Notificaciones Automáticas</h3>
            <p>Alertas sobre cambios en el estado de tus trámites y documentos requeridos.</p>
          </div>
        </div>

        <h3 class="section-title">Beneficios</h3>

        <div class="features-grid">
          <div class="feature-card">
            <q-icon name="schedule" />
            <h3>Ahorro de Tiempo</h3>
            <p>Reducción de hasta un 70% en el tiempo de procesamiento de trámites catastrales.</p>
          </div>

          <div class="feature-card">
            <q-icon name="visibility" />
            <h3>Transparencia</h3>
            <p>Procesos completamente visibles y trazables para los ciudadanos.</p>
          </div>

          <div class="feature-card">
            <q-icon name="eco" />
            <h3>Sostenibilidad</h3>
            <p>Reducción del uso de papel y desplazamientos innecesarios.</p>
          </div>
        </div>

        <div class="team-section">
          <h3 class="section-title">Nuestro Equipo</h3>

          <div class="team-grid">
            <div class="team-member">
              <div class="member-avatar">
                <q-icon name="person" />
              </div>
              <div class="member-name">Ing. Carlos Martínez</div>
              <div class="member-role">Desarrollador Principal</div>
            </div>

            <div class="team-member">
              <div class="member-avatar">
                <q-icon name="person" />
              </div>
              <div class="member-name">Lic. Laura Rodríguez</div>
              <div class="member-role">Diseño UX/UI</div>
            </div>

            <div class="team-member">
              <div class="member-avatar">
                <q-icon name="person" />
              </div>
              <div class="member-name">Dra. Ana González</div>
              <div class="member-role">Especialista Catastral</div>
            </div>
          </div>
        </div>

        <div class="q-mt-xl text-center">
          <q-btn
            color="primary"
            icon="contact_support"
            label="Contactar Soporte"
            @click="contactSupport"
          />
        </div>
      </div>
    </div>

</template>
<script setup lang="ts">
import { useQuasar } from 'quasar';

const $q = useQuasar();
const contactSupport = () => {
          $q.notify({
            type: 'info',
            message: 'Soporte contactado. Te responderemos pronto.',
            position: 'top',
            timeout: 3000
          });
        };
</script>
<style scoped>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Roboto', sans-serif;
    }

    body {
      background-color: #f5f5f5;
      color: #333;
      padding-top: 70px;
    }



    .container-global {
      width: 100%;
      max-width: 1600px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .toolbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .toolbar-title {
      font-weight: 700;
      font-size: 1.5rem;
      color: #333;
    }

    /* Contenido principal */
    .main-content {
      max-width: 1200px;
      margin: 30px auto;
      padding: 0 20px;
    }

    .page-section {
      background: white;
      border-radius: 8px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }

    .section-title {
      font-size: 1.8rem;
      font-weight: 500;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 25px;
      margin-top: 30px;
    }

    .feature-card {
      background: #f9f9f9;
      border-radius: 8px;
      padding: 20px;
      transition: transform 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-5px);
    }

    .feature-card .q-icon {
      font-size: 36px;
      color: #333;
      margin-bottom: 15px;
    }

    .feature-card h3 {
      font-size: 1.2rem;
      margin-bottom: 10px;
      color: #222;
    }

    .feature-card p {
      color: #666;
      line-height: 1.6;
    }

    .about-description {
      line-height: 1.8;
      color: #555;
      margin-bottom: 30px;
      max-width: 800px;
    }

    .team-section {
      margin-top: 40px;
    }

    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 25px;
      margin-top: 20px;
    }

    .team-member {
      text-align: center;
    }

    .member-avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: #e0e0e0;
      margin: 0 auto 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      color: #777;
    }

    .member-name {
      font-weight: 500;
      margin-bottom: 5px;
    }

    .member-role {
      color: #666;
      font-size: 0.9rem;
    }

    .q-btn--dropdown .q-btn__content {
      display: flex;
      align-items: center;
    }

    /* Responsividad */
    @media (max-width: 768px) {
      .toolbar-title {
        font-size: 1.2rem;
      }

      .section-title {
        font-size: 1.5rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }
    }
</style>
