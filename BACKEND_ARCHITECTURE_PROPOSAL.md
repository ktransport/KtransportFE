# Backend Architecture Proposal: Transfer Service Booking System

## Executive Summary

This document proposes a clean, scalable Spring Boot backend architecture for the Ktransport transfer service booking system, following SOLID principles and industry best practices.

---

## 1. System Requirements Analysis

### Current Workflow
1. **Request Phase**: Client sends email/WhatsApp → Unstructured data
2. **Confirmation Phase**: Master confirms via email/WhatsApp → Manual process
3. **Payment Phase**: Handled externally via third-party apps (CashApp, PayPal, etc.)
4. **Communication Phase**: Ongoing updates via email/WhatsApp → No real-time tracking

### Proposed Workflow
1. **Request Phase**: Standardized web forms → Structured data → Automated processing
2. **Confirmation Phase**: Automated notifications → Master approval workflow → Client confirmation
3. **Payment Reference Phase**: Payment method/info stored as reference (NO processing in app)
4. **Communication Phase**: Real-time WebSocket channel + Email/WhatsApp fallback → Persistent communication
5. **Relationship Management**: Owner tools for personal client interactions and notes

---

## 2. Architecture Overview

### 2.1 Layered Architecture (Clean Architecture)

```
┌─────────────────────────────────────────┐
│         Presentation Layer               │
│  (REST Controllers, WebSocket Handlers)  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Application Layer                │
│  (Services, DTOs, Use Cases)             │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Domain Layer                     │
│  (Entities, Value Objects, Domain Logic) │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Infrastructure Layer             │
│  (Repositories, External APIs, DB)      │
└─────────────────────────────────────────┘
```

### 2.2 Core Components

1. **Booking Service**: Handles booking lifecycle
2. **Notification Service**: Multi-channel communication (Email, WhatsApp)
3. **Approval Service**: Master approval workflow
4. **Communication Service**: Real-time messaging
5. **Integration Service**: External API integrations (flight APIs, etc.)
6. **Client Relationship Service**: CRM-like features for owner's personal touch
7. **Payment Reference Service**: Tracks payment info (external processing only)

---

## 3. Design Patterns & SOLID Principles

### 3.1 Design Patterns

#### **State Pattern** (Booking Lifecycle)
```java
// Booking states: PENDING → AWAITING_APPROVAL → APPROVED → CONFIRMED → IN_PROGRESS → COMPLETED → CANCELLED
```
- **Why**: Manages complex state transitions with clear rules
- **Benefit**: Easy to add new states, prevents invalid transitions

#### **Strategy Pattern** (Notification Channels)
```java
interface NotificationStrategy {
    void send(NotificationRequest request);
}
// Implementations: EmailStrategy, WhatsAppStrategy, SMSStrategy
```
- **Why**: Different communication channels with same interface
- **Benefit**: Easy to add new channels, testable, follows Open/Closed Principle

#### **Observer Pattern** (Event-Driven Architecture)
```java
// Spring Events: BookingCreatedEvent, BookingApprovedEvent, BookingConfirmedEvent
```
- **Why**: Decouple booking processing from notifications
- **Benefit**: Scalable, maintainable, follows Single Responsibility

#### **Factory Pattern** (Notification Factory)
```java
NotificationStrategyFactory.create(channelType)
```
- **Why**: Create appropriate notification strategy based on context
- **Benefit**: Encapsulates creation logic

#### **Repository Pattern** (Data Access)
```java
interface BookingRepository extends JpaRepository<Booking, Long>
```
- **Why**: Abstract data access, testable
- **Benefit**: Easy to swap implementations, follows Dependency Inversion

#### **Facade Pattern** (Service Facade)
```java
BookingFacadeService orchestrates BookingService + NotificationService + ApprovalService
```
- **Why**: Simplify complex interactions
- **Benefit**: Single entry point, reduces coupling

#### **Template Method Pattern** (Notification Templates)
```java
abstract class NotificationTemplate {
    final void send() {
        validate();
        format();
        deliver();
        log();
    }
}
```
- **Why**: Common notification flow with channel-specific implementations
- **Benefit**: DRY principle, consistent behavior

### 3.2 SOLID Principles Application

#### **Single Responsibility Principle (SRP)**
- `BookingService`: Only handles booking business logic
- `NotificationService`: Only handles notifications
- `ApprovalService`: Only handles approval workflow
- `EmailService`: Only handles email operations
- `WhatsAppService`: Only handles WhatsApp operations

#### **Open/Closed Principle (OCP)**
- Notification strategies: Open for extension (new channels), closed for modification
- State handlers: New states can be added without modifying existing code

#### **Liskov Substitution Principle (LSP)**
- All `NotificationStrategy` implementations are interchangeable
- All state handlers follow the same contract

