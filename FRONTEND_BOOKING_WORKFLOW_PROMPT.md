# Frontend Booking Workflow Implementation Prompt

## Overview
Implement a two-gateway booking system where clients first provide basic information, receive admin approval, then complete service-specific forms via single-use links.

## Current State Analysis
- Services page has 6 service cards linking to different service pages
- Each service page has its own form with service-specific fields
- Forms currently submit directly without approval workflow
- No integration with WhatsApp/Telegram for notifications
- No single-use link system

## Required Frontend Changes

### 1. Services Page Modifications (`src/app/pages/services/services.component.html`)

#### Changes Needed:
- **Service Card Links**: Modify routerLink to pass service identifier as query parameter or route data
  - Current: `routerLink="/transfer"` 
  - New: `routerLink="/booking" [queryParams]="{service: 'transfer'}"` OR use route data
- **Service Identifiers**: Each service needs a unique identifier:
  - `transfer` - Airport Transfer
  - `events` - Events & MICE
  - `chauffeur` - VIP & Protocol
  - `tourism` - Private Tours & Day Hire
  - `partnerships` - Partnerships (if applicable)
  - `corporate` - Business Travel (if applicable)

### 2. New Booking Gateway Component (`src/app/pages/booking/booking.component.ts`)

#### Purpose:
Universal entry point that captures basic client information and service type before routing to service-specific forms.

#### Component Structure:
```
booking.component.ts
├── Template: Basic info form (Gateway 1)
├── Form Fields:
│   ├── fullName (required)
│   ├── email (required, email validation)
│   ├── phone (required, international format)
│   ├── preferredContact (radio: 'whatsapp' | 'telegram' | 'email')
│   └── serviceType (hidden, from route/query param)
├── Submit Handler:
│   ├── Validate form
│   ├── Call backend API: POST /api/bookings/initial-request
│   ├── Show loading state
│   └── Display success message with next steps
└── Success State:
    ├── Message: "Your request has been submitted. You will receive a confirmation link via [preferred contact method] once approved."
    └── Optional: Show booking reference number
```

#### Route Configuration:
- **Route**: `/booking` or `/booking/:serviceType`
- **Query Params**: `?service=transfer` (alternative approach)
- **Route Guard**: None (public access)
- **Data Passing**: Service type must be preserved through navigation

### 3. Service-Specific Form Components (Modify Existing)

#### Components to Modify:
- `transfer.component.ts`
- `events.component.ts`
- `chauffeurs.component.ts`
- `tourism.component.ts`

#### Changes Required:

**A. Route Protection:**
- Add route guard that checks for valid single-use token
- Token passed as query parameter: `/transfer?token=abc123xyz`
- Guard validates token with backend before allowing access
- If invalid/expired: redirect to error page with message

**B. Form Modifications:**
- Pre-populate basic info (name, email, phone) from token validation response
- Make basic fields read-only (already provided in Gateway 1)
- Only show service-specific fields as editable
- Add hidden field: `bookingToken` (from URL query param)
- Modify submit handler to include token in submission

**C. Success State:**
- After successful submission, invalidate the token (mark as used)
- Show confirmation message
- Optionally redirect to home or booking status page

### 4. New Components to Create

#### A. Booking Status Component (`src/app/pages/booking-status/booking-status.component.ts`)
- **Purpose**: Show booking status after initial submission
- **Features**:
  - Display booking reference number
  - Show status: "Pending Approval" → "Approved" → "Completed"
  - Display expected next steps
  - Show countdown/estimated time for approval (if applicable)

#### B. Token Validation Guard (`src/app/guards/booking-token.guard.ts`)
- **Purpose**: Protect service-specific form routes
- **Logic**:
  - Extract token from query params
  - Call backend: `GET /api/bookings/validate-token?token=xxx`
  - If valid: allow access, store booking data in service/component state
  - If invalid: redirect to error page
  - Handle expired tokens gracefully

#### C. Error Component (`src/app/pages/booking-error/booking-error.component.ts`)
- **Purpose**: Display token-related errors
- **Scenarios**:
  - Invalid token
  - Expired token
  - Already used token
  - Token not found
- **Actions**: Provide link to start new booking

### 5. Routing Configuration Updates (`src/app/app.routes.ts`)

