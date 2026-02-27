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
  protected selectedRoles: string[] = [];
  protected totalRecords = 0;
  protected pageNumber = 1;
  protected pageSize = 5;
  protected loading = false;

  ngOnInit(): void {
    this.getUserWithRoles(this.pageNumber,this.pageSize);
  }

  getUserWithRoles(pageNumber: number, pageSize: number) {
    this.adminService.getUserWithRoles(pageNumber, pageSize).subscribe({
      next: (response) => {
        this.users.set(response.items);
        this.totalRecords = response.metadata.totalCount;
        this.pageSize = response.metadata.pageSize;
      },
    });
  }

  openRolesModal(user: User) {
    this.selectedUser = user;
    this.selectedRoles = [...user.roles];
    this.isRolesDialogVisible = true;
  }

  updateRoles() {
    if (!this.selectedUser) return;

    this.adminService.updateUserRoles(this.selectedUser.id, this.selectedRoles).subscribe({
      next: () => {
        this.users.update((users) =>
          users.map((u) =>
            u.id === this.selectedUser?.id ? { ...u, roles: this.selectedRoles } : u,
          ),
        );

        this.isRolesDialogVisible = false;
      },
    });
  }

  loadUsers(event: any) {
    const pageNumber = event.first / event.rows + 1;
    const pageSize = event.rows;

    this.loading = true;

    this.adminService.getUserWithRoles(pageNumber, pageSize).subscribe({
      next: (response) => {
        this.users.set(response.items);
        this.totalRecords = response.metadata.totalCount;
        this.pageNumber=response.metadata.currentPage;
        this.pageSize = response.metadata.pageSize;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
