import { Component, HostListener, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EditableMember, Member } from '../../../types/member';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../core/services/member-service.service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../core/services/toast-service.service';
import { AccountService } from '../../../core/services/account-service.service';
import { TimeAgoPipe } from '../../../core/pipes/timeAgo.pipe';

@Component({
  imports: [DatePipe, FormsModule,TimeAgoPipe],
  selector: 'app-member-profile',
  templateUrl: './member-profile.component.html',
  styleUrls: ['./member-profile.component.css']
})
export class MemberProfileComponent implements OnInit, OnDestroy {

  @ViewChild("editForm") editForm?: NgForm;
  // notify while leaving the page with profile changes unsaved
  @HostListener("window:beforeunload", ['$event']) notify($event: BeforeUnloadEvent) {
    if (this.editForm?.dirty) {
      $event.preventDefault();
    }
  }
  protected memberService = inject(MemberService);
  private accountService = inject(AccountService);
  private toast = inject(ToastService);
  // private route=inject(ActivatedRoute);
  // protected member=signal<Member|undefined>(undefined);
  protected editableMember: EditableMember = {
    displayName: '',
    description: '',
    city: '',
    country: ''
  };

  ngOnInit(): void {
    this.editableMember = {
      displayName: this.memberService.member()?.displayName || '',
      city: this.memberService.member()?.city || '',
      country: this.memberService.member()?.country || '',
      description: this.memberService.member()?.description || '',
    }
  }

  ngOnDestroy(): void {
    if (this.memberService.editMode())
      this.memberService.editMode.set(false);
  }

  updateProfile() {
    if (!this.memberService.member()) return;
    //combination of member and editable member
    const updatedMember = { ...this.memberService.member(), ...this.editableMember }
    // console.log(updatedMember);
    this.memberService.member.set(updatedMember as Member);
    this.memberService.updateMember(this.editableMember).subscribe({
      next: () => {
        const currentUser = this.accountService.currentUser();
        if (currentUser && updatedMember.displayName != currentUser?.displayName) {
          currentUser.displayName = updatedMember.displayName;
          this.accountService.setcurrentUser(currentUser);
        }
        this.toast.success("Profile updates successfully");
        this.memberService.editMode.set(false);
        this.editForm?.reset(updatedMember);//dirty flag will be false
      },
    });
  }
}
