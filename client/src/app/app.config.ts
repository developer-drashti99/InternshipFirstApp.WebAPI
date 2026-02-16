import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { errorInterceptor } from '../core/interceptors/error-interceptor';
import { InitService } from '../core/services/init-service.service';
import { routes } from './app.routes';
import { jwtInterceptor } from '../core/interceptors/jwt-interceptor';
import { loadingInterceptor } from '../core/interceptors/loading-interceptor';

import { provideTimeago } from 'ngx-timeago';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    // i have added second param for smooth transition
    provideRouter(routes, withViewTransitions()),
    provideTimeago(),
    provideHttpClient(withInterceptors([errorInterceptor, jwtInterceptor, loadingInterceptor])),
    provideAppInitializer(async () => {
      const initService = inject(InitService);

      return new Promise<void>((resolve) => {
        setTimeout(async () => {
          try {
            return lastValueFrom(initService.init());
          } finally {
            const splash = document.getElementById('initial-splash');
            if (splash) {
              splash.remove();
            }
            resolve();
          }
        }, 500);
      });
    })
  ]
}
