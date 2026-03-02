import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../core/services/toast-service.service';
import { themes } from '../themes';
import { BusyService } from '../../core/services/busy-service.service';
import { PrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { HasRole } from '../../shared/directives/has-role';
import { NotificationService } from '../../core/services/notification-service.service';
import { MessageService } from '../../core/services/message-service.service';
import { TimeAgoPipe } from '../../core/pipes/timeAgo.pipe';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive, HasRole, TimeAgoPipe],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar implements OnInit {
  protected accountService = inject(AccountService);
  protected messageService = inject(MessageService);
  protected busyService = inject(BusyService);
  private route = inject(Router);
  private toast = inject(ToastService);

  protected credentials: { email: string; password: string } = { email: '', password: '' };
  protected selectedTheme = signal<string>(localStorage.getItem('theme') || 'light');
  protected themes = themes;
  protected loading = signal(false);

  constructor(public notificationService: NotificationService) {}

  ngOnInit(): void {
    document.documentElement.setAttribute('data-theme', this.selectedTheme());

    if (this.accountService.currentUser()) {
      this.loadUnread();
    }
  }

  handleSelectedTheme(theme: string) {
    this.selectedTheme.set(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);

    const elem = document.activeElement as HTMLDivElement; // themes dropdown which is currently active or we can say open
    if (elem) elem.blur(); //for closing dropdown after selecting theme
  }
  handleSelectUserItem() {
    const elem = document.activeElement as HTMLDivElement; // profile dropdown which is currently active or we can say open
    if (elem) elem.blur(); //for closing dropdown after selecting options
  }

  onLogin() {
    this.accountService.login(this.credentials).subscribe({
      next: (response) => {
        this.loading.set(true);
        this.toast.success('Logged in successfully');
        console.log('Login successful', response);
        this.route.navigateByUrl('/');
        this.credentials = { email: '', password: '' };

        this.clearNotifications();

        this.loadUnread();
      },
      error: (error) => {
        this.toast.error(error.error);
        // console.log(error.error);
        // console.error('Login failed', error.message),
      },
      complete: () => this.loading.set(false),
    });
  }
  clearNotifications() {
    this.notificationService.notifications.set([]);
  }
  logout() {
    this.accountService.logout();
    this.clearNotifications();
    this.route.navigateByUrl('/');
  }
  loadUnread() {
    this.messageService.getUnreadMessages().subscribe({
      next: (messages) => {
        this.notificationService.setInitial(messages);
      },
    });
  }
}
