# Backend Booking Workflow Architecture Prompt

## Overview
Design and implement a Spring Boot (Java 21, Maven) backend system that handles a two-gateway booking workflow with admin approval, multi-channel notifications (Email, WhatsApp, Telegram), and single-use token-based form completion.

## System Architecture

### 1. High-Level Architecture

```
Client (Angular Frontend)
    ↓
API Gateway / Controller Layer
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (Data Access)
    ↓
Database (PostgreSQL/MySQL)
    ↓
External Services:
    - Email Service (SMTP)
    - WhatsApp Business API
    - Telegram Bot API
```

### 2. Database Schema Design

#### A. Bookings Table
```sql
CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
    booking_reference VARCHAR(50) UNIQUE NOT NULL,
    service_type VARCHAR(50) NOT NULL, -- 'transfer', 'events', 'chauffeur', 'tourism', etc.
    
    -- Gateway 1 Data
    client_full_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(50) NOT NULL,
    preferred_contact VARCHAR(20) NOT NULL, -- 'whatsapp', 'telegram', 'email'
    
    -- Status Management
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING_APPROVAL', -- PENDING_APPROVAL, APPROVED, REJECTED, COMPLETED, CANCELLED
    approval_mode VARCHAR(20) NOT NULL DEFAULT 'MANUAL', -- 'MANUAL', 'AUTOMATIC'
    approved_at TIMESTAMP,
    approved_by BIGINT, -- FK to admin_users table
    rejected_at TIMESTAMP,
    rejected_reason TEXT,
    
    -- Token Management
    access_token VARCHAR(255) UNIQUE NOT NULL,
    token_expires_at TIMESTAMP NOT NULL,
    token_used_at TIMESTAMP,
    token_used BOOLEAN DEFAULT FALSE,
    
    -- Gateway 2 Data (JSON field for flexibility)
    service_details JSONB,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    
    -- Indexes
    INDEX idx_booking_reference (booking_reference),
    INDEX idx_access_token (access_token),
    INDEX idx_status (status),
    INDEX idx_service_type (service_type),
    INDEX idx_created_at (created_at)
);
```

#### B. Booking Status History Table (Audit Trail)
```sql
CREATE TABLE booking_status_history (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL REFERENCES bookings(id),
    previous_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    changed_by BIGINT, -- FK to admin_users or NULL for system
    change_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_booking_id (booking_id)
);
```

#### C. Admin Users Table (If not exists)
```sql
CREATE TABLE admin_users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    whatsapp_number VARCHAR(50),
    telegram_chat_id VARCHAR(100),
    role VARCHAR(50) NOT NULL, -- 'ADMIN', 'SUPER_ADMIN', 'OPERATOR'
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### D. System Configuration Table
```sql
CREATE TABLE system_config (
    id BIGSERIAL PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by BIGINT
);

-- Initial Configuration Data
INSERT INTO system_config (config_key, config_value, description) VALUES
('booking.auto_approval.enabled', 'false', 'Enable automatic approval for bookings'),
('booking.token.expiration_hours', '48', 'Token expiration time in hours'),
('booking.notification.email.enabled', 'true', 'Enable email notifications'),
('booking.notification.whatsapp.enabled', 'true', 'Enable WhatsApp notifications'),
('booking.notification.telegram.enabled', 'true', 'Enable Telegram notifications');
```

### 3. Domain Models (Java Entities)

#### A. Booking Entity
```java
@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false, length = 50)
    private String bookingReference;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ServiceType serviceType;
    
    // Gateway 1 fields
    @Column(nullable = false)
    private String clientFullName;
    
    @Column(nullable = false)
    private String clientEmail;
    
    @Column(nullable = false)
    private String clientPhone;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContactMethod preferredContact;
    
    // Status management
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING_APPROVAL;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApprovalMode approvalMode = ApprovalMode.MANUAL;
    
    private LocalDateTime approvedAt;
    
    @ManyToOne
    private AdminUser approvedBy;
    
    private LocalDateTime rejectedAt;
    private String rejectedReason;
    
    // Token management
    @Column(unique = true, nullable = false)
    private String accessToken;
    
    @Column(nullable = false)
    private LocalDateTime tokenExpiresAt;
    
    private LocalDateTime tokenUsedAt;
    private Boolean tokenUsed = false;
    
    // Gateway 2 data (flexible JSON storage)
    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> serviceDetails;
    
    // Timestamps
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    private LocalDateTime completedAt;
    
    // Relationships
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL)
    private List<BookingStatusHistory> statusHistory = new ArrayList<>();
}
```

#### B. Enums
```java
public enum ServiceType {
    TRANSFER,
    EVENTS,
    CHAUFFEUR,
    TOURISM,
    PARTNERSHIPS,
    CORPORATE
}

