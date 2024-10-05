import { Routes } from '@angular/router';

import { routesDashboard } from './components/dashboard/dashboard.routing';

import { authGuard } from './guards/auth.guard';

import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (component) => component.DashboardComponent
      ),
    canActivate: [authGuard],
    children: routesDashboard,
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
