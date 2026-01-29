import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { User } from '../../types/user';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './member-list.html',
  styleUrls: ['./member-list.css'],
})
export class MemberList implements OnInit {
  private http = inject(HttpClient);

  // Use signals for reactive state
  public users = signal<User[]>([]);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.http.get<User[]>('http://localhost:5178/api/Users').subscribe({
      next: (res) => {
        this.users.set(res || []);
        console.log('Users:', res);
      },
      error: (err) => console.error('Error fetching users:', err),
    });
  }
}
