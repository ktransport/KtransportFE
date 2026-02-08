import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

// Mock storage for booking data (simulates backend database)
const mockBookings: Map<string, any> = new Map();
const mockTokens: Map<string, any> = new Map();

// Initialize some mock data for testing
function initializeMockData() {
  // Create a test booking with valid token
  const testBookingId = 'BK-2024-001234';
  const testToken = 'test-token-valid-12345';
  const testClientInfo = {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+33123456789'
  };

  mockBookings.set(testBookingId, {
    bookingId: testBookingId,
    status: 'approved',
    clientInfo: testClientInfo,
    serviceType: 'transfer',
    createdAt: new Date().toISOString(),
    approvedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    expiresAt: new Date(Date.now() + 48 * 3600000).toISOString(), // 48 hours from now
    tokenUsed: false
  });

  mockTokens.set(testToken, {
    bookingId: testBookingId,
    valid: true,
    tokenUsed: false,
    expiresAt: new Date(Date.now() + 48 * 3600000).toISOString()
  });

  // Create an expired token for testing
  const expiredToken = 'test-token-expired-12345';
  mockTokens.set(expiredToken, {
    bookingId: 'BK-2024-EXPIRED',
    valid: false,
    tokenUsed: false,
    expiresAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    error: 'TOKEN_EXPIRED'
  });

  // Create a used token for testing
  const usedToken = 'test-token-used-12345';
  mockTokens.set(usedToken, {
    bookingId: 'BK-2024-USED',
    valid: false,
    tokenUsed: true,
    error: 'TOKEN_ALREADY_USED'
  });
}

