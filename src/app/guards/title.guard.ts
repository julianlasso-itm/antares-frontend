import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  GuardResult,
  MaybeAsync,
  RouterStateSnapshot,
} from '@angular/router';
import { MenuService } from '../services/menu.service';

export const titleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): MaybeAsync<GuardResult> => {
  const menuService = inject(MenuService);
  menuService.title = (route.routeConfig?.title ?? '') as string;
  return true;
};
