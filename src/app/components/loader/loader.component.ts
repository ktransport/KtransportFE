import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  /** When true, shows the loader; when false, hides with a short fade-out */
  @Input() loading = false;

  /** Optional text below the spinner (e.g. "Loading...") */
  @Input() message: string | null = null;

  /** When true, render as overlay (covers content). When false, render inline (no overlay). */
  @Input() overlay = true;
}
