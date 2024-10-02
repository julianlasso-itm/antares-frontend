import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService, AuthStorageService } from '../services';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): MaybeAsync<GuardResult> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return new Promise<boolean>((resolve, reject) => {
    setTimeout(() => {
      if (authService.isAuthenticated()) {
        resolve(true);
      } else {
        AuthStorageService.clear();
        router.navigate(['/login']);
        resolve(false);
      }
    }, 1000);
  });
};