#### **Interface Segregation Principle (ISP)**
- `NotificationStrategy`: Small, focused interface
- Separate interfaces for read/write operations if needed

#### **Dependency Inversion Principle (DIP)**
- High-level modules depend on abstractions (`NotificationStrategy`, `BookingRepository`)
- Low-level modules implement these abstractions

---

## 4. Technology Stack Recommendations

### Core Framework
- **Spring Boot 3.2+** (Latest stable)
- **Java 17+** (LTS version)
- **Maven** (Dependency management)

### Database
- **PostgreSQL** (Primary database - ACID compliance, JSON support)
- **Redis** (Caching, session management, pub/sub for real-time)

### Communication
- **Spring Mail** (Email notifications)
- **Twilio API** (WhatsApp Business API)
- **Spring WebSocket** (Real-time communication)

### Additional Libraries
- **Spring Data JPA** (Data access)
- **Spring Security** (Authentication/Authorization)
- **MapStruct** (DTO mapping)
- **Lombok** (Boilerplate reduction)
- **Spring Validation** (Input validation)
- **Jackson** (JSON processing)
- **Quartz Scheduler** (Scheduled tasks - flight tracking, reminders)

### Testing
- **JUnit 5**
- **Mockito**
- **Testcontainers** (Integration tests)
- **Spring Boot Test**

---

## 5. Project Structure (Maven Multi-Module)

```
ktransport-backend/
├── pom.xml (Parent POM)
├── ktransport-api/              # REST API Module
│   ├── src/main/java/
│   │   └── com/ktransport/api/
│   │       ├── controller/
│   │       ├── dto/
│   │       └── config/
│   └── pom.xml
├── ktransport-core/             # Core Business Logic
│   ├── src/main/java/
│   │   └── com/ktransport/core/
│   │       ├── domain/
│   │       │   ├── model/
│   │       │   ├── repository/
│   │       │   └── service/
│   │       ├── state/
│   │       └── event/
│   └── pom.xml
├── ktransport-notification/     # Notification Module
│   ├── src/main/java/
│   │   └── com/ktransport/notification/
│   │       ├── strategy/
│   │       ├── service/
│   │       └── template/
│   └── pom.xml
├── ktransport-integration/      # External Integrations
│   ├── src/main/java/
│   │   └── com/ktransport/integration/
│   │       ├── whatsapp/
│   │       ├── email/
│   │       └── flight/
│   └── pom.xml
├── ktransport-infrastructure/   # Infrastructure (DB, Config)
│   ├── src/main/java/
│   │   └── com/ktransport/infrastructure/
│   │       ├── persistence/
│   │       └── config/
│   └── pom.xml
└── ktransport-application/      # Main Application
    ├── src/main/java/
    │   └── com/ktransport/
    │       └── KtransportApplication.java
    └── pom.xml
```

---

## 6. Domain Model Design

### 6.1 Core Entities

