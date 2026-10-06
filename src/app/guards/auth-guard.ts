import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service/auth-service';

export let authGuard: CanActivateFn = async route => {
  let authService = inject(AuthService);
  let router = inject(Router);

  await authService.waitForUser();

  let user = authService.user();
  let myId = authService.encodedUid();
  let path = route.routeConfig!.path;

  if (path === 'login' || path === 'register') {
    if (user) {
      return router.createUrlTree(['/tasks', myId]);
    }
    return true;
  }

  if (!user) {
    return router.createUrlTree(['/login']);
  }

  let id = route.paramMap.get('id');

  if (id && id !== myId) {
    return router.createUrlTree(['/tasks', myId]);
  }

  return true;
};
