import { Component, inject, OnInit, signal } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MemberService } from '../../../core/services/member-service.service';
import { Member } from '../../../types/member';
import { Observable } from 'rxjs';
import { MemberCardComponent } from "../member-card/member-card.component";
import { PaginatedResult } from '../../../types/pagination';
import { PaginatorComponent } from "../../../shared/paginator/paginator.component";

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [CommonModule, MemberCardComponent, PaginatorComponent],
  templateUrl: './member-list.html',
  styleUrls: ['./member-list.css'],
})
export class MemberList implements OnInit {
  private memberService = inject(MemberService);
  protected paginatedMembers = signal<PaginatedResult<Member> | null>(null);
  pageNumber = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers(this.pageNumber, this.pageSize).subscribe({
      next: result => {
        this.paginatedMembers.set(result);
      }
    });
  }
  onPageChange(event: { pageNumber: number, pageSize: number }) {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageNumber;
    this.loadMembers();
  }

}
