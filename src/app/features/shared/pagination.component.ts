import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalDecks: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

@Component({
    selector: 'digimon-pagination',
    template: `
    <div class="flex items-center justify-between px-4 py-3 sm:px-6">
      <div class="flex flex-1 justify-between sm:hidden">
        <button
          [disabled]="!pagination.hasPrevPage"
          (click)="onPageChange(pagination.currentPage - 1)"
          class="relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
          Previous
        </button>
        <button
          [disabled]="!pagination.hasNextPage"
          (click)="onPageChange(pagination.currentPage + 1)"
          class="relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
          Next
        </button>
      </div>
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-white">
            Showing
            <span class="font-medium">{{ getStartItem() }}</span>
            to
            <span class="font-medium">{{ getEndItem() }}</span>
            of
            <span class="font-medium">{{ pagination.totalDecks }}</span>
            results
          </p>
        </div>
        <div>
          <nav class="isolate inline-flex -space-x-px rounded-md" aria-label="Pagination">
            <!-- Previous button -->
            <button
              [disabled]="!pagination.hasPrevPage"
              (click)="onPageChange(pagination.currentPage - 1)"
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-white hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="sr-only">Previous</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
              </svg>
            </button>

            <!-- Page numbers -->
            <ng-container *ngFor="let page of getVisiblePages()">
              <button
                *ngIf="page !== '...'; else ellipsis"
                [ngClass]="{
                  'relative z-10 inline-flex items-center bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600': page === pagination.currentPage,
                  'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 focus:z-20 focus:outline-offset-0': page !== pagination.currentPage
                }"
                (click)="page !== '...' && onPageChange(+page)">
                {{ page }}
              </button>
              <ng-template #ellipsis>
                <span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-white focus:outline-offset-0">...</span>
              </ng-template>
            </ng-container>

            <!-- Next button -->
            <button
              [disabled]="!pagination.hasNextPage"
              (click)="onPageChange(pagination.currentPage + 1)"
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-white hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="sr-only">Next</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  `,
    standalone: true,
    imports: [NgFor, NgIf, NgClass, ButtonModule],
})
export class PaginationComponent {
    @Input() pagination!: PaginationInfo;
    @Output() pageChange = new EventEmitter<number>();

    onPageChange(page: number): void {
        if (page >= 1 && page <= this.pagination.totalPages && page !== this.pagination.currentPage) {
            this.pageChange.emit(page);
        }
    }

    getStartItem(): number {
        return (this.pagination.currentPage - 1) * this.pagination.limit + 1;
    }

    getEndItem(): number {
        return Math.min(this.pagination.currentPage * this.pagination.limit, this.pagination.totalDecks);
    }

    getVisiblePages(): (number | string)[] {
        const totalPages = this.pagination.totalPages;
        const currentPage = this.pagination.currentPage;
        const pages: (number | string)[] = [];

        if (totalPages <= 7) {
            // Show all pages if 7 or fewer
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            // Show pages around current page
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            // Show last page
            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }

        return pages;
    }
}
