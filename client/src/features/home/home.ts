import { Component, inject, Input, signal } from '@angular/core';
import { Register } from "../account/register/register";
import { AccountService } from '../../core/services/account-service.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [Register],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
 
  protected accountService = inject(AccountService);
  showRegister()
  {
    this.accountService.registerMode.set(true);
  }

}
