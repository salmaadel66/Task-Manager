import { Routes } from '@angular/router';

import { authGuard } from './guards/auth-guard';
import { Home } from './pages/home/home';
import { TaskDetails } from './pages/task-details/task-details';
import { TaskForm } from './pages/task-form/task-form';
import { TaskList } from './pages/task-list/task-list';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'tasks/:id',
    component: TaskList,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: Login,
    canActivate: [authGuard]
  },
  {
    path: 'register',
    component: Register,
    canActivate: [authGuard]
  },
  {
    path: 'add-task',
    component: TaskForm,
    canActivate: [authGuard]
  },
  {
    path: 'task/:id',
    component: TaskDetails,
    canActivate: [authGuard]
  },
  {
    path: '**',
    component: NotFound
  }
];
