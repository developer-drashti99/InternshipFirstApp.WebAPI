import { Component, inject, output } from '@angular/core';
import { AccountService } from '../../core/services/account-service';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../../types/employee';

@Component({
  selector: 'app-member-list',
  imports: [],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css',
})
export class MemberList {
   private accountService = inject(AccountService);
   private http=inject(HttpClient);
   protected emp:Employee[]=[];
   constructor() {
    this.http.get<Employee[]>("http://localhost:5178/api/Employees").subscribe({
      next:response=>{
        this.emp=response;
        console.log(response);
      }
    });
   }
}
