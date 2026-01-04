import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Public routes can be prerendered
  {
    path: 'home',
    renderMode: RenderMode.Prerender
  },
  // Auth routes should be client-side only (depend on cookies)
  {
    path: 'auth/**',
    renderMode: RenderMode.Client
  },
  // Protected routes must be client-side (require authentication)
  {
    path: 'admin/**',
    renderMode: RenderMode.Client
  },
  // Fallback to client rendering
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