```java
// Booking Entity
@Entity
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String bookingNumber; // Unique identifier (e.g., KT-2024-001234)
    
    @Enumerated(EnumType.STRING)
    private BookingStatus status;
    
    @Embedded
    private CustomerInfo customer;
    
    @Embedded
    private TransferDetails transferDetails;
    
    @Embedded
    private FlightInfo flightInfo; // Optional
    
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL)
    private List<Communication> communications;
    
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL)
    private List<Approval> approvals;
    
    @Embedded
    private PaymentReference paymentReference; // Payment info (external processing)
    
    @ManyToOne
    private Client client; // Link to client relationship
    
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL)
    private List<OwnerNote> ownerNotes; // Owner's personal notes
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // State transition methods
    public void approve() { ... }
    public void confirm() { ... }
    public void cancel() { ... }
}

// Value Objects
@Embeddable
public class CustomerInfo {
    private String name;
    private String email;
    private String phone;
    private String preferredChannel; // EMAIL, WHATSAPP
}

@Embeddable
public class TransferDetails {
    private LocalDate transferDate;
    private LocalTime transferTime;
    private String pickupLocation;
    private String dropoffAddress;
    private Integer passengers;
    private Integer luggage;
    private String notes;
}

@Embeddable
public class FlightInfo {
    private String flightNumber;
    private String airline;
    private String departureAirport;
    private String arrivalAirport;
    private String terminal;
    private String gate;
    private LocalDateTime scheduledArrival;
}

// Payment Reference (External Processing Only)
@Embeddable
public class PaymentReference {
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod; // CASHAPP, PAYPAL, VENMO, BANK_TRANSFER, CASH, OTHER
    
    private String paymentMethodDetails; // Account info, reference numbers, etc.
    private BigDecimal amount; // For reference only
    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus; // PENDING, CONFIRMED, PAID, REFUNDED
    private String paymentNotes; // Owner's notes about payment
    private String transactionReference; // External transaction ID/reference
    private LocalDateTime paymentConfirmedAt;
    private String confirmedBy; // Owner/admin who confirmed payment
}

// Client Entity (CRM-like)
@Entity
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String email;
    private String phone;
    private String preferredChannel; // EMAIL, WHATSAPP
    
    @OneToMany(mappedBy = "client")
    private List<Booking> bookings;
    
    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    private List<ClientNote> notes; // Owner's personal notes about client
    
    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    private List<ClientInteraction> interactions; // Communication history
    
    @Embedded
    private ClientPreferences preferences; // VIP status, special requests, etc.
    
    private LocalDateTime createdAt;
    private LocalDateTime lastContactAt;
    private Integer totalBookings;
    private BigDecimal totalSpent; // For reference/analytics
}

@Embeddable
public class ClientPreferences {
    private boolean isVip;
    private String preferredVehicleType;
    private String specialInstructions; // Always use same driver, specific route, etc.
    private String dietaryRestrictions; // For refreshments
    private String languagePreference;
    private String timezone;
}

// Owner Notes (Personal Touch)
@Entity
public class OwnerNote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    private Booking booking; // Optional - can be booking-specific or general
    
    @ManyToOne
    private Client client; // Optional - can be client-specific
    
    private String note; // Owner's personal notes
    private String createdBy; // Owner/admin ID
    private LocalDateTime createdAt;
    private boolean isPrivate; // Only visible to owner/admins
    @Enumerated(EnumType.STRING)
    private NoteCategory category; // PAYMENT, CLIENT_RELATIONSHIP, SPECIAL_REQUEST, FOLLOW_UP
}

// Client Interaction History
@Entity
public class ClientInteraction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    private Client client;
    
    @Enumerated(EnumType.STRING)
    private InteractionType type; // CALL, EMAIL, WHATSAPP, MEETING, NOTE
    
    private String summary;
    private String details;
    private LocalDateTime interactionDate;
    private String initiatedBy; // CLIENT, OWNER, SYSTEM
    private String ownerNotes; // Owner's follow-up notes
}

// Communication Entity
@Entity
public class Communication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    private Booking booking;
    
    @Enumerated(EnumType.STRING)
    private CommunicationChannel channel; // EMAIL, WHATSAPP, WEBSOCKET
    
    @Enumerated(EnumType.STRING)
    private CommunicationDirection direction; // INBOUND, OUTBOUND
    
    private String content;
    private LocalDateTime timestamp;
    private boolean read;
}

// Approval Entity
@Entity
public class Approval {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    private Booking booking;
    
    private String approverId; // Master/Admin ID
    private String approverName;
    
    @Enumerated(EnumType.STRING)
    private ApprovalStatus status; // PENDING, APPROVED, REJECTED
    
    private String comments;
    private LocalDateTime requestedAt;
    private LocalDateTime respondedAt;
}
```

### 6.2 Enumerations

```java
public enum BookingStatus {
    PENDING,              // Initial state after submission
    AWAITING_APPROVAL,    // Waiting for master approval
    APPROVED,             // Approved by master
    CONFIRMED,            // Confirmed to client
    IN_PROGRESS,          // Transfer in progress
    COMPLETED,            // Transfer completed
    CANCELLED,            // Cancelled
    REJECTED              // Rejected by master
}

public enum CommunicationChannel {
    EMAIL,
    WHATSAPP,
    WEBSOCKET,
    SMS
}

public enum ApprovalStatus {
    PENDING,
    APPROVED,
    REJECTED
}

public enum PaymentMethod {
    CASHAPP,
    PAYPAL,
    VENMO,
    BANK_TRANSFER,
    WISE,
    REVOLUT,
    CASH,
    CREDIT_CARD, // If they use Stripe/Square externally
    OTHER
}

public enum PaymentStatus {
    PENDING,      // Payment not yet received
    CONFIRMED,    // Owner confirmed payment received
    PAID,         // Payment completed
    REFUNDED,     // Payment refunded
    PARTIAL       // Partial payment
}

public enum NoteCategory {
    PAYMENT,
    CLIENT_RELATIONSHIP,
    SPECIAL_REQUEST,
    FOLLOW_UP,
    PREFERENCE,
    GENERAL
}

public enum InteractionType {
    CALL,
    EMAIL,
    WHATSAPP,
    MEETING,
    NOTE,
    BOOKING_CREATED,
    BOOKING_CONFIRMED
}
```

---

## 7. Service Layer Design

### 7.1 Booking Service

