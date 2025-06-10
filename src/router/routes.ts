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