public enum BookingStatus {
    PENDING_APPROVAL,
    APPROVED,
    REJECTED,
    COMPLETED,
    CANCELLED
}

public enum ContactMethod {
    WHATSAPP,
    TELEGRAM,
    EMAIL
}

public enum ApprovalMode {
    MANUAL,
    AUTOMATIC
}
```

### 4. API Endpoints Design

#### A. Gateway 1: Initial Booking Request
```
POST /api/v1/bookings/initial-request

Request Body:
{
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+33123456789",
    "preferredContact": "WHATSAPP", // or "TELEGRAM", "EMAIL"
    "serviceType": "TRANSFER"
}

Response (201 Created):
{
    "bookingId": "BK-2024-001234",
    "status": "PENDING_APPROVAL",
    "message": "Your booking request has been submitted. You will receive a confirmation link once approved.",
    "estimatedResponseTime": "2-4 hours"
}
```

#### B. Token Validation
```
GET /api/v1/bookings/validate-token?token=abc123xyz

Response (200 OK):
{
    "valid": true,
    "bookingId": "BK-2024-001234",
    "clientInfo": {
        "fullName": "John Doe",
        "email": "john.doe@example.com",
        "phone": "+33123456789"
    },
    "serviceType": "TRANSFER",
    "expiresAt": "2024-01-15T14:30:00Z",
    "tokenUsed": false
}

Response (400 Bad Request) - Invalid/Expired:
{
    "valid": false,
    "error": "TOKEN_EXPIRED", // or "TOKEN_INVALID", "TOKEN_ALREADY_USED", "TOKEN_NOT_FOUND"
    "message": "This booking link has expired. Please request a new booking."
}
```

#### C. Complete Booking (Gateway 2)
```
POST /api/v1/bookings/{bookingId}/complete

Headers:
    Authorization: Bearer {accessToken}
    Content-Type: application/json

Request Body (varies by service type):
// For TRANSFER:
{
    "date": "2024-01-20",
    "time": "14:30",
    "flightNumber": "AF123",
    "passengers": 2,
    "luggage": 3,
    "pickupLocation": "Terminal 2E",
    "dropoffAddress": "123 Avenue des Champs-Élysées, Paris",
    "notes": "Special requests..."
}

// For EVENTS:
{
    "eventDate": "2024-02-14",
    "packageType": "PRIVILEGE",
    "vehiclePreference": "ROLLS_ROYCE",
    "passengerName": "Jane Doe",
    "ceremonyLocation": "...",
    "receptionLocation": "...",
    "specialRequests": "..."
}

// Similar structures for other service types

Response (200 OK):
{
    "bookingId": "BK-2024-001234",
    "status": "COMPLETED",
    "message": "Your booking has been confirmed. You will receive detailed information via your preferred contact method.",
    "confirmationNumber": "CNF-2024-001234"
}
```

#### D. Booking Status Check
```
GET /api/v1/bookings/{bookingId}/status

Response (200 OK):
{
    "bookingId": "BK-2024-001234",
    "status": "APPROVED",
    "currentStep": "WAITING_FOR_DETAILS", // or "PENDING_APPROVAL", "COMPLETED"
    "message": "Your booking has been approved. Please complete the booking form using the link sent to you.",
    "createdAt": "2024-01-15T10:00:00Z",
    "approvedAt": "2024-01-15T11:30:00Z",
    "expiresAt": "2024-01-17T10:00:00Z"
}
```

#### E. Admin Approval Endpoints
```
POST /api/v1/admin/bookings/{bookingId}/approve?token={adminApprovalToken}

Response (200 OK):
{
    "bookingId": "BK-2024-001234",
    "status": "APPROVED",
    "message": "Booking approved successfully. Client notification sent."
}

POST /api/v1/admin/bookings/{bookingId}/reject?token={adminApprovalToken}

Request Body:
{
    "reason": "No availability for requested date"
}

