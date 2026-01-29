import { inject, Injectable } from '@angular/core';
import { AccountService } from './account-service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private accountService = inject(AccountService);
  init():Observable<null> {
    const empString = localStorage.getItem('user');
    if (!empString) return of(null);
    const emp = JSON.parse(empString);
    this.accountService.currentUser.set(emp);

    return of(null);
  }
}
