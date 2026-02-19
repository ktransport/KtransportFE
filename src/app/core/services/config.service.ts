import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';

export interface AppConfig {
  api: {
    flight: {
      provider: 'aviationstack' | 'opensky' | 'amadeus';
      aviationStack: {
        apiKey: string;
        apiUrl: string;
      };
      opensky: {
        apiUrl: string;
        username: string;
        password: string;
      };
      amadeus: {
        clientId: string;
        clientSecret: string;
        apiUrl: string;
      };
    };
  };
  whatsapp: {
    number: string;
    defaultMessage: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    addressSecondary?: string;
  };
  map: {
    defaultLatitude: number;
    defaultLongitude: number;
    defaultZoom: number;
  };
  backend: {
    apiUrl: string;
    endpoints: {
      bookings?: {
        base: string;
        initialRequest: string;
        validateToken: string;
        complete: string;
        status: string;
      };
      admin?: {
        base: string;
        approve: string;
        reject: string;
      };
      contact: string;
      transfer: string;
      events: string;
      tourism: string;
      chauffeurs: string;
      partnership: string;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config$: Observable<AppConfig> | null = null;
  private configCache: AppConfig | null = null;

  constructor(private http: HttpClient) { }

  /**
   * Load configuration from config.json
   * Uses caching to avoid multiple HTTP requests
   */
  loadConfig(): Observable<AppConfig> {
    if (this.config$) {
      return this.config$;
    }

    this.config$ = this.http.get<AppConfig>('/assets/config.json').pipe(
      catchError(error => {
        console.error('Error loading config.json, using defaults:', error);
        return of(this.getDefaultConfig());
      }),
      shareReplay(1)
    );

    this.config$.subscribe(config => {
      this.configCache = config;
    });

    return this.config$;
  }

  /**
   * Get configuration synchronously (must be called after loadConfig)
   */
  getConfig(): AppConfig {
    if (this.configCache) {
      return this.configCache;
    }
    return this.getDefaultConfig();
  }

  /**
   * Get default configuration as fallback
   */
  private getDefaultConfig(): AppConfig {
    return {
      api: {
        flight: {
          provider: 'aviationstack',
          aviationStack: {
            apiKey: 'YOUR_API_KEY_HERE',
            apiUrl: 'https://api.aviationstack.com/v1/flights'
          },
          opensky: {
            apiUrl: 'https://opensky-network.org/api',
            username: '',
            password: ''
          },
          amadeus: {
            clientId: 'YOUR_CLIENT_ID_HERE',
            clientSecret: 'YOUR_CLIENT_SECRET_HERE',
            apiUrl: 'https://test.api.amadeus.com'
          }
        }
      },
      whatsapp: {
        number: '+33680282572',
        defaultMessage: 'Bonjour, je souhaite réserver un transport.'
      },
      contact: {
        email: 'bilal.ktransport@hotmail.com',
        phone: '+33 6 80 28 25 72',
        address: '99 Avenue Albert 1er siège, 92500 Rueil-Malmaison, France',
        addressSecondary: '6B Avenue Durante, 06000 Nice, France'
      },
      map: {
        defaultLatitude: 48.8847,
        defaultLongitude: 2.1700,
        defaultZoom: 15
      },
      backend: {
        apiUrl: 'https://api.ktransport.online',
        endpoints: {
          bookings: {
            base: '/api/v1/bookings',
            initialRequest: '/api/v1/bookings/initial-request',
            validateToken: '/api/v1/bookings/validate-token',
            complete: '/api/v1/bookings',
            status: '/api/v1/bookings'
          },
          admin: {
            base: '/api/v1/admin/bookings',
            approve: '/api/v1/admin/bookings',
            reject: '/api/v1/admin/bookings'
          },
          contact: '/forms/contact',
          transfer: '/forms/transfer',
          events: '/forms/events',
          tourism: '/forms/tourism',
          chauffeurs: '/forms/chauffeurs',
          partnership: '/forms/partnership'
        }
      }
    };
  }
}

