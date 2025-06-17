<template>
  <q-page class="flex flex-center">
    <q-card class="rounded-card login-card">
      <q-card-section class="text-center q-pt-lg">
        <img
          src="/public/LoginLogo.png"
          alt="Logo de la aplicación"
          class="centered-image"
          width="280px"
          fit="cover"
        />
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="email"
            label="Correo Electrónico"
            type="email"
            lazy-rules
            class="input-field"
          />

          <q-input
            v-model="password"
            label="Contraseña"
            :type="isPwd ? 'password' : 'text'"
            lazy-rules
            class="input-field"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <div class="row justify-center items-baseline q-mt-md">
            <q-btn
              type="submit"
              label="Iniciar sesión"
              color="black"
              size="sm"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { api } from 'src/boot/axios';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { computed } from 'vue';

const email = ref('');
const password = ref('');
const isPwd = ref(true);
const loading = ref(false);
const $q = useQuasar();
const router = useRouter();

const isFormValid = computed(() => {
  return email.value;
});

const onSubmit = async () => {
  if (!isFormValid.value) {
    $q.notify({
      type: 'negative',
      message: 'Por favor, completa todos los campos correctamente.',
      position: 'top-right',
      color: 'red',
      textColor: 'white',
      icon: 'error_outline',
    });
    return;
  }

  loading.value = true;
  try {
    const response = await api.post('/api/token/', {
      email: email.value,
      password: password.value,
    });

    const token = response.data.token;
    localStorage.setItem('authToken', token);

    $q.notify({
      type: 'positive',
      message: '¡Inicio de sesión exitoso!',
      position: 'bottom-right',
    });

    await router.push('/Main');
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Correo electrónico o Contraseña incorrectos.',
      position: 'top-right',
      color: 'red',
      textColor: 'white',
      icon: 'error_outline',
    });
    console.error('Error al iniciar sesión:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.input-field {
  width: 100%;
}

.centered-image {
  max-width: 100%;
  height: auto;
}

.rounded-card {
  border-radius: 5px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.rounded-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}
.q-form {
  border-radius: 10px;
  padding: 20px;
  max-width: 400px;
  margin: auto;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

@media (max-width: 768px) {
  .login-card {
    width: 90%;
    margin: 0 5%;
  }
}
</style>
