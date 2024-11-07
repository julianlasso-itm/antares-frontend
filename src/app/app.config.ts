import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  InMemoryScrollingOptions,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';
import { OAuthStorage, provideOAuthClient } from 'angular-oauth2-oidc';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';

import { AuthStorageService } from './services/auth-storage.service';

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling(scrollConfig),
      withComponentInputBinding(),
      withViewTransitions({
        skipInitialTransition: true,
      })
    ),
    provideAnimationsAsync(),
    provideToastr({
      maxOpened: 4,
      preventDuplicates: true,
    }),
    provideHttpClient(),
    provideOAuthClient(),
    {
      provide: OAuthStorage,
      useFactory: () => AuthStorageService,
    },
    provideCharts(withDefaultRegisterables()),
  ],
};
