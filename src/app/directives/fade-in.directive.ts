import { Directive, ElementRef, OnInit, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appFadeIn]',
  standalone: true
})
export class FadeInDirective implements OnInit, OnDestroy {
  private observer?: IntersectionObserver;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    // Set initial state
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '0.8');
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(40px)');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'opacity 1s ease, transform 1s ease');

    // Create intersection observer
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
            this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(0)');
            this.renderer.addClass(this.el.nativeElement, 'visible');
          } else {
            // Optional: fade out when leaving viewport
            // this.renderer.setStyle(this.el.nativeElement, 'opacity', '0.8');
            // this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(40px)');
          }
        });
      },
      { threshold: 0.2 }
    );

    // Start observing
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
