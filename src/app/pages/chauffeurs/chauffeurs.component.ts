import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { I18nService } from '../../core/services/i18n.service';
import { FormService } from '../../core/services/form.service';

@Component({
  selector: 'app-chauffeurs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  template: `
    <!-- Hero Section -->
    <section class="relative h-[500px] flex items-start justify-center bg-gray-900 overflow-hidden w-full pt-12 sm:pt-16 md:pt-20" style="margin-top: 70px; width: 100vw; margin-left: calc(-50vw + 50%);">
      <div class="absolute inset-0 bg-black opacity-60 z-10"></div>
      <div class="absolute inset-0 bg-center" style="background-image: url('assets/images/banner.png'); background-size: 150%; background-position: 40% center; background-repeat: no-repeat;"></div>
      <div class="container mx-auto px-6 z-20 text-center">
        <h1 class="text-5xl md:text-6xl font-serif font-extrabold text-white mb-6 leading-tight tracking-wide">{{ i18n.t$('chauffeur.hero.title') | async }}</h1>
        <p class="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">{{ i18n.t$('chauffeur.hero.subtitle') | async }}</p>
      </div>
    </section>

    <!-- Service Details -->
    <section class="py-24 bg-gray-50">
      <div class="container mx-auto px-6 max-w-6xl">
        <div class="grid md:grid-cols-2 gap-16">
          <div>
            <h2 class="text-4xl font-serif font-bold mb-8 text-gray-900 section-heading">{{ i18n.t$('chauffeur.details.title') | async }}</h2>
            <div class="luxury-card p-8">
              <p>{{ i18n.t$('chauffeur.details.intro') | async }}</p>
              <ul>
                <li>{{ i18n.t$('chauffeur.details.feature1') | async }}</li>
                <li>{{ i18n.t$('chauffeur.details.feature2') | async }}</li>
                <li>{{ i18n.t$('chauffeur.details.feature3') | async }}</li>
                <li>{{ i18n.t$('chauffeur.details.feature4') | async }}</li>
                <li>{{ i18n.t$('chauffeur.details.feature5') | async }}</li>
              </ul>
            </div>
          </div>

          <div>
            <div class="bg-gray-50 p-6 rounded-xl sticky top-8">
              <h3 class="text-2xl font-serif font-bold mb-6">{{ i18n.t$('chauffeur.form.title') | async }}</h3>

              <form [formGroup]="chauffeurForm" (ngSubmit)="onSubmit()" class="space-y-4">
                <div>
                  <label for="service-type" class="block text-gray-700 mb-2">{{ i18n.t$('chauffeur.form.service_type') | async }}</label>
                  <select id="service-type" formControlName="serviceType"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    (change)="onServiceTypeChange()">
                    <option value="occasional">{{ i18n.t$('chauffeur.form.service_occasional') | async }}</option>
                    <option value="regular">{{ i18n.t$('chauffeur.form.service_regular') | async }}</option>
                    <option value="long">{{ i18n.t$('chauffeur.form.service_long') | async }}</option>
                  </select>
                </div>

                <div *ngIf="showOccasionalFields" id="occasional-fields">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label for="start-date" class="block text-gray-700 mb-2">{{ i18n.t$('chauffeur.form.date') | async }}</label>
                      <input type="date" id="start-date" formControlName="startDate"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
                    </div>

                    <div>
                      <label for="duration" class="block text-gray-700 mb-2">{{ i18n.t$('chauffeur.form.duration') | async }}</label>
                      <select id="duration" formControlName="duration"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
                        <option value="4">{{ i18n.t$('chauffeur.form.duration_4') | async }}</option>
                        <option value="8">{{ i18n.t$('chauffeur.form.duration_8') | async }}</option>
                        <option value="12">{{ i18n.t$('chauffeur.form.duration_12') | async }}</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div *ngIf="showRegularFields" id="regular-fields">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label for="start-date-regular" class="block text-gray-700 mb-2">{{ i18n.t$('chauffeur.form.start_date') | async }}</label>
                      <input type="date" id="start-date-regular" formControlName="startDateRegular"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
                    </div>

                    <div>
                      <label for="end-date-regular" class="block text-gray-700 mb-2">{{ i18n.t$('chauffeur.form.end_date') | async }}</label>
                      <input type="date" id="end-date-regular" formControlName="endDateRegular"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
                    </div>
                  </div>

                  <div>
                    <label for="daily-hours" class="block text-gray-700 mb-2">{{ i18n.t$('chauffeur.form.daily_hours') | async }}</label>
                    <input type="number" id="daily-hours" formControlName="dailyHours" min="1" max="12" value="8"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
                  </div>
                </div>

                <div>
                  <label for="vehicle-type" class="block text-gray-700 mb-2">{{ i18n.t$('chauffeur.form.vehicle_type') | async }}</label>
                  <select id="vehicle-type" formControlName="vehicleType"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
                    <option value="berline">{{ i18n.t$('chauffeur.form.vehicle_berline') | async }}</option>
                    <option value="suv">{{ i18n.t$('chauffeur.form.vehicle_suv') | async }}</option>
                    <option value="chauffeur">{{ i18n.t$('chauffeur.form.vehicle_chauffeur') | async }}</option>
                    <option value="minivan">{{ i18n.t$('chauffeur.form.vehicle_minivan') | async }}</option>
                  </select>
                </div>

                <div>
                  <label for="language" class="block text-gray-700 mb-2">{{ i18n.t$('chauffeur.form.language') | async }}</label>
                  <select id="language" formControlName="language"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
                    <option value="fr">{{ i18n.t$('chauffeur.form.language_fr') | async }}</option>
                    <option value="en">{{ i18n.t$('chauffeur.form.language_en') | async }}</option>
                    <option value="es">{{ i18n.t$('chauffeur.form.language_es') | async }}</option>
                    <option value="de">{{ i18n.t$('chauffeur.form.language_de') | async }}</option>
                    <option value="other">{{ i18n.t$('chauffeur.form.language_other') | async }}</option>
                  </select>
                </div>

                <div>
                  <label for="special-requests" class="block text-gray-700 mb-2">{{ i18n.t$('chauffeur.form.special_requests') | async }}</label>
                  <textarea id="special-requests" rows="3" formControlName="specialRequests"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"></textarea>
                </div>

                <button type="submit" [disabled]="!chauffeurForm.valid || isSubmitting"
                  class="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  {{ isSubmitting ? (i18n.t$('chauffeur.form.sending') | async) : (i18n.t$('chauffeur.form.submit') | async) }}
                </button>
                <div *ngIf="submitSuccess" class="mt-4 text-green-600">
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
export class ChauffeurComponent implements OnInit {
  chauffeurForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  showOccasionalFields = true;
  showRegularFields = false;

  constructor(
    public i18n: I18nService,
    private fb: FormBuilder,
    private formService: FormService
  ) {
    this.chauffeurForm = this.fb.group({
      serviceType: ['occasional', Validators.required],
      startDate: ['', Validators.required],
      duration: ['4', Validators.required],
      startDateRegular: [''],
      endDateRegular: [''],
      dailyHours: ['8'],
      vehicleType: ['berline', Validators.required],
      language: ['fr', Validators.required],
      specialRequests: ['']
    });
  }

  ngOnInit(): void {
    this.onServiceTypeChange();
  }

  onServiceTypeChange(): void {
    const serviceType = this.chauffeurForm.get('serviceType')?.value;
    this.showOccasionalFields = serviceType === 'occasional';
    this.showRegularFields = serviceType === 'regular' || serviceType === 'long';
    
    if (this.showOccasionalFields) {
      this.chauffeurForm.get('startDate')?.setValidators([Validators.required]);
      this.chauffeurForm.get('duration')?.setValidators([Validators.required]);
      this.chauffeurForm.get('startDateRegular')?.clearValidators();
      this.chauffeurForm.get('endDateRegular')?.clearValidators();
    } else {
      this.chauffeurForm.get('startDate')?.clearValidators();
      this.chauffeurForm.get('duration')?.clearValidators();
      this.chauffeurForm.get('startDateRegular')?.setValidators([Validators.required]);
      this.chauffeurForm.get('endDateRegular')?.setValidators([Validators.required]);
    }
    this.chauffeurForm.get('startDate')?.updateValueAndValidity();
    this.chauffeurForm.get('duration')?.updateValueAndValidity();
    this.chauffeurForm.get('startDateRegular')?.updateValueAndValidity();
    this.chauffeurForm.get('endDateRegular')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.chauffeurForm.valid) {
      this.isSubmitting = true;
      const formData = {
        ...this.chauffeurForm.value,
        subject: 'VIP & Protocol Service Request',
        message: `Service type: ${this.chauffeurForm.value.serviceType}. Vehicle: ${this.chauffeurForm.value.vehicleType}. Language: ${this.chauffeurForm.value.language}. Special requests: ${this.chauffeurForm.value.specialRequests || 'None'}`
      };
      
      this.formService.submitChauffeursForm(formData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.chauffeurForm.reset();
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
