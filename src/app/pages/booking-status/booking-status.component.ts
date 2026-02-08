import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';
import { BookingService } from '../../core/services/booking.service';
import { ConfigService } from '../../core/services/config.service';

@Component({
  selector: 'app-booking-status',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <section class="py-24 bg-gray-50" style="margin-top: 70px;">
      <div class="container mx-auto px-6 max-w-2xl">
        <div class="luxury-card-alt p-10 text-center">
          <div *ngIf="loading" class="py-12">
            <svg class="animate-spin h-12 w-12 text-yellow-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-gray-600">{{ i18n.t$('booking.status.loading') | async }}</p>
          </div>

          <div *ngIf="!loading && bookingStatus">
            <!-- Status Icon -->
            <div class="mb-6">
              <div [ngClass]="getStatusIconClass()" class="w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <svg [ngClass]="getStatusIconSvgClass()" class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path *ngIf="bookingStatus.status === 'pending'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  <path *ngIf="bookingStatus.status === 'approved'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  <path *ngIf="bookingStatus.status === 'rejected'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  <path *ngIf="bookingStatus.status === 'completed'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>

            <!-- Status Title -->
            <h2 class="text-3xl font-serif font-bold text-gray-900 mb-4">
              {{ getStatusTitle() }}
            </h2>

            <!-- Booking ID -->
            <div class="bg-gray-50 p-4 rounded-lg mb-6">
              <p class="text-sm text-gray-600 mb-1">{{ i18n.t$('booking.status.bookingId') | async }}</p>
              <p class="text-lg font-mono font-bold text-gray-900">{{ bookingStatus.bookingId }}</p>
            </div>

            <!-- Status Message -->
            <p class="text-gray-700 mb-6 leading-relaxed">
              {{ bookingStatus.message }}
            </p>

            <!-- Invoice Section (when invoice is sent) -->
            <div *ngIf="hasInvoice()" class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
              <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Invoice Ready
              </h3>
              
              <p class="text-gray-700 mb-6">Please review your invoice and provide your feedback on the price and details.</p>
              
              <!-- Download Invoice Button -->
              <div class="mb-6">
                <a 
                  [href]="getInvoiceDownloadUrl()" 
                  target="_blank"
                  download
                  class="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  Download Invoice (Facture)
                </a>
              </div>

              <!-- Invoice Preview (Optional) -->
              <div class="bg-white rounded-lg p-4 mb-6 border border-gray-200">
                <p class="text-sm text-gray-600 mb-3 font-medium">Invoice Preview:</p>
                <iframe 
                  *ngIf="invoiceUrl && !loadingInvoice" 
                  [src]="invoiceUrl" 
                  class="w-full h-96 border border-gray-300 rounded"
                  style="min-height: 400px;">
                </iframe>
                <div *ngIf="!invoiceUrl && !loadingInvoice" class="text-center py-8 text-gray-500">
                  <p>Invoice preview not available. Please download the invoice to view it.</p>
                </div>
                <div *ngIf="loadingInvoice" class="text-center py-8">
                  <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p class="text-gray-600 mt-2">Loading invoice...</p>
                </div>
              </div>

              <!-- Invoice Feedback Actions -->
              <div class="border-t border-blue-300 pt-6">
                <p class="text-gray-700 mb-4 font-medium">Please provide your feedback on the invoice:</p>
                <div class="flex flex-col sm:flex-row gap-3">
                  <button
                    (click)="acceptInvoice()"
                    [disabled]="processing"
                    class="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span *ngIf="!processing">Accept Invoice</span>
                    <span *ngIf="processing">Processing...</span>
                  </button>
                  <button
                    (click)="showRejectModal = true"
                    [disabled]="processing"
                    class="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span>Reject Invoice</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Status Details -->
            <div class="bg-gray-50 p-6 rounded-lg mb-6 text-left">
              <h3 class="font-semibold text-gray-900 mb-4">{{ i18n.t$('booking.status.details') | async }}</h3>
              <div class="space-y-2 text-sm text-gray-700">
                <div class="flex justify-between">
                  <span class="font-medium">{{ i18n.t$('booking.status.created') | async }}</span>
                  <span>{{ formatDate(bookingStatus.createdAt) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium">{{ i18n.t$('booking.status.approved') | async }}</span>
                  <span>{{ formatDate(bookingStatus.approvedAt) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium">{{ i18n.t$('booking.status.expires') | async }}</span>
                  <span>{{ formatDate(bookingStatus.expiresAt) }}</span>
                </div>
                <div class="flex justify-between" *ngIf="bookingStatus.completedAt">
                  <span class="font-medium">{{ i18n.t$('booking.status.completed') | async }}</span>
                  <span>{{ formatDate(bookingStatus.completedAt) }}</span>
                </div>
                <div class="flex justify-between" *ngIf="bookingStatus.invoiceSentAt">
                  <span class="font-medium">Invoice Sent</span>
                  <span>{{ formatDate(bookingStatus.invoiceSentAt) }}</span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="space-y-3">
              <button
                *ngIf="bookingStatus.status === 'pending' || bookingStatus.status === 'pending_approval'"
                (click)="refreshStatus()"
                class="btn-primary w-full">
                {{ i18n.t$('booking.status.refresh') | async }}
              </button>
              <button
                (click)="goToHome()"
                class="btn-secondary w-full">
                {{ i18n.t$('booking.status.back_home') | async }}
              </button>
            </div>
          </div>

          <div *ngIf="!loading && error" class="py-12">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ i18n.t$('booking.status.error_title') | async }}</h3>
            <p class="text-gray-600 mb-6">{{ error }}</p>
            <button (click)="goToHome()" class="btn-primary">
              {{ i18n.t$('booking.status.back_home') | async }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Rejection Modal -->
    <div *ngIf="showRejectModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" (click)="closeRejectModal()">
      <div class="bg-white rounded-lg max-w-md w-full p-6" (click)="$event.stopPropagation()">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Reject Invoice</h3>
        <p class="text-gray-700 mb-4">Please provide a reason for rejecting this invoice:</p>
        <textarea
          [(ngModel)]="rejectionReason"
          placeholder="Enter rejection reason..."
          class="w-full p-3 border border-gray-300 rounded-lg mb-4 min-h-24"
          rows="4">
        </textarea>
        <div class="flex gap-3">
          <button
            (click)="closeRejectModal()"
            class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors">
            Cancel
          </button>
          <button
            (click)="rejectInvoice()"
            [disabled]="!rejectionReason || processing"
            class="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            Reject
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class BookingStatusComponent implements OnInit {
  bookingStatus: any = null;
  loading = true;
  error: string | null = null;
  bookingId: string = '';
  invoiceUrl: string | null = null;
  loadingInvoice = false;
  showRejectModal = false;
  rejectionReason = '';
  processing = false;
  apiBaseUrl = '';

  constructor(
    public i18n: I18nService,
    private bookingService: BookingService,
    private configService: ConfigService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.configService.loadConfig().subscribe(config => {
      this.apiBaseUrl = config.backend?.apiUrl || 'http://10.73.139.207:8080';
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.bookingId = params['bookingId'];
      if (this.bookingId) {
        this.loadStatus();
      } else {
        this.error = this.i18n.translate('booking.status.no_booking_id');
        this.loading = false;
      }
    });
  }

  loadStatus(): void {
    this.loading = true;
    this.error = null;

    this.bookingService.getBookingStatus(this.bookingId).subscribe({
      next: (status) => {
        this.bookingStatus = status;
        this.loading = false;
        
        // Load invoice if status is invoice_sent
        if (this.isInvoiceSent()) {
          this.loadInvoice();
        }
      },
      error: (err) => {
        console.error('Error loading booking status:', err);
        this.error = this.i18n.translate('booking.status.load_error') || 'Failed to load booking status';
        this.loading = false;
      }
    });
  }

  isInvoiceSent(): boolean {
    if (!this.bookingStatus) return false;
    const status = this.bookingStatus.status?.toLowerCase() || '';
    // Check for various possible status formats
    return status === 'invoice_sent' || 
           status === 'invoicesent' ||
           status.includes('invoice_sent') ||
           status.includes('invoicesent') ||
           (status.includes('invoice') && status.includes('sent'));
  }

  hasInvoice(): boolean {
    if (!this.bookingStatus) return false;
    // Show invoice section if status is invoice_sent OR if invoice data exists
    return this.isInvoiceSent() || !!(this.bookingStatus.invoiceFilePath && this.bookingStatus.invoiceFileName);
  }

  loadInvoice(): void {
    if (!this.bookingId) return;
    
    this.loadingInvoice = true;
    // Build the invoice URL directly
    this.configService.loadConfig().subscribe({
      next: (config) => {
        const apiUrl = config.backend?.apiUrl || 'http://10.73.139.207:8080';
        this.invoiceUrl = `${apiUrl}/api/v1/bookings/${this.bookingId}/invoice/download`;
        this.loadingInvoice = false;
      },
      error: (err) => {
        console.error('Error loading config:', err);
        // Fallback to default URL from config
        this.invoiceUrl = `http://10.73.139.207:8080/api/v1/bookings/${this.bookingId}/invoice/download`;
        this.loadingInvoice = false;
      }
    });
  }

  getInvoiceDownloadUrl(): string {
    return this.invoiceUrl || `${this.apiBaseUrl}/api/v1/bookings/${this.bookingId}/invoice/download`;
  }

  acceptInvoice(): void {
    if (this.processing) return;
    
    this.processing = true;
    this.bookingService.acceptInvoice(this.bookingId).subscribe({
      next: (response) => {
        console.log('Invoice accepted:', response);
        // Reload status to show updated state
        this.loadStatus();
        this.processing = false;
        // Show success message
        alert('Invoice accepted successfully! Your booking is now confirmed.');
      },
      error: (err) => {
        console.error('Error accepting invoice:', err);
        this.processing = false;
        alert('Failed to accept invoice. Please try again.');
      }
    });
  }

  rejectInvoice(): void {
    if (this.processing || !this.rejectionReason.trim()) return;
    
    this.processing = true;
    this.bookingService.rejectInvoice(this.bookingId, this.rejectionReason.trim()).subscribe({
      next: (response) => {
        console.log('Invoice rejected:', response);
        // Close modal and reload status
        this.closeRejectModal();
        this.loadStatus();
        this.processing = false;
        // Show success message
        alert('Invoice rejected. We will contact you to resolve this issue.');
      },
      error: (err) => {
        console.error('Error rejecting invoice:', err);
        this.processing = false;
        alert('Failed to reject invoice. Please try again.');
      }
    });
  }

  closeRejectModal(): void {
    this.showRejectModal = false;
    this.rejectionReason = '';
  }

  refreshStatus(): void {
    this.loadStatus();
  }

  getStatusTitle(): string {
    if (!this.bookingStatus) return '';
    // Normalize status: convert "PENDING_APPROVAL" -> "pending", "APPROVED" -> "approved", etc.
    const status = this.normalizeStatus(this.bookingStatus.status);
    const translationKey = `booking.status.${status}`;
    const translated = this.i18n.translate(translationKey);
    return translated || this.bookingStatus.status;
  }

  normalizeStatus(status: string): string {
    if (!status) return '';
    // Convert to lowercase
    const normalized = status.toLowerCase();
    
    // Map common status values to translation keys
    // Handle formats like "PENDING_APPROVAL", "pending_approval", "PENDING", etc.
    if (normalized.includes('pending')) return 'pending';
    if (normalized.includes('approved')) return 'approved';
    if (normalized.includes('rejected')) return 'rejected';
    if (normalized.includes('completed')) return 'completed';
    
    // If no match, return the normalized status (without underscores for simple cases)
    return normalized.replace(/_/g, '');
  }

  getStatusIconClass(): string {
    if (!this.bookingStatus) return 'bg-gray-100';
    const status = this.bookingStatus.status.toLowerCase();
    switch (status) {
      case 'pending':
        return 'bg-yellow-100';
      case 'approved':
        return 'bg-green-100';
      case 'rejected':
        return 'bg-red-100';
      case 'completed':
        return 'bg-blue-100';
      default:
        return 'bg-gray-100';
    }
  }

  getStatusIconSvgClass(): string {
    if (!this.bookingStatus) return 'text-gray-600';
    const status = this.bookingStatus.status.toLowerCase();
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      case 'completed':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  }

  formatDate(dateInput: string | Date | undefined | null): string {
    if (!dateInput) return '-';
    
    try {
      let date: Date;
      
      // Handle different input types
      if (dateInput instanceof Date) {
        date = dateInput;
      } else if (typeof dateInput === 'string') {
        // Handle ISO date strings from backend (e.g., "2025-12-20T14:30:00" or "2025-12-20T14:30:00.123Z")
        // Also handle format without timezone: "2025-12-20T14:30:00"
        if (dateInput.includes('T')) {
          // If no timezone, treat as local time
          if (!dateInput.includes('Z') && !dateInput.includes('+') && !dateInput.includes('-', 10)) {
            date = new Date(dateInput + 'Z'); // Add Z to treat as UTC
          } else {
            date = new Date(dateInput);
          }
        } else {
          date = new Date(dateInput);
        }
      } else {
        console.warn('Unexpected date input type:', typeof dateInput, dateInput);
        return '-';
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateInput);
        return '-';
      }
      
      // Format according to locale
      const locale = this.i18n.getLanguage() === 'fr' ? 'fr-FR' : 'en-US';
      return date.toLocaleString(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', dateInput, error);
      return '-';
    }
  }

  goToHome(): void {
    // Use replaceUrl to prevent back navigation to this page
    this.router.navigate(['/'], { replaceUrl: true });
  }
}

