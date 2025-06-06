import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
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
    path: '/Negocio',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Solicitudes',
        component: () => import('src/components/NegociosPage.vue'),
      },
    ],
  },
  {
    path: '/NegocioDetalles/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'NegocioDetalles',
        component: () => import('src/pages/Negocios/NegociosDetailPage.vue'),
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

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