Response (200 OK):
{
    "bookingId": "BK-2024-001234",
    "status": "REJECTED",
    "message": "Booking rejected. Client notification sent."
}
```

### 5. Service Layer Architecture

#### A. BookingService
**Responsibilities:**
- Process initial booking requests
- Generate secure tokens
- Handle approval/rejection logic
- Coordinate notification sending
- Validate and process service details
- Manage booking lifecycle

**Key Methods:**
```java
public interface BookingService {
    BookingResponse createInitialRequest(InitialBookingRequest request);
    TokenValidationResponse validateToken(String token);
    BookingConfirmation completeBooking(String bookingId, String token, ServiceDetailsRequest details);
    BookingStatusResponse getBookingStatus(String bookingId);
    void processAutomaticApproval(Booking booking);
    void sendApprovalNotifications(Booking booking);
    void sendRejectionNotifications(Booking booking, String reason);
}
```

#### B. TokenService
**Responsibilities:**
- Generate cryptographically secure tokens
- Validate token integrity
- Check token expiration
- Mark tokens as used
- Handle token refresh (if needed)

**Key Methods:**
```java
public interface TokenService {
    String generateSecureToken();
    TokenValidationResult validateToken(String token);
    void markTokenAsUsed(String token);
    boolean isTokenExpired(LocalDateTime expiresAt);
    String generateAdminApprovalToken(Long bookingId, Long adminId);
}
```

**Token Generation Strategy:**
- Use UUID v4 or cryptographically secure random string
- Length: 32-64 characters
- Include booking reference in hash for validation
- Store hashed version in database (security)
- Return plain token only in notifications

#### C. NotificationService
**Responsibilities:**
- Send notifications via multiple channels
- Template management for messages
- Handle notification failures gracefully
- Queue notifications for retry
- Track notification delivery status

**Key Methods:**
```java
public interface NotificationService {
    void sendInitialRequestNotification(Booking booking);
    void sendApprovalNotification(Booking booking);
    void sendRejectionNotification(Booking booking, String reason);
    void sendCompletionConfirmation(Booking booking);
    NotificationStatus sendWhatsAppMessage(String phone, String message, String templateId);
    NotificationStatus sendTelegramMessage(String chatId, String message);
    NotificationStatus sendEmail(String to, String subject, String body, boolean isHtml);
}
```

**Notification Templates:**

**Email Template (Initial Request to Admin):**
```html
Subject: New Booking Request - {ServiceType} - {BookingReference}

Dear Admin,

A new booking request has been submitted:

Client: {FullName}
Email: {Email}
Phone: {Phone}
Service: {ServiceType}
Booking Reference: {BookingReference}

[APPROVE BUTTON] - Link: {baseUrl}/api/v1/admin/bookings/{bookingId}/approve?token={adminToken}
[REJECT BUTTON] - Link: {baseUrl}/api/v1/admin/bookings/{bookingId}/reject?token={adminToken}

Request submitted at: {CreatedAt}
```

**WhatsApp/Telegram Template (Initial Request to Admin):**
```
🔔 New Booking Request

Client: {FullName}
Service: {ServiceType}
Reference: {BookingReference}

Approve: {approveLink}
Reject: {rejectLink}
```

**Client Approval Notification (Email/WhatsApp/Telegram):**
```
✅ Your booking request has been approved!

Booking Reference: {BookingReference}
Service: {ServiceType}

Complete your booking by clicking the link below:
{bookingLink}

This link is valid for 48 hours and can only be used once.
```

#### D. AdminService
**Responsibilities:**
- Handle admin approval/rejection
- Generate admin approval tokens
- Validate admin permissions
- Log admin actions
- Manage approval workflows

### 6. External Service Integrations

#### A. WhatsApp Business API Integration
**Configuration:**
```yaml
whatsapp:
  api:
    base-url: https://graph.facebook.com/v18.0
    phone-number-id: {your-phone-number-id}
    access-token: {your-access-token}
    verify-token: {webhook-verify-token}
  webhook:
    enabled: true
    path: /webhooks/whatsapp
