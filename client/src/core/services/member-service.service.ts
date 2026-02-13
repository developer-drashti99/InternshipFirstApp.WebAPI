import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { EditableMember, Member, MemberParams, Photo } from '../../types/member';
import { tap } from 'rxjs';
import { PaginatedResult } from '../../types/pagination';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient);
  private siteUrl = environment.apiUrl;
  editMode = signal(false);
  member = signal<Member | null>(null);

  // getMembers(pageNumber = 1, pageSize = 5) {
  //   let params = new HttpParams();

  //   params.append('pageNumber', pageNumber);
  //   params.append('pageSize', pageSize);

  //   return this.http.get<PaginatedResult<Member>>(this.siteUrl + 'Users?' + { params });
  // }
  getMembers(memberParams: MemberParams) {
    let params = new HttpParams()
      .set('pageNumber', memberParams.pageNumber)
      .set('pageSize', memberParams.pageSize)
      .set('minAge', memberParams.minAge)
      .set('maxAge', memberParams.maxAge);

    if (memberParams.gender)
      params = params.append('gender', memberParams.gender);

    return this.http.get<PaginatedResult<Member>>(
      this.siteUrl + 'Users',
      { params }
    );
  }

  getMember(id: string) {
    return this.http.get<Member>(this.siteUrl + 'Users/' + id).pipe(
      tap(member => {
        this.member.set(member)
      })
    )
  }
  getMemberPhotos(id: string) {
    return this.http.get<Photo[]>(this.siteUrl + 'Users/' + id + '/photos');
  }

  updateMember(member: EditableMember) {
    return this.http.put(this.siteUrl + 'Users', member);
  }

  uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Photo>(this.siteUrl + 'Users/add-photo', formData)
  }

  setMainPhoto(photo: Photo) {
    return this.http.put(this.siteUrl + 'Users/set-main-photo/' + photo.id, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.siteUrl + 'Users/delete-photo/' + photoId);
  }
}
