# How to Edit config.json in the Frontend

## File Location
```
ktransportFE/src/assets/config.json
```

## Quick Edit Instructions

### Method 1: Direct Edit (Recommended)
1. **Open the file** in your IDE/editor:
   - Path: `ktransportFE/src/assets/config.json`
   - Or navigate: `Ktransporte/ktransportFE/src/assets/config.json`

2. **Edit the JSON** (make sure to maintain valid JSON syntax)
3. **Save the file**
4. **Refresh your browser** - The Angular dev server will automatically reload

### Method 2: Using Command Line
```powershell
# Navigate to the frontend directory
cd ktransportFE/src/assets

# Edit with notepad (Windows)
notepad config.json

# Or use your preferred editor
code config.json  # VS Code
```

## Configuration Structure

The `config.json` file contains the following sections:

### 1. Backend API Configuration
```json
"backend": {
  "apiUrl": "http://localhost:8080/api",
  "endpoints": {
    "contact": "/forms/contact",
    "transfer": "/forms/transfer",
    "events": "/forms/events",
    "tourism": "/forms/tourism",
    "chauffeurs": "/forms/chauffeurs",
    "partnership": "/forms/partnership"
  }
}
```

**Important:** The booking endpoints (`/api/v1/bookings/*`) are automatically constructed using `backend.apiUrl`, so you only need to set the base URL.

### 2. Contact Information
```json
"contact": {
  "email": "contact@ktransport.fr",
  "phone": "+33 1 23 45 67 89",
  "address": "123 Avenue des Champs-Élysées, 75008 Paris, France"
}
```

### 3. WhatsApp Configuration
```json
"whatsapp": {
  "number": "+21698910068",
  "defaultMessage": "Bonjour, je souhaite réserver un transport."
}
```

### 4. Map Settings
```json
"map": {
  "defaultLatitude": 48.8698,
  "defaultLongitude": 2.3079,
  "defaultZoom": 15
}
```

### 5. Flight API Configuration
```json
"api": {
  "flight": {
    "provider": "aviationstack",
    "aviationStack": {
      "apiKey": "your-api-key-here",
      "apiUrl": "https://api.aviationstack.com/v1/flights"
    }
  }
}
```

## Common Edits

### Change Backend URL (Production)
```json
"backend": {
  "apiUrl": "https://api.yourdomain.com/api"
}
```

### Update Contact Information
```json
"contact": {
  "email": "your-email@example.com",
  "phone": "+33 1 23 45 67 89",
  "address": "Your Address Here"
}
```

### Change WhatsApp Number
```json
"whatsapp": {
  "number": "+1234567890",
  "defaultMessage": "Hello, I would like to book a transport."
}
```

### Update Map Location
```json
"map": {
  "defaultLatitude": 48.8566,  // Paris coordinates
  "defaultLongitude": 2.3522,
  "defaultZoom": 12
}
```

## Important Notes

### ⚠️ JSON Syntax Rules
- Always use double quotes `"` for strings
- No trailing commas
- Proper comma placement between properties
- Valid JSON structure

### ✅ Valid Example
```json
{
  "backend": {
    "apiUrl": "http://localhost:8080/api"
  }
}
```

### ❌ Invalid Examples
```json
// Missing quotes
{
  backend: {
    apiUrl: "http://localhost:8080/api"
  }
}

// Trailing comma
{
  "backend": {
    "apiUrl": "http://localhost:8080/api",  // ❌ No comma here
  }
}
```

## How It's Loaded

The `config.json` file is:
1. **Loaded at runtime** by `ConfigService`
2. **Cached** after first load
3. **Used throughout** the application for API calls and configuration

## After Editing

1. **Save the file**
2. **Check browser console** for any JSON parsing errors
3. **Refresh the page** if changes don't appear
4. **Restart dev server** if needed:
   ```powershell
   # Stop current server (Ctrl+C)
   # Then restart
   cd ktransportFE
   npm start
   ```

## Validation

To validate your JSON before saving:
1. Use an online JSON validator: https://jsonlint.com/
2. Or use VS Code - it will show errors if JSON is invalid
3. Check browser console for loading errors

## Environment-Specific Configs (Advanced)

For different environments (dev, staging, production), you can:

1. **Create multiple config files:**
   - `config.dev.json`
   - `config.prod.json`

2. **Update `angular.json`** to use different configs based on build:
   ```json
   "assets": [
     {
       "input": "src/assets",
       "glob": "config.*.json",
       "output": "/assets"
     }
   ]
   ```

3. **Or use environment files** (Angular's built-in feature):
   - `src/environments/environment.ts`
   - `src/environments/environment.prod.ts`

## Troubleshooting

### Issue: Changes not reflecting
**Solution:**
- Hard refresh browser (Ctrl+Shift+R or Ctrl+F5)
- Clear browser cache
- Restart Angular dev server

### Issue: JSON parse error
**Solution:**
- Validate JSON syntax
- Check for trailing commas
- Ensure all strings are in double quotes
- Use a JSON validator

### Issue: API calls failing after config change
**Solution:**
- Verify `backend.apiUrl` is correct
- Check CORS settings on backend
- Ensure backend is running
- Check browser console for errors

## Current Configuration

Your current `config.json` includes:
- ✅ Backend API URL: `http://localhost:8080/api`
- ✅ Contact information
- ✅ WhatsApp number
- ✅ Map coordinates
- ✅ Flight API configuration

The booking endpoints are automatically constructed as:
- `{backend.apiUrl}/v1/bookings/initial-request`
- `{backend.apiUrl}/v1/bookings/validate-token`
- `{backend.apiUrl}/v1/bookings/{bookingId}/complete`
- `{backend.apiUrl}/v1/bookings/{bookingId}/status`