```java
@Service
@Transactional
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final BookingStateHandler stateHandler;
    private final ApplicationEventPublisher eventPublisher;
    
    public BookingDTO createBooking(CreateBookingRequest request) {
        // 1. Validate request
        // 2. Create booking entity
        // 3. Save to database
        // 4. Transition to AWAITING_APPROVAL state
        // 5. Publish BookingCreatedEvent
        // 6. Return DTO
    }
    
    public void approveBooking(Long bookingId, ApprovalRequest request) {
        // 1. Load booking
        // 2. Validate approval permissions
        // 3. Transition to APPROVED state
        // 4. Publish BookingApprovedEvent
    }
    
    public void confirmBooking(Long bookingId) {
        // 1. Load booking
        // 2. Transition to CONFIRMED state
        // 3. Publish BookingConfirmedEvent
        // 4. Send confirmation to client
    }
}
```

### 7.2 Notification Service (Strategy Pattern)

```java
// Strategy Interface
public interface NotificationStrategy {
    void send(NotificationRequest request);
    boolean supports(CommunicationChannel channel);
}

// Email Strategy
@Component
public class EmailNotificationStrategy implements NotificationStrategy {
    @Override
    public void send(NotificationRequest request) {
        // Send email using JavaMailSender
    }
    
    @Override
    public boolean supports(CommunicationChannel channel) {
        return channel == CommunicationChannel.EMAIL;
    }
}

// WhatsApp Strategy
@Component
public class WhatsAppNotificationStrategy implements NotificationStrategy {
    @Override
    public void send(NotificationRequest request) {
        // Send WhatsApp using Twilio API
    }
    
    @Override
    public boolean supports(CommunicationChannel channel) {
        return channel == CommunicationChannel.WHATSAPP;
    }
}

// Notification Service (Facade)
@Service
public class NotificationService {
    private final List<NotificationStrategy> strategies;
    
    public void sendNotification(NotificationRequest request) {
        NotificationStrategy strategy = findStrategy(request.getChannel());
        strategy.send(request);
    }
    
    private NotificationStrategy findStrategy(CommunicationChannel channel) {
        return strategies.stream()
            .filter(s -> s.supports(channel))
            .findFirst()
            .orElseThrow(() -> new UnsupportedChannelException(channel));
    }
}
```

### 7.3 Event Listeners (Observer Pattern)

```java
@Component
@Slf4j
public class BookingEventListener {
    
    private final NotificationService notificationService;
    private final ApprovalService approvalService;
    
    @EventListener
    @Async
    public void handleBookingCreated(BookingCreatedEvent event) {
        // 1. Notify master/admin about new booking
        // 2. Send acknowledgment to client
        // 3. Create approval request
    }
    
    @EventListener
    @Async
    public void handleBookingApproved(BookingApprovedEvent event) {
        // 1. Send confirmation to client
        // 2. Update booking status
    }
    
    @EventListener
    @Async
    public void handleBookingConfirmed(BookingConfirmedEvent event) {
        // 1. Send final confirmation with details
        // 2. Set up flight tracking if applicable
    }
}
```

### 7.4 Payment Reference Service (External Payment Tracking)

```java
@Service
@Transactional
public class PaymentReferenceService {
    
    private final BookingRepository bookingRepository;
    
    /**
     * Update payment reference information
     * NOTE: This does NOT process payments - only tracks payment info
     */
    public void updatePaymentReference(Long bookingId, PaymentReferenceUpdateRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new BookingNotFoundException(bookingId));
        
        PaymentReference paymentRef = booking.getPaymentReference();
        if (paymentRef == null) {
            paymentRef = new PaymentReference();
        }
        
        // Update payment method and details
        paymentRef.setPaymentMethod(request.getPaymentMethod());
        paymentRef.setPaymentMethodDetails(request.getPaymentMethodDetails());
        paymentRef.setAmount(request.getAmount());
        paymentRef.setPaymentNotes(request.getNotes());
        paymentRef.setTransactionReference(request.getTransactionReference());
        
        booking.setPaymentReference(paymentRef);
        bookingRepository.save(booking);
    }
    
    /**
     * Confirm payment received (owner confirms external payment)
     */
    public void confirmPayment(Long bookingId, String confirmedBy) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new BookingNotFoundException(bookingId));
        
        PaymentReference paymentRef = booking.getPaymentReference();
        if (paymentRef != null) {
            paymentRef.setPaymentStatus(PaymentStatus.CONFIRMED);
            paymentRef.setPaymentConfirmedAt(LocalDateTime.now());
            paymentRef.setConfirmedBy(confirmedBy);
            bookingRepository.save(booking);
        }
    }
    
    /**
     * Get payment reference for a booking
     */
    public PaymentReferenceDTO getPaymentReference(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new BookingNotFoundException(bookingId));
        return mapToDTO(booking.getPaymentReference());
    }
}
```

