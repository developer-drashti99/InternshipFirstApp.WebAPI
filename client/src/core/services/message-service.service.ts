import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { PaginatedResult } from '../../types/pagination';
import { Message } from '../../types/message';
import { AccountService } from './account-service.service';
import { NotificationService } from './notification-service.service';
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private siteUrl = environment.apiUrl;
  private hubUrl = environment.hubUrl;
  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  private hubConnection?: HubConnection;
  messageThread = signal<Message[]>([]);
  private notificationService = inject(NotificationService);

  createHubConnection(otherUserId: string) {
    const currentUser = this.accountService.currentUser();
    if (!currentUser) return;

    console.log('current ' + currentUser.displayName);
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'messages?userId=' + otherUserId, {
        accessTokenFactory: () => currentUser.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((error) => console.log(error));

    this.hubConnection.on('RecieveMessageThread', (messages: Message[]) => {
      this.messageThread.set(
        messages.map((message) => ({
          ...message,
          currentUserSender: message.senderId !== otherUserId,
        })),
      );  
      this.notificationService.removeBySender(otherUserId);
    });
    this.hubConnection.on('NewMessage', (message: Message) => {
      message.currentUserSender = message.senderId === currentUser.id;
      this.messageThread.update((messages) => [...messages, message]);
    });
  }

  stopHubConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected)
      this.hubConnection.stop().catch((error) => console.log(error));
  }

  getMessages(container: string, pageNumber: number, pageSize: number) {
    let params = new HttpParams()
      .append('pageNumber', pageNumber)
      .append('pageSize', pageSize)
      .append('container', container);

    return this.http.get<PaginatedResult<Message>>(this.siteUrl + 'messages', { params });
  }
  getMessagesThread(memberId: string) {
    return this.http.get<Message[]>(this.siteUrl + 'messages/thread/' + memberId);
  }
  sendMessage(recipientId: string, content: string) {
    // return this.http.post<Message>(this.siteUrl + 'messages', { recipientId, content });
    return this.hubConnection?.invoke('SendMessage', { recipientId, content });
  }
  deleteMessage(id: string) {
    return this.http.delete(this.siteUrl + 'messages/' + id);
  }

  getUnreadMessages() {
    return this.http.get<Message[]>(this.siteUrl + 'messages/unread');
  }
}
