import { Component, inject, OnInit } from '@angular/core';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';
import { ChangePassword } from '../../types/user';
import { AccountService } from '../../core/services/account-service.service';
import { ToastService } from '../../core/services/toast-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  imports: [ReactiveFormsModule, TextInputComponent, NgxCaptchaModule],
})
export class ChangePasswordComponent {
  protected changePwdForm: FormGroup;
  protected formBuilder = inject(FormBuilder);
  protected accountService = inject(AccountService);
  protected toastService = inject(ToastService);
  protected router = inject(Router);

  protected changePasswordData: ChangePassword = {
    confirmPassword: '',
    newPassword: '',
    oldPassword: '',
  };

  constructor() {
    this.changePwdForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/),
        ],
      ],
      confirmPassword: ['', [Validators.required, this.matchValues('newPassword')]],
      recaptcha: ['', Validators.required],
    });
  }
  siteKey: string = '6LdaiYEsAAAAAHkHYPoskdMvMiAaFnYzxyrhoanl';
  captchaToken: string = '';

  handleSuccess(token: string) {
    this.captchaToken = token;
    this.changePwdForm.patchValue({
      recaptcha: token,
    });
  }
  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent;
      if (!parent) return null;
      const matchValue = parent.get(matchTo)?.value;
      return control.value === matchValue ? null : { passwordMismatch: true };
    };
  }
  changePassword() {
    this.changePasswordData = this.changePwdForm.value;
    this.accountService.changePassword(this.changePasswordData).subscribe({
      next: () => {
        this.toastService.success('Password has been chnaged.');
        this.changePwdForm.reset();
        this.accountService.logout(); // remove token
        this.router.navigateByUrl('/');
      },
      error: (error) => {
        this.toastService.error(error.error);
        // console.log(error.error);
      },
    });
  }
}
