import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/Main',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'index',
        component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: true }
      },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('src/pages/LoginPage.vue'),
      },
    ],
  },
  {
    path: '/About',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'about',
        component: () => import('src/pages/AboutPage.vue'),
        meta: { requiresAuth: true }
      },
    ],
  },
  {
    path: '/Admin',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Solicitudes',
        component: () => import('src/pages/Users/AdminPage.vue'),
        meta: { requiresAuth: true }
      },
    ],
  },

  {
    path: '/Nuevo Registro',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'NewRegistro',
        component: () => import('src/pages/Negocios/SolicitudForm.vue'),
        meta: { requiresAuth: true }
      },
    ],
  },
  {
    path: '/Nuevo Usuario',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'NewRegistroUser',
        component: () => import('src/pages/Users/CreateUserPage.vue'),
        meta: { requiresAuth: true }
      },
    ],
  },
  {
    path: '/Gestionar Entidad',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'gestionentiti',
        component: () => import('src/pages/Negocios/GestionOpcionesPage.vue'),
        meta: { requiresAuth: true }
      },
    ],
  },
  {
    path: '/entidades',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'entidades',
        component: () => import('src/pages/Entidades/EntidadesPage.vue'),
        meta: { requiresAuth: true }

      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
