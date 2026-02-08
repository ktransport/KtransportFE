import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { I18nService } from '../../core/services/i18n.service';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { provideHttpClient } from '@angular/common/http';

interface Testimonial {
  text: string;
  name: string;
  position?: string;
  company: string;
  initials: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, FadeInDirective],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('testimonialCarousel') testimonialCarousel!: ElementRef<HTMLElement>;

  private slideIndex = 0;
  private slideInterval: ReturnType<typeof setInterval> | null = null;
  private initTimeout: ReturnType<typeof setTimeout> | null = null;
  private slides: NodeListOf<HTMLElement> | null = null;

  // Testimonials data
  testimonials: Testimonial[] = [];
  originalTestimonials: Testimonial[] = [];
  currentTestimonialIndex = 0;
  selectedCardIndex: number | null = null;

  cardWidth = 400; // Base card width in pixels
  cardGap = 24; // Gap between cards in pixels
  private testimonialInterval: ReturnType<typeof setInterval> | null = null;
  private scrollTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    public i18n: I18nService,
    private http: HttpClient
  ) { }

  private resizeHandler = () => {
    this.updateCardDimensions();
    // On resize, update which card is selected based on current scroll position
    this.updateSelectedCardFromScroll();
  };

  ngOnInit(): void {
    this.loadTestimonials();
    this.updateCardDimensions();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.resizeHandler);
    }
  }

  private updateCardDimensions(): void {
    if (typeof window === 'undefined') return;

    const width = window.innerWidth;
    if (width < 640) {
      this.cardWidth = Math.floor(width * 0.9); // 90vw
      this.cardGap = 16;
    } else if (width < 768) {
      this.cardWidth = 400;
      this.cardGap = 16;
    } else if (width < 1024) {
      this.cardWidth = 420;
      this.cardGap = 24;
    } else if (width < 1280) {
      this.cardWidth = 450;
      this.cardGap = 24;
    } else {
      this.cardWidth = 480;
      this.cardGap = 24;
    }
  }

  private loadTestimonials(): void {
    this.http.get<Testimonial[]>('/assets/testimonials.json').subscribe({
      next: (data) => {
        this.originalTestimonials = data;
        this.testimonials = data;
        this.currentTestimonialIndex = 0;
        this.selectedCardIndex = 0; // Highlight first card by default
        setTimeout(() => {
          this.updateCardDimensions();
          // Start auto-rotation after testimonials are loaded
          this.startAutoRotation();
        }, 100);
      },
      error: (error) => {
        console.error('Error loading testimonials:', error);
      }
    });
  }

  private startAutoRotation(): void {
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
    }
    this.testimonialInterval = setInterval(() => {
      this.scrollToNext();
    }, 60000);
  }

  private resetAutoRotation(): void {
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
      this.testimonialInterval = null;
    }
    // Restart auto-rotation after a delay
    setTimeout(() => {
      this.startAutoRotation();
    }, 5000);
  }

  private scrollToNext(): void {
    this.goToNext();
  }



  // Navigation methods
  goToNext(): void {
    if (this.originalTestimonials.length === 0) return;
    const nextIndex = (this.currentTestimonialIndex + 1) % this.originalTestimonials.length;
    this.navigateToIndex(nextIndex);
  }

  goToPrev(): void {
    if (this.originalTestimonials.length === 0) return;
    const prevIndex = (this.currentTestimonialIndex - 1 + this.originalTestimonials.length) % this.originalTestimonials.length;
    this.navigateToIndex(prevIndex);
  }

  onScroll(): void {
    // Debounce scroll events to avoid excessive calculations
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    this.scrollTimeout = setTimeout(() => {
      this.updateSelectedCardFromScroll();
    }, 100);
  }

  private updateSelectedCardFromScroll(): void {
    if (!this.testimonialCarousel?.nativeElement) return;

    const container = this.testimonialCarousel.nativeElement;
    const cards = container.querySelectorAll('.testimonial-card');
    if (cards.length === 0) return;

    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    // Find the card closest to the center
    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(cardCenter - containerCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    // Update selected card if it changed
    if (closestIndex !== this.currentTestimonialIndex) {
      this.currentTestimonialIndex = closestIndex;
      this.selectedCardIndex = closestIndex;
    }
  }

  private navigateToIndex(index: number): void {
    if (index < 0 || index >= this.originalTestimonials.length) return;
    if (!this.testimonialCarousel?.nativeElement) return;

    this.currentTestimonialIndex = index;
    this.selectedCardIndex = index;

    const container = this.testimonialCarousel.nativeElement;
    const cards = container.querySelectorAll('.testimonial-card');
    if (cards.length === 0 || !cards[index]) return;

    // Scroll the card into view with center alignment
    cards[index].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });

    this.resetAutoRotation(); // Reset auto-rotation on manual navigation
  }

  onCardClick(index: number): void {
    // Map the index to the original testimonials array if needed
    if (this.originalTestimonials.length > 0 && index < this.originalTestimonials.length) {
      // If clicking on a card, highlight it and optionally navigate to it
      this.selectedCardIndex = index;
      this.navigateToIndex(index);
    }
  }

  ngAfterViewInit(): void {
    // Wait for DOM to be ready and images to load
    this.initTimeout = setTimeout(() => {
      this.startSlideshow();
    }, 500);
  }

  ngOnDestroy(): void {
    // Clear initialization timeout if component is destroyed before it runs
    if (this.initTimeout) {
      clearTimeout(this.initTimeout);
    }

    // Clear scroll timeout
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    // Clear slideshow interval
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }

    // Clear testimonial auto-rotation
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
      this.testimonialInterval = null;
    }

    // Remove resize listener
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resizeHandler);
    }
  }

  private startSlideshow(): void {
    // Cache slides reference to avoid repeated DOM queries
    this.slides = document.querySelectorAll('.hero-slide') as NodeListOf<HTMLElement>;

    if (!this.slides || this.slides.length === 0) {
      console.warn('No slides found');
      return;
    }

    // Preload all images to prevent loading delays
    this.preloadImages();

    // Initialize: show first slide (index 0), hide others
    this.slides.forEach((slide: HTMLElement, index: number) => {
      slide.style.opacity = index === 0 ? '1' : '0';
    });

    // Start at slide 0, will advance to slide 1 after first interval
    this.slideIndex = 0;

    // Start slideshow - advance to next slide every 8 seconds
    this.slideInterval = setInterval(() => {
      if (this.slides && this.slides.length > 0) {
        this.advanceSlide();
      }
    }, 8000); // 8 seconds per slide
  }

  private preloadImages(): void {
    // Preload all hero images for smooth transitions
    const imageUrls = [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&h=1080&fit=crop',
      'https://images.unsplash.com/photo-1549144511-f099e773c147?w=1920&h=1080&fit=crop',
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&h=1080&fit=crop',
      'assets/images/Promenade-Des-Anglais.jpg'
    ];

    // Preload all images in parallel
    imageUrls.forEach(url => {
      const img = new Image();
      img.onerror = () => console.warn('Failed to load image:', url);
      img.src = url;
    });
  }

  private advanceSlide(): void {
    if (!this.slides || this.slides.length === 0) {
      return;
    }

    // Calculate next slide index
    const nextIndex = (this.slideIndex + 1) % this.slides.length;

    // Show next slide immediately (crossfade - no dark gap)
    if (this.slides[nextIndex]) {
      this.slides[nextIndex].style.opacity = '1';
    }

    // Hide current slide immediately (both visible during transition for smooth crossfade)
    if (this.slides[this.slideIndex]) {
      this.slides[this.slideIndex].style.opacity = '0';
    }

    // Update index
    this.slideIndex = nextIndex;
  }
}
