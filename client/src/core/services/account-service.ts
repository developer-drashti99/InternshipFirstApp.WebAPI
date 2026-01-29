import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { Employee, LoginCreds, RegisterCreds } from '../../types/employee';
@Injectable({ providedIn: 'root' })
export class AccountService {
  private http = inject(HttpClient);

  public currentUser = signal<Employee | null>(null);

  private apiUrl = 'http://localhost:5178/api/';

  register(credentials: RegisterCreds) {
    return this.http
      .post<Employee>(this.apiUrl + 'account/register', credentials)
      .pipe(tap(user => {
        this.setcurrentUser(user);
      })
      );
  }

  login(credentials: LoginCreds) {
    return this.http
      .post<Employee>(this.apiUrl + 'account/login', credentials)
      .pipe(tap(user => {
        if (user) {
          this.setcurrentUser(user);
        }
      })
      );
  }
  setcurrentUser(employee: Employee) {
    localStorage.setItem('user', JSON.stringify(employee));
    this.currentUser.set(employee);
  }
  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
}