### 7.5 Client Relationship Service (CRM Features)

```java
@Service
@Transactional
public class ClientRelationshipService {
    
    private final ClientRepository clientRepository;
    private final ClientNoteRepository noteRepository;
    private final ClientInteractionRepository interactionRepository;
    
    /**
     * Find or create client from booking information
     */
    public Client findOrCreateClient(CustomerInfo customerInfo) {
        return clientRepository.findByEmail(customerInfo.getEmail())
            .or(() -> clientRepository.findByPhone(customerInfo.getPhone()))
            .orElseGet(() -> {
                Client newClient = new Client();
                newClient.setName(customerInfo.getName());
                newClient.setEmail(customerInfo.getEmail());
                newClient.setPhone(customerInfo.getPhone());
                newClient.setPreferredChannel(customerInfo.getPreferredChannel());
                newClient.setTotalBookings(0);
                newClient.setTotalSpent(BigDecimal.ZERO);
                newClient.setCreatedAt(LocalDateTime.now());
                return clientRepository.save(newClient);
            });
    }
    
    /**
     * Add owner's personal note about client or booking
     */
    public OwnerNote addOwnerNote(AddNoteRequest request) {
        OwnerNote note = new OwnerNote();
        note.setNote(request.getNote());
        note.setCategory(request.getCategory());
        note.setCreatedBy(request.getCreatedBy());
        note.setCreatedAt(LocalDateTime.now());
        note.setPrivate(request.isPrivate());
        
        if (request.getClientId() != null) {
            Client client = clientRepository.findById(request.getClientId())
                .orElseThrow(() -> new ClientNotFoundException(request.getClientId()));
            note.setClient(client);
        }
        
        if (request.getBookingId() != null) {
            // Set booking if provided
        }
        
        return noteRepository.save(note);
    }
    
    /**
     * Record client interaction (call, email, WhatsApp, etc.)
     */
    public ClientInteraction recordInteraction(InteractionRequest request) {
        Client client = clientRepository.findById(request.getClientId())
            .orElseThrow(() -> new ClientNotFoundException(request.getClientId()));
        
        ClientInteraction interaction = new ClientInteraction();
        interaction.setClient(client);
        interaction.setType(request.getType());
        interaction.setSummary(request.getSummary());
        interaction.setDetails(request.getDetails());
        interaction.setInteractionDate(LocalDateTime.now());
        interaction.setInitiatedBy(request.getInitiatedBy());
        interaction.setOwnerNotes(request.getOwnerNotes());
        
        // Update client's last contact date
        client.setLastContactAt(LocalDateTime.now());
        clientRepository.save(client);
        
        return interactionRepository.save(interaction);
    }
    
    /**
     * Get client history (bookings, interactions, notes)
     */
    public ClientHistoryDTO getClientHistory(Long clientId) {
        Client client = clientRepository.findById(clientId)
            .orElseThrow(() -> new ClientNotFoundException(clientId));
        
        List<Booking> bookings = client.getBookings();
        List<ClientNote> notes = noteRepository.findByClientId(clientId);
        List<ClientInteraction> interactions = interactionRepository.findByClientIdOrderByInteractionDateDesc(clientId);
        
        return ClientHistoryDTO.builder()
            .client(mapToDTO(client))
            .bookings(bookings.stream().map(this::mapToDTO).toList())
            .notes(notes.stream().map(this::mapToDTO).toList())
            .interactions(interactions.stream().map(this::mapToDTO).toList())
            .build();
    }
    
    /**
     * Update client preferences (VIP status, special instructions, etc.)
     */
    public void updateClientPreferences(Long clientId, ClientPreferencesUpdateRequest request) {
        Client client = clientRepository.findById(clientId)
            .orElseThrow(() -> new ClientNotFoundException(clientId));
        
        ClientPreferences preferences = client.getPreferences();
        if (preferences == null) {
            preferences = new ClientPreferences();
        }
        
        preferences.setVip(request.isVip());
        preferences.setPreferredVehicleType(request.getPreferredVehicleType());
        preferences.setSpecialInstructions(request.getSpecialInstructions());
        preferences.setDietaryRestrictions(request.getDietaryRestrictions());
        preferences.setLanguagePreference(request.getLanguagePreference());
        
        client.setPreferences(preferences);
        clientRepository.save(client);
    }
}
```

---

## 8. API Design (RESTful)

### 8.1 Endpoints

