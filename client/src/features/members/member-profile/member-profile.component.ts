import { Component, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditableMember, Member } from '../../../types/member';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../core/services/member-service.service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../core/services/toast-service.service';

@Component({
  imports:[DatePipe,FormsModule],
  selector: 'app-member-profile',
  templateUrl: './member-profile.component.html',
  styleUrls: ['./member-profile.component.css']
})
export class MemberProfileComponent implements OnInit,OnDestroy {
 
  @ViewChild("editForm") editForm?:NgForm;
  protected memberService=inject(MemberService);
  private toast=inject(ToastService);
  private route=inject(ActivatedRoute);
  protected member=signal<Member|undefined>(undefined);
  protected editableMember:EditableMember={
    displayName:'',
    description:'',
    city:'',
    country:''
  };

  ngOnInit(): void {
   this.route.parent?.data.subscribe(data=>{
    this.member.set(data["member"])
   })
    this.editableMember={
      displayName:this.member()?.displayName ||'',
      city:this.member()?.city ||'',
      country:this.member()?.country ||'',
      description:this.member()?.description ||'',
    }
  }

   ngOnDestroy(): void {
    if(this.memberService.editMode())
      this.memberService.editMode.set(false);
  }

  updateProfile()
  {
    if(!this.member()) return;
    //combination of member and editable member
    const updatedMember={...this.member(),...this.editableMember}
    console.log(updatedMember);
    this.toast.success("Profile updates successfully");
    this.memberService.editMode.set(false);
  }
}
