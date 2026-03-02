import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter } from 'rxjs';
import { Location } from '@angular/common';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { AccountService } from '../../../core/services/account-service.service';
import { MemberService } from '../../../core/services/member-service.service';
import { PresenceService } from '../../../core/services/presence-service.service';
import { LikesService } from '../../../core/services/likes-service.service';

@Component({
  selector: 'app-member-details',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './member-details.html',
  styleUrl: './member-details.css',
})
export class MemberDetails implements OnInit {
  private route = inject(ActivatedRoute);
  protected router = inject(Router);
  private location = inject(Location);

  protected accountService = inject(AccountService);
  protected memberService = inject(MemberService);
  protected likeService = inject(LikesService);

  protected title = signal<string | undefined>('Profile');
  private routeId=signal<string|null>(null);
  protected presenceService = inject(PresenceService);

  protected hasLiked = computed(() => this.likeService.likeIds().includes(this.routeId()!));
  protected isCurrentUser = computed(() => {
    return this.accountService.currentUser()?.id === this.routeId();
  });

  constructor() {
    this.route.paramMap.subscribe(params=>{
      this.routeId.set(params.get('id'));
    });    
  }

  ngOnInit(): void {

    // loaded member from resolver req

    this.title.set(this.route.firstChild?.snapshot?.title);

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe({
      next: () => {
        this.title.set(this.route.firstChild?.snapshot?.title);
      },
    });
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
