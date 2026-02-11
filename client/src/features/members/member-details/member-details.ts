import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Location } from '@angular/common';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { AccountService } from '../../../core/services/account-service.service';
import { MemberService } from '../../../core/services/member-service.service';

@Component({
  selector: 'app-member-details',
  imports: [ RouterLink, RouterLinkActive, RouterOutlet,AgePipe],
  templateUrl: './member-details.html',
  styleUrl: './member-details.css',
})
export class MemberDetails implements OnInit {
  private route = inject(ActivatedRoute);
  protected router = inject(Router);
  private location = inject(Location);
  private accountService=inject(AccountService);
  protected memberService=inject(MemberService);
  protected title = signal<string | undefined>('Profile');
  protected isCurrentUser=computed(()=>{
    return this.accountService.currentUser()?.id ===
    this.route.snapshot.paramMap.get("id");
  });

  ngOnInit(): void {
    // this.member$ = this.loadMember();
    // loaded member from resolver req

    this.title.set(this.route.firstChild?.snapshot?.title);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe({
      next: () => {
        this.title.set(this.route.firstChild?.snapshot?.title)
      }
    })
  }
  // because we are using resolver to prefetch the data we don't need this
  // loadMember() {
  //   // for getting id by url
  //   const id = this.route.snapshot.paramMap.get('id');
  //   if (!id)
  //     return;
  //   return this.memberService.getMember(id);
  // }
  goBack() {
    this.location.back();
  }
}
