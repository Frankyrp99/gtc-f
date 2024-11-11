import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/Negocio',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Negocio',
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
    path: '/Nuevo Negocio',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'NewNegocio',
        component: () => import('src/pages/Negocios/NegociosForm.vue'),
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
