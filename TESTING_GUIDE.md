# Testing Guide for Booking Workflow

## Quick Test Steps

### 1. Start the Development Server
```bash
npm start
```
The server will start at `http://localhost:4200`

### 2. Test Complete Booking Flow

#### Step 1: Start a New Booking
1. Navigate to: `http://localhost:4200/services`
2. Click on any service card (e.g., "Airport Transfers")
3. You should be redirected to: `http://localhost:4200/booking?service=transfer`
4. Fill in the booking form:
   - Full Name: Test User
   - Email: test@example.com
   - Phone: +33123456789
   - Preferred Contact: Select WhatsApp, Telegram, or Email
5. Click "Submit Request"
6. You should see a success modal with a booking ID (e.g., `BK-2024-123456`)

#### Step 2: Test with Pre-configured Valid Token
1. Navigate directly to: `http://localhost:4200/transfer?token=test-token-valid-12345`
2. The form should:
   - Be pre-populated with: John Doe, john.doe@example.com, +33123456789
   - Show basic fields (name, email, phone) as read-only (grayed out)
   - Display an info message at the top
3. Fill in the service-specific details:
   - Date, Time
   - Flight number (optional)
   - Passengers, Luggage
   - Pickup/Dropoff locations
4. Click "Book" to submit
5. You should be redirected to: `http://localhost:4200/booking-status/BK-2024-001234`

#### Step 3: Check Booking Status
1. Navigate to: `http://localhost:4200/booking-status/BK-2024-001234`
2. You should see:
   - Booking status (Approved/Completed)
   - Booking reference number
   - Timestamps
   - Status message

### 3. Test Error Scenarios

#### Test Expired Token
1. Navigate to: `http://localhost:4200/transfer?token=test-token-expired-12345`
2. Should redirect to error page with "Link Expired" message

#### Test Used Token
1. Navigate to: `http://localhost:4200/transfer?token=test-token-used-12345`
2. Should redirect to error page with "Link Already Used" message

#### Test Invalid Token
1. Navigate to: `http://localhost:4200/transfer?token=invalid-token-12345`
2. Should redirect to error page with "Link Not Found" message

#### Test No Token (Direct Access)
1. Navigate to: `http://localhost:4200/transfer` (without token)
2. Should redirect to: `http://localhost:4200/booking?service=transfer`

### 4. Test Different Services

Try the booking flow with different service types:
- Transfer: `http://localhost:4200/booking?service=transfer`
- Events: `http://localhost:4200/booking?service=events`
- Tourism: `http://localhost:4200/booking?service=tourism`
- Chauffeur: `http://localhost:4200/booking?service=chauffeur`

## What to Check

### ✅ Success Indicators

1. **Booking Gateway (Step 1)**
   - Form validation works
   - All fields are required
   - Email validation works
   - Radio buttons for contact method work
   - Success modal appears after submission
   - Booking ID is displayed

2. **Service Form (Step 2)**
   - Token validation works
   - Basic info is pre-populated
   - Basic fields are read-only
   - Service-specific fields are editable
   - Form submission works
   - Redirect to status page works

3. **Error Handling**
   - Expired tokens show appropriate error
   - Used tokens show appropriate error
   - Invalid tokens show appropriate error
   - No token redirects to booking gateway

4. **Mock API**
   - Check browser DevTools Network tab
   - API calls should be intercepted
   - Responses should have realistic delays (500-1000ms)
   - Booking IDs should be generated

### 🐛 Common Issues

1. **Guard Not Working**
   - Check browser console for errors
   - Verify query params are being read correctly
   - Check if redirect is happening

2. **Form Not Pre-populating**
   - Check BookingStateService is storing data
   - Verify token validation response
   - Check browser console for errors

3. **API Calls Not Mocked**
   - Verify mock interceptor is registered in app.config.ts
   - Check Network tab - calls should not go to real server
   - Verify URL patterns match

4. **Translation Keys Missing**
   - Check browser console for missing translation warnings
   - Verify translations.json has all booking keys

## Browser DevTools Tips

1. **Network Tab**
   - Filter by "bookings" to see API calls
   - Check request/response payloads
   - Verify delays are working

2. **Console Tab**
   - Look for any errors
   - Check token validation logs
   - Verify booking state updates

3. **Application Tab**
   - Check localStorage for language preference
   - Verify no unexpected data storage

## Expected Console Output

When testing, you might see:
- Token validation logs (if added)
- Booking state updates
- Form submission confirmations

## Next Steps After Testing

1. If everything works: Ready for backend integration
2. If issues found: Check error messages and fix accordingly
3. Test with different browsers (Chrome, Firefox, Edge)
4. Test responsive design on mobile devices

## Notes

- Mock data resets on page refresh
- All bookings are stored in memory only
- Tokens are generated automatically
- Status can be checked via status endpoint

