import {
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordNormalized
} from 'vue-router';

// Extiende la interfaz de metadatos para incluir requiresAuth
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
  // Verifica si el usuario está autenticado
  const isAuthenticated = () => {
    const token = localStorage.getItem('authToken');
    if (!token) return false;}

  // Verifica si alguna ruta coincidente requiere autenticación
  const requiresAuth = to.matched.some(
    (record: RouteRecordNormalized) => record.meta?.requiresAuth
  );

  if (!isAuthenticated && requiresAuth) {
    // Redirige al usuario a la página de login
    next('/');
  } else {
    // Permite el acceso a la ruta
    next();
  }
}