```
# Booking Endpoints
POST   /api/v1/bookings                    # Create booking
GET    /api/v1/bookings/{id}               # Get booking details
GET    /api/v1/bookings                    # List bookings (with filters)
PUT    /api/v1/bookings/{id}/approve       # Approve booking (Master)
PUT    /api/v1/bookings/{id}/confirm       # Confirm booking
PUT    /api/v1/bookings/{id}/cancel        # Cancel booking
GET    /api/v1/bookings/{id}/communications # Get communication history

# Payment Reference Endpoints (External Payment Tracking)
PUT    /api/v1/bookings/{id}/payment       # Update payment reference info
GET    /api/v1/bookings/{id}/payment      # Get payment reference
PUT    /api/v1/bookings/{id}/payment/confirm # Confirm payment received (Owner)

# Client Relationship Endpoints (CRM Features)
GET    /api/v1/clients                     # List clients (with filters)
GET    /api/v1/clients/{id}                # Get client details
GET    /api/v1/clients/{id}/history         # Get client history (bookings, interactions, notes)
PUT    /api/v1/clients/{id}/preferences    # Update client preferences
POST   /api/v1/clients/{id}/notes          # Add owner note about client
POST   /api/v1/clients/{id}/interactions   # Record client interaction
GET    /api/v1/clients/{id}/interactions   # Get interaction history

# Communication Endpoints
POST   /api/v1/communications              # Send message (WebSocket fallback)
GET    /api/v1/communications/{id}         # Get message

# WebSocket
WebSocket: /ws/bookings/{bookingId}      # Real-time communication
```

### 8.2 DTOs

```java
// Request DTOs
public record CreateBookingRequest(
    @NotBlank String name,
    @Email String email,
    @NotBlank String phone,
    @NotNull LocalDate transferDate,
    @NotNull LocalTime transferTime,
    String flightNumber,
    FlightInfoRequest flightInfo,
    String pickupLocation,
    String dropoffAddress,
    Integer passengers,
    Integer luggage,
    String notes,
    String preferredChannel
) {}

// Response DTOs
public record BookingDTO(
    Long id,
    String bookingNumber,
    BookingStatus status,
    CustomerInfoDTO customer,
    TransferDetailsDTO transferDetails,
    FlightInfoDTO flightInfo,
    PaymentReferenceDTO paymentReference, // Payment info (reference only)
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}

// Payment Reference DTOs
public record PaymentReferenceUpdateRequest(
    PaymentMethod paymentMethod,
    String paymentMethodDetails, // Account info, phone number, etc.
    BigDecimal amount,
    String transactionReference, // External transaction ID
    String notes // Owner's notes about payment
) {}

public record PaymentReferenceDTO(
    PaymentMethod paymentMethod,
    String paymentMethodDetails,
    BigDecimal amount,
    PaymentStatus paymentStatus,
    String transactionReference,
    String paymentNotes,
    LocalDateTime paymentConfirmedAt,
    String confirmedBy
) {}

// Client Relationship DTOs
public record AddNoteRequest(
    Long clientId, // Optional
    Long bookingId, // Optional
    String note,
    NoteCategory category,
    String createdBy,
    boolean isPrivate
) {}

public record InteractionRequest(
    Long clientId,
    InteractionType type,
    String summary,
    String details,
    String initiatedBy, // CLIENT, OWNER, SYSTEM
    String ownerNotes
) {}

public record ClientHistoryDTO(
    ClientDTO client,
    List<BookingDTO> bookings,
    List<OwnerNoteDTO> notes,
    List<ClientInteractionDTO> interactions
) {}
```

---

## 9. Real-Time Communication (WebSocket)

### 9.1 WebSocket Configuration

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
    }
    
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}
```

### 9.2 WebSocket Controller

```java
@Controller
public class BookingWebSocketController {
    
    @MessageMapping("/bookings/{bookingId}/message")
    @SendTo("/topic/bookings/{bookingId}")
    public CommunicationMessage handleMessage(
            @DestinationVariable Long bookingId,
            MessageRequest request) {
        // 1. Save message to database
        // 2. Broadcast to all subscribers
        // 3. Send notification if user offline
        return communicationMessage;
    }
}
```

---

## 10. Integration with External Services

### 10.1 WhatsApp Integration (Twilio)

```java
@Service
@Slf4j
public class TwilioWhatsAppService {
    
    private final TwilioRestClient twilioClient;
    
    public void sendMessage(String to, String message) {
        Message.creator(
            new PhoneNumber("whatsapp:" + to),
            new PhoneNumber("whatsapp:" + twilioNumber),
            message
        ).create();
    }
    
    @PostMapping("/webhook/whatsapp")
    public void handleIncomingMessage(@RequestBody TwilioWebhookRequest request) {
        // Process incoming WhatsApp message
        // Create communication record
        // Trigger appropriate business logic
    }
}
```

### 10.2 Email Integration

```java
@Service
@Slf4j
public class EmailService {
    
