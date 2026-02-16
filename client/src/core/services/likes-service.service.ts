import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Member } from '../../types/member';

@Injectable({
  providedIn: 'root'
})
export class LikesService {

  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  likeIds = signal<string[]>([]);

  toggleLike(targetMemberId: string) {
    return this.http.post(`${this.apiUrl}likes/${targetMemberId}`, {});
  }

  getLikes(predicate: string) {
    this.http.get<Member[]>(this.apiUrl + 'likes?predicate=' + predicate);
  }

  getLikeIds() {
    return this.http.get<string[]>(this.apiUrl + 'likes/list').subscribe({
      next: ids => this.likeIds.set(ids)
    });
  }

  clearLikeIds() {
    this.likeIds.set([]);
  }

}
