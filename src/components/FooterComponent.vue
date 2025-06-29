<template>
  <footer class="q-pa-md bg-grey-2 text-dark">
    <div class="container-global">
      <div class="row justify-between items-center">
        <div class="col-md-4 q-pr-md">
          <div class="text-h6">Información de Contacto</div>
          <div class="q-mt-sm">
            <q-icon name="phone" /> +53 55761484<br />
            <q-icon name="email" /> SGCCSOPORTE@gmail.com
          </div>
        </div>

        <div class="col-md-4 text-center">
          <div class="text-bold">
             Nuestras Redes Sociales
          </div>
          <div class="social-links row justify-center q-gutter-md">
            <a href="https://t.me/FrankyPro_Tech" class="social-link">
              <q-icon name="telegram" size="lg" color="black" />
            </a>
            <a href="https://facebook.com" class="social-link">
              <q-icon name="facebook" size="lg" color="black" />
            </a>
          </div>

        </div>

        <div class="col-md-4 text-right">

          <div>
            © {{ new Date().getFullYear() }} Todos los Derechos Reservados
          </div>
          <div class="q-mt-sm text-caption">
            <router-link to="/privacy" class="text-dark"
              >Política de Privacidad</router-link
            >
            |
            <router-link to="/terms" class="text-dark"
              >Términos de Uso</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.separator {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, #e0e0e0, transparent);
  margin: 20px 0;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
}

.footer-text {
  flex: 1;
  font-size: 0.9rem;
  color: #333;
}

.social-links {
  display: flex;
  gap: 20px;
}

.social-link {
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.telegram {
  background: linear-gradient(135deg, #2aabee, #229ed9);
  box-shadow: 0 4px 15px rgba(42, 171, 238, 0.3);
}

.telegram i {
  color: white;
  font-size: 24px;
  transition: transform 0.3s ease;
}

.social-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(42, 171, 238, 0.4);
}

.social-link:hover i {
  transform: scale(1.2);
}

.social-link::after {
  content: '';
  position: absolute;
  bottom: -100%;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(transparent, rgba(255, 255, 255, 0.1));
  transition: bottom 0.3s ease;
}

.social-link:hover::after {
  bottom: 0;
}

@media (max-width: 600px) {
  .footer-content {
    flex-direction: column;
    gap: 20px;
  }

  .social-links {
    justify-content: center;
  }
}
</style>
