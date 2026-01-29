import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-api-without-signal',
  imports: [],
  templateUrl: './api-without-signal.html',
  styleUrl: './api-without-signal.css',
})
export class ApiWithoutSignal implements OnInit{

  private http=inject(HttpClient);

  Employees: { displayName: string; email: string; empId: string }[] = [];
  // protected readonly title = signal('client');
  protected readonly title ='client';
  
  ngOnInit(): void {
    this.http.get('https://localhost:7090/api/Employees').subscribe({
      next: data => {
       // console.log(data);
        this.Employees=data as { displayName: string; email: string; empId: string }[];
        //console.log(this.Employees);
      },
      error: error => {
        console.error('There was an error!', error);
      },
      complete: () => {
        console.log('Request completed');
      }
    });
  }

}

