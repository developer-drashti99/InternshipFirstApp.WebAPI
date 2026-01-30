import { Component, inject, input, Input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User, RegisterCreds } from '../../../types/user';
import { AccountService } from '../../../core/services/account-service.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private accountService = inject(AccountService);
  cancelRegister = output<boolean>();
  protected credentials = {} as RegisterCreds;
  register(): void {
    this.accountService.register(this.credentials).subscribe({
      next: response => {
        console.log('Registration successful', response);
        this.cancel();
      },
      error: error => {
        console.error('Registration failed', error);
      }
    });
  }
  cancel(): void {
    this.cancelRegister.emit(false);
  }

}
