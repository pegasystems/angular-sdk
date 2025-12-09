import { Directive, ElementRef, AfterViewInit, OnDestroy, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[appMasonry]',
  standalone: true
})
export class MasonryDirective implements AfterViewInit, OnDestroy {
  @Input() masonryGap: number = 16;
  @Input() masonryRowHeight: number = 1;
  @Input() masonryItemSelector: string = '.card';

  private resizeTimeout: any;
  private mutationObserver: MutationObserver | null = null;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    // Apply masonry layout after view is initialized
    setTimeout(() => {
      this.applyMasonryLayout();
    }, 100);

    // Watch for DOM changes (new items added/removed)
    this.setupMutationObserver();
  }

  ngOnDestroy() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    // Throttle resize events to avoid excessive recalculations
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = setTimeout(() => {
      this.applyMasonryLayout();
    }, 150);
  }

  private setupMutationObserver() {
    this.mutationObserver = new MutationObserver(() => {
      // Debounce DOM changes
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }

      this.resizeTimeout = setTimeout(() => {
        this.applyMasonryLayout();
      }, 100);
    });

    this.mutationObserver.observe(this.elementRef.nativeElement, {
      childList: true,
      subtree: true
    });
  }

  private applyMasonryLayout() {
    const grid = this.elementRef.nativeElement;
    if (!grid) return;

    const items = grid.querySelectorAll(this.masonryItemSelector);
    if (items.length === 0) return;

    // Reset any existing row spans first
    items.forEach((item: HTMLElement) => {
      item.style.removeProperty('--row-span');
    });

    // Wait for layout to settle after reset, then recalculate
    requestAnimationFrame(() => {
      items.forEach((item: HTMLElement) => {
        const itemHeight = item.getBoundingClientRect().height;
        const rowSpan = Math.ceil((itemHeight + this.masonryGap) / (this.masonryRowHeight + this.masonryGap));
        item.style.setProperty('--row-span', rowSpan.toString());
      });
    });
  }

  // Public method to manually trigger layout recalculation
  public recalculateLayout() {
    this.applyMasonryLayout();
  }
}
