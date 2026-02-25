import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { I18nService } from '../../core/services/i18n.service';
import { FormService } from '../../core/services/form.service';
import { FadeInDirective } from '../../directives/fade-in.directive';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, FadeInDirective],
  template: `
    <!-- Hero Section -->
    <section class="page-hero-section relative h-[500px] flex items-start justify-center bg-gray-900 overflow-hidden w-full pt-12 sm:pt-16 md:pt-20" style="margin-top: 70px; width: 100vw; margin-left: calc(-50vw + 50%);">
      <div class="absolute inset-0 bg-black opacity-60 z-10"></div>
      <div class="absolute inset-0 bg-center" style="background-image: url('assets/images/banner.png'); background-size: 150%; background-position: 40% center; background-repeat: no-repeat;"></div>
      <div class="container mx-auto px-6 z-20 text-center">
        <h1 class="text-5xl md:text-6xl font-serif font-extrabold text-white mb-6 leading-tight tracking-wide">{{ i18n.t$('events.hero.title') | async }}</h1>
        <p class="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">{{ i18n.t$('events.hero.subtitle') | async }}</p>
      </div>
    </section>

    <!-- Description Section -->
    <section class="py-16 bg-white" appFadeIn>
      <div class="container mx-auto px-6 max-w-4xl text-center">
        <p class="text-xl text-gray-700 leading-relaxed">
          <ng-container *ngIf="(currentLang$ | async) === 'fr'">{{ i18n.t$('events.description.fr') | async }}</ng-container>
          <ng-container *ngIf="(currentLang$ | async) !== 'fr'">{{ i18n.t$('events.description.en') | async }}</ng-container>
        </p>
      </div>
    </section>

    <!-- Wedding Packages -->
    <section class="py-24 bg-gray-50" appFadeIn>
      <div class="container mx-auto px-6">
        <h2 class="text-4xl md:text-5xl font-serif font-bold text-center mb-20 section-heading">{{ i18n.t$('events.packages.title') | async }}</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div class="luxury-card-alt p-10 hover:shadow-xl-hover transition-all duration-300 transform hover:-translate-y-2">
            <div class="text-center mb-6">
              <h3 class="text-2xl font-serif font-bold mb-2">{{ i18n.t$('events.packages.essentiel.title') | async }}</h3>
            </div>
            <ul class="space-y-3 mb-8">
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-yellow-500 mr-2" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{{ i18n.t$('events.packages.essentiel.feature1') | async }}</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-yellow-500 mr-2" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{{ i18n.t$('events.packages.essentiel.feature2') | async }}</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-yellow-500 mr-2" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{{ i18n.t$('events.packages.essentiel.feature3') | async }}</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-yellow-500 mr-2" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{{ i18n.t$('events.packages.essentiel.feature4') | async }}</span>
              </li>
            </ul>
            <a href="#reservation"
              class="block text-center bg-gray-100 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-6 rounded-lg transition duration-300">
              {{ i18n.t$('events.packages.choose') | async }}
            </a>
          </div>

          <div class="luxury-card-alt p-10 border-2 border-yellow-500 transform hover:scale-105 transition-all duration-300 relative shadow-xl-hover">
            <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-gray-900 px-4 py-1 rounded-full text-sm font-bold shadow-md">
              {{ i18n.t$('events.packages.popular') | async }}
            </div>
            <div class="text-center mb-6">
              <h3 class="text-2xl font-serif font-bold mb-2">{{ i18n.t$('events.packages.privilege.title') | async }}</h3>
            </div>
            <ul class="space-y-3 mb-8">
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-yellow-500 mr-2" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{{ i18n.t$('events.packages.privilege.feature1') | async }}</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-yellow-500 mr-2" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{{ i18n.t$('events.packages.privilege.feature2') | async }}</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-yellow-500 mr-2" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{{ i18n.t$('events.packages.privilege.feature3') | async }}</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-yellow-500 mr-2" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{{ i18n.t$('events.packages.privilege.feature4') | async }}</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-yellow-500 mr-2" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{{ i18n.t$('events.packages.privilege.feature5') | async }}</span>
              </li>
            </ul>
            <a href="#reservation"
              class="block text-center bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-6 rounded-lg transition duration-300">
              {{ i18n.t$('events.packages.choose') | async }}
            </a>
          </div>

          <div class="package-card border-2 border-gray-200 rounded-xl p-8 hover:border-yellow-500 transition duration-300">
            <div class="text-center mb-6">
              <h3 class="text-2xl font-serif font-bold mb-2">{{ i18n.t$('events.packages.prestige.title') | async }}</h3>
            </div>
            <ul class="space-y-3 mb-8">
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-yellow-500 mr-2" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{{ i18n.t$('events.packages.prestige.feature1') | async }}</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-yellow-500 mr-2" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{{ i18n.t$('events.packages.prestige.feature2') | async }}</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-yellow-500 mr-2" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{{ i18n.t$('events.packages.prestige.feature3') | async }}</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-yellow-500 mr-2" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{{ i18n.t$('events.packages.prestige.feature4') | async }}</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-yellow-500 mr-2" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{{ i18n.t$('events.packages.prestige.feature5') | async }}</span>
              </li>
            </ul>
            <a href="#reservation"
              class="block text-center bg-gray-100 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-6 rounded-lg transition duration-300">
              {{ i18n.t$('events.packages.choose') | async }}
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Vehicle Selection -->
    <section class="py-20 bg-gray-50" appFadeIn>
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-serif font-bold text-center mb-16">{{ i18n.t$('events.vehicles.title') | async }}</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="vehicle-card bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
            <div class="relative h-64">
              <img src="https://static.photos/automotive/640x360/6" alt="Rolls-Royce Phantom" class="w-full h-full object-cover">
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <h3 class="text-xl font-bold text-white">{{ i18n.t$('events.vehicles.rolls.name') | async }}</h3>
              </div>
            </div>
            <div class="p-6">
              <ul class="space-y-2 text-gray-700 mb-6">
                <li class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 mr-2 mt-1 text-yellow-500" viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <span>{{ i18n.t$('events.vehicles.passengers_4') | async }}</span>
                </li>
                <li class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="w-4 h-4 mr-2 mt-1 text-yellow-500" viewBox="0 0 24 24">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  <span>{{ i18n.t$('events.vehicles.rolls.feature2') | async }}</span>
                </li>
                <li class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 mr-2 mt-1 text-yellow-500" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <span>{{ i18n.t$('events.vehicles.rolls.feature3') | async }}</span>
                </li>
              </ul>
              <a href="#reservation"
                class="inline-block bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-6 rounded-lg transition duration-300">
                {{ i18n.t$('events.vehicles.select') | async }}
              </a>
            </div>
          </div>

          <div class="vehicle-card bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
            <div class="relative h-64">
              <img src="https://static.photos/automotive/640x360/7" alt="Bentley Continental" class="w-full h-full object-cover">
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <h3 class="text-xl font-bold text-white">{{ i18n.t$('events.vehicles.bentley.name') | async }}</h3>
              </div>
            </div>
            <div class="p-6">
              <ul class="space-y-2 text-gray-700 mb-6">
                <li class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 mr-2 mt-1 text-yellow-500" viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <span>{{ i18n.t$('events.vehicles.bentley.feature1') | async }}</span>
                </li>
                <li class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="w-4 h-4 mr-2 mt-1 text-yellow-500" viewBox="0 0 24 24">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  <span>{{ i18n.t$('events.vehicles.bentley.feature2') | async }}</span>
                </li>
                <li class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 mr-2 mt-1 text-yellow-500" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <span>{{ i18n.t$('events.vehicles.bentley.feature3') | async }}</span>
                </li>
              </ul>
              <a href="#reservation"
                class="inline-block bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-6 rounded-lg transition duration-300">
                {{ i18n.t$('events.vehicles.select') | async }}
              </a>
            </div>
          </div>

          <div class="vehicle-card bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
            <div class="relative h-64">
              <img src="https://static.photos/automotive/640x360/8" alt="Mercedes Maybach" class="w-full h-full object-cover">
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <h3 class="text-xl font-bold text-white">{{ i18n.t$('events.vehicles.maybach.name') | async }}</h3>
              </div>
            </div>
            <div class="p-6">
              <ul class="space-y-2 text-gray-700 mb-6">
                <li class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 mr-2 mt-1 text-yellow-500" viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <span>{{ i18n.t$('events.vehicles.passengers_4') | async }}</span>
                </li>
                <li class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="w-4 h-4 mr-2 mt-1 text-yellow-500" viewBox="0 0 24 24">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  <span>{{ i18n.t$('events.vehicles.maybach.feature2') | async }}</span>
                </li>
                <li class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 mr-2 mt-1 text-yellow-500" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <span>{{ i18n.t$('events.vehicles.maybach.feature3') | async }}</span>
                </li>
              </ul>
              <a href="#reservation"
                class="inline-block bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-6 rounded-lg transition duration-300">
                {{ i18n.t$('events.vehicles.select') | async }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Reservation Form -->
    <section id="reservation" class="py-20 bg-white" appFadeIn>
      <div class="container mx-auto px-6 max-w-4xl">
        <h2 class="text-3xl font-serif font-bold text-center mb-16">{{ i18n.t$('events.reservation.title') | async }}</h2>

        <div class="bg-gray-50 p-8 rounded-xl">
          <form [formGroup]="eventsForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="wedding-date" class="block text-gray-700 mb-2">{{ i18n.t$('events.reservation.event_date') | async }}</label>
                <input type="date" id="wedding-date" formControlName="eventDate"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
              </div>

              <div>
                <label for="package" class="block text-gray-700 mb-2">{{ i18n.t$('events.reservation.package') | async }}</label>
                <select id="package" formControlName="eventType"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
                  <option value="essentiel">{{ i18n.t$('events.packages.essentiel.title') | async }}</option>
                  <option value="privilege">{{ i18n.t$('events.packages.privilege.title') | async }}</option>
                  <option value="prestige">{{ i18n.t$('events.packages.prestige.title') | async }}</option>
                </select>
              </div>
            </div>

            <div>
              <label for="vehicle" class="block text-gray-700 mb-2">{{ i18n.t$('events.reservation.vehicle') | async }}</label>
              <select id="vehicle" formControlName="requirements"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
                <option>Rolls-Royce Phantom</option>
                <option>Bentley Continental</option>
                <option>Mercedes Maybach</option>
                <option>{{ i18n.t$('events.vehicles.other') | async }}</option>
              </select>
            </div>

            <div>
              <label for="bride-name" class="block text-gray-700 mb-2">{{ i18n.t$('events.reservation.passenger_name') | async }}</label>
              <input type="text" id="bride-name" formControlName="contact"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
            </div>

            <div>
              <label for="ceremony" class="block text-gray-700 mb-2">{{ i18n.t$('events.reservation.ceremony') | async }}</label>
              <input type="text" id="ceremony" formControlName="company"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
            </div>

            <div>
              <label for="reception" class="block text-gray-700 mb-2">{{ i18n.t$('events.reservation.reception') | async }}</label>
              <input type="text" id="reception"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
            </div>

            <div>
              <label for="special-requests" class="block text-gray-700 mb-2">{{ i18n.t$('events.reservation.special_requests') | async }}</label>
              <textarea id="special-requests" rows="4" formControlName="requirements"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"></textarea>
            </div>

            <button type="submit" [disabled]="!eventsForm.valid || isSubmitting"
              class="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isSubmitting ? (i18n.t$('events.reservation.sending') | async) : (i18n.t$('events.reservation.submit') | async) }}
            </button>
            <div *ngIf="submitSuccess" class="mt-4 text-green-600">
              {{ i18n.t$('contact.form.success') | async }}
            </div>
          </form>
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
export class EventsComponent implements OnInit {
  eventsForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  currentLang$ = this.i18n.language$;

  constructor(
    public i18n: I18nService,
    private fb: FormBuilder,
    private formService: FormService
  ) {
    this.eventsForm = this.fb.group({
      company: ['', Validators.required],
      contact: ['', Validators.required],
      eventType: ['essentiel', Validators.required],
      eventDate: ['', Validators.required],
      requirements: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.eventsForm.valid) {
      this.isSubmitting = true;
      const formData = {
        ...this.eventsForm.value,
        subject: 'Events & MICE Request',
        message: `Event type: ${this.eventsForm.value.eventType}. Participants: ${this.eventsForm.value.passengers}. Duration: ${this.eventsForm.value.duration} days. Requirements: ${this.eventsForm.value.requirements || 'None'}`
      };
      
      this.formService.submitEventsForm(formData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.eventsForm.reset();
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
