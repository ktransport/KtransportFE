import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ConfigService } from './config.service';

export interface FlightInfo {
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

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private accessToken: string = '';
  private tokenExpiry: number = 0;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {}

  /**
   * Fetch flight information by flight number
   * @param flightNumber - Flight number (e.g., "AF123", "LH456")
   * @param date - Optional date in YYYY-MM-DD format
   */
  getFlightInfo(flightNumber: string, date?: string): Observable<FlightInfo | null> {
    if (!flightNumber || flightNumber.trim().length < 3) {
      return of(null);
    }

    // Load config and route to appropriate provider
    return this.configService.loadConfig().pipe(
      switchMap(config => {
        const provider = config.api.flight.provider;

        switch (provider) {
          case 'amadeus':
            return this.fetchWithAmadeus(flightNumber, date, config);
          case 'aviationstack':
            return this.fetchWithAviationStack(flightNumber, date, config);
          case 'opensky':
            return this.fetchWithOpenSky(flightNumber, date, config);
          default:
            console.warn(`Unknown flight API provider: ${provider}`);
            return of(null);
        }
      })
    );
  }

  /**
   * Fetch flight info using Amadeus API (Free tier: 2000 requests/month)
   */
  private fetchWithAmadeus(flightNumber: string, date: string | undefined, config: any): Observable<FlightInfo | null> {
    const clientId = config.api.flight.amadeus.clientId;
    const clientSecret = config.api.flight.amadeus.clientSecret;
    const apiUrl = config.api.flight.amadeus.apiUrl;

    if (!clientId || clientId === 'YOUR_CLIENT_ID_HERE' || !clientSecret || clientSecret === 'YOUR_CLIENT_SECRET_HERE') {
      console.warn('Amadeus API credentials not configured. Please set them in assets/config.json');
      return of(null);
    }

    // First, get access token if needed
    return this.getAmadeusToken(clientId, clientSecret, apiUrl).pipe(
      switchMap(token => {
        if (!token) {
          return of(null);
        }

        // Extract carrier code and flight number
        const { carrierCode, number } = this.extractCarrierAndNumber(flightNumber);
        
        if (!carrierCode || !number) {
          console.warn('Invalid flight number format. Expected format: XX1234 (e.g., AF123, LH456)');
          return of(null);
        }

        // Use Flight Status API to check existing flight status
        // This endpoint checks the status of an existing flight, not for booking
        // Format: /v2/schedule/flights?carrierCode=XX&number=123&date=YYYY-MM-DD
        const searchUrl = `${apiUrl}/v2/schedule/flights`;

        // Date is required - use provided date or today
        let searchDate = date ? this.formatDateForAPI(date) : new Date().toISOString().split('T')[0];
        
        if (!searchDate) {
          console.warn('Invalid date format. Using today\'s date.');
          searchDate = new Date().toISOString().split('T')[0];
        }

        let params = new HttpParams()
          .set('carrierCode', carrierCode)
          .set('number', number)
          .set('date', searchDate);

        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<any>(searchUrl, { params, headers }).pipe(
          map(response => {
            if (response.data && response.data.length > 0) {
              return this.mapAmadeusToFlightInfo(response.data[0], `${carrierCode}${number}`);
            }
            return null;
          }),
          catchError(error => {
            console.error('Error fetching flight info from Amadeus:', error);
            if (error.error) {
              console.error('Error details:', JSON.stringify(error.error, null, 2));
              if (error.error.errors && Array.isArray(error.error.errors)) {
                error.error.errors.forEach((err: any) => {
                  console.error(`API Error: ${err.code || 'Unknown'} - ${err.detail || err.title || 'No details'}`);
                });
              }
            }
            if (error.status === 400) {
              console.warn(`Bad Request (400) - Flight: ${carrierCode}${number}, Date: ${date || 'today'}`);
              console.warn('Possible issues:');
              console.warn('1. Flight number format (expected: XX1234, e.g., AF123, LH456)');
              console.warn('2. Date format (expected: YYYY-MM-DD)');
              console.warn('3. Endpoint /v2/schedule/flights may not be available in free tier');
              console.warn('4. Flight may not exist in the schedule for the given date');
            }
            return of(null);
          })
        );
      })
    );
  }

