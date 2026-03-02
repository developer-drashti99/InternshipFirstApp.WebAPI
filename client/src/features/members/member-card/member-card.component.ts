import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../../types/member';
import { RouterLink } from '@angular/router';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { LikesService } from '../../../core/services/likes-service.service';
import { TimeagoPipe } from 'ngx-timeago';
import { PresenceService } from '../../../core/services/presence-service.service';
import { AccountService } from '../../../core/services/account-service.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],
  imports: [RouterLink, AgePipe],
})
export class MemberCardComponent {
  private likeService = inject(LikesService);
  protected accountService = inject(AccountService);
  private presenceService = inject(PresenceService);
  
  member = input.required<Member>();

  protected hasLiked = computed(() => this.likeService.likeIds().includes(this.member().id));
  protected isOnline = computed(() =>
    this.presenceService.onlineUsers().includes(this.member().id),
  );

  toggleLike(event: Event) {
    event.stopPropagation();
    this.likeService.toggleLike(this.member().id)
  }
}
