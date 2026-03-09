import { Component, inject, OnInit, signal } from '@angular/core';
import { TextInputComponent } from '../../../shared/components/text-input/text-input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../../../core/services/account-service.service';
import { ToastService } from '../../../core/services/toast-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [TextInputComponent, ReactiveFormsModule, NgxCaptchaModule, RouterModule],
})
export class LoginComponent implements OnInit {
  protected loginForm: FormGroup;
  protected formBuilder = inject(FormBuilder);
  protected accountService = inject(AccountService);
  protected toast = inject(ToastService);
  protected route = inject(Router);
  protected loading = signal(false);

  constructor() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      // recaptcha: ['', Validators.required],
    });
  }
  siteKey: string = '6LdaiYEsAAAAAHkHYPoskdMvMiAaFnYzxyrhoanl';
  captchaToken: string = '';

  handleSuccess(token: string) {
    this.captchaToken = token;
    this.loginForm.patchValue({
      recaptcha: token,
    });
  }
  onLogin() {
    if (this.loginForm.invalid) return;

    this.accountService.registerMode.set(false);
    this.loading.set(true);

    const credentials = this.loginForm.value;

    this.accountService.login(credentials).subscribe({
      next: () => {
        this.toast.success('Logged in successfully');
        this.loginForm.reset();
        this.route.navigateByUrl('/');
      },
      error: () => {
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }
  ngOnInit() {}
}