  /**
   * Get Amadeus OAuth access token
   */
  private getAmadeusToken(clientId: string, clientSecret: string, apiUrl: string): Observable<string | null> {
    // Check if we have a valid cached token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return of(this.accessToken);
    }

    const tokenUrl = `${apiUrl}/v1/security/oauth2/token`;
    const body = `grant_type=client_credentials&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<any>(tokenUrl, body, { headers }).pipe(
      map(response => {
        if (response.access_token) {
          this.accessToken = response.access_token;
          // Token expires in response.expires_in seconds, cache for slightly less
          this.tokenExpiry = Date.now() + (response.expires_in - 60) * 1000;
          return this.accessToken;
        }
        return null;
      }),
      catchError(error => {
        console.error('Error getting Amadeus token:', error);
        return of(null);
      })
    );
  }

  /**
   * Fetch flight info using AviationStack API (Free tier: 100 requests/month)
   * This API is designed to CHECK existing flight status, not to book flights
   */
  private fetchWithAviationStack(flightNumber: string, date: string | undefined, config: any): Observable<FlightInfo | null> {
    const apiKey = config.api.flight.aviationStack.apiKey;
    const apiUrl = config.api.flight.aviationStack.apiUrl;

    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      console.warn('AviationStack API key not configured. Please set it in assets/config.json');
      console.warn('Get your free API key at: https://aviationstack.com/');
      return of(null);
    }

    const flightCode = this.extractFlightCode(flightNumber);
    
    // Log for debugging (remove in production)
    console.log('AviationStack API Request:', {
      url: apiUrl,
      flightCode: flightCode,
      apiKeyLength: apiKey.length,
      apiKeyPreview: apiKey.substring(0, 8) + '...'
    });
    
    let params = new HttpParams()
      .set('access_key', apiKey.trim()) // Trim any whitespace
      .set('flight_iata', flightCode)
      .set('limit', '1');

    // Add date if provided (format: YYYY-MM-DD)
    if (date) {
      const formattedDate = this.formatDateForAPI(date);
      if (formattedDate) {
        params = params.set('flight_date', formattedDate);
      }
    }

    return this.http.get<any>(apiUrl, { params }).pipe(
      map(response => {
        if (response.data && response.data.length > 0) {
          return this.mapAviationStackToFlightInfo(response.data[0]);
        }
        console.warn(`No flight data found for ${flightCode}${date ? ' on ' + date : ''}`);
        return null;
      }),
      catchError(error => {
        console.error('Error fetching flight info from AviationStack:', error);
        
        if (error.status === 401) {
          console.error('❌ 401 Unauthorized - Invalid API Key');
          console.error('Possible issues:');
          console.error('1. API key is incorrect or has been changed');
          console.error('2. API key has not been activated in your AviationStack dashboard');
          console.error('3. API key has expired or been revoked');
          console.error('4. There are extra spaces or characters in the API key');
          console.error('');
          console.error('To fix:');
          console.error('1. Go to https://aviationstack.com/dashboard');
          console.error('2. Check your API key');
          console.error('3. Make sure it\'s activated');
          console.error('4. Copy it exactly (no spaces) to config.json');
          if (error.error && error.error.error) {
            console.error('API Error Details:', error.error.error);
          }
        } else if (error.status === 429) {
          console.error('❌ 429 Rate Limit Exceeded');
          console.error('Free tier allows 100 requests/month.');
          console.error('Wait for the limit to reset or upgrade your plan.');
        } else if (error.error) {
          if (error.error.error) {
            console.error(`API Error: ${error.error.error.info || error.error.error.message || 'Unknown error'}`);
          }
        }
        
        return of(null);
      })
    );
  }

  /**
   * Fetch flight info using OpenSky Network API (Free: 4000 requests/day)
   * Note: OpenSky doesn't support direct flight number search, so we use a workaround
   */
  private fetchWithOpenSky(flightNumber: string, date: string | undefined, config: any): Observable<FlightInfo | null> {
    // OpenSky doesn't have a direct flight number search endpoint
    // We'll use the flights endpoint and filter by callsign
    const apiUrl = config.api.flight.opensky.apiUrl;
    const username = config.api.flight.opensky.username;
    const password = config.api.flight.opensky.password;

    // For now, return null as OpenSky requires a different approach
    // (would need to search all flights and filter, which is inefficient)
    console.warn('OpenSky Network does not support direct flight number search. Please use Amadeus or AviationStack.');
    return of(null);
  }

  /**
   * Extract carrier code and flight number separately
   * Examples: "AF123" -> { carrierCode: "AF", number: "123" }
   *           "LH456" -> { carrierCode: "LH", number: "456" }
   *           "AC10320" -> { carrierCode: "AC", number: "10320" }
   */
  private extractCarrierAndNumber(flightNumber: string): { carrierCode: string; number: string } {
    const cleaned = flightNumber.replace(/\s+/g, '').toUpperCase();
    
    // Match pattern: 2 letters followed by digits (most common IATA format)
    // Examples: AF123, LH456, AC10320
    const twoLetterMatch = cleaned.match(/^([A-Z]{2})(\d+)$/);
    if (twoLetterMatch) {
      return {
        carrierCode: twoLetterMatch[1],
        number: twoLetterMatch[2]
      };
    }
    
    // Match pattern: 3 letters followed by digits (less common)
    // Examples: SWA1234
    const threeLetterMatch = cleaned.match(/^([A-Z]{3})(\d+)$/);
    if (threeLetterMatch) {
      return {
        carrierCode: threeLetterMatch[1],
        number: threeLetterMatch[2]
      };
    }
    
    // Try to extract: any 2-3 letters at start followed by digits
    const flexibleMatch = cleaned.match(/^([A-Z]{2,3})(\d+)$/);
    if (flexibleMatch) {
      return {
        carrierCode: flexibleMatch[1],
        number: flexibleMatch[2]
      };
    }
    
    console.warn(`Could not parse flight number: ${flightNumber}. Expected format: XX1234 or XXX1234`);
    return { carrierCode: '', number: '' };
  }

  /**
   * Extract IATA flight code from flight number (for other APIs)
   */
  private extractFlightCode(flightNumber: string): string {
    const cleaned = flightNumber.replace(/\s+/g, '').toUpperCase();
    const match = cleaned.match(/^([A-Z]{2,3})(\d{1,4})$/);
    if (match) {
      return cleaned;
    }
    const airlineMatch = cleaned.match(/([A-Z]{2,3})(\d+)/);
    if (airlineMatch) {
      return cleaned;
    }
    return cleaned;
  }

  /**
   * Format date to YYYY-MM-DD format for API
   */
  private formatDateForAPI(date: string): string | null {
    if (!date) return null;
    
    // If already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    
    // Try to parse and format
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
      return null;
    }
    
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  /**
   * Map Amadeus API response to FlightInfo
   */
  private mapAmadeusToFlightInfo(flight: any, flightCode: string): FlightInfo {
    return {
      flightNumber: flightCode,
      airline: flight.carrierCode || '',
      departure: {
        airport: flight.departure?.iataCode || '',
        iata: flight.departure?.iataCode || '',
        scheduled: flight.departure?.at || '',
        terminal: flight.departure?.terminal || undefined,
        gate: undefined
      },
      arrival: {
        airport: flight.arrival?.iataCode || '',
        iata: flight.arrival?.iataCode || '',
        scheduled: flight.arrival?.at || '',
        terminal: flight.arrival?.terminal || undefined,
        gate: undefined
      },
      status: 'scheduled',
      aircraft: flight.aircraft?.code || undefined
    };
  }

  /**
   * Map AviationStack API response to FlightInfo
   */
  private mapAviationStackToFlightInfo(flight: any): FlightInfo {
    return {
      flightNumber: flight.flight?.iata || flight.flight?.number || '',
      airline: flight.airline?.name || '',
      departure: {
        airport: flight.departure?.airport || '',
        iata: flight.departure?.iata || '',
        scheduled: flight.departure?.scheduled || '',
        terminal: flight.departure?.terminal || undefined,
        gate: flight.departure?.gate || undefined
      },
      arrival: {
        airport: flight.arrival?.airport || '',
        iata: flight.arrival?.iata || '',
        scheduled: flight.arrival?.scheduled || '',
        terminal: flight.arrival?.terminal || undefined,
        gate: flight.arrival?.gate || undefined
      },
      status: flight.flight_status || 'unknown',
      aircraft: flight.aircraft?.iata || undefined
    };
  }
}
