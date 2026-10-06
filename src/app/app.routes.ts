import { Routes } from '@angular/router';

import { authGuard } from './guards/auth-guard';
import { taskOwnerGuard } from './guards/task-owner-guard';
import { guestGuard } from './guards/guest-guard';
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
    path: 'tasks',
    component: TaskList,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: Login,
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    component: Register,
    canActivate: [guestGuard]
  },
  {
    path: 'add-task',
    component: TaskForm,
    canActivate: [authGuard]
  },
  {
    path: 'task/:id',
    component: TaskDetails,
    canActivate: [authGuard, taskOwnerGuard]
  },
  {
    path: '**',
    component: NotFound
  }
];