#### New Routes:
```typescript
{
  path: 'booking',
  component: BookingComponent,
  data: { title: 'Booking Request' }
},
{
  path: 'booking/:serviceType',
  component: BookingComponent,
  data: { title: 'Booking Request' }
},
{
  path: 'transfer',
  component: TransferComponent,
  canActivate: [BookingTokenGuard], // Only if token present
  data: { requiresToken: true }
},
{
  path: 'events',
  component: EventsComponent,
  canActivate: [BookingTokenGuard],
  data: { requiresToken: true }
},
// Similar for other service routes
{
  path: 'booking-status/:bookingId',
  component: BookingStatusComponent
},
{
  path: 'booking-error',
  component: BookingErrorComponent
}
```

### 6. Service Integration Updates

#### A. Booking Service (`src/app/core/services/booking.service.ts`)
**New Service Methods:**
```typescript
- submitInitialRequest(data: InitialBookingRequest): Observable<BookingResponse>
- validateToken(token: string): Observable<TokenValidationResponse>
- submitServiceDetails(token: string, data: ServiceDetails): Observable<BookingConfirmation>
- getBookingStatus(bookingId: string): Observable<BookingStatus>
```

**Data Models:**
```typescript
interface InitialBookingRequest {
  fullName: string;
  email: string;
  phone: string;
  preferredContact: 'whatsapp' | 'telegram' | 'email';
  serviceType: string;
}

interface BookingResponse {
  bookingId: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
}

interface TokenValidationResponse {
  valid: boolean;
  bookingId?: string;
  clientInfo?: {
    fullName: string;
    email: string;
    phone: string;
  };
  serviceType?: string;
  expiresAt?: string;
}

interface ServiceDetails {
  // Service-specific fields (varies by service type)
  [key: string]: any;
}
```

### 7. UI/UX Enhancements

#### A. Loading States
- Show spinner during initial request submission
- Show progress indicator: "Step 1 of 2: Basic Information Submitted"
- Disable form during submission

#### B. Success Messages
- Clear messaging about next steps
- Display booking reference number prominently
- Explain approval process timeline
- Show contact method preference confirmation

#### C. Error Handling
- Form validation errors (client-side)
- API error messages (server-side)
- Network error handling
- Token validation error messages

#### D. Responsive Design
- Ensure forms work on mobile (important for WhatsApp/Telegram users)
- Touch-friendly buttons and inputs
- Clear visual hierarchy for multi-step process

### 8. State Management Considerations

#### Option A: Service-Based State (Recommended for simplicity)
- Store booking token in BookingService
- Store client info after token validation
- Clear state after form completion

#### Option B: Route-Based State
- Pass data via route state (Angular Router)
- Use query parameters for token
- Less persistent but simpler

#### Option C: Local Storage (For persistence)
- Store booking reference in localStorage
- Allow returning to booking status
- Clear after completion

### 9. Integration Points with Backend

#### API Endpoints Needed:
1. `POST /api/bookings/initial-request`
   - Body: InitialBookingRequest
   - Response: BookingResponse with bookingId

2. `GET /api/bookings/validate-token?token=xxx`
   - Response: TokenValidationResponse

3. `POST /api/bookings/{bookingId}/complete`
   - Body: ServiceDetails
   - Headers: Authorization token
   - Response: BookingConfirmation

4. `GET /api/bookings/{bookingId}/status`
   - Response: BookingStatus

### 10. Translation Updates

#### New Translation Keys Needed:
```json
{
  "booking": {
    "gateway1": {
      "title": "Request Your Service",
      "subtitle": "Start by providing your basic information",
      "fullName": "Full Name",
      "email": "Email",
      "phone": "Phone Number",
      "preferredContact": "Preferred Contact Method",
      "whatsapp": "WhatsApp",
      "telegram": "Telegram",
      "email_contact": "Email",
      "submit": "Submit Request",
      "success": {
        "title": "Request Submitted",
        "message": "Your request has been submitted. You will receive a confirmation link via {method} once approved.",
        "bookingId": "Booking Reference: {id}"
      }
    },
    "token": {
      "invalid": "Invalid or expired link",
      "used": "This link has already been used",
      "expired": "This link has expired. Please request a new booking.",
      "notFound": "Booking link not found"
    },
    "status": {
      "pending": "Pending Approval",
      "approved": "Approved - Complete Your Booking",
      "rejected": "Request Rejected",
      "completed": "Booking Completed"
    }
  }
}
```

