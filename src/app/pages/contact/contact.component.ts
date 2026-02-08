import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { I18nService } from '../../core/services/i18n.service';
import { FormService } from '../../core/services/form.service';

declare var L: any;

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit, AfterViewInit {
  contactForm: FormGroup;
  isSubmitting = false;
  private map: any;

  constructor(
    public i18n: I18nService,
    private fb: FormBuilder,
    private formService: FormService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    // Initialize map after view is initialized
    setTimeout(() => {
      if (typeof L !== 'undefined') {
        // Rueil-Malmaison coordinates (primary address)
        this.map = L.map('map', {
          zoomControl: false  // Disable default zoom control
        }).setView([48.8847, 2.17], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        // Add custom zoom control positioned at bottom to avoid navbar overlap
        L.control.zoom({
          position: 'bottomright'  // Position zoom controls at bottom-right to avoid navbar
        }).addTo(this.map);

        // Add primary address marker (Rueil-Malmaison)
        const primaryPopup = L.popup({
          className: 'custom-popup',
          maxWidth: 280,
          minWidth: 200
        }).setContent(`
          <div class="popup-content" style="min-width: 200px; width: 100%; box-sizing: border-box;">
            <h3 class="popup-title" style="display: block; white-space: normal;">Ktransport</h3>
            <p class="popup-address" style="display: block; white-space: normal;">99 Avenue Albert 1er siège<br>92500 Rueil-Malmaison, France</p>
          </div>
        `);
        L.marker([48.8847, 2.17]).addTo(this.map)
          .bindPopup(primaryPopup)
          .openPopup();

        // Add secondary address marker (Nice)
        const secondaryPopup = L.popup({
          className: 'custom-popup',
          maxWidth: 280,
          minWidth: 200
        }).setContent(`
          <div class="popup-content" style="min-width: 200px; width: 100%; box-sizing: border-box;">
            <h3 class="popup-title" style="display: block; white-space: normal;">Ktransport</h3>
            <p class="popup-address" style="display: block; white-space: normal;">6B Avenue Durante<br>06000 Nice, France</p>
          </div>
        `);
        L.marker([43.7102, 7.2620]).addTo(this.map)
          .bindPopup(secondaryPopup);
      }
    }, 100);
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      this.formService.submitContactForm(this.contactForm.value).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.contactForm.reset();
          alert(this.i18n.translate('contact.form.success'));
        },
        error: () => {
          this.isSubmitting = false;
          alert(this.i18n.translate('contact.form.error'));
        }
      });
    }
  }
}
