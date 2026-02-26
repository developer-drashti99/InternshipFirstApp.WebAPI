import { Component, inject } from '@angular/core';
import { AccountService } from '../../core/services/account-service.service';
import { UserManagementComponent } from './user-management/user-management.component';
import { PhotoManagementComponent } from './photo-management/photo-management.component';

@Component({
  selector: 'app-admin',
  imports: [UserManagementComponent,PhotoManagementComponent],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  protected accountService=inject(AccountService);
  activeTab="photos";
  tabs=[
    {label:'Photo Moderation', value:'photos'},
    {label:'User Management', value:'roles'},
  ];

  setTab(tab:string){
    this.activeTab=tab;
  }
}
