import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast-service.service';
import { NavigationExtras, Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const router = inject(Router);
  return next(req).pipe(
    catchError((error) => {
      if (error) {
        switch (error.status) {
          case 500:
            const navigationExtras: NavigationExtras = { state: { error: error.error } };
            router.navigateByUrl('/server-error', navigationExtras);
            break;
          case 400:
            if (error.error?.errors) {
              const validationErrors = Object.values(error.error.errors).flat();

              const validationErrorsMessage = `
              <div>
                <strong>Please fix the following:</strong>
                <ul style="margin-top:8px; padding-left:18px;">
                  ${validationErrors.map((err) => `<li>${err}</li>`).join('')}
                </ul>
              </div>
              `;
              toast.error(validationErrorsMessage);
              console.log(validationErrorsMessage);
            }
            break;
          case 401:
            // Ignore refresh-token 401
            if (!req.url.includes('refresh-token')) {
              if (typeof error.error === 'string') {
                toast.error(error.error);
              } else {
                toast.error('Invalid credentials');
              }
            }
            break;
          case 404:
            router.navigateByUrl('/not-found');
            break;
          case 0:
            toast.error('Server is not reachable. Please try again later.');
            break;
          default:
            toast.error('Something went wrong');
            break;
        }
      }
      return throwError(() => error);
    }),
  );
};
