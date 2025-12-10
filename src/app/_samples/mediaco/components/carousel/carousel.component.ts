import {
  Component,
  ElementRef,
  ViewChildren,
  QueryList,
  AfterViewInit,
  OnDestroy,
  NgZone,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() data: any[] = [];
  @ViewChildren('cardItem') cardItems!: QueryList<ElementRef>;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLElement>;

  originalItems: any[] = [];
  displayItems: any[] = [];
  isLoading: boolean = true;
  skeletonItems: any[] = new Array(6).fill(0);

  constructor(
    private ngZone: NgZone,
    private dialog: MatDialog
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      if (this.data && this.data.length > 0) {
        this.buildCarouselItems();
      } else {
        this.isLoading = true;
      }
    }
  }

  initializeScroll() {
    const container = this.scrollContainer?.nativeElement;
    if (container && container.scrollWidth > 0) {
      const singleSetWidth = container.scrollWidth / 3;
      container.scrollLeft = singleSetWidth;
      // Trigger one calculation to set initial sizes
      this.onScroll({ target: container } as any);
    }
  }

  buildCarouselItems() {
    const mappedData = this.data.map(item => {
      return {
        title: item.Carouselheading || item.Description || 'Untitled',
        img: item.ImageURL,
        ...item
      };
    });

    this.originalItems = mappedData;
    let loopList = [...mappedData];

    // If you have 2 items, we duplicate them until we have at least 12.
    const MIN_ITEMS = 12;
    if (loopList.length > 0) {
      while (loopList.length < MIN_ITEMS) {
        loopList = [...loopList, ...loopList];
      }
    }

    this.displayItems = [...loopList, ...loopList, ...loopList];

    this.preloadImages();
  }

  //Logic to download all images before showing UI
  preloadImages() {
    this.isLoading = true;
    const uniqueUrls = [...new Set(this.displayItems.map(item => item.img))].filter(url => url);

    let loadedCount = 0;
    const total = uniqueUrls.length;

    if (total === 0) {
      this.finishLoading();
      return;
    }

    uniqueUrls.forEach(url => {
      const img = new Image();
      img.src = url;

      const onImageComplete = () => {
        loadedCount++;
        if (loadedCount === total) {
          this.finishLoading();
        }
      };

      img.onload = onImageComplete;
      img.onerror = onImageComplete;
    });
  }

  finishLoading() {
    this.isLoading = false;
    setTimeout(() => {
      this.initializeScroll();
    }, 0);
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      const container = this.scrollContainer?.nativeElement;
      if (container) {
        container.addEventListener('scroll', this.onScroll.bind(this));
      }
    });
  }

  ngOnDestroy() {
    const container = this.scrollContainer?.nativeElement;
    if (container) {
      container.removeEventListener('scroll', this.onScroll.bind(this));
    }
  }

  onScroll(event: Event) {
    if (this.isLoading) return;

    const container = event.target as HTMLElement;
    if (!container) return;

    requestAnimationFrame(() => {
      const totalWidth = container.scrollWidth;
      const singleSetWidth = totalWidth / 3;
      const currentScroll = container.scrollLeft;

      if (currentScroll < 100) {
        container.scrollLeft = currentScroll + singleSetWidth;
      } else if (currentScroll >= singleSetWidth * 2 - 100) {
        container.scrollLeft = currentScroll - singleSetWidth;
      }

      const containerRect = container.getBoundingClientRect();
      if (containerRect.width === 0) return;

      this.cardItems.forEach(item => {
        const el = item.nativeElement;
        const rect = el.getBoundingClientRect();
        const cardCenter = rect.left - containerRect.left + rect.width / 2;
        const containerCenter = containerRect.width / 2;
        const distance = Math.abs(containerCenter - cardCenter);

        const activeZone = 400;
        const minWidth = 200;
        const maxWidth = 500;
        let currentWidth = minWidth;
        let opacity = 0.7;

        if (distance < activeZone) {
          const factor = 1 - distance / activeZone;
          currentWidth = minWidth + (maxWidth - minWidth) * factor;
          opacity = 0.7 + 0.3 * factor;
        }

        el.style.flexBasis = `${currentWidth}px`;
        el.style.minWidth = `${currentWidth}px`;
        el.style.opacity = `${opacity}`;
      });
    });
  }
}
