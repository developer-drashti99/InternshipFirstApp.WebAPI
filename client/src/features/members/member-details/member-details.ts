import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Member } from '../../../types/member';
import { Location } from '@angular/common';
import { AgePipe } from '../../../core/pipes/age-pipe';

@Component({
  selector: 'app-member-details',
  imports: [ RouterLink, RouterLinkActive, RouterOutlet,AgePipe],
  templateUrl: './member-details.html',
  styleUrl: './member-details.css',
})
export class MemberDetails implements OnInit {
  private route = inject(ActivatedRoute);
  protected router = inject(Router);
  protected member = signal<Member | undefined>(undefined);
  private location = inject(Location);
  protected title = signal<string | undefined>('Profile');

  ngOnInit(): void {
    // this.member$ = this.loadMember();
    // loaded member from resolver req
    this.route.data.subscribe({
      next: data => this.member.set(data['member'])
    });
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
