import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
    selector: 'app-pagination',
    template: `
    @if (totalElements() > 0) {
      <nav
        class="flex items-center justify-between gap-4 py-4 flex-wrap"
        role="navigation"
        aria-label="Paginación"
      >
        <div class="text-gray-500 text-sm">
          <span>
            Mostrando {{ startItem() }}-{{ endItem() }} de {{ totalElements() }}
          </span>
        </div>

        @if (totalPages() > 1) {
          <ul class="flex items-center gap-1 list-none m-0 p-0">
            <li>
              <button
                type="button"
                class="inline-flex items-center justify-center min-w-9 h-9 p-2 border border-gray-200 rounded-md bg-white text-gray-700 text-sm cursor-pointer transition-all duration-150 hover:enabled:bg-gray-100 hover:enabled:border-gray-300 focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                [disabled]="isFirst()"
                [attr.aria-disabled]="isFirst()"
                aria-label="Primera página"
                (click)="goToPage(0)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="11 17 6 12 11 7"></polyline>
                  <polyline points="18 17 13 12 18 7"></polyline>
                </svg>
              </button>
            </li>

            <li>
              <button
                type="button"
                class="inline-flex items-center justify-center min-w-9 h-9 p-2 border border-gray-200 rounded-md bg-white text-gray-700 text-sm cursor-pointer transition-all duration-150 hover:enabled:bg-gray-100 hover:enabled:border-gray-300 focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                [disabled]="isFirst()"
                [attr.aria-disabled]="isFirst()"
                aria-label="Página anterior"
                (click)="goToPage(currentPage() - 1)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
            </li>

            @for (pageNum of visiblePages(); track pageNum) {
              @if (pageNum === -1) {
                <li>
                  <span class="inline-flex items-center justify-center min-w-9 h-9 text-gray-500" aria-hidden="true">...</span>
                </li>
              } @else {
                <li>
                  <button
                    type="button"
                    class="inline-flex items-center justify-center min-w-9 h-9 p-2 border rounded-md text-sm font-medium cursor-pointer transition-all duration-150 focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2"
                    [class]="pageNum === currentPage() 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-300'"
                    [attr.aria-current]="pageNum === currentPage() ? 'page' : null"
                    [attr.aria-label]="'Página ' + (pageNum + 1)"
                    (click)="goToPage(pageNum)"
                  >
                    {{ pageNum + 1 }}
                  </button>
                </li>
              }
            }

            <li>
              <button
                type="button"
                class="inline-flex items-center justify-center min-w-9 h-9 p-2 border border-gray-200 rounded-md bg-white text-gray-700 text-sm cursor-pointer transition-all duration-150 hover:enabled:bg-gray-100 hover:enabled:border-gray-300 focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                [disabled]="isLast()"
                [attr.aria-disabled]="isLast()"
                aria-label="Página siguiente"
                (click)="goToPage(currentPage() + 1)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </li>

            <li>
              <button
                type="button"
                class="inline-flex items-center justify-center min-w-9 h-9 p-2 border border-gray-200 rounded-md bg-white text-gray-700 text-sm cursor-pointer transition-all duration-150 hover:enabled:bg-gray-100 hover:enabled:border-gray-300 focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                [disabled]="isLast()"
                [attr.aria-disabled]="isLast()"
                aria-label="Última página"
                (click)="goToPage(totalPages() - 1)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="13 17 18 12 13 7"></polyline>
                  <polyline points="6 17 11 12 6 7"></polyline>
                </svg>
              </button>
            </li>
          </ul>
        }

        <div class="flex items-center gap-2 text-sm">
          <label for="page-size" class="text-gray-500">Mostrar:</label>
          <select
            id="page-size"
            class="py-1.5 px-3 border border-gray-200 rounded-md bg-white text-gray-700 text-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2"
            [value]="pageSize()"
            (change)="onPageSizeChange($event)"
          >
            @for (option of pageSizeOptions(); track option) {
              <option [value]="option">{{ option }}</option>
            }
          </select>
        </div>
      </nav>
    }
  `,
})
export class Pagination {
    currentPage = input.required<number>();
    pageSize = input.required<number>();
    totalElements = input.required<number>();
    totalPages = input.required<number>();
    isFirst = input.required<boolean>();
    isLast = input.required<boolean>();
    pageSizeOptions = input<number[]>([10, 25, 50, 100]);

    pageChange = output<number>();
    pageSizeChange = output<number>();

    startItem = computed(() => {
        if (this.totalElements() === 0) return 0;
        return this.currentPage() * this.pageSize() + 1;
    });

    endItem = computed(() => {
        const end = (this.currentPage() + 1) * this.pageSize();
        return Math.min(end, this.totalElements());
    });

    visiblePages = computed(() => {
        const total = this.totalPages();
        const current = this.currentPage();
        const pages: number[] = [];

        if (total <= 7) {
            for (let i = 0; i < total; i++) {
                pages.push(i);
            }
            return pages;
        }

        // Always show first page
        pages.push(0);

        if (current > 2) {
            pages.push(-1); // ellipsis
        }

        // Pages around current
        const start = Math.max(1, current - 1);
        const end = Math.min(total - 2, current + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (current < total - 3) {
            pages.push(-1); // ellipsis
        }

        // Always show last page
        pages.push(total - 1);

        return pages;
    });

    goToPage(page: number): void {
        if (page >= 0 && page < this.totalPages() && page !== this.currentPage()) {
            this.pageChange.emit(page);
        }
    }

    onPageSizeChange(event: Event): void {
        const select = event.target as HTMLSelectElement;
        const newSize = parseInt(select.value, 10);
        this.pageSizeChange.emit(newSize);
    }
}
