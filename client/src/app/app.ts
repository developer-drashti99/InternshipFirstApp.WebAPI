import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { NavBar } from "../layout/nav-bar/nav-bar";
import { BusyService } from '../core/services/busy-service.service';

@Component({
  selector: 'app-root',
  imports: [NavBar, RouterOutlet, RouterModule, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App
// implements OnInit
{

  protected router = inject(Router);
   protected busyService = inject(BusyService);


  // private accountService = inject(AccountService);
  // private http = inject(HttpClient);
  // private readonly apiUrl = 'http://localhost:5178/api/employees';
  // protected employees = signal<Employee[]>([]);

  // async ngOnInit() {
  //   try {
  //     this.employees.set(await this.getEmployees());
  //     console.log("from on init:  ");

  // 👇this code is in init-service👇
  // this.setCurrentEmployees();


  //   } catch (error) {
  //     console.error('Error fetching employees:', error);
  //   }
  // }


  // 👇this code is in init-service👇
  // setCurrentEmployees() {

  //   const empString = localStorage.getItem('user');
  //   if (!empString) return;
  //   const emp = JSON.parse(empString);
  //   this.accountService.currentUser.set(emp);

  // }

  // async getEmployees() {
  // return lastValueFrom(this.http.get<Employee[]>(this.apiUrl));
  // }
}