```

**Implementation:**
- Use WhatsApp Business API for sending messages
- Support message templates for structured messages
- Handle webhook callbacks for delivery status
- Implement rate limiting (WhatsApp has limits)
- Fallback to email if WhatsApp fails

**Message Format:**
```json
{
  "messaging_product": "whatsapp",
  "to": "{phone_number}",
  "type": "template",
  "template": {
    "name": "booking_approval",
    "language": {
      "code": "fr" // or "en"
    },
    "components": [
      {
        "type": "body",
        "parameters": [
          {
            "type": "text",
            "text": "{BookingReference}"
          },
          {
            "type": "text",
            "text": "{ServiceType}"
          }
        ]
      },
      {
        "type": "button",
        "sub_type": "url",
        "index": 0,
        "parameters": [
          {
            "type": "text",
            "text": "{bookingLink}"
          }
        ]
      }
    ]
  }
}
```

#### B. Telegram Bot API Integration
**Configuration:**
```yaml
telegram:
  bot:
    token: {your-bot-token}
    username: {your-bot-username}
    webhook:
      enabled: true
      url: {your-webhook-url}
      path: /webhooks/telegram
```

**Implementation:**
- Use Telegram Bot API
- Create inline keyboard buttons for approve/reject
- Handle callback queries for button clicks
- Support rich text formatting
- Handle bot commands

**Message Format:**
```json
{
  "chat_id": "{chat_id}",
  "text": "🔔 New Booking Request\n\nClient: {FullName}\nService: {ServiceType}",
  "reply_markup": {
    "inline_keyboard": [
      [
        {
          "text": "✅ Approve",
          "callback_data": "approve_{bookingId}_{adminToken}"
        },
        {
          "text": "❌ Reject",
          "callback_data": "reject_{bookingId}_{adminToken}"
        }
      ]
    ]
  }
}
```

#### C. Email Service Integration
**Configuration:**
```yaml
mail:
  host: smtp.gmail.com
  port: 587
  username: {your-email}
  password: {your-password}
  properties:
    mail:
      smtp:
        auth: true
        starttls:
          enable: true
  templates:
    location: classpath:/templates/mail/
```

**Implementation:**
- Use Spring Mail with Thymeleaf templates
- HTML email templates with styled buttons
- Support for both HTML and plain text
- Attachment support (if needed for confirmations)
- Email queue for reliability

**Email Template Structure:**
```
templates/mail/
├── booking-request-admin.html
├── booking-approved-client.html
├── booking-rejected-client.html
├── booking-completed-client.html
└── booking-link.html
```

### 7. Security Architecture

#### A. Token Security
- **Generation**: Use `SecureRandom` or `UUID.randomUUID()` with additional entropy
- **Storage**: Hash tokens in database (use BCrypt or similar)
- **Transmission**: Only send plain tokens in secure channels (HTTPS)
- **Expiration**: Configurable expiration (default 48 hours)
- **Single Use**: Mark as used immediately upon form submission
- **Validation**: Check expiration, usage status, and integrity

#### B. Admin Approval Tokens
- Separate token system for admin actions
- Shorter expiration (e.g., 24 hours)
- Include admin ID and booking ID in token
- Validate admin permissions before processing
- Log all admin actions for audit

#### C. API Security
- **Authentication**: JWT tokens for admin endpoints
- **Authorization**: Role-based access control (RBAC)
- **Rate Limiting**: Prevent abuse (e.g., 10 requests per minute per IP)
- **Input Validation**: Validate all inputs (Bean Validation)
- **SQL Injection Prevention**: Use parameterized queries (JPA)
- **XSS Prevention**: Sanitize all outputs
- **CORS Configuration**: Restrict to frontend domain only

#### D. Data Protection
- Encrypt sensitive data (phone numbers, emails) at rest
- Use HTTPS for all communications
- Implement data retention policies
- GDPR compliance considerations
- Secure logging (don't log sensitive data)

### 8. Configuration Management

#### A. Application Properties
```yaml
application:
  name: ktransport-booking-api
  
server:
  port: 8080
  
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/ktransport
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
  
  mail:
    # Email configuration (as above)
  
booking:
  token:
    expiration-hours: 48
    length: 64
    algorithm: SHA-256
  
  approval:
    auto-approval-enabled: false
    default-mode: MANUAL
  
  notification:
    email:
      enabled: true
      from: noreply@ktransport.fr
    whatsapp:
      enabled: true
      rate-limit-per-minute: 20
    telegram:
      enabled: true
      rate-limit-per-minute: 30
  
  admin:
    approval-token-expiration-hours: 24
    notification-channels: [EMAIL, TELEGRAM, WHATSAPP]
```

### 9. Error Handling Strategy

#### A. Custom Exceptions
```java
public class BookingException extends RuntimeException {
    private final ErrorCode errorCode;
    private final Map<String, Object> details;
}

