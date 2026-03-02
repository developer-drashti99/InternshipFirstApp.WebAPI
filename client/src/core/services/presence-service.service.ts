import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { ToastService } from './toast-service.service';
import { User } from '../../types/user';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { Message } from '../../types/message';
import { NotificationService } from './notification-service.service';
@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  private hubUrl = environment.hubUrl;
  private toast = inject(ToastService);
  private notificationService = inject(NotificationService);
  // hubconnection method
  hubConnection?: HubConnection;
  onlineUsers = signal<string[]>([]);

  createHubConnection(user: User) {
    // build the hub connection
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    //start connection with fallback message if exists
    this.hubConnection.start().catch((error) => console.log(error));

    this.hubConnection.on('UserOnline', (userId) => {
      // this.toast.success(email+' has connected');
      // ...users means existing users and added new usersIds in userId
      this.onlineUsers.update((users) => [...users, userId]);
    });

    this.hubConnection.on('UserOffline', (userId) => {
      // this.toast.info(email+' has disconnected');
      this.onlineUsers.update((users) => users.filter((x) => x !== userId));
    });

    this.hubConnection.on('GetOnlineUsers', (userIds) => {
      this.onlineUsers.set(userIds);
    });

    this.hubConnection.on('NewMessageReceived', (message: Message) => {
      this.toast.info(
        message.senderDisplayName + ' has sent you a new message',
        10000,
        message.senderImageUrl,
        `/members/${message.senderId}/messages`,
      );
    });

    //  for notifying in navbar
    this.hubConnection.on('NewMessageReceived', (message: Message) => {
      this.notificationService.add(message);
    });
  }

  stopHubConnection() {
    if (this.hubConnection?.state == HubConnectionState.Connected) {
      this.hubConnection.stop().catch((error) => {
        console.log(error);
      });
    }
  }
}
