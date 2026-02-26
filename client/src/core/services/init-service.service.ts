import { inject, Injectable } from '@angular/core';
import { AccountService } from './account-service.service';
import { catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private accountService = inject(AccountService);

  init() {
    this.accountService.refreshToken().pipe(
      tap((user) => {
        if (user) {
          this.accountService.setcurrentUser(user);
          this.accountService.startTokenRefreshInterval();
        }
      }),
      catchError(() => {
        // If refresh fails, just continue app load
        return of(null);
      }),
    ).subscribe();
  }
}