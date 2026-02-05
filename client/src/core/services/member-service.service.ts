import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member, Photo } from '../../types/member';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient);
  private siteUrl = environment.apiUrl;
  editMode=signal(false);

  getMembers() {
    return this.http.get<Member[]>(this.siteUrl + 'Users');
  }
  getMember(id: string) {
    return this.http.get<Member>(this.siteUrl + 'Users/' + id);
  }
  getMemberPhotos(id:string){
    return this.http.get<Photo[]>(this.siteUrl+'Users/'+id+'/photos');
  }
}
