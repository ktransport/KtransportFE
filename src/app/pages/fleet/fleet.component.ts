import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';
import { FadeInDirective } from '../../directives/fade-in.directive';

@Component({
  selector: 'app-fleet',
  standalone: true,
  imports: [CommonModule, RouterModule, FadeInDirective],
  templateUrl: './fleet.component.html',
  styleUrl: './fleet.component.scss'
})
export class FleetComponent {
  constructor(public i18n: I18nService) {}
}
