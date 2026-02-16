import { Component, inject, OnInit, signal } from '@angular/core';
import { LikesService } from '../../core/services/likes-service.service';
import { Member } from '../../types/member';
import { MemberCardComponent } from "../members/member-card/member-card.component";
@Component({
  selector: 'app-list-component',
  templateUrl: './list-component.component.html',
  styleUrls: ['./list-component.component.css'],
  imports: [MemberCardComponent]
})
export class ListComponent implements OnInit {
  private likesService = inject(LikesService);
  protected members = signal<Member[]>([]);
  protected predicate = 'liked';

  tabs = [
    { label: 'Liked', value: 'liked' },
    { label: 'Liked me', value: 'likedBy' },
    { label: 'Mutual', value: 'mutual' },
  ];

  ngOnInit(): void {
    this.loadLikes();
  }

  setPredicate(predicate: string) {
    if (this.predicate !== predicate) {
      this.predicate = predicate;
      this.loadLikes();
    }
  }

  loadLikes() {
    this.likesService.getLikes(this.predicate).subscribe({
      next: members => this.members.set(members)
    });
  }
}
