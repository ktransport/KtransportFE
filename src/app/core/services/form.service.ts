import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { ConfigService } from './config.service';

export interface FlightInfoSubmission {
  flightNumber: string;
  airline: string;
  departure: {
    airport: string;
    iata: string;
    scheduled: string;
    terminal?: string;
    gate?: string;
  };
  arrival: {
    airport: string;
    iata: string;
    scheduled: string;
    terminal?: string;
    gate?: string;
  };
  status: string;
  aircraft?: string;
}

export interface FormSubmission {
  name: string;
  email: string;
  phone: string;
  date?: string;
  time?: string;
  flight?: string;
  notes?: string;
  subject?: string;
  message: string;
  flightInfo?: FlightInfoSubmission | null; // Structured flight data
}

export interface FormResponse {
  success: boolean;
  message: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class FormService {
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
        const apiUrl = config.backend.apiUrl;
        const endpointPath = config.backend.endpoints[endpoint as keyof typeof config.backend.endpoints] || endpoint;
        const url = apiUrl ? `${apiUrl}${endpointPath}` : `/api${endpointPath}`;
        return of(url);
      })
    );
  }

  submitContactForm(data: FormSubmission): Observable<FormResponse> {
    // Use configured backend URL - ensure config is loaded before making request
    return this.getEndpointUrl('contact').pipe(
      switchMap(url => this.http.post<FormResponse>(url, data))
    );
  }

  submitTransferForm(data: FormSubmission): Observable<FormResponse> {
    // Airport transfer form with flight info
    return this.getEndpointUrl('transfer').pipe(
      switchMap(url => this.http.post<FormResponse>(url, data))
    );
  }

  submitEventsForm(data: FormSubmission): Observable<FormResponse> {
    // Events & MICE form
    return this.getEndpointUrl('events').pipe(
      switchMap(url => this.http.post<FormResponse>(url, data))
    );
  }

  submitTourismForm(data: FormSubmission): Observable<FormResponse> {
    // Tourism & private tours form
    return this.getEndpointUrl('tourism').pipe(
      switchMap(url => this.http.post<FormResponse>(url, data))
    );
  }

  submitChauffeursForm(data: FormSubmission): Observable<FormResponse> {
    // VIP & Protocol service form
    return this.getEndpointUrl('chauffeurs').pipe(
      switchMap(url => this.http.post<FormResponse>(url, data))
    );
  }

  submitPartnershipForm(data: FormSubmission & { company?: string; serviceType?: string }): Observable<FormResponse> {
    // Partnership form
    return this.getEndpointUrl('partnership').pipe(
      switchMap(url => this.http.post<FormResponse>(url, data))
    );
  }
}
