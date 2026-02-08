# Mock Booking Data for Frontend Testing

This document describes the mock data available for testing the booking workflow without a backend.

## Test Tokens

The mock interceptor includes several pre-configured test tokens for different scenarios:

### 1. Valid Token (Approved Booking)
- **Token**: `test-token-valid-12345`
- **Booking ID**: `BK-2024-001234`
- **Status**: `approved`
- **Client Info**:
  - Name: John Doe
  - Email: john.doe@example.com
  - Phone: +33123456789
- **Service Type**: `transfer`
- **Usage**: Use this token to test the complete booking flow with an approved booking

**Test URL**: `/transfer?token=test-token-valid-12345`

### 2. Expired Token
- **Token**: `test-token-expired-12345`
- **Status**: `expired`
- **Usage**: Use this token to test error handling for expired links

**Test URL**: `/transfer?token=test-token-expired-12345`

### 3. Used Token
- **Token**: `test-token-used-12345`
- **Status**: `already_used`
- **Usage**: Use this token to test error handling for already-used links

**Test URL**: `/transfer?token=test-token-used-12345`

## Mock API Endpoints

### 1. POST `/api/v1/bookings/initial-request`
**Request Body:**
```json
{
  "fullName": "Jane Smith",
  "email": "jane.smith@example.com",
  "phone": "+33123456789",
  "preferredContact": "whatsapp",
  "serviceType": "transfer"
}
```

**Response (201 Created):**
```json
{
  "bookingId": "BK-2024-123456",
  "status": "pending",
  "message": "Your booking request has been submitted. You will receive a confirmation link once approved.",
  "estimatedResponseTime": "2-4 hours"
}
```

### 2. GET `/api/v1/bookings/validate-token?token=xxx`
**Response (200 OK) - Valid Token:**
```json
{
  "valid": true,
  "bookingId": "BK-2024-001234",
  "clientInfo": {
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+33123456789"
  },
  "serviceType": "transfer",
  "expiresAt": "2024-01-17T10:00:00Z",
  "tokenUsed": false
}
```

**Response (200 OK) - Invalid Token:**
```json
{
  "valid": false,
  "error": "TOKEN_EXPIRED",
  "message": "This booking link has expired."
}
```

### 3. POST `/api/v1/bookings/{bookingId}/complete`
**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "date": "2024-01-20",
  "time": "14:30",
  "flight": "AF123",
  "passengers": 2,
  "luggage": 3,
  "pickupLocation": "Terminal 2E",
  "dropoffAddress": "123 Avenue des Champs-Élysées, Paris",
  "notes": "Special requests..."
}
```

**Response (200 OK):**
```json
{
  "bookingId": "BK-2024-001234",
  "status": "completed",
  "message": "Your booking has been confirmed. You will receive detailed information via your preferred contact method.",
  "confirmationNumber": "CNF-2024-123456"
}
```

### 4. GET `/api/v1/bookings/{bookingId}/status`
**Response (200 OK):**
```json
{
  "bookingId": "BK-2024-001234",
  "status": "approved",
  "currentStep": "waiting_for_details",
  "message": "Your booking has been approved. Please complete the booking form using the link sent to you.",
  "createdAt": "2024-01-15T10:00:00Z",
  "approvedAt": "2024-01-15T11:30:00Z",
  "expiresAt": "2024-01-17T10:00:00Z"
}
```

## Testing Workflow

### Complete Booking Flow Test

1. **Start Booking (Gateway 1)**
   - Navigate to: `/booking?service=transfer`
   - Fill in the form with any test data
   - Submit the form
   - You'll receive a booking ID (e.g., `BK-2024-123456`)

2. **Simulate Admin Approval**
   - In a real scenario, the admin would approve and send a token link
   - For testing, use the pre-configured valid token: `test-token-valid-12345`
   - Navigate to: `/transfer?token=test-token-valid-12345`

3. **Complete Booking (Gateway 2)**
   - The form should be pre-populated with client info
   - Basic fields (name, email, phone) should be read-only
   - Fill in service-specific details
   - Submit the form
   - You'll be redirected to the booking status page

4. **Check Booking Status**
   - Navigate to: `/booking-status/BK-2024-001234`
   - View the booking status and details

### Error Scenario Tests

1. **Expired Token**
   - Navigate to: `/transfer?token=test-token-expired-12345`
   - Should redirect to error page with "Link Expired" message

2. **Used Token**
   - Navigate to: `/transfer?token=test-token-used-12345`
   - Should redirect to error page with "Link Already Used" message

3. **Invalid Token**
   - Navigate to: `/transfer?token=invalid-token-12345`
   - Should redirect to error page with "Link Not Found" message

4. **No Token**
   - Navigate to: `/transfer` (without token)
   - Should redirect to booking gateway: `/booking?service=transfer`

## Mock Data Storage

The mock interceptor uses in-memory storage (Maps) to simulate a database:
- `mockBookings`: Stores booking data by booking ID
- `mockTokens`: Stores token validation data by token

**Note**: Mock data is reset on page refresh. All bookings and tokens created during a session are lost when you reload the page.

## Service Types

Supported service types for testing:
- `transfer` - Airport Transfer
- `events` - Events & MICE
- `chauffeur` - VIP & Protocol
- `tourism` - Private Tours & Day Hire
- `partnerships` - Partnerships

## Testing Tips

1. **Use Browser DevTools**: Check the Network tab to see mock API calls
2. **Console Logs**: The interceptor logs token validation and booking operations
3. **Token Generation**: New tokens are generated automatically when creating bookings
4. **Status Updates**: Booking status can be checked via the status endpoint
5. **Error Testing**: Use the pre-configured error tokens to test error handling

## Next Steps

Once the backend is ready:
1. Remove or disable the mock interceptor
2. Update the `ConfigService` with the real backend URL
3. The frontend will automatically use the real API endpoints

