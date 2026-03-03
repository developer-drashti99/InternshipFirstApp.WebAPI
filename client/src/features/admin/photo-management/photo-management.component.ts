import { Component, inject, OnInit, signal } from '@angular/core';
import { Photo, PhotoForModeration } from '../../../types/member';
import { AdminService } from '../../../core/services/admin-service.service';
import { Paginator } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MemberService } from '../../../core/services/member-service.service';
import { ToastService } from '../../../core/services/toast-service.service';

@Component({
  selector: 'app-photo-management',
  templateUrl: './photo-management.component.html',
  styleUrls: ['./photo-management.component.css'],
  imports: [Paginator, ButtonModule, TooltipModule],
})
export class PhotoManagementComponent implements OnInit {
  protected photos = signal<PhotoForModeration[]>([]);
  protected adminService = inject(AdminService);
  protected memberService = inject(MemberService);
  protected toastService = inject(ToastService);
  totalRecords = signal(0);
  rows = 10; // page size

  loadPhotos(pageNumber = 1) {
    this.adminService.getPhotosToModerate(pageNumber, this.rows).subscribe((result) => {
      this.photos.set(result.items);
      this.totalRecords.set(result.metadata.totalCount);
    });
  }

  onPageChange(event: any) {
    const pageNumber = event.page + 1; // PrimeNG starts from 0
    this.loadPhotos(pageNumber);
  }

  ngOnInit() {
    this.loadPhotos();
  }

  approvePhoto(photoId: number) {
    this.memberService.approveOrRejectPhoto(photoId, 'Approve').subscribe({
      next: () => {
        this.toastService.success('Photo Approved');
        this.loadPhotos();
      },
      error: (error) => this.toastService.error(error.message),
    });
  }
  unapprovePhoto(photoId: number) {
    this.memberService.approveOrRejectPhoto(photoId, 'Reject').subscribe({
      next: () => {
        this.toastService.success('Photo Unapproved');
        this.loadPhotos();
      },
      error: (error) => this.toastService.error(error.message),
    });
  }
}
