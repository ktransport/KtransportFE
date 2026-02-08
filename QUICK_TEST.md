# 🚀 Quick Test Guide

## Server Status
The Angular dev server should be starting. Wait for it to compile, then open:
**http://localhost:4200**

## ⚡ Quick Test Steps

### Test 1: Complete Booking Flow (5 minutes)

1. **Open Services Page**
   ```
   http://localhost:4200/services
   ```

2. **Click "Airport Transfers" card**
   - Should redirect to: `/booking?service=transfer`
   - Fill the form:
     - Name: Test User
     - Email: test@example.com
     - Phone: +33123456789
     - Select preferred contact method
   - Click "Submit Request"
   - ✅ Should show success modal with booking ID

3. **Test with Pre-configured Token**
   ```
   http://localhost:4200/transfer?token=test-token-valid-12345
   ```
   - ✅ Form should be pre-populated with:
     - Name: John Doe (read-only)
     - Email: john.doe@example.com (read-only)
     - Phone: +33123456789 (read-only)
   - Fill in service details:
     - Date, Time
     - Flight number (optional)
     - Passengers, Luggage
     - Pickup/Dropoff locations
   - Click "Book"
   - ✅ Should redirect to status page

### Test 2: Error Scenarios (2 minutes)

1. **Expired Token**
   ```
   http://localhost:4200/transfer?token=test-token-expired-12345
   ```
   - ✅ Should show error page: "Link Expired"

2. **Used Token**
   ```
   http://localhost:4200/transfer?token=test-token-used-12345
   ```
   - ✅ Should show error page: "Link Already Used"

3. **No Token (Direct Access)**
   ```
   http://localhost:4200/transfer
   ```
   - ✅ Should redirect to: `/booking?service=transfer`

### Test 3: Check Browser DevTools

1. **Open DevTools** (F12)
2. **Network Tab**
   - Filter by "bookings"
   - ✅ Should see mocked API calls:
     - POST `/api/v1/bookings/initial-request`
     - GET `/api/v1/bookings/validate-token`
     - POST `/api/v1/bookings/{id}/complete`
   - ✅ Responses should have realistic delays (500-1000ms)

3. **Console Tab**
   - ✅ No errors should appear
   - ✅ Check for any warnings

## ✅ Success Indicators

### Booking Gateway (Step 1)
- [ ] Form loads correctly
- [ ] Validation works (required fields)
- [ ] Email validation works
- [ ] Radio buttons work
- [ ] Submit creates booking
- [ ] Success modal appears
- [ ] Booking ID displayed

### Service Form (Step 2)
- [ ] Token validation works
- [ ] Basic info pre-populated
- [ ] Basic fields are read-only (grayed out)
- [ ] Service fields are editable
- [ ] Form submission works
- [ ] Redirects to status page

### Error Handling
- [ ] Expired token shows error
- [ ] Used token shows error
- [ ] Invalid token shows error
- [ ] No token redirects correctly

### Mock API
- [ ] API calls are intercepted
- [ ] Responses are mocked
- [ ] Delays are realistic
- [ ] Booking IDs generated

## 🐛 Troubleshooting

### Server Not Starting
```bash
# Kill any existing processes
taskkill /F /IM node.exe

# Start fresh
npm start
```

### Port 4200 Already in Use
```bash
# Use different port
ng serve --port 4201
```

### Compilation Errors
- Check browser console
- Verify all imports are correct
- Check `read_lints` output

### Mock API Not Working
- Verify interceptor is in `app.config.ts`
- Check Network tab for API calls
- Verify URL patterns match

## 📝 Test Results Template

```
Date: ___________
Tester: ___________

✅ Booking Gateway: [ ] Pass [ ] Fail
✅ Token Validation: [ ] Pass [ ] Fail
✅ Form Pre-population: [ ] Pass [ ] Fail
✅ Form Submission: [ ] Pass [ ] Fail
✅ Error Handling: [ ] Pass [ ] Fail
✅ Mock API: [ ] Pass [ ] Fail

Notes:
_________________________________
_________________________________
```

## 🎯 Next Steps After Testing

1. If all tests pass → Ready for backend integration
2. If issues found → Document and fix
3. Test on different browsers
4. Test responsive design

