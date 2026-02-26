import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../../types/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  apiUrl=environment.apiUrl;
  private http=inject(HttpClient);

  getUserWithRoles(){
    return this.http.get<User[]>(this.apiUrl+'admin/users-with-roles');
  } 
  updateUserRoles(userId: string, roles: string[]) {
    return this.http.post<string[]>(
      this.apiUrl + 'admin/edit-roles/' + userId + '?roles=' + roles,
      {},
    );
  }
}
