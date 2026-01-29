import { Component, inject, output } from '@angular/core';
import { AccountService } from '../../core/services/account-service';
import { HttpClient } from '@angular/common/http';
import { User } from '../../types/user';

@Component({
  selector: 'app-member-list',
  imports: [],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css',
})
export class MemberList {
   private accountService = inject(AccountService);
   private http=inject(HttpClient);
   protected user:User[]=[];
   constructor() {
    this.http.get<User[]>("http://localhost:5178/api/Users").subscribe({
      next:response=>{
        this.user=response;
        console.log(response);
      }
    });
   }
}
