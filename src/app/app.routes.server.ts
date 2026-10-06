import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Routes guarded by auth must render on the client: Firebase keeps the
 * session in the browser, so on the server the user is always null and the
 * guards would send the Login page before the client redirects back.
 */
export const serverRoutes: ServerRoute[] = [
  { path: 'tasks/:id', renderMode: RenderMode.Client },
  { path: 'add-task', renderMode: RenderMode.Client },
  { path: 'task/:id', renderMode: RenderMode.Client },
  { path: 'login', renderMode: RenderMode.Client },
  { path: 'register', renderMode: RenderMode.Client },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
