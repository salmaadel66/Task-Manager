import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service/auth-service';
import { TaskService } from '../services/task-service/task-service';

/** Only lets a user open a task that belongs to them. */
export const taskOwnerGuard: CanActivateFn = async route => {
  const authService = inject(AuthService);
  const taskService = inject(TaskService);
  const router = inject(Router);

  await authService.ready;

  const user = authService.user();
  if (!user) {
    return router.createUrlTree(['/login']);
  }

  await taskService.ensureLoaded();

  const task = taskService.getTaskById(Number(route.paramMap.get('id')));

  return task?.userId === user.uid ? true : router.createUrlTree(['/tasks']);
};
