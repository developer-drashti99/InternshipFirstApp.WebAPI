import { Component, effect, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Message } from '../../../types/message';
import { MessageService } from '../../../core/services/message-service.service';
import { MemberService } from '../../../core/services/member-service.service';
import { DatePipe } from '@angular/common';
import { TimeAgoPipe } from '../../../core/pipes/timeAgo.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css'],
  imports: [DatePipe, TimeAgoPipe, FormsModule],
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageEndRef') messageEndRef!: ElementRef;
  protected messageService = inject(MessageService);
  protected memberService = inject(MemberService);
  protected messages = signal<Message[]>([]);
  protected messageContent = '';

  constructor() {
    effect(() => {
      const currentMessages = this.messages();
      if(currentMessages.length>0) {
        this.scrollToBottom();
      }
    });
  }

  ngOnInit() {
    this.loadMessages();
  }
  loadMessages() {
    this.messageService.getMessagesThread(this.memberService.member()?.id!).subscribe({
      next: (response) => {
        this.messages.set(
          response.map((message) => ({
            ...message,
            currentUserSender: message.senderId !== this.memberService.member()?.id,
          })),
        );
      },
    });
    console.log(this.messages());
  }
  sendMessage() {
    const recipientId = this.memberService.member()?.id!;
    if (!recipientId) return;
    this.messageService.sendMessage(recipientId, this.messageContent).subscribe({
      next: (message) => {
        this.messages.update((messages) => {
          message.currentUserSender = true;
          return [message, ...messages];
        });
        this.messageContent = '';
        this.loadMessages();
      },
    });
  }
  scrollToBottom() {
    setTimeout(() => {
      this.messageEndRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
    });
  }
}