    private final JavaMailSender mailSender;
    private final ThymeleafTemplateEngine templateEngine;
    
    public void sendBookingConfirmation(Booking booking) {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        
        helper.setTo(booking.getCustomer().getEmail());
        helper.setSubject("Booking Confirmation - " + booking.getBookingNumber());
        helper.setText(templateEngine.process("booking-confirmation", context), true);
        
        mailSender.send(message);
    }
}
```

---

## 10.5 Payment Handling (External Processing)

### Important: No Payment Processing in Application

**The system does NOT process payments internally.** All payments are handled externally via third-party applications (CashApp, PayPal, Venmo, Wise, Revolut, Bank Transfer, etc.).

### Payment Reference System

The system only **tracks and references** payment information:

1. **Payment Method Selection**: Owner/client selects payment method from list
2. **Payment Details Storage**: Account info, transaction references stored for reference
3. **Payment Confirmation**: Owner manually confirms when payment received externally
4. **Payment Notes**: Owner can add personal notes about payment arrangements

### Payment Workflow

```
1. Booking Created → Payment Reference Created (Status: PENDING)
2. Owner discusses payment with client (via WhatsApp/Email/Phone)
3. Owner updates payment reference with:
   - Payment method (CashApp, PayPal, etc.)
   - Payment details (account info, phone number, etc.)
   - Expected amount
   - Transaction reference (if available)
4. Client makes payment externally (outside app)
5. Owner confirms payment received → Status: CONFIRMED
6. Booking proceeds to confirmation
```

### Payment Reference Fields

- **Payment Method**: Enum (CASHAPP, PAYPAL, VENMO, WISE, REVOLUT, BANK_TRANSFER, CASH, OTHER)
- **Payment Method Details**: Free text (account info, phone number, reference numbers)
- **Amount**: For reference/analytics only
- **Transaction Reference**: External transaction ID/reference number
- **Payment Status**: PENDING, CONFIRMED, PAID, REFUNDED, PARTIAL
- **Payment Notes**: Owner's notes about payment arrangements
- **Confirmed By**: Owner/admin who confirmed payment
- **Payment Confirmed At**: Timestamp of confirmation

### Benefits of This Approach

✅ **Flexibility**: Owner can use any payment method they prefer  
✅ **Personal Touch**: Direct communication about payment builds trust  
✅ **No PCI Compliance**: No sensitive payment data stored  
✅ **Simple**: No complex payment gateway integration  
✅ **Cost Effective**: No payment processing fees in app  

---

## 10.6 Client Relationship Management (CRM Features)

### Philosophy: Support Owner's Personal Touch

The system is designed to **facilitate**, not replace, the owner's personal relationship with clients. It provides tools to:

- Track client history and preferences
- Remember important details about clients
- Maintain communication history
- Support guerrilla marketing approach

### Key Features

#### 1. Client Profile Management
- Automatic client creation from bookings
- Client deduplication (by email/phone)
- Client preferences (VIP status, vehicle preferences, special instructions)
- Total bookings and spending history (for reference)

#### 2. Owner Notes System
- **Personal Notes**: Owner can add notes about clients or bookings
- **Note Categories**: Payment, Client Relationship, Special Request, Follow-up, Preference, General
- **Private Notes**: Only visible to owner/admins
- **Context**: Notes can be linked to specific bookings or general client notes

#### 3. Interaction History
- **Track All Interactions**: Calls, emails, WhatsApp messages, meetings, notes
- **Communication Log**: Automatic logging of system communications
- **Owner Notes**: Owner can add follow-up notes to interactions
- **Timeline View**: Chronological history of all client interactions

#### 4. Client Preferences
- **VIP Status**: Mark important clients
- **Preferred Vehicle Type**: Remember client preferences
- **Special Instructions**: Always use same driver, specific route, etc.
- **Dietary Restrictions**: For refreshments
- **Language Preference**: For communication
- **Timezone**: For scheduling

### Use Cases

#### Scenario 1: Returning Client
```
1. Client books again
2. System recognizes client (by email/phone)
3. Owner sees client history:
   - Previous bookings
   - Previous interactions
   - Preferences and notes
4. Owner can personalize service based on history
```

#### Scenario 2: Payment Discussion
```
1. Owner calls client to discuss payment
2. Owner records interaction:
   - Type: CALL
   - Summary: "Discussed payment via CashApp"
   - Notes: "Client prefers CashApp, will pay tomorrow"
3. Owner updates payment reference
4. System tracks all payment-related communications
```

#### Scenario 3: Special Request
```
1. Client has special request (e.g., specific driver)
2. Owner adds note:
   - Category: SPECIAL_REQUEST
   - Note: "Always use driver John for this client"
