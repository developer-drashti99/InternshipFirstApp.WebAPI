import { Component, inject, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
export class Register {
  private accountService = inject(AccountService);
  private formBuilder = inject(FormBuilder);
  cancelRegister = output<boolean>();
  protected credentials = {} as RegisterCreds;
  protected credentialsForm: FormGroup;
  protected profileForm: FormGroup;
  protected currentStep = signal(1);

  constructor() {
    this.credentialsForm = this.formBuilder.group({
      displayName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,
      Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    });

    this.profileForm = this.formBuilder.group({
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
    });

    // on value change check password again
    this.credentialsForm.controls['password'].valueChanges.subscribe(() => {
      this.credentialsForm.controls['confirmPassword'].updateValueAndValidity();
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
  
  nextStep() {
    if (this.credentialsForm.valid) {
      this.currentStep.update(prevStep => prevStep + 1);
    }
  }
  getMaxDate(){
    const today=new Date();
    today.setFullYear(today.getFullYear()-18);
    console.log(today.toISOString().split('T')[0]);
    return today.toISOString().split('T')[0];
  }

  prevStep() {
    if (this.credentialsForm.valid) {
      this.currentStep.update(prevStep => prevStep - 1);
    }
  }

  register(): void {
    if (this.profileForm.valid && this.credentialsForm.valid) { 
      const formData={...this.credentialsForm.value,...this.profileForm.value};
      console.log(formData);
    }
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
    console.log(this.credentialsForm.value);
  }
  cancel(): void {
    this.cancelRegister.emit(false);
  }

}
