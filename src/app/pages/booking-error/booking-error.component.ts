import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-booking-error',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="py-24 bg-gray-50" style="margin-top: 70px;">
      <div class="container mx-auto px-6 max-w-2xl">
        <div class="luxury-card-alt p-10 text-center">
          <!-- Error Icon -->
          <div class="mb-6">
            <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
          </div>

          <!-- Error Title -->
          <h2 class="text-3xl font-serif font-bold text-gray-900 mb-4">
            {{ getErrorTitle() }}
          </h2>

          <!-- Error Message -->
          <p class="text-gray-700 mb-8 leading-relaxed">
            {{ getErrorMessage() }}
          </p>

          <!-- Error Details -->
          <div *ngIf="errorCode" class="bg-gray-50 p-4 rounded-lg mb-8">
            <p class="text-sm text-gray-600 mb-1">{{ i18n.t$('booking.error.error_code') | async }}</p>
            <p class="text-lg font-mono font-bold text-gray-900">{{ errorCode }}</p>
          </div>

          <!-- Actions -->
          <div class="space-y-3">
            <button
              (click)="startNewBooking()"
              class="btn-primary w-full">
              {{ i18n.t$('booking.error.start_new') | async }}
            </button>
            <button
              (click)="goToHome()"
              class="btn-secondary w-full">
              {{ i18n.t$('booking.error.back_home') | async }}
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class BookingErrorComponent implements OnInit {
  errorCode: string = '';

  constructor(
    public i18n: I18nService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.errorCode = params['error'] || 'UNKNOWN_ERROR';
    });
  }

  getErrorTitle(): string {
    const key = `booking.error.${this.errorCode.toLowerCase()}.title`;
    const title = this.i18n.translate(key);
    if (title !== key) return title;
    return this.i18n.translate('booking.error.default.title') || 'Booking Error';
  }

  getErrorMessage(): string {
    const key = `booking.error.${this.errorCode.toLowerCase()}.message`;
    const message = this.i18n.translate(key);
    if (message !== key) return message;
    return this.i18n.translate('booking.error.default.message') || 
           'An error occurred with your booking. Please try again.';
  }

  startNewBooking(): void {
    this.router.navigate(['/services']);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}

