import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../../types/user';
import { PaginatedResult } from '../../types/pagination';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getUserWithRoles(pageNumber: number, pageSize: number) {
    return this.http.get<PaginatedResult<User>>(
      `${this.apiUrl}admin/users-with-roles?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    );
  }
  updateUserRoles(userId: string, roles: string[]) {
    return this.http.post<string[]>(
      this.apiUrl + 'admin/edit-roles/' + userId + '?roles=' + roles,
      {},
    );
  }
}
