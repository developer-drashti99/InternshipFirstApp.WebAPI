import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { NavBar } from '../layout/nav-bar/nav-bar';
import { BusyService } from '../core/services/busy-service.service';

@Component({
  selector: 'app-root',
  imports: [NavBar, RouterOutlet, RouterModule, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
// implements OnInit
export class App {
  protected router = inject(Router);
  protected busyService = inject(BusyService);
}
