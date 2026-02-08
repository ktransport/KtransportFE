# Design Patterns Quick Reference

## Patterns Used in This Architecture

### 1. State Pattern
**Purpose**: Manage booking lifecycle states

**Implementation**:
```java
public interface BookingState {
    void approve(Booking booking);
    void confirm(Booking booking);
    void cancel(Booking booking);
}

public class AwaitingApprovalState implements BookingState {
    @Override
    public void approve(Booking booking) {
        booking.setStatus(BookingStatus.APPROVED);
        // Transition logic
    }
}
```

**Benefits**:
- Clear state transitions
- Prevents invalid state changes
- Easy to add new states

---

### 2. Strategy Pattern
**Purpose**: Different notification channels (Email, WhatsApp)

**Implementation**:
```java
public interface NotificationStrategy {
    void send(NotificationRequest request);
    boolean supports(CommunicationChannel channel);
}

public class EmailNotificationStrategy implements NotificationStrategy {
    @Override
    public void send(NotificationRequest request) {
        // Email sending logic
    }
    
    @Override
    public boolean supports(CommunicationChannel channel) {
        return channel == CommunicationChannel.EMAIL;
    }
}
```

**Benefits**:
- Easy to add new notification channels
- Testable in isolation
- Follows Open/Closed Principle

---

### 3. Observer Pattern (Spring Events)
**Purpose**: Decouple booking processing from notifications

**Implementation**:
```java
// Event
public class BookingCreatedEvent extends ApplicationEvent {
    private final Booking booking;
    // ...
}

// Publisher
@Service
public class BookingService {
    @Autowired
    private ApplicationEventPublisher eventPublisher;
    
    public void createBooking(...) {
        // Create booking
        eventPublisher.publishEvent(new BookingCreatedEvent(booking));
    }
}

// Listener
@Component
public class BookingEventListener {
    @EventListener
    @Async
    public void handleBookingCreated(BookingCreatedEvent event) {
        // Handle notification
    }
}
```

**Benefits**:
- Loose coupling
- Scalable (multiple listeners)
- Asynchronous processing

---

### 4. Factory Pattern
**Purpose**: Create appropriate notification strategy

**Implementation**:
```java
@Component
public class NotificationStrategyFactory {
    private final List<NotificationStrategy> strategies;
    
    public NotificationStrategy create(CommunicationChannel channel) {
        return strategies.stream()
            .filter(s -> s.supports(channel))
            .findFirst()
            .orElseThrow(() -> new UnsupportedChannelException(channel));
    }
}
```

**Benefits**:
- Encapsulates creation logic
- Centralized strategy selection
- Easy to extend

---

### 5. Repository Pattern
**Purpose**: Abstract data access

**Implementation**:
```java
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByStatus(BookingStatus status);
    Optional<Booking> findByBookingNumber(String bookingNumber);
}

@Service
public class BookingService {
    private final BookingRepository repository; // Depends on abstraction
    
    // ...
}
```

**Benefits**:
- Testable (can mock repository)
- Easy to swap implementations
- Follows Dependency Inversion Principle

---

### 6. Facade Pattern
**Purpose**: Simplify complex service interactions

**Implementation**:
```java
@Service
public class BookingFacadeService {
    private final BookingService bookingService;
    private final NotificationService notificationService;
    private final ApprovalService approvalService;
    
    public BookingDTO createBooking(CreateBookingRequest request) {
        // Orchestrate multiple services
        BookingDTO booking = bookingService.create(request);
        notificationService.sendAcknowledgment(booking);
        approvalService.createApprovalRequest(booking);
        return booking;
    }
}
```

**Benefits**:
- Single entry point
- Reduces coupling
- Simplifies client code

---

### 7. Template Method Pattern
**Purpose**: Common notification flow with channel-specific steps

**Implementation**:
```java
public abstract class NotificationTemplate {
    public final void send(NotificationRequest request) {
        validate(request);
        String formatted = format(request);
        deliver(formatted, request);
        log(request);
    }
    
    protected abstract String format(NotificationRequest request);
    protected abstract void deliver(String message, NotificationRequest request);
    
    private void validate(NotificationRequest request) {
        // Common validation
    }
    
    private void log(NotificationRequest request) {
        // Common logging
    }
}

public class EmailNotificationTemplate extends NotificationTemplate {
    @Override
    protected String format(NotificationRequest request) {
        // Email-specific formatting
    }
    
    @Override
    protected void deliver(String message, NotificationRequest request) {
        // Email-specific delivery
    }
}
```

**Benefits**:
- DRY (Don't Repeat Yourself)
- Consistent behavior
- Easy to maintain

---

## SOLID Principles Application

### Single Responsibility Principle (SRP)
- **BookingService**: Only handles booking business logic
- **NotificationService**: Only handles notifications
- **ApprovalService**: Only handles approval workflow
- **EmailService**: Only handles email operations

### Open/Closed Principle (OCP)
- **NotificationStrategy**: Open for extension (new channels), closed for modification
- **State handlers**: New states can be added without modifying existing code

### Liskov Substitution Principle (LSP)
- All `NotificationStrategy` implementations are interchangeable
- All state handlers follow the same contract

### Interface Segregation Principle (ISP)
- Small, focused interfaces (`NotificationStrategy`, `BookingState`)
- Clients don't depend on methods they don't use

### Dependency Inversion Principle (DIP)
- High-level modules depend on abstractions
- Low-level modules implement these abstractions
- Example: `BookingService` depends on `BookingRepository` interface, not implementation

---

## Best Practices Checklist

### Code Organization
- [ ] Package by feature, not by layer
- [ ] Use meaningful names
- [ ] Keep classes small and focused
- [ ] Use DTOs for API boundaries

### Error Handling
- [ ] Use custom exceptions
- [ ] Global exception handler
- [ ] Meaningful error messages
- [ ] Proper HTTP status codes

### Testing
- [ ] Unit tests for business logic
- [ ] Integration tests for repositories
- [ ] Mock external services
- [ ] Test state transitions

### Security
- [ ] Input validation
- [ ] Authentication & authorization
- [ ] Encrypt sensitive data
- [ ] Rate limiting

### Performance
- [ ] Use caching where appropriate
- [ ] Database indexing
- [ ] Async processing for notifications
- [ ] Connection pooling

### Documentation
- [ ] JavaDoc for public APIs
- [ ] README with setup instructions
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Architecture diagrams

---

## Common Anti-Patterns to Avoid

### ❌ God Object
- **Problem**: One class does everything
- **Solution**: Split into focused services

### ❌ Anemic Domain Model
- **Problem**: Entities are just data containers
- **Solution**: Add business logic to entities

### ❌ Tight Coupling
- **Problem**: Direct dependencies on concrete classes
- **Solution**: Use interfaces and dependency injection

### ❌ Magic Numbers/Strings
- **Problem**: Hard-coded values
- **Solution**: Use constants or configuration

### ❌ Long Methods
- **Problem**: Methods with too many responsibilities
- **Solution**: Extract methods, follow SRP

---

## Recommended Reading

1. **Design Patterns: Elements of Reusable Object-Oriented Software** (Gang of Four)
2. **Clean Code** by Robert C. Martin
3. **Domain-Driven Design** by Eric Evans
4. **Spring in Action** by Craig Walls
5. **Effective Java** by Joshua Bloch


