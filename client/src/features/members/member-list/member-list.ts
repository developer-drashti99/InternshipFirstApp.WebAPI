import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberService } from '../../../core/services/member-service.service';
import { Member, MemberParams } from '../../../types/member';
import { MemberCardComponent } from "../member-card/member-card.component";
import { PaginatedResult } from '../../../types/pagination';
import { PaginatorComponent } from "../../../shared/paginator/paginator.component";
import { FilterModalComponent } from '../filter-modal/filter-modal.component';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [CommonModule, MemberCardComponent, PaginatorComponent, FilterModalComponent],
  templateUrl: './member-list.html',
  styleUrls: ['./member-list.css'],
})
export class MemberList implements OnInit {
  // accesing modal component
  @ViewChild('filterModal') modal!: FilterModalComponent;

  private memberService = inject(MemberService);
  protected paginatedMembers = signal<PaginatedResult<Member> | null>(null);
  protected memberParams = new MemberParams();

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers(this.memberParams).subscribe({
      next: result => {
        this.paginatedMembers.set(result);
      }
    });
  }
  onPageChange(event: { pageNumber: number, pageSize: number }) {
    this.memberParams.pageSize = event.pageSize;
    this.memberParams.pageNumber = event.pageNumber;
    this.loadMembers();
  }

  openModal() {
    this.modal.open();
  }

  onClose() {
    console.log('modal closed');
  }

  onFilterChange(data:MemberParams){
    // console.log('Modal submitted data ',data);
    this.memberParams=data;
    this.loadMembers();
  }

  resetFilters(){
    this.memberParams=new MemberParams();
    this.loadMembers();
  }

}
