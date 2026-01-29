import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AccountService } from '../../core/services/account-service';

@Component({
  selector: 'app-api-with-signal',
  imports: [],
  templateUrl: './api-with-signal.html',
  styleUrl: './api-with-signal.css',
})
export class ApiWithSignal {}