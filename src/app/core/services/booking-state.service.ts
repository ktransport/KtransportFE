import { Injectable } from '@angular/core';
import { TokenValidationResponse } from './booking.service';

@Injectable({
  providedIn: 'root'
})
export class BookingStateService {
  private bookingData: TokenValidationResponse | null = null;
  private token: string | null = null;

  setBookingData(token: string, data: TokenValidationResponse): void {
    this.token = token;
    this.bookingData = data;
  }

  getBookingData(): TokenValidationResponse | null {
    return this.bookingData;
  }

  getToken(): string | null {
    return this.token;
  }

  clearBookingData(): void {
    this.token = null;
    this.bookingData = null;
  }
}

