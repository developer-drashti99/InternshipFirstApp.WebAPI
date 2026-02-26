import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { AdminService } from '../../../core/services/admin-service.service';
import { User } from '../../../types/user';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ToastService } from '../../../core/services/toast-service.service';
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  imports: [TableModule, MultiSelectModule, CommonModule, FormsModule, DialogModule],
})
export class UserManagementComponent implements OnInit {
  protected isRolesDialogVisible = false;

  private adminService = inject(AdminService);
  private toast = inject(ToastService);

  protected users = signal<User[]>([]);
  protected availableRoles = [{ name: 'Member' }, { name: 'Moderator' }, { name: 'Admin' }];
  protected selectedUser: User | null = null;
  protected selectedRoles: any[] = [];
  ngOnInit(): void {
    this.getUserWithRoles();
  }

  getUserWithRoles() {
    this.adminService.getUserWithRoles().subscribe({
      next: (users) => this.users.set(users),
    });
  }

  openRolesModal(user: User) {
    this.selectedUser = user;
    // map string roles to object format
    this.selectedRoles = this.availableRoles.filter((role) => user.roles.includes(role.name));
    this.isRolesDialogVisible = true;
  }

  updateRoles() {
    if (!this.selectedUser) return;

    const rolesToSend = this.selectedRoles.map((r) => r.name);

    this.adminService.updateUserRoles(this.selectedUser.id, rolesToSend).subscribe({
      next: () => {
        this.users.update((users) =>
          users.map((user) => {
            if (user.id === this.selectedUser?.id) user.roles = rolesToSend;
            return user;
          }),
        );
        this.isRolesDialogVisible = false;
      },
      error: (err) => this.toast.error('Failed to update roles', err),
    });
  }
}
