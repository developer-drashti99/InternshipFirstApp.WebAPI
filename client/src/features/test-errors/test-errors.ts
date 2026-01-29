import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-test-errors',
  imports: [],
  templateUrl: './test-errors.html',
  styleUrl: './test-errors.css',
})
export class TestErrors {
  private http = inject(HttpClient);
  private apiUrl = "http://localhost:5178/api/";

  get404Error() {
    this.http.get(this.apiUrl + "buggy/not-found").subscribe(
      {
        next: response => console.log(response),
        error:error=>console.log(error)        
      }
    );
  }

   get400Error() {
    this.http.get(this.apiUrl + "buggy/bad-request").subscribe(
      {
        next: response => console.log(response),
        error:error=>console.log(error)        
      }
    );
  }
   get500Error() {
    this.http.get(this.apiUrl + "buggy/server-error").subscribe(
      {
        next: response => console.log(response),
        error:error=>console.log(error)        
      }
    );
  }
   get401Error() {
    this.http.get(this.apiUrl + "buggy/auth").subscribe(
      {
        next: response => console.log(response),
        error:error=>console.log(error)        
      }
    );
  }
   get400ValidationError() {
    this.http.post(this.apiUrl + "account/register",{}).subscribe(
      {
        next: response => console.log(response),
        error:error=>console.log(error)        
      }
    );
  }
}
