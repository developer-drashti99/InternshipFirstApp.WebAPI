import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../../types/member';
import { AccountService } from './account-service.service';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  private siteUrl = environment.apiUrl;

  getMembers() {
    return this.http.get<Member[]>(this.siteUrl + 'Users', this.getHttpOptions());
  }
  getMember(id: string) {
    return this.http.get<Member>(this.siteUrl + 'Users/' + id, this.getHttpOptions());
  }
  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.accountService.currentUser()?.token
      })
    };
  }

}
