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
      .post<User>(this.apiUrl + 'account/register', credentials, { withCredentials: true })
      .pipe(
        tap((user) => {
          this.setcurrentUser(user);
        }),
      );
  }

  login(credentials: LoginCreds) {
    // ,{withCredentials:true} for getting refreshtoken
    return this.http
      .post<User>(this.apiUrl + 'account/login', credentials, { withCredentials: true })
      .pipe(
        tap((user) => {
          if (user) {
            this.setcurrentUser(user);
            this.startTokenRefreshInterval();
          }
        }),
      );
  }

  refreshToken() {
    return this.http.post<User>(
      this.apiUrl + 'account/refresh-token',
      {},
      { withCredentials: true },
    );
  }

  startTokenRefreshInterval() {
    setInterval(() => {
      this.http
        .post<User>(this.apiUrl + 'account/refresh-token', {}, { withCredentials: true })
        .subscribe({
          next: (user) => {
            this.setcurrentUser(user);
          },
          error: () => {
            this.logout();
          },
        });
    }, 5 * 60 * 1000);//refresh every  minutes
  }

  setcurrentUser(user: User | null) {
    if (!user || !user.token) {
      this.currentUser.set(null);
      return;
    }

    user.roles = this.getRolesFromToken(user);
    this.currentUser.set(user);
    this.likeService.getLikeIds();
  }
  logout() {
    localStorage.removeItem('filters');
    this.likeService.clearLikeIds();
    this.currentUser.set(null);
  }
  private getRolesFromToken(user: User): string[] {
    const payload = user.token.split('.')[1];
    const decoded = atob(payload); //decode in base64
    const jsonPayload = JSON.parse(decoded);
    // return one role or multiple roles as array
    return Array.isArray(jsonPayload.role) ? jsonPayload.role : [jsonPayload.role];
  }
}
