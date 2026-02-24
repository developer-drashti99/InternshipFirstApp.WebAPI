import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginatedResult } from '../../types/pagination';
import { Message } from '../../types/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private siteUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getMessages(container: string, pageNumber: number, pageSize: number) {
    let params=new HttpParams()
    .append('pageNumber', pageNumber)
    .append('pageSize', pageSize)
    .append('container', container);
    
    return this.http.get<PaginatedResult<Message>>(this.siteUrl+'messages', {params});
  }
  getMessagesThread(memberId:string) {
    
    return this.http.get<Message[]>(this.siteUrl+'messages/thread/'+memberId);
  }
  sendMessage(recipientId:string, content:string) {
    return this.http.post<Message>(this.siteUrl+'messages', {recipientId, content});
  }
  deleteMessage(id:string){
    return this.http.delete(this.siteUrl+'messages/'+id);
  } 
}
