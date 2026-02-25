import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { LoaderComponent } from '../../components/loader/loader.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent, LoaderComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  navigationLoading = false;
  private routerSub: Subscription | null = null;
  private hideDelay: ReturnType<typeof setTimeout> | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.routerSub = this.router.events
      .pipe(
        filter(
          (e): e is NavigationStart | NavigationEnd | NavigationError =>
            e instanceof NavigationStart || e instanceof NavigationEnd || e instanceof NavigationError
        )
      )
      .subscribe((e) => {
        if (e instanceof NavigationStart) {
          if (this.hideDelay) {
            clearTimeout(this.hideDelay);
            this.hideDelay = null;
          }
          this.navigationLoading = true;
        } else {
          this.hideDelay = setTimeout(() => {
            this.navigationLoading = false;
            this.hideDelay = null;
          }, 180);
        }
      });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    if (this.hideDelay) clearTimeout(this.hideDelay);
  }
}
