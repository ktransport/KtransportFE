# Notification System Setup Guide

## Overview

Yes, you need to set up **business accounts** for both email and WhatsApp to enable the notification system. This guide explains what you need and how to set it up.

---

## 📧 Email Account Setup

### What You Need

**1. Business Email Account**
- ✅ A professional email address (e.g., `contact@ktransport.fr`, `bookings@ktransport.fr`)
- ✅ SMTP (Simple Mail Transfer Protocol) access
- ✅ Email account credentials (username/password or app password)

### Email Provider Options

#### Option 1: Gmail Business (Google Workspace)
**Pros:**
- Easy to set up
- Reliable delivery
- Good for small businesses
- Free tier available (limited)

**Setup Steps:**
1. Sign up for Google Workspace (or use Gmail)
2. Create business email: `contact@yourdomain.com`
3. Enable 2-Factor Authentication
4. Generate App Password (for SMTP)
5. Configure in Spring Boot application

**SMTP Settings:**
```
Host: smtp.gmail.com
Port: 587 (TLS) or 465 (SSL)
Username: your-email@gmail.com
Password: [App Password]
```

#### Option 2: Microsoft 365 (Outlook Business)
**Pros:**
- Professional email
- Good deliverability
- Integrated with Microsoft services

**SMTP Settings:**
```
Host: smtp.office365.com
Port: 587
Username: your-email@yourdomain.com
Password: [Your Password]
```

#### Option 3: Custom Domain Email (via Hosting Provider)
**Pros:**
- Professional domain email
- Full control
- Can use your domain registrar's email service

