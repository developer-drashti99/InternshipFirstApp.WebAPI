import { Component, inject, Input, signal } from '@angular/core';
import { Register } from "../account/register/register";
import { AccountService } from '../../core/services/account-service.service';

@Component({
  selector: 'app-home',
  // imports: [Register],
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected registerMode = signal(false);
  protected accountService = inject(AccountService);

}
