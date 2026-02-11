import { Component, inject, OnInit, output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RegisterCreds } from '../../../types/user';
import { AccountService } from '../../../core/services/account-service.service';
import { JsonPipe } from '@angular/common';
import { TextInputComponent } from "../../../shared/text-input/text-input.component";

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, JsonPipe, TextInputComponent],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  private accountService = inject(AccountService);
  cancelRegister = output<boolean>();
  protected credentials = {} as RegisterCreds;
  protected registerForm: FormGroup = new FormGroup({});

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = new FormGroup({
      displayName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required,
      Validators.minLength(4), Validators.maxLength(8)]),
      confirmPassword: new FormControl('', [Validators.required,this.matchValues('password')])
    });

    // on value change check password again
    this.registerForm.controls['password'].valueChanges.subscribe(()=>{
      this.registerForm.controls['confirmPassword'].updateValueAndValidity();
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent;
      if (!parent) return null;
      const matchValue = parent.get(matchTo)?.value;
      return control.value === matchValue ? null : { passwordMismatch: true }
    };
  }

  register(): void {
    // this.accountService.register(this.credentials).subscribe({
    //   next: response => {
    //     console.log('Registration successful', response);
    //     this.accountService.registerMode.set(false);
    //     this.cancel();
    //   },
    //   error: error => {
    //     console.error('Registration failed', error);
    //   }
    // });
    console.log(this.registerForm.value);
  }
  cancel(): void {
    this.cancelRegister.emit(false);
  }

}
