import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { User, LoginCreds, RegisterCreds, AuthUser } from '../../types/user';
import { environment } from '../../environments/environment';
import { LikesService } from './likes-service.service';
@Injectable({ providedIn: 'root' })
export class AccountService {
  private http = inject(HttpClient);
  private likeService = inject(LikesService);

  public currentUser = signal<User | null>(null);
  public registerMode = signal(false);
  private apiUrl = environment.apiUrl;

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
    this.likeService.getLikeIds();
  }
  logout() {
    localStorage.removeItem('filters');
    localStorage.removeItem('user');
    
    this.likeService.clearLikeIds();

    this.currentUser.set(null);
  }
}
