import { Component, computed, input, model, output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent {
  pageNumber = model(1);
  pageSize = model(10);
  totalCount = input(0);
  totalPages = input(0);
  pageSizeOptions = input([5, 10, 20, 50]);

  pageChange = output<{ pageNumber: number, pageSize: number }>();

  constructor() {
    console.log(this.pageNumber());
  }

  lastItemIndex = computed(() => {
    return Math.min(this.pageNumber() * this.pageSize(), this.totalCount())
  })

  onPageChange(newPage?: number, pageSize?: EventTarget | null) {
    if (newPage) this.pageNumber.set(newPage);
    if (pageSize) {
      const size = Number((pageSize as HTMLSelectElement).value);
      // this.pageNumber.set(size);
      this.pageSize.set(size);     // ✅ FIX
      this.pageNumber.set(1);      // reset to page 1 when size changes
    }

    this.pageChange.emit({
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize()
    });
  }

}
