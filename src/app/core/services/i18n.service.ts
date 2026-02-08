import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';

export type Language = 'en' | 'fr';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private currentLanguage = new BehaviorSubject<Language>('en');
  public language$ = this.currentLanguage.asObservable();
  
  private translations: Record<Language, any> = {
    en: {},
    fr: {}
  };

  private translationsLoaded = false;
  private loadError = false;

  constructor(private http: HttpClient) {
    this.initializeLanguage();
  }

  /**
   * Initialize language from localStorage, browser preference, or default to 'en'
   */
  private initializeLanguage(): void {
    const saved = localStorage.getItem('language') as Language | null;
    const browserLang = this.detectBrowserLanguage();
    const initialLang = saved || browserLang || 'en';
    
    // Set initial language immediately
    this.currentLanguage.next(initialLang);
    document.documentElement.lang = initialLang;
    
    // Then load translations
    this.loadTranslations();
  }

  /**
   * Detect browser language preference
   */
  private detectBrowserLanguage(): Language | null {
    if (typeof navigator === 'undefined') return null;
    
    const browserLang = navigator.language || (navigator as any).userLanguage;
    if (!browserLang) return null;
    
    // Check if browser language starts with 'fr'
    if (browserLang.toLowerCase().startsWith('fr')) {
      return 'fr';
    }
    
    // Default to 'en' for other languages
    return 'en';
  }

  /**
   * Load translations from assets
   */
  private loadTranslations(): void {
    this.http.get<any>('/assets/translations.json').pipe(
      tap((data) => {
        if (data && typeof data === 'object') {
          this.translations = data;
          this.translationsLoaded = true;
          this.loadError = false;
          
          // Ensure current language is set after translations are loaded
          const currentLang = this.currentLanguage.value;
          this.setLanguage(currentLang, false); // false = don't save to localStorage again
        } else {
          console.warn('Translations file loaded but data is invalid');
          this.loadError = true;
        }
      }),
      catchError((error) => {
        console.error('Failed to load translations:', error);
        this.loadError = true;
        // Return empty observable to complete the stream
        return of(null);
      })
    ).subscribe();
  }

  /**
   * Set the current language
   * @param lang - Language to set
   * @param saveToStorage - Whether to save to localStorage (default: true)
   */
  setLanguage(lang: Language, saveToStorage: boolean = true): void {
    if (!['en', 'fr'].includes(lang)) {
      console.warn(`Invalid language: ${lang}. Defaulting to 'en'`);
      lang = 'en';
    }

    this.currentLanguage.next(lang);
    
    if (saveToStorage) {
      localStorage.setItem('language', lang);
    }
    
    document.documentElement.lang = lang;
  }

  /**
   * Get the current language
   */
  getLanguage(): Language {
    return this.currentLanguage.value;
  }

  /**
   * Translate a key to the current language
   * @param key - Translation key (e.g., 'nav.home')
   * @param defaultValue - Default value if translation not found
   * @returns Translated string
   */
  translate(key: string, defaultValue?: string): string {
    if (!key) return defaultValue || key;

    const keys = key.split('.');
    let value: any = this.translations[this.getLanguage()];

    // Navigate through nested object
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Key not found, try fallback to English if current language is not English
        if (this.getLanguage() !== 'en') {
          let enValue: any = this.translations['en'];
          for (const enKey of keys) {
            if (enValue && typeof enValue === 'object' && enKey in enValue) {
              enValue = enValue[enKey];
            } else {
              return defaultValue || key;
            }
          }
          return enValue || defaultValue || key;
        }
        return defaultValue || key;
      }
    }

    // Return the value if it's a string, otherwise return default
    if (typeof value === 'string') {
      return value;
    }

    return defaultValue || key;
  }

  /**
   * Get translation as Observable (reactive)
   * @param key - Translation key
   * @returns Observable of translated string
   */
  t$(key: string): Observable<string> {
    return this.language$.pipe(
      map(() => this.translate(key))
    );
  }

  /**
   * Check if translations are loaded
   */
  areTranslationsLoaded(): boolean {
    return this.translationsLoaded;
  }

  /**
   * Check if there was an error loading translations
   */
  hasLoadError(): boolean {
    return this.loadError;
  }
}
