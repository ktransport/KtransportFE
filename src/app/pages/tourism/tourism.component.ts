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
  selector: 'app-tourism',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  template: `
    <!-- Hero Section -->
    <section class="relative h-[500px] flex items-start justify-center bg-gray-900 overflow-hidden w-full pt-12 sm:pt-16 md:pt-20" style="margin-top: 70px; width: 100vw; margin-left: calc(-50vw + 50%);">
      <div class="absolute inset-0 bg-black opacity-60 z-10"></div>
      <div class="absolute inset-0 bg-center" style="background-image: url('assets/images/banner.png'); background-size: 150%; background-position: 40% center; background-repeat: no-repeat;"></div>
      <div class="container mx-auto px-6 z-20 text-center">
        <h1 class="text-5xl md:text-6xl font-serif font-extrabold text-white mb-6 leading-tight tracking-wide">{{ i18n.t$('tourism.hero.title') | async }}</h1>
        <p class="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">{{ i18n.t$('tourism.hero.subtitle') | async }}</p>
      </div>
    </section>

    <!-- Service Details -->
    <section class="py-24 bg-gray-50">
      <div class="container mx-auto px-6 max-w-6xl">
        <div class="grid md:grid-cols-2 gap-16">
          <div>
            <h2 class="text-4xl font-serif font-bold mb-8 text-gray-900 section-heading">{{ i18n.t$('tourism.details.title') | async }}</h2>
            <div class="luxury-card p-8">
              <p>{{ i18n.t$('tourism.details.intro') | async }}</p>
              <ul>
                <li>{{ i18n.t$('tourism.details.feature1') | async }}</li>
                <li>{{ i18n.t$('tourism.details.feature2') | async }}</li>
                <li>{{ i18n.t$('tourism.details.feature3') | async }}</li>
                <li>{{ i18n.t$('tourism.details.feature4') | async }}</li>
                <li>{{ i18n.t$('tourism.details.feature5') | async }}</li>
              </ul>

              <div class="mt-8">
                <h3 class="text-xl font-bold mb-4">{{ i18n.t$('tourism.itineraries.title') | async }}</h3>
                <div class="space-y-4">
                  <div class="border-l-4 border-yellow-500 pl-4 py-2">
                    <h4 class="font-bold">{{ i18n.t$('tourism.itineraries.paris.title') | async }}</h4>
                    <p class="text-sm text-gray-600">{{ i18n.t$('tourism.itineraries.paris.description') | async }}</p>
                  </div>
                  <div class="border-l-4 border-yellow-500 pl-4 py-2">
                    <h4 class="font-bold">{{ i18n.t$('tourism.itineraries.gastronomy.title') | async }}</h4>
                    <p class="text-sm text-gray-600">{{ i18n.t$('tourism.itineraries.gastronomy.description') | async }}</p>
                  </div>
                  <div class="border-l-4 border-yellow-500 pl-4 py-2">
                    <h4 class="font-bold">{{ i18n.t$('tourism.itineraries.chateaux.title') | async }}</h4>
                    <p class="text-sm text-gray-600">{{ i18n.t$('tourism.itineraries.chateaux.description') | async }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="bg-gray-50 p-6 rounded-xl sticky top-8">
              <h3 class="text-2xl font-serif font-bold mb-6">{{ i18n.t$('tourism.form.title') | async }}</h3>

              <form [formGroup]="tourismForm" (ngSubmit)="onSubmit()" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="tour-date" class="block text-gray-700 mb-2">{{ i18n.t$('tourism.form.date') | async }}</label>
                    <input type="date" id="tour-date" formControlName="tourDate"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
                  </div>

                  <div>
                    <label for="duration" class="block text-gray-700 mb-2">{{ i18n.t$('tourism.form.duration') | async }}</label>
                    <select id="duration" formControlName="duration"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
                      <option value="4">{{ i18n.t$('tourism.form.duration_4') | async }}</option>
                      <option value="6">{{ i18n.t$('tourism.form.duration_6') | async }}</option>
                      <option value="8">{{ i18n.t$('tourism.form.duration_8') | async }}</option>
                      <option value="full">{{ i18n.t$('tourism.form.duration_full') | async }}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label for="passengers" class="block text-gray-700 mb-2">{{ i18n.t$('tourism.form.passengers') | async }}</label>
                  <input type="number" id="passengers" formControlName="passengers" min="1"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
                </div>

                <div>
                  <label for="itinerary" class="block text-gray-700 mb-2">{{ i18n.t$('tourism.form.itinerary') | async }}</label>
                  <select id="itinerary" formControlName="itinerary"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
                    <option value="cultural">{{ i18n.t$('tourism.form.itinerary_cultural') | async }}</option>
                    <option value="gastronomic">{{ i18n.t$('tourism.form.itinerary_gastronomic') | async }}</option>
                    <option value="shopping">{{ i18n.t$('tourism.form.itinerary_shopping') | async }}</option>
                    <option value="nature">{{ i18n.t$('tourism.form.itinerary_nature') | async }}</option>
                    <option value="custom">{{ i18n.t$('tourism.form.itinerary_custom') | async }}</option>
                  </select>
                </div>

                <div>
                  <label for="language" class="block text-gray-700 mb-2">{{ i18n.t$('tourism.form.language') | async }}</label>
                  <select id="language" formControlName="language"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
                    <option value="fr">{{ i18n.t$('tourism.form.language_fr') | async }}</option>
                    <option value="en">{{ i18n.t$('tourism.form.language_en') | async }}</option>
                    <option value="es">{{ i18n.t$('tourism.form.language_es') | async }}</option>
                    <option value="de">{{ i18n.t$('tourism.form.language_de') | async }}</option>
                    <option value="zh">{{ i18n.t$('tourism.form.language_zh') | async }}</option>
                  </select>
                </div>

                <div>
                  <label for="special-requests" class="block text-gray-700 mb-2">{{ i18n.t$('tourism.form.special_requests') | async }}</label>
                  <textarea id="special-requests" rows="3" formControlName="specialRequests"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"></textarea>
                </div>

                <button type="submit" [disabled]="!tourismForm.valid || isSubmitting"
                  class="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  {{ isSubmitting ? (i18n.t$('tourism.form.sending') | async) : (i18n.t$('tourism.form.request_quote') | async) }}
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
export class TourismComponent implements OnInit {
  tourismForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;

  constructor(
    public i18n: I18nService,
    private fb: FormBuilder,
    private formService: FormService
  ) {
    this.tourismForm = this.fb.group({
      tourDate: ['', Validators.required],
      duration: ['4', Validators.required],
      passengers: ['', [Validators.required, Validators.min(1)]],
      itinerary: ['cultural', Validators.required],
      language: ['fr', Validators.required],
      specialRequests: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.tourismForm.valid) {
      this.isSubmitting = true;
      const formData = {
        ...this.tourismForm.value,
        subject: 'Tourism & Private Tours Request',
        message: `Tour date: ${this.tourismForm.value.tourDate}. Duration: ${this.tourismForm.value.duration}. Passengers: ${this.tourismForm.value.passengers}. Itinerary: ${this.tourismForm.value.itinerary}. Language: ${this.tourismForm.value.language}. Special requests: ${this.tourismForm.value.specialRequests || 'None'}`
      };
      
      this.formService.submitTourismForm(formData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.tourismForm.reset();
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