3. System remembers for future bookings
4. Owner can see note when creating new bookings
```

### API Endpoints for Owner Tools

```
GET    /api/v1/clients/{id}/history         # Full client history
POST   /api/v1/clients/{id}/notes            # Add personal note
POST   /api/v1/clients/{id}/interactions     # Record interaction
PUT    /api/v1/clients/{id}/preferences      # Update preferences
GET    /api/v1/clients?search={query}        # Search clients
```

### Benefits

✅ **Personal Touch**: System remembers, owner personalizes  
✅ **Efficiency**: Quick access to client history  
✅ **Relationship Building**: Track all interactions  
✅ **Flexibility**: Owner has full control over communication  
✅ **Guerrilla Marketing**: Support owner's direct approach  

---

## 11. Security Considerations

### 11.1 Authentication & Authorization

- **JWT Tokens** for API authentication
- **Role-Based Access Control (RBAC)**:
  - `ROLE_CLIENT`: Can create bookings, view own bookings
  - `ROLE_MASTER`: Can approve/reject bookings, view all bookings
  - `ROLE_ADMIN`: Full access

### 11.2 Data Protection

- Encrypt sensitive data (PII) at rest
- Use HTTPS for all communications
- Validate and sanitize all inputs
- Rate limiting on API endpoints
- CORS configuration

---

## 12. Testing Strategy

### 12.1 Unit Tests
- Service layer logic
- State transitions
- Notification strategies
- DTO mappings

### 12.2 Integration Tests
- Repository layer
- External service integrations (mocked)
- WebSocket communication
- End-to-end booking flow

### 12.3 Test Coverage Goals
- Minimum 80% code coverage
- 100% coverage for critical business logic

---

## 13. Monitoring & Logging

### 13.1 Logging
- Structured logging with SLF4J + Logback
- Log levels: ERROR, WARN, INFO, DEBUG
- Include correlation IDs for request tracking

### 13.2 Monitoring
- Spring Boot Actuator for health checks
- Metrics: booking creation rate, approval time, notification success rate
- Alerting for critical errors

---

## 14. Implementation Phases

### Phase 1: Foundation (Week 1-2)
- Project setup (Maven multi-module)
- Database schema design
- Core entities and repositories
- Basic REST API

### Phase 2: Booking Workflow (Week 3-4)
- Booking service implementation
- State management
- Approval workflow
- Payment reference system (external payment tracking)
- Basic notifications (email)

### Phase 3: Communication (Week 5-6)
- WhatsApp integration
- WebSocket implementation
- Notification strategies
- Communication history

### Phase 4: Client Relationship Management (Week 7-8)
- Client profile management
- Owner notes system
- Interaction history tracking
- Client preferences management
- Client history API

### Phase 5: Advanced Features (Week 9-10)
- Flight tracking integration
- Real-time updates
- Admin dashboard APIs
- Advanced search and filtering
- Testing & optimization

---

## 15. Questions for Discussion

1. **Approval Workflow**: 
   - Should there be multiple approval levels?
   - Can bookings be auto-approved under certain conditions?
   - Should payment confirmation be required before approval?

2. **Payment Handling**:
   - Which payment methods are most commonly used? (CashApp, PayPal, Venmo, etc.)
   - Should payment confirmation be mandatory before booking confirmation?
   - Do you need payment reminders/notifications?

3. **Communication Preferences**:
   - Should clients be able to choose their preferred channel?
   - Should we support multiple channels simultaneously?
   - How important is WhatsApp vs Email vs Phone?

4. **Client Relationship Management**:
   - What information is most important to track about clients?
   - Should the system suggest personalized service based on history?
   - How detailed should interaction tracking be?

5. **Real-Time Requirements**:
   - How critical is real-time communication?
   - Should we implement push notifications for mobile?
   - Is WebSocket essential or is email/WhatsApp sufficient?

6. **Scalability**:
   - Expected booking volume?
   - Do we need horizontal scaling from day one?
   - How many concurrent clients/communications?

7. **Integration Priority**:
   - Which external service is most critical? (Email, WhatsApp, Flight API)
   - Should we prioritize client relationship features or booking workflow?

---

## 16. Next Steps

1. **Review this proposal** and discuss questions above
2. **Finalize domain model** based on business requirements
3. **Set up development environment** (Spring Boot project structure)
4. **Create detailed technical specifications** for each module
5. **Begin Phase 1 implementation**

---

## Conclusion

This architecture provides:
- ✅ Clean, maintainable code following SOLID principles
- ✅ Scalable design with proper separation of concerns
- ✅ Flexible notification system (easy to add new channels)
- ✅ Real-time communication capabilities
- ✅ Testable and well-structured codebase
- ✅ Industry best practices and design patterns

**Ready to discuss and refine based on your feedback!**

