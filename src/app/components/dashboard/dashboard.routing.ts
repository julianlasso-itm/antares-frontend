import { Routes } from '@angular/router';
import { titleGuard } from '../../guards/title.guard';
import { MenuItem, menuStruct } from '../../menu.struct';

export const routesDashboard: Routes = [];

menuStruct.forEach((menu) => {
  menu.children.forEach((element) => {
    if ((element as MenuItem).loadComponent) {
      routesDashboard.push({
        title: (element as MenuItem).titleWindow ?? (element as MenuItem).title,
        path: (element as MenuItem).path,
        loadComponent: (element as MenuItem).loadComponent,
        canActivate: [titleGuard],
      });
    }
  });
});

routesDashboard.push({ path: '', redirectTo: 'dashboard', pathMatch: 'full' });
routesDashboard.push({ path: '**', redirectTo: 'dashboard' });