**SMTP Settings:**
- Varies by provider (check your hosting provider's documentation)

### Spring Boot Configuration

Add to `application.properties` or `application.yml`:

```properties
# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=contact@ktransport.fr
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true

# Email Templates
mail.from.address=contact@ktransport.fr
mail.from.name=Ktransport
```

### Important Notes

⚠️ **Security:**
- Never commit passwords to version control
- Use environment variables or Spring Cloud Config
- Use App Passwords (not your main password) for Gmail
- Enable 2-Factor Authentication

⚠️ **Limits:**
- Gmail: 500 emails/day (free), 2000/day (paid)
- Check your provider's sending limits
- Consider email service providers (SendGrid, Mailgun) for high volume

---

## 💬 WhatsApp Business API Setup

### Important: You Need WhatsApp Business API (Not Regular WhatsApp)

**You CANNOT use a regular WhatsApp account** for automated messaging. You need **WhatsApp Business API** access through an official provider.

### Option 1: Twilio WhatsApp API (Recommended)

**Pros:**
- Easy integration
- Good documentation
- Reliable service
- Pay-as-you-go pricing

**Setup Steps:**

#### Step 1: Create Twilio Account
1. Go to [twilio.com](https://www.twilio.com)
2. Sign up for an account
3. Verify your phone number
4. Complete account setup

#### Step 2: Get WhatsApp Sandbox Access
1. Go to Twilio Console → Messaging → Try it out → Send a WhatsApp message
2. Join the sandbox by sending the code to the provided number
3. Test sending messages

#### Step 3: Apply for WhatsApp Business API
1. Go to Twilio Console → Messaging → Settings → WhatsApp Senders
2. Click "Request WhatsApp Access"
3. Fill out the application form:
   - Business name: Ktransport
   - Business description: Premium transfer service
   - Use case: Customer notifications and booking confirmations
   - Expected message volume
4. Submit for approval (can take 1-3 days)

#### Step 4: Get Twilio Credentials
1. Go to Twilio Console → Account → API Keys & Tokens
2. Note your:
   - Account SID
   - Auth Token
   - WhatsApp-enabled phone number (from Twilio)

#### Step 5: Configure in Spring Boot

Add Twilio dependency to `pom.xml`:
```xml
<dependency>
    <groupId>com.twilio.sdk</groupId>
    <artifactId>twilio</artifactId>
    <version>9.2.3</version>
</dependency>
```

Add to `application.properties`:
```properties
# Twilio WhatsApp Configuration
twilio.account.sid=your-account-sid
twilio.auth.token=your-auth-token
twilio.whatsapp.number=whatsapp:+14155238886
```

**Pricing:**
- Sandbox: Free (limited)
- Production: ~$0.005 per message (varies by country)
- Check Twilio pricing for your region

### Option 2: WhatsApp Business API (Direct from Meta)

**Pros:**
- Official WhatsApp solution
- No per-message fees (but requires Business Manager account)
- More control

**Cons:**
- More complex setup
- Requires business verification
- Higher initial setup cost

**Setup Steps:**
1. Create Meta Business Account
2. Apply for WhatsApp Business API
3. Get approved (can take weeks)
4. Set up webhook endpoints
5. Configure in your application

**Note:** This is more complex and typically used by larger businesses. Twilio is recommended for most use cases.

### Option 3: Other WhatsApp API Providers

- **360dialog**: WhatsApp Business API provider
- **MessageBird**: WhatsApp Business API
- **Vonage (Nexmo)**: WhatsApp API

**Research and compare:**
- Pricing
- Setup complexity
- Support quality
- Regional availability

---

## 🔧 Complete Configuration Example

### Spring Boot Application Properties

```properties
# ============================================
# Email Configuration
# ============================================
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME:contact@ktransport.fr}
spring.mail.password=${MAIL_PASSWORD:your-app-password}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.connectiontimeout=5000
spring.mail.properties.mail.smtp.timeout=5000
spring.mail.properties.mail.smtp.writetimeout=5000

# Email Templates
mail.from.address=${MAIL_FROM:contact@ktransport.fr}
mail.from.name=Ktransport
mail.reply-to=${MAIL_REPLY_TO:contact@ktransport.fr}

# ============================================
# WhatsApp Configuration (Twilio)
# ============================================
twilio.account.sid=${TWILIO_ACCOUNT_SID:your-account-sid}
twilio.auth.token=${TWILIO_AUTH_TOKEN:your-auth-token}
twilio.whatsapp.number=${TWILIO_WHATSAPP_NUMBER:whatsapp:+14155238886}
twilio.whatsapp.webhook.url=${TWILIO_WEBHOOK_URL:https://yourdomain.com/api/webhook/whatsapp}

# ============================================
# Notification Preferences
# ============================================
notification.email.enabled=true
notification.whatsapp.enabled=true
notification.default.channel=EMAIL
```

### Environment Variables (Recommended)

Create `.env` file or set in your deployment environment:

```bash
# Email
MAIL_USERNAME=contact@ktransport.fr
MAIL_PASSWORD=your-app-password-here
MAIL_FROM=contact@ktransport.fr
MAIL_REPLY_TO=contact@ktransport.fr

# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token-here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
TWILIO_WEBHOOK_URL=https://yourdomain.com/api/webhook/whatsapp
```

---

## 📋 Setup Checklist

### Email Setup
- [ ] Create business email account
- [ ] Set up SMTP access
- [ ] Generate app password (if using Gmail)
- [ ] Test email sending
- [ ] Configure in Spring Boot
- [ ] Set up email templates
- [ ] Test booking confirmation email
- [ ] Monitor email delivery

### WhatsApp Setup
- [ ] Create Twilio account (or other provider)
- [ ] Join WhatsApp sandbox (for testing)
- [ ] Apply for WhatsApp Business API access
- [ ] Get approved (wait for approval)
- [ ] Get API credentials
- [ ] Configure in Spring Boot
- [ ] Set up webhook endpoint
- [ ] Test WhatsApp message sending
- [ ] Test receiving messages (webhook)

### Security
- [ ] Use environment variables for credentials
- [ ] Never commit passwords to Git
- [ ] Enable 2FA on email account
- [ ] Use app passwords (not main password)
- [ ] Set up monitoring/alerts
- [ ] Review access logs regularly

### Testing
- [ ] Test email sending
- [ ] Test email templates
- [ ] Test WhatsApp sending
- [ ] Test WhatsApp receiving (webhook)
- [ ] Test booking confirmation flow
- [ ] Test notification delivery
- [ ] Test error handling

---

## 💰 Cost Estimation

### Email Costs
- **Gmail (Free)**: 500 emails/day (limited)
- **Google Workspace**: ~$6/user/month (2000 emails/day)
- **SendGrid**: Free tier (100 emails/day), then ~$15/month (40,000 emails)
- **Mailgun**: Free tier (5,000 emails/month), then pay-as-you-go

### WhatsApp Costs
- **Twilio Sandbox**: Free (limited testing)
- **Twilio Production**: ~$0.005 per message (varies by country)
  - Example: 1000 messages/month = ~$5/month
- **Meta WhatsApp Business API**: No per-message fee, but requires Business Manager setup

**Estimated Monthly Costs (100 bookings/month):**
- Email: $0-15/month (depending on provider)
- WhatsApp: ~$5-10/month (Twilio)
- **Total: ~$5-25/month**

---

## 🚀 Quick Start Guide

### Step 1: Email Setup (15 minutes)

1. **Create Gmail Business Account:**
   ```
   - Go to Google Workspace
   - Sign up for account
   - Create email: contact@ktransport.fr
   ```

2. **Enable App Password:**
   ```
   - Google Account → Security
   - Enable 2-Step Verification
   - Generate App Password
   - Copy the password
   ```

3. **Configure in Spring Boot:**
   ```properties
   spring.mail.username=contact@ktransport.fr
   spring.mail.password=[app-password]
   ```

### Step 2: WhatsApp Setup (30-60 minutes)

1. **Create Twilio Account:**
   ```
   - Go to twilio.com
   - Sign up
   - Verify phone number
   ```

2. **Join WhatsApp Sandbox:**
   ```
   - Twilio Console → Messaging → Try it out
   - Send code to join sandbox
   - Test sending messages
   ```

3. **Apply for Production Access:**
   ```
   - Twilio Console → Messaging → WhatsApp Senders
   - Request WhatsApp Access
   - Fill out application
   - Wait for approval (1-3 days)
   ```

4. **Configure in Spring Boot:**
   ```properties
   twilio.account.sid=[your-sid]
   twilio.auth.token=[your-token]
   twilio.whatsapp.number=[your-number]
   ```

### Step 3: Test (10 minutes)

1. **Test Email:**
   ```java
   // Send test email
   emailService.sendTestEmail("test@example.com");
   ```

2. **Test WhatsApp:**
   ```java
   // Send test WhatsApp
   whatsAppService.sendMessage("+1234567890", "Test message");
   ```

---

## 🔍 Troubleshooting

### Email Issues

**Problem: Authentication Failed**
- ✅ Check username/password
- ✅ Use App Password (not main password for Gmail)
- ✅ Enable "Less secure app access" (if using Gmail without 2FA)

**Problem: Emails Not Sending**
- ✅ Check SMTP host/port
- ✅ Check firewall/network
- ✅ Verify email limits not exceeded
- ✅ Check spam folder

**Problem: Emails Going to Spam**
- ✅ Set up SPF/DKIM records
- ✅ Use professional email domain
- ✅ Avoid spam trigger words
- ✅ Use email service provider (SendGrid, Mailgun)

### WhatsApp Issues

**Problem: Cannot Send Messages**
- ✅ Verify Twilio account is active
- ✅ Check account balance
- ✅ Verify WhatsApp number is correct format: `whatsapp:+1234567890`
- ✅ Check if sandbox is active (for testing)

**Problem: Messages Not Received**
- ✅ Verify webhook URL is accessible
- ✅ Check webhook endpoint is configured
- ✅ Verify webhook signature validation
- ✅ Check Twilio logs

**Problem: WhatsApp API Not Approved**
- ✅ Wait for approval (can take 1-3 days)
- ✅ Ensure application is complete
- ✅ Contact Twilio support if delayed

---

## 📚 Additional Resources

### Email
- [Spring Mail Documentation](https://spring.io/guides/gs/sending-email/)
- [Gmail SMTP Setup](https://support.google.com/a/answer/176600)
- [SendGrid Integration Guide](https://sendgrid.com/docs/for-developers/sending-email/java/)

### WhatsApp
- [Twilio WhatsApp Documentation](https://www.twilio.com/docs/whatsapp)
- [Twilio WhatsApp Quickstart](https://www.twilio.com/docs/whatsapp/quickstart/java)
- [WhatsApp Business API](https://www.whatsapp.com/business/api)

---

## ✅ Summary

**What You Need:**

1. **Email Account:**
   - ✅ Business email address
   - ✅ SMTP access
   - ✅ App password (for Gmail)

2. **WhatsApp Business API:**
   - ✅ Twilio account (recommended)
   - ✅ WhatsApp Business API access
   - ✅ API credentials

**Estimated Setup Time:**
- Email: 15-30 minutes
- WhatsApp: 1-3 days (including approval wait)

**Estimated Monthly Cost:**
- Email: $0-15/month
- WhatsApp: ~$5-10/month
- **Total: ~$5-25/month**

**Next Steps:**
1. Set up email account
2. Create Twilio account
3. Apply for WhatsApp access
4. Configure in Spring Boot
5. Test both channels
6. Go live! 🚀

---

*Need help? Contact your development team or refer to the troubleshooting section above.*

