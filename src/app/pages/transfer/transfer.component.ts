import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { I18nService } from '../../core/services/i18n.service';
import { FormService } from '../../core/services/form.service';
import { BookingService } from '../../core/services/booking.service';
import { BookingStateService } from '../../core/services/booking-state.service';
import { FlightService, FlightInfo } from '../../core/services/flight.service';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { Subject, of } from 'rxjs';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <!-- Hero Section -->
    <section class="page-hero-section relative h-[500px] flex items-start justify-center bg-gray-900 overflow-hidden w-full pt-12 sm:pt-16 md:pt-20" style="margin-top: 70px; width: 100vw; margin-left: calc(-50vw + 50%);">
      <div class="absolute inset-0 bg-black opacity-60 z-10"></div>
      <div class="absolute inset-0 bg-center" style="background-image: url('assets/images/banner.png'); background-size: 150%; background-position: 40% center; background-repeat: no-repeat;"></div>
      <div class="container mx-auto px-4 sm:px-6 z-20 text-center">
        <h1 class="text-5xl md:text-6xl font-serif font-extrabold text-white mb-6 leading-tight tracking-wide">{{ i18n.t$('transfer.hero.title') | async }}</h1>
        <p class="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">{{ i18n.t$('transfer.hero.subtitle') | async }}</p>
      </div>
    </section>

    <!-- Service Details -->
    <section class="py-24 bg-gray-50">
      <div class="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div class="grid md:grid-cols-2 gap-16">
          <div>
            <h2 class="text-4xl font-serif font-bold mb-8 text-gray-900 section-heading">{{ i18n.t$('transfer.details.title') | async }}</h2>
            <div class="luxury-card p-8">
              <p class="text-lg text-gray-700 mb-6 leading-relaxed">{{ i18n.t$('transfer.details.intro') | async }}</p>
              <ul class="space-y-4 mb-6">
                <li class="flex items-start">
                  <svg class="w-6 h-6 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-gray-700 leading-relaxed">{{ i18n.t$('transfer.details.feature1') | async }}</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-6 h-6 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-gray-700 leading-relaxed">{{ i18n.t$('transfer.details.feature2') | async }}</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-6 h-6 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-gray-700 leading-relaxed">{{ i18n.t$('transfer.details.feature3') | async }}</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-6 h-6 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-gray-700 leading-relaxed">{{ i18n.t$('transfer.details.feature4') | async }}</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-6 h-6 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-gray-700 leading-relaxed">{{ i18n.t$('transfer.details.feature5') | async }}</span>
                </li>
              </ul>
              <p class="text-gray-700 leading-relaxed">{{ i18n.t$('transfer.details.closing') | async }}</p>
            </div>
          </div>

          <div>
            <div class="luxury-card-alt p-10 sticky top-8">
              <h3 class="text-3xl font-serif font-bold mb-8 text-gray-900">{{ i18n.t$('transfer.form.title') | async }}</h3>

              <form [formGroup]="transferForm" (ngSubmit)="onSubmit()" class="space-y-6">
                <!-- Basic Info Section (read-only if token exists) -->
                <div *ngIf="hasToken" class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p class="text-sm text-blue-800 mb-4">
                    <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {{ i18n.t$('booking.gateway1.success.message') | async }}
                  </p>
                </div>

                <div>
                  <label for="name" class="block text-sm font-semibold mb-3 text-gray-900">{{ i18n.t$('transfer.form.name') | async }}</label>
                  <input type="text" id="name" formControlName="name" class="form-input w-full" [readonly]="hasToken" [class.bg-gray-50]="hasToken">
                </div>

                <div>
                  <label for="email" class="block text-sm font-semibold mb-3 text-gray-900">{{ i18n.t$('transfer.form.email') | async }}</label>
                  <input type="email" id="email" formControlName="email" class="form-input w-full" [readonly]="hasToken" [class.bg-gray-50]="hasToken">
                </div>

                <div>
                  <label for="phone" class="block text-sm font-semibold mb-3 text-gray-900">{{ i18n.t$('transfer.form.phone') | async }}</label>
                  <input type="tel" id="phone" formControlName="phone" class="form-input w-full" [readonly]="hasToken" [class.bg-gray-50]="hasToken">
                </div>

                <div>
                  <label for="date" class="block text-sm font-semibold mb-3 text-gray-900">{{ i18n.t$('transfer.form.date') | async }}</label>
                  <input type="date" id="date" formControlName="date" class="form-input w-full">
                </div>

                <div>
                  <label for="time" class="block text-sm font-semibold mb-3 text-gray-900">{{ i18n.t$('transfer.form.time') | async }}</label>
                  <input type="time" id="time" formControlName="time" class="form-input w-full">
                </div>

                <div>
                  <label for="flight" class="block text-sm font-semibold mb-3 text-gray-900">{{ i18n.t$('transfer.form.flight') | async }}</label>
                  <div class="relative">
                    <input type="text" id="flight" formControlName="flight" 
                      [placeholder]="(i18n.t$('transfer.form.flight_placeholder') | async)" 
                      class="form-input w-full"
                      (blur)="onFlightNumberBlur()">
                    <div *ngIf="isLoadingFlight" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg class="animate-spin h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </div>
                  <div *ngIf="flightInfo" class="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div class="flex items-start">
                      <svg class="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <div class="flex-1">
                        <p class="text-sm font-semibold text-green-900 mb-2">{{ i18n.t$('transfer.form.flight_found') | async }}</p>
                        <div class="text-sm text-green-800 space-y-1">
                          <p><strong>{{ i18n.t$('transfer.form.airline') | async }}</strong> {{ flightInfo.airline }}</p>
                          <p><strong>{{ i18n.t$('transfer.form.departure') | async }}</strong> {{ flightInfo.departure.airport }} ({{ flightInfo.departure.iata }})</p>
                          <p *ngIf="flightInfo.departure.scheduled"><strong>{{ i18n.t$('transfer.form.departure_time') | async }}</strong> {{ formatDateTime(flightInfo.departure.scheduled) }}</p>
                          <p><strong>{{ i18n.t$('transfer.form.arrival') | async }}</strong> {{ flightInfo.arrival.airport }} ({{ flightInfo.arrival.iata }})</p>
                          <p *ngIf="flightInfo.arrival.scheduled"><strong>{{ i18n.t$('transfer.form.arrival_time') | async }}</strong> {{ formatDateTime(flightInfo.arrival.scheduled) }}</p>
                          <div *ngIf="flightInfo.arrival.terminal || flightInfo.arrival.gate" class="mt-2 pt-2 border-t border-green-300">
                            <p *ngIf="flightInfo.arrival.terminal" class="font-semibold"><strong>{{ i18n.t$('transfer.form.terminal') | async }}</strong> {{ flightInfo.arrival.terminal }}</p>
                            <p *ngIf="flightInfo.arrival.gate" class="font-semibold"><strong>{{ i18n.t$('transfer.form.gate') | async }}</strong> {{ flightInfo.arrival.gate }}</p>
                          </div>
                          <p class="mt-2"><strong>{{ i18n.t$('transfer.form.status') | async }}</strong> 
                            <span class="capitalize px-2 py-1 rounded text-xs font-semibold"
                                  [class.bg-green-200]="flightInfo.status === 'active' || flightInfo.status === 'scheduled'"
                                  [class.bg-yellow-200]="flightInfo.status === 'delayed'"
                                  [class.bg-red-200]="flightInfo.status === 'cancelled'"
                                  [class.text-green-800]="flightInfo.status === 'active' || flightInfo.status === 'scheduled'"
                                  [class.text-yellow-800]="flightInfo.status === 'delayed'"
                                  [class.text-red-800]="flightInfo.status === 'cancelled'">
                              {{ flightInfo.status }}
                            </span>
                          </p>
                        </div>
                        <button type="button" (click)="useFlightInfo()" 
                          class="mt-3 text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded transition-colors">
                          {{ i18n.t$('transfer.form.use_info') | async }}
                        </button>
                      </div>
                    </div>
                  </div>
                  <p *ngIf="flightError" class="mt-2 text-sm text-red-600">
                    {{ flightError }}
                  </p>
                </div>

                <!-- Fields revealed when flight info is found - auto-fillable fields that facilitate the process -->
                <div *ngIf="flightInfo" class="space-y-6 pt-4 border-t border-gray-200">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label for="terminal" class="block text-sm font-semibold mb-3 text-gray-900">{{ i18n.t$('transfer.form.terminal') | async }}</label>
                      <input type="text" id="terminal" formControlName="terminal" 
                        [placeholder]="(i18n.t$('transfer.form.terminal_placeholder') | async)"
                        class="form-input w-full"
                        [class.bg-gray-50]="!!flightInfo.arrival.terminal"
                        [readonly]="!!flightInfo.arrival.terminal">
                      <p *ngIf="flightInfo.arrival.terminal" class="mt-1 text-xs text-gray-500">
                        {{ i18n.t$('transfer.form.auto_filled') | async }}
                      </p>
                    </div>

                    <div>
                      <label for="gate" class="block text-sm font-semibold mb-3 text-gray-900">{{ i18n.t$('transfer.form.gate') | async }}</label>
                      <input type="text" id="gate" formControlName="gate" 
                        [placeholder]="(i18n.t$('transfer.form.gate_placeholder') | async)"
                        class="form-input w-full"
                        [class.bg-gray-50]="!!flightInfo.arrival.gate"
                        [readonly]="!!flightInfo.arrival.gate">
                      <p *ngIf="flightInfo.arrival.gate" class="mt-1 text-xs text-gray-500">
                        {{ i18n.t$('transfer.form.auto_filled') | async }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Manual entry fields when flight is not found -->
                <div *ngIf="!flightInfo && flightSearchAttempted && !isLoadingFlight" class="space-y-6 pt-4 border-t border-gray-200">
                  <p class="text-sm text-gray-700 mb-4 font-semibold">
                    {{ i18n.t$('transfer.form.manual_entry_required') | async }}
                  </p>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label for="terminal" class="block text-sm font-semibold mb-3 text-gray-900">{{ i18n.t$('transfer.form.terminal') | async }}</label>
                      <input type="text" id="terminal" formControlName="terminal" 
                        [placeholder]="(i18n.t$('transfer.form.terminal_placeholder') | async)"
                        class="form-input w-full">
                    </div>

                    <div>
                      <label for="gate" class="block text-sm font-semibold mb-3 text-gray-900">{{ i18n.t$('transfer.form.gate') | async }}</label>
                      <input type="text" id="gate" formControlName="gate" 
                        [placeholder]="(i18n.t$('transfer.form.gate_placeholder') | async)"
                        class="form-input w-full">
                    </div>
                  </div>

                  <div>
                    <label for="arrivalAirport" class="block text-sm font-semibold mb-3 text-gray-900">{{ i18n.t$('transfer.form.arrival_airport') | async }}</label>
                    <input type="text" id="arrivalAirport" formControlName="arrivalAirport" 
                      [placeholder]="(i18n.t$('transfer.form.arrival_airport_placeholder') | async)"
                      class="form-input w-full">
                  </div>
                </div>

                <!-- Additional fields that users can predict - shown when flight is found or search was attempted -->
                <div *ngIf="flightInfo || flightSearchAttempted" class="space-y-6 pt-4 border-t border-gray-200">
                  <div>
                    <label for="pickupLocation" class="block text-sm font-semibold mb-3 text-gray-900">{{ i18n.t$('transfer.form.pickup_location') | async }}</label>
                    <input type="text" id="pickupLocation" formControlName="pickupLocation" 
                      [placeholder]="(i18n.t$('transfer.form.pickup_location_placeholder') | async)"
                      class="form-input w-full">
                    <p class="mt-1 text-xs text-gray-500">
                      {{ i18n.t$('transfer.form.pickup_location_hint') | async }}
                    </p>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label for="passengers" class="block text-sm font-semibold mb-3 text-gray-900">{{ i18n.t$('transfer.form.passengers') | async }}</label>
                      <input type="number" id="passengers" formControlName="passengers" 
                        min="1" max="20"
                        [placeholder]="(i18n.t$('transfer.form.passengers_placeholder') | async)"
                        class="form-input w-full">
                    </div>

                    <div>
                      <label for="luggage" class="block text-sm font-semibold mb-3 text-gray-900">{{ i18n.t$('transfer.form.luggage') | async }}</label>
                      <input type="number" id="luggage" formControlName="luggage" 
                        min="0" max="20"
                        [placeholder]="(i18n.t$('transfer.form.luggage_placeholder') | async)"
                        class="form-input w-full">
                    </div>
                  </div>

                  <div>
                    <label for="dropoffAddress" class="block text-sm font-semibold mb-3 text-gray-900">{{ i18n.t$('transfer.form.dropoff_address') | async }}</label>
                    <input type="text" id="dropoffAddress" formControlName="dropoffAddress" 
                      [placeholder]="(i18n.t$('transfer.form.dropoff_address_placeholder') | async)"
                      class="form-input w-full">
                  </div>
                </div>

                <div>
                  <label for="notes" class="block text-sm font-semibold mb-3 text-gray-900">{{ i18n.t$('transfer.form.notes') | async }}</label>
                  <textarea id="notes" rows="3" formControlName="notes" class="form-input w-full"></textarea>
                </div>

                <button type="submit" [disabled]="!transferForm.valid || isSubmitting"
                  class="btn-primary w-full">
                  {{ isSubmitting ? (i18n.t$('transfer.form.sending') | async) : (i18n.t$('transfer.form.book') | async) }}
                </button>
                <div *ngIf="submitSuccess" class="mt-4 text-green-600 text-center font-semibold">
                  {{ i18n.t$('contact.form.success') | async }}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }

    .container {
      max-width: 1200px;
    }
  `]
})
export class TransferComponent implements OnInit, OnDestroy {
  transferForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  flightInfo: FlightInfo | null = null;
  isLoadingFlight = false;
  flightError: string | null = null;
  flightSearchAttempted = false; // Track if user has attempted a search
  private flightSearchSubject = new Subject<string>();
  
  // Token-based booking
  bookingToken: string | null = null;
  bookingId: string | null = null;
  clientInfo: any = null;
  hasToken = false;

  constructor(
    public i18n: I18nService,
    private fb: FormBuilder,
    private formService: FormService,
    private bookingService: BookingService,
    private bookingState: BookingStateService,
    private flightService: FlightService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.transferForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      flight: [''],
      terminal: [''],
      gate: [''],
      arrivalAirport: [''],
      passengers: [''],
      luggage: [''],
      pickupLocation: [''],
      dropoffAddress: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    // Check for token in query params (from guard)
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.bookingToken = token;
        this.hasToken = true;
        // Get booking data from booking state service (set by guard)
        const bookingData = this.bookingState.getBookingData();
        if (bookingData) {
          this.bookingId = bookingData.bookingId || null;
          this.clientInfo = bookingData.clientInfo;
          if (this.clientInfo) {
            // Pre-populate form with client info
            this.transferForm.patchValue({
              name: this.clientInfo.fullName,
              email: this.clientInfo.email,
              phone: this.clientInfo.phone
            });
            // Make basic fields read-only
            this.transferForm.get('name')?.disable();
            this.transferForm.get('email')?.disable();
            this.transferForm.get('phone')?.disable();
          }
        }
      }
    });

    // Debounce flight number search
    this.flightSearchSubject.pipe(
      debounceTime(1000), // Wait 1 second after user stops typing
      distinctUntilChanged(),
      switchMap(flightNumber => {
        if (flightNumber && flightNumber.length >= 3) {
          this.isLoadingFlight = true;
          this.flightError = null;
          this.flightSearchAttempted = true; // Mark that search was attempted
          const date = this.transferForm.get('date')?.value;
          return this.flightService.getFlightInfo(flightNumber, date).pipe(
            catchError(error => {
              this.isLoadingFlight = false;
              this.flightSearchAttempted = true; // Mark search attempted even on error
              if (error.status === 401) {
                this.flightError = this.i18n.translate('transfer.form.errors.api_invalid');
              } else if (error.status === 429) {
                this.flightError = this.i18n.translate('transfer.form.errors.rate_limit');
              } else {
                this.flightError = this.i18n.translate('transfer.form.errors.flight_error');
              }
              console.error('Flight search error:', error);
              return of(null);
            })
          );
        }
        return of(null);
      })
    ).subscribe({
      next: (info) => {
        this.isLoadingFlight = false;
        this.flightInfo = info;
        this.flightSearchAttempted = true; // Mark search attempted
        if (info) {
          // Auto-fill terminal and gate if available from API
          this.transferForm.patchValue({
            terminal: info.arrival.terminal || '',
            gate: info.arrival.gate || ''
          });
        } else {
          const flightNumber = this.transferForm.get('flight')?.value;
          if (flightNumber && flightNumber.length >= 3) {
            this.flightError = this.i18n.translate('transfer.form.errors.flight_not_found');
          }
        }
      },
        error: (error) => {
          this.isLoadingFlight = false;
          this.flightSearchAttempted = true; // Mark search attempted even on error
          this.flightError = this.i18n.translate('transfer.form.errors.flight_error');
          console.error('Flight search error:', error);
        }
    });

    // Watch for flight number changes
    this.transferForm.get('flight')?.valueChanges.subscribe(value => {
      if (value) {
        this.flightSearchSubject.next(value);
      } else {
        this.flightInfo = null;
        this.flightError = null;
        this.flightSearchAttempted = false; // Reset when flight number is cleared
      }
    });
  }

  ngOnDestroy(): void {
    this.flightSearchSubject.complete();
  }

  onFlightNumberBlur(): void {
    const flightNumber = this.transferForm.get('flight')?.value;
    if (flightNumber && !this.flightInfo) {
      this.flightSearchSubject.next(flightNumber);
    }
  }

      useFlightInfo(): void {
        if (this.flightInfo) {
          // Auto-fill date and time from flight info
          if (this.flightInfo.arrival.scheduled) {
            const arrivalDate = new Date(this.flightInfo.arrival.scheduled);
            const dateStr = arrivalDate.toISOString().split('T')[0];
            const timeStr = arrivalDate.toTimeString().slice(0, 5);
            this.transferForm.patchValue({
              date: dateStr,
              time: timeStr
            });
          }
          
          // Auto-fill terminal and gate if available
          this.transferForm.patchValue({
            terminal: this.flightInfo.arrival.terminal || '',
            gate: this.flightInfo.arrival.gate || ''
          });
          
          // Add flight details to notes if not already present
          const currentNotes = this.transferForm.get('notes')?.value || '';
          const flightDetails = [
            `Vol: ${this.flightInfo.flightNumber}`,
            `Compagnie: ${this.flightInfo.airline}`,
            `Départ: ${this.flightInfo.departure.airport} (${this.flightInfo.departure.iata})`,
            `Arrivée: ${this.flightInfo.arrival.airport} (${this.flightInfo.arrival.iata})`,
            this.flightInfo.arrival.terminal ? `Terminal: ${this.flightInfo.arrival.terminal}` : '',
            this.flightInfo.arrival.gate ? `Porte: ${this.flightInfo.arrival.gate}` : '',
            `Statut: ${this.flightInfo.status}`
          ].filter(Boolean).join('\n');
          
          if (!currentNotes.includes('Vol:')) {
            this.transferForm.patchValue({
              notes: currentNotes ? `${currentNotes}\n\n${flightDetails}` : flightDetails
            });
          }
        }
      }

  formatDateTime(dateTimeString: string): string {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  onSubmit(): void {
    if (this.transferForm.valid) {
      this.isSubmitting = true;
      
      // Prepare flight information if available
      const flightData = this.flightInfo ? {
        flightNumber: this.flightInfo.flightNumber,
        airline: this.flightInfo.airline,
        departure: {
          airport: this.flightInfo.departure.airport,
          iata: this.flightInfo.departure.iata,
          scheduled: this.flightInfo.departure.scheduled,
          terminal: this.flightInfo.departure.terminal,
          gate: this.flightInfo.departure.gate
        },
        arrival: {
          airport: this.flightInfo.arrival.airport,
          iata: this.flightInfo.arrival.iata,
          scheduled: this.flightInfo.arrival.scheduled,
          terminal: this.flightInfo.arrival.terminal,
          gate: this.flightInfo.arrival.gate
        },
        status: this.flightInfo.status,
        aircraft: this.flightInfo.aircraft
      } : null;
      
      // If token exists, use booking service (Gateway 2)
      if (this.hasToken && this.bookingToken && this.bookingId) {
        const serviceDetails = {
          date: this.transferForm.get('date')?.value,
          time: this.transferForm.get('time')?.value,
          flight: this.transferForm.get('flight')?.value,
          terminal: this.transferForm.get('terminal')?.value,
          gate: this.transferForm.get('gate')?.value,
          arrivalAirport: this.transferForm.get('arrivalAirport')?.value,
          passengers: this.transferForm.get('passengers')?.value,
          luggage: this.transferForm.get('luggage')?.value,
          pickupLocation: this.transferForm.get('pickupLocation')?.value,
          dropoffAddress: this.transferForm.get('dropoffAddress')?.value,
          notes: this.transferForm.get('notes')?.value,
          flightInfo: flightData
        };
        
        this.bookingService.completeBooking(this.bookingId, this.bookingToken, serviceDetails).subscribe({
          next: (response) => {
            this.isSubmitting = false;
            this.submitSuccess = true;
            // Redirect to success page or show confirmation
            setTimeout(() => {
              this.router.navigate(['/booking-status', this.bookingId]);
            }, 2000);
          },
          error: (error) => {
            this.isSubmitting = false;
            console.error('Booking completion error:', error);
            alert(this.i18n.translate('transfer.form.errors.submit_error'));
          }
        });
      } else {
        // Fallback to old form service (direct booking without token)
        const formData = {
          ...this.transferForm.value,
          subject: 'Airport Transfer Request',
          message: `Transfer request for ${this.transferForm.value.date} at ${this.transferForm.value.time}. Flight: ${this.transferForm.value.flight || 'N/A'}. Notes: ${this.transferForm.value.notes || 'None'}`,
          flightInfo: flightData
        };
        
        this.formService.submitTransferForm(formData).subscribe({
          next: (response) => {
            this.isSubmitting = false;
            this.submitSuccess = true;
            this.transferForm.reset();
            setTimeout(() => this.submitSuccess = false, 5000);
          },
          error: (error) => {
            this.isSubmitting = false;
            console.error('Form submission error:', error);
            alert(this.i18n.translate('transfer.form.errors.submit_error'));
          }
        });
      }
    }
  }
}
