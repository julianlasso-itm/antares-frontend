import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth-google.service';
import { AuthStorageService } from '../services/auth-storage.service';

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
