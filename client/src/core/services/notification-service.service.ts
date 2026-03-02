import { Injectable, signal } from '@angular/core';
import { Message } from '../../types/message';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  notifications = signal<Message[]>([]);
  setInitial(messages: Message[]) {
    this.notifications.set(messages);
  }
  add(message: Message) {
    this.notifications.update((list) => [message, ...list]);
  }
  markAsRead(id: string) {
    this.notifications.update((list) => list.filter((n) => n.id !== id));
  }
  clear() {
    this.notifications.set([]);
  }
  removeBySender(senderId: string) {
    this.notifications.update((list) => list.filter((n) => n.senderId !== senderId));
  }
  count = () => this.notifications().length;
}
