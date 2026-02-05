import { HttpClient } from '@angular/common/http';
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
    return this.http.get<Member[]>(this.siteUrl + 'Users');
  }
  getMember(id: string) {
    return this.http.get<Member>(this.siteUrl + 'Users/' + id);
  }
}
