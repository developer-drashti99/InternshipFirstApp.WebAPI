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

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive,HasRole],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar implements OnInit {

  protected accountService = inject(AccountService);
  protected busyService = inject(BusyService);
  private route = inject(Router);
  private toast = inject(ToastService);
  private primeng = inject(PrimeNG);

  protected credentials: { email: string; password: string } = { email: '', password: '' };
  protected selectedTheme = signal<string>(localStorage.getItem("theme") || "light");
  protected themes = themes;

  ngOnInit(): void {
      document.documentElement.setAttribute('data-theme', this.selectedTheme());

      // Sync PrimeNG theme on init
      this.primeng.theme.set({
        preset: Aura,
        options: {
          darkModeSelector: this.selectedTheme() === 'dark'
        }
      });
  }

  handleSelectedTheme(theme: string)
  {
    this.selectedTheme.set(theme);
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute('data-theme', theme);

    // Sync PrimeNG theme when DaisyUI theme changes
    this.primeng.theme.set({
      preset: Aura,
      options: {
        darkModeSelector: theme === 'dark'
      }
    });

    const elem = document.activeElement as HTMLDivElement; // themes dropdown which is currently active or we can say open
    if(elem) elem.blur(); //for closing dropdown after selecting theme
  }

  onLogin() {
    this.accountService.login(this.credentials).subscribe({
      next: response => {
        this.toast.success('Logged in successfully');
        console.log('Login successful', response);
        this.route.navigateByUrl('/');
        this.credentials = { email: '', password: '' };
      },
      error: error =>{
        this.toast.error(error.error);
        // console.log(error.error);
        // console.error('Login failed', error.message),
      }
    });
  }

  logout() {
    this.accountService.logout();
    this.route.navigateByUrl('/');
  }
}