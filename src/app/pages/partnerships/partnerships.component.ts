import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';
import { FadeInDirective } from '../../directives/fade-in.directive';

@Component({
  selector: 'app-partnerships',
  standalone: true,
  imports: [CommonModule, RouterModule, FadeInDirective],
  templateUrl: './partnerships.component.html',
  styleUrl: './partnerships.component.scss'
})
export class PartnershipsComponent {
  constructor(public i18n: I18nService) { }

  formatB2BTitle(title: string): string {
    return title.replace('B2B', 'B<span class="text-xl sm:text-2xl md:text-5xl inline-block relative top-0.5">2</span>B');
  }

  getEmailHref(): string {
    const subject = this.i18n.translate('partnerships.contact.email_subject', 'B2B Partnership Request');
    return `mailto:bilal.ktransport@hotmail.com?subject=${encodeURIComponent(subject)}`;
  }
}
