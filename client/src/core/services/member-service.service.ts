import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { EditableMember, Member, MemberParams, Photo } from '../../types/member';
import { tap } from 'rxjs';
import { PaginatedResult } from '../../types/pagination';
import { ApiResponse } from '../../types/api-response';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private http = inject(HttpClient);
  private siteUrl = environment.apiUrl;

  editMode = signal(false);
  member = signal<Member | null>(null);

  getMembers(memberParams: MemberParams) {
    let params = new HttpParams()
      .set('pageNumber', memberParams.pageNumber)
      .set('pageSize', memberParams.pageSize)
      .set('minAge', memberParams.minAge)
      .set('maxAge', memberParams.maxAge)
      .set('orderBy', memberParams.orderBy);

    if (memberParams.gender) params = params.append('gender', memberParams.gender);

    return this.http
      .get<ApiResponse<PaginatedResult<Member>>>(this.siteUrl + 'Users', { params })
      .pipe(
        tap(() => {
          localStorage.setItem('filters', JSON.stringify(memberParams));
        }),
      );
  }

  getMember(id: string) {
    return this.http
      .get<ApiResponse<Member>>(this.siteUrl + 'Users/' + id)
      .pipe(
        tap((response) => {
          this.member.set(response.data);
        }),
      );
  }

  getMemberPhotos(id: string) {
    return this.http.get<ApiResponse<Photo[]>>(this.siteUrl + 'Users/' + id + '/photos');
  }

  updateMember(member: EditableMember) {
    return this.http.put<ApiResponse<string>>(this.siteUrl + 'Users', member);
  }

  uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<ApiResponse<Photo>>(this.siteUrl + 'Users/add-photo', formData);
  }

  setMainPhoto(photo: Photo) {
    return this.http.put<ApiResponse<string>>(this.siteUrl + 'Users/set-main-photo/' + photo.id, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete<ApiResponse<string>>(this.siteUrl + 'Users/delete-photo/' + photoId);
  }

  approveOrRejectPhoto(photoId: number, action: 'Approve' | 'Reject') {
    return this.http.post<ApiResponse<string>>(
      this.siteUrl + 'admin/photos-to-moderate/' + photoId,
      {},
      {
        params: new HttpParams().set('action', action),
      },
    );
  }
}