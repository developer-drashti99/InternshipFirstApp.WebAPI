import {
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { InputOtpModule } from 'primeng/inputotp';
import { AccountService } from '../../core/services/account-service.service';
import { ToastService } from '../../core/services/toast-service.service';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  imports: [TextInputComponent, NgxCaptchaModule, ReactiveFormsModule, InputOtpModule],
})
export class ForgotPasswordComponent implements OnInit {
  protected forgetPasswordForm: FormGroup;
  protected otpForm: FormGroup;
  protected resetPasswordForm: FormGroup;

  protected formBuilder = inject(FormBuilder);
  protected accountService = inject(AccountService);
  protected toast = inject(ToastService);
  protected route=inject(Router);

  protected step = signal(1);
  protected resendTimer = signal(30);
  protected canResend = signal(false);

  private intervalId: any;

  startCountdown() {
    this.resendTimer.set(30);
    this.canResend.set(false);

    this.intervalId = setInterval(() => {
      const value = this.resendTimer() - 1;

      this.resendTimer.set(value);

      if (value <= 0) {
        clearInterval(this.intervalId);
        this.canResend.set(true);
      }
    }, 1000);
  }

  siteKey: string = '6LdaiYEsAAAAAHkHYPoskdMvMiAaFnYzxyrhoanl';
  captchaToken: string = '';

  constructor() {
    this.forgetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      recaptcha: ['', Validators.required],
    });
    this.otpForm = this.formBuilder.group({
      otp: ['', [Validators.required, Validators.pattern('^\\d{6}$')]],
    });
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/),
        ],
      ],
      confirmPassword: ['', [Validators.required, this.matchValues('newPassword')]],
    });
  }

  ngOnInit() {}
  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent;
      if (!parent) return null;
      const matchValue = parent.get(matchTo)?.value;
      return control.value === matchValue ? null : { passwordMismatch: true };
    };
  }
  handleSuccess(token: string) {
    this.captchaToken = token;
    this.forgetPasswordForm.patchValue({
      recaptcha: token,
    });
  }
  resendOTP(){
    this.startCountdown();
    this.sendEmail();
  }
  sendEmail() {
    this.accountService.sendEmail(this.forgetPasswordForm.value.email).subscribe({
      next: () => {
        this.toast.success('email sent');
        this.step.set(2);
        this.startCountdown();
      },
      error: (error) => {
        this.toast.error(error.error.message);
        console.log(error);
      },
    });
  }
  verifyOTP(){
   this.accountService.verifyOTP(this.forgetPasswordForm.value.email,this.otpForm.value.otp).subscribe({
      next: () => {
        this.toast.success('Otp verified');
        this.step.set(3);
      },
      error: (error) => {
        this.toast.error(error.error.message);
        console.log(error);
      },
    });
  }
  resetPassword(){
 this.accountService.resetPassword(this.forgetPasswordForm.value.email,this.resetPasswordForm.value.newPassword).subscribe({
      next: () => {
        this.toast.success('Password has been changed');

        this.forgetPasswordForm.reset();
        this.otpForm.reset();
        this.resetPasswordForm.reset();
        
        this.route.navigateByUrl('/');
      },
      error: (error) => {
        this.toast.error(error.error.message);
        console.log(error);
      },
    });
  }
}