public enum ErrorCode {
    BOOKING_NOT_FOUND,
    TOKEN_INVALID,
    TOKEN_EXPIRED,
    TOKEN_ALREADY_USED,
    BOOKING_ALREADY_COMPLETED,
    INVALID_SERVICE_TYPE,
    VALIDATION_ERROR,
    NOTIFICATION_FAILED,
    ADMIN_APPROVAL_FAILED
}
```

#### B. Global Exception Handler
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(BookingException.class)
    public ResponseEntity<ErrorResponse> handleBookingException(BookingException e) {
        // Return appropriate HTTP status and error message
    }
    
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(ValidationException e) {
        // Return 400 with validation errors
    }
    
    // Other exception handlers...
}
```

### 10. Background Jobs & Scheduling

#### A. Token Expiration Cleanup
- **Job**: Mark expired tokens as invalid
- **Schedule**: Run every hour
- **Action**: Update status to "EXPIRED", send notification if needed

#### B. Automatic Approval Processing
- **Job**: Process bookings with auto-approval enabled
- **Schedule**: Run every 5 minutes
- **Logic**: Check system config, approve if conditions met

#### C. Notification Retry Queue
- **Job**: Retry failed notifications
- **Schedule**: Run every 10 minutes
- **Logic**: Retry up to 3 times, then mark as failed

#### D. Booking Status Updates
- **Job**: Update booking statuses based on business rules
- **Schedule**: Run daily
- **Logic**: Mark old pending bookings, cleanup completed bookings

### 11. Logging & Monitoring

#### A. Logging Strategy
- Log all booking creation events
- Log all status changes
- Log all admin actions
- Log notification attempts (success/failure)
- Log token validations
- Use structured logging (JSON format)

#### B. Metrics to Track
- Booking requests per day/hour
- Approval/rejection rates
- Average approval time
- Token usage rates
- Notification delivery rates
- Error rates by type
- API response times

#### C. Health Checks
- Database connectivity
- External service availability (WhatsApp, Telegram, Email)
- Token generation service
- Notification queue status

### 12. Testing Strategy

#### A. Unit Tests
- Service layer logic
- Token generation and validation
- Notification template rendering
- Business rule validation

#### B. Integration Tests
- Complete booking flow
- Token validation flow
- Admin approval flow
- Notification sending (mock external services)
- Database operations

#### C. End-to-End Tests
- Full booking workflow
- Multi-channel notification delivery
- Error scenarios
- Concurrent booking handling

### 13. Deployment Considerations

#### A. Environment Configuration
- Development: Local database, mock external services
- Staging: Staging database, test WhatsApp/Telegram accounts
- Production: Production database, real external services

#### B. Scalability
- Database connection pooling
- Async processing for notifications
- Message queue for notification delivery (RabbitMQ/Kafka)
- Caching for frequently accessed data (Redis)
- Load balancing for API servers

#### C. High Availability
- Database replication
- Multiple API server instances
- External service failover
- Backup and recovery procedures

### 14. API Documentation

#### A. OpenAPI/Swagger
- Document all endpoints
- Include request/response examples
- Document error responses
- Include authentication requirements

#### B. Postman Collection
- Create collection for all endpoints
- Include example requests
- Environment variables for different stages

### 15. Data Migration Strategy

#### A. Existing Bookings
- Migrate existing bookings to new schema
- Generate booking references for old bookings
- Preserve all historical data

#### B. Configuration Migration
- Set up initial system configuration
- Configure admin users
- Set up notification channels

### 16. Proposed Enhancements

#### A. Real-time Updates
- WebSocket support for status updates
- Push notifications to frontend
- Live admin dashboard

#### B. Advanced Features
- Booking calendar integration
- Availability checking
- Automatic slot assignment
- Recurring bookings support
- Booking modifications
- Cancellation workflow

#### C. Analytics & Reporting
- Booking analytics dashboard
- Revenue reporting
- Service popularity metrics
- Client behavior analysis
- Admin performance metrics

#### D. Multi-tenancy (If needed)
- Support multiple companies/organizations
- Isolated data per tenant
- Tenant-specific configurations

### 17. Security Best Practices

#### A. Token Security
- Use cryptographically secure random generators
- Implement token rotation if needed
- Monitor for token abuse
- Implement token revocation

#### B. API Security
- Implement API key authentication for external integrations
- Use OAuth2 for admin authentication
- Implement request signing for critical operations
- Regular security audits

