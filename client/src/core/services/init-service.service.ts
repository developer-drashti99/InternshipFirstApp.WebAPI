import { inject, Injectable } from '@angular/core';
import { AccountService } from './account-service.service';
import { Observable, of } from 'rxjs';
import { LikesService } from './likes-service.service';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private accountService = inject(AccountService);
  private likeService = inject(LikesService);

  init():Observable<null> {
    const empString = localStorage.getItem('user');
    if (!empString) return of(null);
    const emp = JSON.parse(empString);
    this.accountService.currentUser.set(emp);
    this.likeService.getLikeIds();

    return of(null);
  }
}
