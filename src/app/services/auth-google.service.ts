import { inject, Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';

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
      issuer: environment.googleId.issuer,
      strictDiscoveryDocumentValidation: false,
      clientId: environment.googleId.clientId,
      redirectUri: window.location.origin + '/dashboard',
      scope: environment.googleId.scope,
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