#### C. Data Security
- Encrypt sensitive fields
- Implement field-level encryption for PII
- Secure backup storage
- Regular security updates

### 18. Performance Optimization

#### A. Database Optimization
- Proper indexing strategy
- Query optimization
- Connection pooling
- Read replicas for reporting

#### B. Caching Strategy
- Cache system configuration
- Cache token validation results (short TTL)
- Cache admin user data
- Use Redis for distributed caching

#### C. Async Processing
- Async notification sending
- Background job processing
- Message queue for heavy operations
- Non-blocking API responses

### 19. Monitoring & Alerting

#### A. Application Monitoring
- Application performance monitoring (APM)
- Error tracking (Sentry, Rollbar)
- Log aggregation (ELK Stack, Splunk)
- Real-time dashboards

#### B. Alerting Rules
- High error rate alerts
- Notification delivery failure alerts
- Database connection issues
- External service downtime
- Token generation failures

### 20. Compliance & Legal

#### A. GDPR Compliance
- Right to access data
- Right to deletion
- Data portability
- Consent management
- Privacy policy integration

#### B. Data Retention
- Define retention policies
- Automated cleanup of old data
- Archive strategy for historical data

## Implementation Phases

### Phase 1: Core Infrastructure (Week 1-2)
1. Database schema creation
2. Entity models and repositories
3. Basic service layer
4. Token generation and validation
5. Basic API endpoints

### Phase 2: Notification System (Week 2-3)
1. Email service integration
2. WhatsApp API integration
3. Telegram Bot integration
4. Template management
5. Notification queue system

### Phase 3: Admin Approval (Week 3-4)
1. Admin approval endpoints
2. Approval token system
3. Admin notification system
4. Approval workflow logic

### Phase 4: Gateway 2 Integration (Week 4-5)
1. Service-specific form processing
2. Token validation integration
3. Booking completion logic
4. Final confirmation system

### Phase 5: Testing & Polish (Week 5-6)
1. Comprehensive testing
2. Error handling refinement
3. Performance optimization
4. Documentation
5. Deployment preparation

## Questions to Resolve

1. **WhatsApp Integration**: 
   - Do we have WhatsApp Business API access?
   - What's the approval process for WhatsApp Business Account?
   - Rate limits and pricing?

2. **Telegram Integration**:
   - Do we have a Telegram Bot created?
   - What's the admin's Telegram chat ID?
   - Bot token security storage?

3. **Email Service**:
   - Which email service provider? (Gmail, SendGrid, AWS SES, etc.)
   - Email template design requirements?
   - SPF/DKIM configuration?

4. **Admin Approval**:
   - How many admins will handle approvals?
   - Do we need approval workflow (multiple approvers)?
   - Approval SLA requirements?

5. **Token Security**:
   - Preferred token length and format?
   - Token storage strategy (hashed vs encrypted)?
   - Token refresh mechanism needed?

6. **Scalability**:
   - Expected booking volume per day?
   - Peak load scenarios?
   - Geographic distribution of clients?

7. **Compliance**:
   - Data retention requirements?
   - GDPR compliance level needed?
   - Audit logging requirements?

## Dependencies to Add (pom.xml)

```xml
<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-mail</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    
    <!-- Database -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
    </dependency>
    
    <!-- JSON Processing -->
    <dependency>
        <groupId>com.vladmihalcea</groupId>
        <artifactId>hibernate-types-55</artifactId>
        <version>2.21.1</version>
    </dependency>
    
    <!-- HTTP Client for External APIs -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-webflux</artifactId>
    </dependency>
    
    <!-- Thymeleaf for Email Templates -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-thymeleaf</artifactId>
    </dependency>
    
    <!-- Scheduling -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-quartz</artifactId>
    </dependency>
    
    <!-- Utilities -->
    <dependency>
        <groupId>org.apache.commons</groupId>
        <artifactId>commons-lang3</artifactId>
    </dependency>
    <dependency>
        <groupId>com.google.guava</groupId>
        <artifactId>guava</artifactId>
    </dependency>
    
    <!-- Testing -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

## Notes

- Consider using Spring Cloud for microservices architecture if scaling is needed
- Implement circuit breakers for external service calls
- Use Spring Cache for performance optimization
- Consider event-driven architecture for notifications
- Implement idempotency for critical operations
- Use database transactions carefully for data consistency
- Consider using Spring Batch for bulk operations
- Implement proper logging for debugging and auditing

