import { inject, Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly oAuthService = inject(OAuthService);

  constructor() {
    this.initConfiguration();
  }

  initConfiguration() {
    const authConfig: AuthConfig = {
      issuer: 'https://accounts.google.com',
      strictDiscoveryDocumentValidation: false,
      clientId:
        '166154982577-5kbga8vkagep2jbuk8r0l99b6b5edinf.apps.googleusercontent.com',
      redirectUri: window.location.origin + '/dashboard',
      scope: 'openid email profile',
    };

    this.oAuthService.configure(authConfig);
    this.oAuthService.setupAutomaticSilentRefresh();
    this.oAuthService.loadDiscoveryDocumentAndTryLogin();
  }

  login(): void {
    this.oAuthService.initImplicitFlow();
  }

  logout(): void {
    this.oAuthService.revokeTokenAndLogout().then(() => {
      console.log('logged out');
    });
    this.oAuthService.logOut();
  }

  getProfile(): Record<string, unknown> {
    return this.oAuthService.getIdentityClaims();
  }

  getToken(): string {
    return this.oAuthService.getIdToken();
  }

  isAuthenticated(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }
}
