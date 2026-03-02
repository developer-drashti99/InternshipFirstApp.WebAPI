import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { User, LoginCreds, RegisterCreds, AuthUser } from '../../types/user';
import { environment } from '../../environments/environment';
import { LikesService } from './likes-service.service';
import { PresenceService } from './presence-service.service';
import { HubConnectionState } from '@microsoft/signalr';
@Injectable({ providedIn: 'root' })
export class AccountService {
  private http = inject(HttpClient);
  private likeService = inject(LikesService);
  private presenceService = inject(PresenceService);

  public currentUser = signal<User | null>(null);
  public registerMode = signal(false);
  private apiUrl = environment.apiUrl;

  isNormalUser(): boolean {
    if (!this.currentUser()) return false;

    return (
      !this.currentUser()?.roles?.includes('Admin') &&
      !this.currentUser()?.roles?.includes('Moderator')
    );
  }

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
    setInterval(
      () => {
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
      },
      5 * 60 * 1000,
    ); //refresh every  minutes
  }

  setcurrentUser(user: User | null) {
    if (!user || !user.token) {
      this.currentUser.set(null);
      return;
    }

    user.roles = this.getRolesFromToken(user);
    this.currentUser.set(user);
    this.likeService.getLikeIds();

    // if connected to hub or not checking
    if (this.presenceService.hubConnection?.state !== HubConnectionState.Connected) {
      this.presenceService.createHubConnection(user);
    }
  }

  logout() {
    this.http.post(this.apiUrl+'account/logout',{},{withCredentials:true}).subscribe({
      next:()=>{
        localStorage.removeItem('filters');
        this.likeService.clearLikeIds();
        this.currentUser.set(null);
        this.presenceService.stopHubConnection();
      }
    });
  }
  private getRolesFromToken(user: User): string[] {
    const payload = user.token.split('.')[1];
    const decoded = atob(payload); //decode in base64
    const jsonPayload = JSON.parse(decoded);
    // return one role or multiple roles as array
    return Array.isArray(jsonPayload.role) ? jsonPayload.role : [jsonPayload.role];
  }
}
