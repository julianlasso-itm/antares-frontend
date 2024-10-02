import { Routes } from '@angular/router';

import { routesDashboard } from './components';
import { authGuard } from './guards';
import { LoginScreen } from './screens/login';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginScreen,
  },
  {
    path: '',
    loadComponent: () =>
      import('./components/dashboard').then(
        (component) => component.DashboardComponent
      ),
    canActivate: [authGuard],
    children: routesDashboard,
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