### 11. Security Considerations

#### Frontend Security:
- **Token Storage**: Never store tokens in localStorage (use session or memory only)
- **HTTPS**: Ensure all API calls use HTTPS
- **Input Validation**: Client-side validation before submission
- **XSS Prevention**: Sanitize all user inputs
- **CSRF Protection**: Use Angular's built-in CSRF protection

#### Token Handling:
- Tokens should be single-use only
- Tokens should expire (configurable, e.g., 24-48 hours)
- Tokens should be cryptographically secure (generated by backend)
- Display minimal information until token is validated

### 12. User Flow Diagram

```
Services Page
    ↓ (Click Service Card)
Booking Gateway 1
    ↓ (Submit Basic Info)
Backend API → Admin Notification (Email/WhatsApp/Telegram)
    ↓ (Admin Approves)
Client Receives Link (WhatsApp/Telegram/Email)
    ↓ (Click Link)
Token Validation Guard
    ↓ (Token Valid)
Service-Specific Form (Gateway 2)
    ↓ (Submit Service Details)
Backend API → Booking Confirmed
    ↓
Success Page / Confirmation
```

### 13. Edge Cases to Handle

1. **User closes browser after Gateway 1**
   - Solution: Store bookingId in localStorage, allow status check

2. **Token expires before user clicks link**
   - Solution: Show clear error message, provide option to request new link

3. **User clicks link multiple times**
   - Solution: Backend should handle idempotency, frontend should show appropriate state

4. **Admin rejects request**
   - Solution: Client receives rejection notification, can start new booking

5. **Network failure during submission**
   - Solution: Retry mechanism, save form data locally, show error message

6. **User navigates directly to service form without token**
   - Solution: Redirect to booking gateway or show error

### 14. Testing Considerations

#### Unit Tests Needed:
- BookingService methods
- Token validation guard logic
- Form validation
- Error handling

#### Integration Tests Needed:
- Complete booking flow
- Token validation flow
- Error scenarios
- Navigation between steps

#### E2E Tests Needed:
- Full booking workflow
- Admin approval simulation
- Token link clicking
- Form completion

### 15. Accessibility Requirements

- ARIA labels for form fields
- Keyboard navigation support
- Screen reader compatibility
- Focus management between steps
- Error announcements
- Success message announcements

### 16. Performance Optimizations

- Lazy load service-specific form components
- Preload booking service
- Cache token validation results (short-lived)
- Optimize form rendering
- Minimize API calls

### 17. Analytics & Tracking

#### Events to Track:
- Booking gateway 1 submission
- Token link clicks
- Service form completion
- Drop-off points in flow
- Error occurrences

### 18. Future Enhancements (Optional)

1. **Booking Dashboard**: Client can view all their bookings
2. **Reschedule Option**: Allow rescheduling via token link
3. **Payment Integration**: Add payment step after approval
4. **Calendar Integration**: Show available slots
5. **Real-time Updates**: WebSocket for status updates
6. **Multi-language Support**: Extend to more languages
7. **Mobile App**: Native app for better WhatsApp/Telegram integration

### 19. Implementation Priority

#### Phase 1 (Core Functionality):
1. Create Booking Gateway component
2. Modify service routes to accept tokens
3. Implement token validation guard
4. Update service forms to use tokens
5. Basic error handling

#### Phase 2 (Enhancements):
1. Booking status component
2. Enhanced error pages
3. Loading states and animations
4. Better UX messaging

#### Phase 3 (Polish):
1. Analytics integration
2. Accessibility improvements
3. Performance optimizations
4. Advanced error recovery

### 20. Dependencies to Add

```json
{
  "dependencies": {
    // May need additional packages for:
    // - Token management utilities
    // - Form state persistence
    // - Better date/time handling for expiration
  }
}
```

## Questions for Backend Team

1. What is the expected token format and length?
2. What is the token expiration time?
3. How should we handle token refresh if needed?
4. What is the expected response time for admin approval?
5. Should we implement polling for status updates?
6. What notification channels are available (WhatsApp Business API, Telegram Bot API)?
7. How should we handle rate limiting for booking requests?
8. Should there be a maximum number of pending bookings per client?

## Notes

- Keep existing direct booking forms as fallback (optional)
- Ensure backward compatibility during transition
- Consider A/B testing the new flow
- Document all API contracts clearly
- Maintain translation support throughout

