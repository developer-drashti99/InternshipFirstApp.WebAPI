import { inject, Injectable } from '@angular/core';
import { AccountService } from './account-service.service';
import { catchError, of, tap } from 'rxjs';
import { LikesService } from './likes-service.service';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private accountService = inject(AccountService);
  private likeService = inject(LikesService);

  init() {
  return  this.accountService.refreshToken().pipe(
      tap((user) => {
        if (user) {
          this.accountService.setcurrentUser(user);
          this.likeService.getLikeIds();
          this.accountService.startTokenRefreshInterval();
        }
      })
      ,
      catchError(() => {
        // If refresh fails, just continue app load
        return of(null);
      }),
    );
  }
}