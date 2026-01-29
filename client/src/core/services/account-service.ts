import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { User, LoginCreds, RegisterCreds, AuthUser } from '../../types/user';
@Injectable({ providedIn: 'root' })
export class AccountService {
  private http = inject(HttpClient);

  public currentUser = signal<User | null>(null);

  private apiUrl = 'http://localhost:5178/api/';

  register(credentials: RegisterCreds) {
    return this.http
      .post<AuthUser>(this.apiUrl + 'account/register', credentials)
      .pipe(tap(user => {
        this.setcurrentUser(user);
      })
      );
  }

  login(credentials: LoginCreds) {
    return this.http
      .post<User>(this.apiUrl + 'account/login', credentials)
      .pipe(tap(user => {
        if (user) {
          this.setcurrentUser(user);
        }
      })
      );
  }
  setcurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
  }
  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
}
