import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavBar } from "../layout/nav-bar/nav-bar";
import { AccountService } from '../core/services/account-service';
import { lastValueFrom } from 'rxjs';
import { Home } from '../features/home/home';
import { Employee } from '../types/employee';

@Component({
  selector: 'app-root',
  imports: [NavBar, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App 
// implements OnInit
 {

  protected router=inject(Router);


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