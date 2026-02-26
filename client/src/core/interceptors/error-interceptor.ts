import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs';
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
              const validationErrors = Object.values(error.error.errors).flat().join('\n');

              toast.error(validationErrors);
            } else if (typeof error.error === 'string') {
              toast.error(error.error);
            } else {
              toast.error(error.error?.title || 'Bad Request');
            }
            break;
          case 401:
            toast.error('Unauthorized');
            break;
          case 404:
            router.navigateByUrl('/not-found');
            break;

          default:
            toast.error('Something went wrong');
            break;
        }
      }
      throw error;
    }),
  );
};
