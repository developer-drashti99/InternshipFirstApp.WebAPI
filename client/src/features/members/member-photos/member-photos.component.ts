import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../core/services/member-service.service';
import { ActivatedRoute } from '@angular/router';
import { Member, Photo } from '../../../types/member';
import { ImageUploadComponent } from "../../../shared/image-upload/image-upload.component";
import { AccountService } from '../../../core/services/account-service.service';
import { User } from '../../../types/user';
import { StarButtonComponent } from "../../../shared/star-button/star-button.component";
import { DeleteButtonComponent } from "../../../shared/delete-button/delete-button.component";

@Component({
  selector: 'app-member-photos',
  imports: [ImageUploadComponent, StarButtonComponent, DeleteButtonComponent],
  templateUrl: './member-photos.component.html',
  styleUrls: ['./member-photos.component.css']
})
export class MemberPhotosComponent implements OnInit {
  protected memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  private accountService = inject(AccountService);
  protected photos = signal<Photo[]>([]);
  protected loading = signal(false);

  protected isCurrentUser = computed(() => {
    return this.accountService.currentUser()?.id ===
      this.route.parent?.snapshot.paramMap.get('id');
  });

  ngOnInit(): void {
    const memberId = this.route.parent?.snapshot.paramMap.get('id');
    if (memberId) {
      this.memberService.getMemberPhotos(memberId).subscribe({
        next: photos => this.photos.set(photos)
      });
    }
  }
  onUploadImage(file: File) {
    this.loading.set(true);
    this.memberService.uploadPhoto(file).subscribe({
      next: photo => {
        this.memberService.editMode.set(false);
        this.loading.set(false);
        this.photos.update(photos => [...photos, photo])
      },
      error: error => {
        console.log("error uploading image:", error);
        this.loading.set(false);
      }
    });
  }
  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo).subscribe({
      next: () => {
        const currentUser = this.accountService.currentUser();
        if (currentUser) currentUser.imageUrl = photo.url;
        this.accountService.setcurrentUser(currentUser as User);

        this.memberService.member.update(member => ({
          ...member,
          imageUrl: photo.url
        }) as Member);
      }
    });
  }
  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe({
      next: () => {
        this.photos.update(photos => photos.filter(p => p.id !== photoId));
      }
    });
  }
  // a property which shows 20 photos for temporary fake images testing purpose
  // get photoMocks()
  // {
  //   return Array.from({length:20},(_,i)=>({
  //     url:'/default_user.jpg'
  //   }))
  // }
}
