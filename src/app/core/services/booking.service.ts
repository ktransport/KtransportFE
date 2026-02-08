import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ConfigService } from './config.service';

export interface InitialBookingRequest {
  fullName: string;
  email: string;
  phone: string;
  preferredContact: 'whatsapp' | 'telegram' | 'email';
  serviceType: string;
}

export interface BookingResponse {
  bookingId: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  estimatedResponseTime?: string;
}

export interface TokenValidationResponse {
  valid: boolean;
  bookingId?: string;
  clientInfo?: {
    fullName: string;
    email: string;
    phone: string;
  };
  serviceType?: string;
  expiresAt?: string;
  tokenUsed?: boolean;
  error?: string;
}

export interface ServiceDetails {
  [key: string]: any;
}

export interface BookingConfirmation {
  bookingId: string;
  status: string;
  message: string;
  confirmationNumber?: string;
}

export interface BookingStatus {
  bookingId: string;
  status: string;
  currentStep: 'pending_approval' | 'waiting_for_details' | 'completed' | 'pending_invoice' | 'invoice_sent' | 'invoice_accepted' | 'invoice_rejected' | 'confirmed';
  message: string;
  createdAt?: string;
  approvedAt?: string;
  expiresAt?: string;
  completedAt?: string;
  invoiceFilePath?: string;
  invoiceFileName?: string;
  invoiceSentAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {}

  /**
   * Get the full URL for an endpoint
   */
  private getEndpointUrl(endpoint: string): Observable<string> {
    return this.configService.loadConfig().pipe(
      switchMap(config => {
        const apiUrl = config.backend?.apiUrl;
        const basePath = '/api/v1/bookings';
        const url = apiUrl ? `${apiUrl}${basePath}${endpoint}` : `${basePath}${endpoint}`;
        return of(url);
      })
    );
  }

  /**
   * Submit initial booking request (Gateway 1)
   */
  submitInitialRequest(request: InitialBookingRequest): Observable<BookingResponse> {
    return this.getEndpointUrl('/initial-request').pipe(
      switchMap(url => this.http.post<BookingResponse>(url, request))
    );
  }

  /**
   * Validate booking token
   */
  validateToken(token: string): Observable<TokenValidationResponse> {
    return this.getEndpointUrl('/validate-token').pipe(
      switchMap(url => {
        const params = new HttpParams().set('token', token);
        return this.http.get<TokenValidationResponse>(url, { params });
      })
    );
  }

  /**
   * Complete booking with service details (Gateway 2)
   */
  completeBooking(bookingId: string, token: string, details: ServiceDetails): Observable<BookingConfirmation> {
    return this.getEndpointUrl(`/${bookingId}/complete`).pipe(
      switchMap(url => {
        return this.http.post<BookingConfirmation>(url, details, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      })
    );
  }

  /**
   * Get booking status
   */
  getBookingStatus(bookingId: string): Observable<BookingStatus> {
    return this.getEndpointUrl(`/${bookingId}/status`).pipe(
      switchMap(url => this.http.get<BookingStatus>(url))
    );
  }

  /**
   * Accept invoice
   */
  acceptInvoice(bookingId: string): Observable<any> {
    return this.getEndpointUrl(`/${bookingId}/invoice/accept`).pipe(
      switchMap(url => this.http.post(url, {}))
    );
  }

  /**
   * Reject invoice
   */
  rejectInvoice(bookingId: string, reason: string): Observable<any> {
    return this.getEndpointUrl(`/${bookingId}/invoice/reject`).pipe(
      switchMap(url => this.http.post(url, { reason }))
    );
  }

  /**
   * Get invoice download URL
   */
  getInvoiceDownloadUrl(bookingId: string): Observable<string> {
    return this.getEndpointUrl(`/${bookingId}/invoice/download`).pipe(
      switchMap(url => of(url))
    );
  }
}

