import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme = new BehaviorSubject<ThemeMode>('light');
  public theme$ = this.currentTheme.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initializeTheme();
  }

  /**
   * Initialize theme from localStorage or browser preference
   */
  private initializeTheme(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const saved = localStorage.getItem('theme') as ThemeMode | null;
      
      // Validate saved theme
      if (saved && (saved === 'light' || saved === 'dark')) {
        this.setTheme(saved, false); // false = don't save again
        return;
      }

      // Detect browser preference
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = prefersDark ? 'dark' : 'light';
      this.setTheme(theme, false); // false = don't save initial detection
    } catch (error) {
      console.warn('Error initializing theme:', error);
      // Fallback to light theme
      this.setTheme('light', false);
    }
  }

  /**
   * Set the current theme
   * @param theme - Theme to set
   * @param saveToStorage - Whether to save to localStorage (default: true)
   */
  setTheme(theme: ThemeMode, saveToStorage: boolean = true): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Validate theme
    if (theme !== 'light' && theme !== 'dark') {
      console.warn(`Invalid theme: ${theme}. Defaulting to 'light'`);
      theme = 'light';
    }

    this.currentTheme.next(theme);
    
    if (saveToStorage) {
      try {
        localStorage.setItem('theme', theme);
      } catch (error) {
        console.warn('Error saving theme to localStorage:', error);
      }
    }

    // Apply theme class to document
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('theme-dark');
      } else {
        document.documentElement.classList.remove('theme-dark');
      }
    } catch (error) {
      console.warn('Error applying theme class:', error);
    }
  }

  /**
   * Get the current theme
   */
  getTheme(): ThemeMode {
    return this.currentTheme.value;
  }

  /**
   * Toggle between light and dark theme
   */
  toggleTheme(): void {
    const newTheme = this.currentTheme.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Check if current theme is dark
   */
  isDarkMode(): boolean {
    return this.currentTheme.value === 'dark';
  }
}
