import { Component, OnInit, OnDestroy, HostListener, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { I18nService, Language } from '../../core/services/i18n.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy, AfterViewInit {
  currentLanguage: Language = 'en';
  isDarkMode = false;
  isScrolled = false;
  navLoaded = false;
  isMobileMenuOpen = false;
  private destroy$ = new Subject<void>();

  constructor(
    public i18n: I18nService,
    private theme: ThemeService
  ) {}

  ngOnInit(): void {
    this.currentLanguage = this.i18n.getLanguage();
    this.i18n.language$
      .pipe(takeUntil(this.destroy$))
      .subscribe((lang: Language) => {
        this.currentLanguage = lang;
      });
    this.theme.theme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this.isDarkMode = theme === 'dark';
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    // trigger entrance animation after view init
    setTimeout(() => {
      this.navLoaded = true;
    }, 80);
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768 && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  onLanguageChange(): void {
    this.i18n.setLanguage(this.currentLanguage);
  }

  toggleTheme(): void {
    this.theme.toggleTheme();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    // Prevent body scroll when menu is open
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  onNavLinkClick(): void {
    // Close mobile menu when a link is clicked
    this.closeMobileMenu();
  }
}
