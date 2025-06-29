import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
  }
}

export default function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('authToken');
    return !!token; // Convierte a booleano (true si existe token)
  };

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // Si la ruta requiere autenticación y el usuario NO está logueado
  if (requiresAuth && !isAuthenticated()) {
    next('/'); // Redirige al login
  }
  // Si el usuario está autenticado y trata de acceder al login, redirige al dashboard
  else if (to.path === '/' && isAuthenticated()) {
    next('/Main'); // O la ruta por defecto para usuarios autenticados
  }
  // En cualquier otro caso, permite el acceso
  else {
    next();
  }
}
