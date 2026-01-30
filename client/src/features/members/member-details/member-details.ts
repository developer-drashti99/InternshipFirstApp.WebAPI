import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../core/services/member-service.service';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, Observable } from 'rxjs';
import { Member } from '../../../types/member';
import { AsyncPipe, Location } from '@angular/common';
import { MemberCardComponent } from "../member-card/member-card.component";

@Component({
  selector: 'app-member-details',
  imports: [AsyncPipe, MemberCardComponent, RouterLink, RouterLinkActive,RouterOutlet],
  templateUrl: './member-details.html',
  styleUrl: './member-details.css',
})
export class MemberDetails implements OnInit {
 
  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  protected router=inject(Router);
  protected member$?: Observable<Member>;
  private location=inject(Location);
  protected title=signal<string|undefined>('Profile');
  
  ngOnInit(): void {
    this.member$ = this.loadMember();
    this.title.set(this.route.firstChild?.snapshot?.title);

    this.router.events.pipe(
      filter(event=>event instanceof NavigationEnd)
    ).subscribe({
      next:()=>
      {
        this.title.set(this.route.firstChild?.snapshot?.title)
      }
    })
  }
  loadMember() {
    // for getting id by url
    const id = this.route.snapshot.paramMap.get('id');
    if (!id)
      return;
    return this.memberService.getMember(id);
  }
   goBack() {
    this.location.back();
  }
}
