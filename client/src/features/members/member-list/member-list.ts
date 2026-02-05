import { Component, inject, OnInit, signal } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../types/user';
import { environment } from '../../../environments/environment';
import { MemberService } from '../../../core/services/member-service.service';
import { Member } from '../../../types/member';
import { Observable } from 'rxjs';
import { MemberCardComponent } from "../member-card/member-card.component";
import { AgePipe } from '../../../core/pipes/age-pipe';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [CommonModule, AsyncPipe, MemberCardComponent],
  templateUrl: './member-list.html',
  styleUrls: ['./member-list.css'],
})
export class MemberList{
  private memberService = inject(MemberService);
  protected members$: Observable<Member[]>;
 

  constructor() {
   this.members$=this.memberService.getMembers();
  }

}
