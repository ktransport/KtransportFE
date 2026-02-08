import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';
import { FadeInDirective } from '../../directives/fade-in.directive';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule, FadeInDirective],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {
  constructor(public i18n: I18nService) {}

  formatB2BTitle(title: string): string {
    return title.replace('B2B', 'B<span class="text-xl sm:text-2xl md:text-3xl inline-block relative top-0.5">2</span>B');
  }
}