// Initialize mock data on first load
initializeMockData();

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  // Check if this is a request to real backend (any absolute URL with http/https)
  // If URL starts with http:// or https://, bypass mock and use real backend
  // This allows the configured backend URL from config.json to work properly
  if (req.url.startsWith('http://') || req.url.startsWith('https://')) {
    // Let real backend requests pass through
    return next(req);
  }

  // Intercept form submissions and return mock responses (only for relative URLs)
  if (req.url.includes('/api/forms/') && !req.url.startsWith('http')) {
    const mockResponse = new HttpResponse({
      body: {
        success: true,
        message: 'Form submitted successfully',
        data: { id: Date.now() }
      },
      status: 200,
      statusText: 'OK',
      url: req.url
    });
    return of(mockResponse).pipe(delay(800));
  }

  // Intercept booking API endpoints (only for relative URLs, not absolute backend URLs)
  if (req.url.includes('/api/v1/bookings') && !req.url.startsWith('http')) {
    // POST /api/v1/bookings/initial-request
    if (req.method === 'POST' && req.url.includes('/initial-request')) {
      const requestBody = req.body as any;
      const bookingId = `BK-2024-${String(Date.now()).slice(-6)}`;
      const token = `mock-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Store booking in mock storage
      const booking = {
        bookingId,
        status: 'pending',
        clientInfo: {
          fullName: requestBody.fullName,
          email: requestBody.email,
          phone: requestBody.phone
        },
        serviceType: requestBody.serviceType,
        preferredContact: requestBody.preferredContact,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 48 * 3600000).toISOString(), // 48 hours
        tokenUsed: false
      };
      
      mockBookings.set(bookingId, booking);
      mockTokens.set(token, {
        bookingId,
        valid: true,
        tokenUsed: false,
        expiresAt: booking.expiresAt
      });

      const mockResponse = new HttpResponse({
        body: {
          bookingId,
          status: 'pending',
          message: 'Your booking request has been submitted. You will receive a confirmation link once approved.',
          estimatedResponseTime: '2-4 hours'
        },
        status: 201,
        statusText: 'Created',
        url: req.url
      });
      
      // Simulate network delay
      return of(mockResponse).pipe(delay(1000));
    }

    // GET /api/v1/bookings/validate-token
    if (req.method === 'GET' && req.url.includes('/validate-token')) {
      // Parse token from query params
      let token: string | null = null;
      if (req.url.includes('?')) {
        const queryString = req.url.split('?')[1];
        const params = queryString.split('&');
        for (const param of params) {
          const [key, value] = param.split('=');
          if (key === 'token') {
            token = decodeURIComponent(value);
            break;
          }
        }
      }

      if (!token) {
        return throwError(() => new HttpErrorResponse({
          error: { error: 'TOKEN_NOT_FOUND', message: 'Token is required' },
          status: 400,
          statusText: 'Bad Request'
        })).pipe(delay(500));
      }

      // Check if token exists in mock storage
      const tokenData = mockTokens.get(token);
      
      if (!tokenData) {
        const errorResponse = new HttpResponse({
          body: {
            valid: false,
            error: 'TOKEN_NOT_FOUND',
            message: 'This booking link was not found.'
          },
          status: 200, // Return 200 with valid: false
          statusText: 'OK',
          url: req.url
        });
        return of(errorResponse).pipe(delay(500));
      }

      // Check if token is expired
      if (tokenData.expiresAt && new Date(tokenData.expiresAt) < new Date()) {
        const errorResponse = new HttpResponse({
          body: {
            valid: false,
            error: 'TOKEN_EXPIRED',
            message: 'This booking link has expired.'
          },
          status: 200,
          statusText: 'OK',
          url: req.url
        });
        return of(errorResponse).pipe(delay(500));
      }

      // Check if token is already used
      if (tokenData.tokenUsed) {
        const errorResponse = new HttpResponse({
          body: {
            valid: false,
            error: 'TOKEN_ALREADY_USED',
            message: 'This booking link has already been used.'
          },
          status: 200,
          statusText: 'OK',
          url: req.url
        });
        return of(errorResponse).pipe(delay(500));
      }

      // Get booking data
      const booking = mockBookings.get(tokenData.bookingId);
      
      if (!booking) {
        const errorResponse = new HttpResponse({
          body: {
            valid: false,
            error: 'BOOKING_NOT_FOUND',
            message: 'Booking not found.'
          },
          status: 200,
          statusText: 'OK',
          url: req.url
        });
        return of(errorResponse).pipe(delay(500));
      }

      // Return valid token response
      const successResponse = new HttpResponse({
        body: {
          valid: true,
          bookingId: booking.bookingId,
          clientInfo: booking.clientInfo,
          serviceType: booking.serviceType,
          expiresAt: booking.expiresAt,
          tokenUsed: false
        },
        status: 200,
        statusText: 'OK',
        url: req.url
      });
      
      return of(successResponse).pipe(delay(500));
    }

    // POST /api/v1/bookings/{bookingId}/complete
    if (req.method === 'POST' && req.url.includes('/complete')) {
      const urlParts = req.url.split('/');
      const bookingIdIndex = urlParts.findIndex(part => part === 'bookings') + 1;
      const bookingId = urlParts[bookingIdIndex];
      
      // Get authorization token from headers
      const authHeader = req.headers.get('Authorization');
      const token = authHeader ? authHeader.replace('Bearer ', '') : null;

      if (!token) {
        return throwError(() => new HttpErrorResponse({
          error: { error: 'UNAUTHORIZED', message: 'Token is required' },
          status: 401,
          statusText: 'Unauthorized'
        })).pipe(delay(500));
      }

      // Validate token
      const tokenData = mockTokens.get(token);
      if (!tokenData || tokenData.bookingId !== bookingId) {
        return throwError(() => new HttpErrorResponse({
          error: { error: 'INVALID_TOKEN', message: 'Invalid token' },
          status: 401,
          statusText: 'Unauthorized'
        })).pipe(delay(500));
      }

      // Mark token as used
      tokenData.tokenUsed = true;
      mockTokens.set(token, tokenData);

      // Update booking
      const booking = mockBookings.get(bookingId);
      if (booking) {
        booking.status = 'completed';
        booking.serviceDetails = req.body;
        booking.completedAt = new Date().toISOString();
        mockBookings.set(bookingId, booking);
      }

      const confirmationNumber = `CNF-2024-${String(Date.now()).slice(-6)}`;
      
      const successResponse = new HttpResponse({
        body: {
          bookingId,
          status: 'completed',
          message: 'Your booking has been confirmed. You will receive detailed information via your preferred contact method.',
          confirmationNumber
        },
        status: 200,
        statusText: 'OK',
        url: req.url
      });
      
      return of(successResponse).pipe(delay(1000));
    }

    // GET /api/v1/bookings/{bookingId}/status
    if (req.method === 'GET' && req.url.includes('/status')) {
      const urlParts = req.url.split('/');
      const bookingIdIndex = urlParts.findIndex(part => part === 'bookings') + 1;
      const bookingId = urlParts[bookingIdIndex];

      const booking = mockBookings.get(bookingId);
      
      if (!booking) {
        return throwError(() => new HttpErrorResponse({
          error: { error: 'BOOKING_NOT_FOUND', message: 'Booking not found' },
          status: 404,
          statusText: 'Not Found'
        })).pipe(delay(500));
      }

      let currentStep: 'pending_approval' | 'waiting_for_details' | 'completed';
      let message: string;

      if (booking.status === 'pending') {
        currentStep = 'pending_approval';
        message = 'Your booking request is pending approval. You will receive a confirmation link once approved.';
      } else if (booking.status === 'approved') {
        currentStep = 'waiting_for_details';
        message = 'Your booking has been approved. Please complete the booking form using the link sent to you.';
      } else if (booking.status === 'completed') {
        currentStep = 'completed';
        message = 'Your booking has been completed successfully.';
      } else {
        currentStep = 'pending_approval';
        message = 'Your booking request is being processed.';
      }

      const statusResponse = new HttpResponse({
        body: {
          bookingId: booking.bookingId,
          status: booking.status,
          currentStep,
          message,
          createdAt: booking.createdAt,
          approvedAt: booking.approvedAt,
          expiresAt: booking.expiresAt
        },
        status: 200,
        statusText: 'OK',
        url: req.url
      });
      
      return of(statusResponse).pipe(delay(500));
    }
  }

  // Let other requests pass through
  return next(req);
};
