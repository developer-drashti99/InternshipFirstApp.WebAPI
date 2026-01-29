import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../core/services/toast-service';

@Component({
  selector: 'app-nav-bar',
  imports: [FormsModule,RouterLink,RouterLinkActive],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {
  
  protected accountService = inject(AccountService);
  private route=inject(Router);
  private toast=inject(ToastService);
  protected credentials: { email: string; password: string } = { email: '', password: '' };
  
  onLogin() {
    this.accountService.login(this.credentials).subscribe({
      next: response => {
        this.toast.success('Logged in successfully'); 
        console.log('Login successful', response);
        this.route.navigateByUrl('/');
        this.credentials={email:'',password:''};
      }
      ,
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
