import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { I18nService } from '../../core/services/i18n.service';
import { ConfigService } from '../../core/services/config.service';
import type { AppConfig } from '../../core/services/config.service';
import { BookingService, InitialBookingRequest } from '../../core/services/booking.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule
  ],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  bookingForm: FormGroup;
  serviceType: string = '';
  isSubmitting = false;
  submitSuccess = false;
  submitError: string | null = null;
  bookingId: string | null = null;
  preferredContactAtSubmit: string | null = null;
  config: AppConfig | null = null;

  constructor(
    public i18n: I18nService,
    private fb: FormBuilder,
    private bookingService: BookingService,
    private configService: ConfigService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.bookingForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      preferredContact: ['', [Validators.required]],
      serviceType: ['']
    });
  }

  ngOnInit(): void {
    this.configService.loadConfig().subscribe(c => (this.config = c));

    // Get service type from query params or route
    this.route.queryParams.subscribe(params => {
      this.serviceType = params['service'] || '';
      if (this.serviceType) {
        this.bookingForm.patchValue({ serviceType: this.serviceType });
      }
    });

    // If no service type, try to get from route param
    if (!this.serviceType) {
      this.route.params.subscribe(params => {
        this.serviceType = params['serviceType'] || '';
        if (this.serviceType) {
          this.bookingForm.patchValue({ serviceType: this.serviceType });
        }
      });
    }

    // If still no service type, redirect to services page
    if (!this.serviceType) {
      this.router.navigate(['/services']);
    }
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      this.isSubmitting = true;
      this.submitError = null;

      const request: InitialBookingRequest = {
        fullName: this.bookingForm.value.fullName,
        email: this.bookingForm.value.email,
        phone: this.bookingForm.value.phone,
        preferredContact: this.bookingForm.value.preferredContact,
        serviceType: this.serviceType
      };

      console.log('Submitting booking request:', request);
      this.bookingService.submitInitialRequest(request).subscribe({
        next: (response) => {
          console.log('Booking submission successful:', response);
          this.isSubmitting = false;
          this.bookingId = response.bookingId;
          this.preferredContactAtSubmit = this.bookingForm.value.preferredContact ?? null;
          if (!this.config) {
            this.config = this.configService.getConfig();
          }
          this.submitSuccess = true;
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Booking submission error:', error);
          console.error('Error details:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            url: error.url
          });
          this.submitError = this.i18n.translate('booking.gateway1.errors.submit_error') ||
            'An error occurred while submitting your request. Please try again.';
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.bookingForm.controls).forEach(key => {
        this.bookingForm.get(key)?.markAsTouched();
      });
    }
  }

  goToHome(): void {
    this.preferredContactAtSubmit = null;
    this.submitSuccess = false;
    this.router.navigate(['/'], { replaceUrl: true });
  }

  /** Open WhatsApp in new tab and close the modal (used when WhatsApp block is the only CTA). */
  openWhatsAppAndClose(): void {
    window.open(this.getWhatsAppUrl(), '_blank', 'noopener,noreferrer');
    this.goToHome();
  }

  /** Show "check email" + WhatsApp button when agent mode is off and user chose WhatsApp. */
  get showWhatsAppButtonBlock(): boolean {
    return (
      this.submitSuccess === true &&
      this.preferredContactAtSubmit === 'whatsapp' &&
      this.config?.whatsapp?.whatsAppAgentModeEnabled === false
    );
  }

  getWhatsAppUrl(): string {
    const whatsapp = this.config?.whatsapp;
    if (!whatsapp?.number) {
      return 'https://wa.me/';
    }
    const digits = whatsapp.number.replace(/\D/g, '');
    const defaultMsg = whatsapp.defaultMessage || 'Bonjour, demande de réservation via ktransport.online — je souhaite confirmer ou compléter ma réservation.';
    let text = defaultMsg;
    if (this.bookingId) {
      text += ` Réf. demande : ${this.bookingId}`;
    }
    return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
  }
}

