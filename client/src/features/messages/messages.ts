import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MessageService } from '../../core/services/message-service.service';
import { PaginatedResult } from '../../types/pagination';
import { Message } from '../../types/message';
import { DataViewModule } from 'primeng/dataview';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { RouterLink } from '@angular/router';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
@Component({
  standalone: true,
  selector: 'app-messages',
  imports: [
    CommonModule,
    DataViewModule,
    AvatarModule,
    TabsModule,
    RouterLink,
    Paginator,
    PaginatorModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages implements OnInit {
  @ViewChild('deleteModal') deleteModal!: ElementRef<HTMLDialogElement>;

  private messageService = inject(MessageService);
  protected container = signal<string>('0');
  first = 0;
  protected pageNumber = 1;
  protected pageSize = 5;
  protected paginatedMessages = signal<PaginatedResult<Message> | null>(null);
  tabs: { title: string; value: string }[] = [];
  protected messageToDeleteId: string | null = null;

  ngOnInit(): void {
    this.tabs = [
      { title: 'Inbox', value: '0' },
      { title: 'Outbox', value: '1' },
    ];
    this.setContainer('0');
    this.loadMessages();
  }

  loadMessages() {
    this.messageService
      .getMessages(
        this.tabs.find((t) => t.value === this.container())?.title ?? '',
        this.pageNumber,
        this.pageSize,
      )
      .subscribe({
        next: (response) => this.paginatedMessages.set(response),
      });
  }

  deleteMessage(event: Event, id: string) {
    event.stopPropagation();
    this.messageService.deleteMessage(id).subscribe({
      next: () => {
        const current = this.paginatedMessages();
        if (current?.items) {
          this.paginatedMessages.update((prev) => {
            if (!prev) return null;

            const newItems = prev.items.filter((m) => m.id !== id) || [];

            return {
              items: newItems,
              metadata: prev.metadata,
            };
          });
        }
      },
    });
  }

  onPageChange(event: any) {
    this.pageNumber = event.page + 1; // PrimeNG pages start at 0
    this.pageSize = event.rows;
    this.loadMessages();
  }

  get isInbox() {
    return this.container() === '0';
  }

  setContainer(container: string) {
    this.container.set(container);

    this.loadMessages();
  }

  openDeleteModal(id: string) {
    this.messageToDeleteId = id;
    this.deleteModal.nativeElement.showModal();
  }
}
