import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { BookingService } from '../core/services/booking.service';
import { BookingStateService } from '../core/services/booking-state.service';

export const bookingTokenGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  const bookingService = inject(BookingService);
  const bookingState = inject(BookingStateService);
  const router = inject(Router);

  // Get token from query params
  const token = route.queryParams['token'];

  if (!token) {
    // No token provided, redirect to booking gateway
    router.navigate(['/booking'], {
      queryParams: { service: getServiceTypeFromRoute(state.url) }
    });
    return of(false);
  }

  // Validate token
  return bookingService.validateToken(token).pipe(
    tap((response) => {
      if (response.valid && !response.tokenUsed) {
        // Store booking data in service for component access
        bookingState.setBookingData(token, response);
      }
    }),
    map((response) => {
      if (response.valid && !response.tokenUsed) {
        return true;
      } else {
        // Invalid or used token, redirect to error page
        router.navigate(['/booking-error'], {
          queryParams: { error: response.error || 'TOKEN_INVALID' }
        });
        return false;
      }
    }),
    catchError((error) => {
      console.error('Token validation error:', error);
      router.navigate(['/booking-error'], {
        queryParams: { error: 'TOKEN_VALIDATION_ERROR' }
      });
      return of(false);
    })
  );
};

/**
 * Extract service type from route URL
 */
function getServiceTypeFromRoute(url: string): string {
  if (url.includes('/transfer')) return 'transfer';
  if (url.includes('/events')) return 'events';
  if (url.includes('/chauffeurs')) return 'chauffeur';
  if (url.includes('/tourism')) return 'tourism';
  if (url.includes('/partnerships')) return 'partnerships';
  return '';
}

