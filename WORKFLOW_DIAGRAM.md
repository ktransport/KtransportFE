# Booking Workflow Diagram

## Complete Booking Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT SUBMITS REQUEST                       │
│  (Web Form / Email / WhatsApp)                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              BOOKING SERVICE (Create Booking)                   │
│  • Validate input                                                │
│  • Create Booking entity                                         │
│  • Set status: PENDING → AWAITING_APPROVAL                       │
│  • Generate booking number (KT-2024-001234)                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              PUBLISH EVENT: BookingCreatedEvent                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
         ▼                               ▼
┌──────────────────────┐      ┌──────────────────────┐
│  NOTIFICATION        │      │  APPROVAL SERVICE    │
│  SERVICE             │      │                      │
│  • Send to Master    │      │  • Create Approval   │
│  • Acknowledge Client│      │    Request           │
│  (Email/WhatsApp)    │      │  • Notify Master     │
└──────────────────────┘      └──────────┬───────────┘
                                        │
                                        ▼
                         ┌──────────────────────────────┐
                         │   MASTER REVIEWS REQUEST     │
                         │   (Admin Dashboard/Email)    │
                         └──────────┬───────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
         ┌──────────────────┐          ┌──────────────────┐
         │   APPROVED       │          │   REJECTED       │
         │                  │          │                  │
         │  Status: APPROVED │          │  Status: REJECTED│
         └────────┬─────────┘          └────────┬─────────┘
                  │                             │
                  │                             ▼
                  │                  ┌──────────────────┐
                  │                  │  NOTIFY CLIENT   │
                  │                  │  (Rejection)     │
                  │                  └──────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│              PUBLISH EVENT: BookingApprovedEvent                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              NOTIFICATION SERVICE                                │
│  • Send confirmation to client                                   │
│  • Include booking details                                       │
│  • Provide communication channel info                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              BOOKING SERVICE (Confirm)                           │
│  • Set status: APPROVED → CONFIRMED                              │
│  • Publish BookingConfirmedEvent                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              REAL-TIME COMMUNICATION CHANNEL                     │
│  • WebSocket connection established                              │
│  • Client can send/receive messages                              │
│  • Master can provide updates                                   │
│  • Last-minute requests handled                                  │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              TRANSFER DAY                                         │
│  • Status: CONFIRMED → IN_PROGRESS                               │
│  • Real-time updates via WebSocket                               │
│  • Flight tracking (if applicable)                               │
│  • Status: IN_PROGRESS → COMPLETED                               │
└─────────────────────────────────────────────────────────────────┘
```

## State Transition Diagram

```
                    ┌─────────┐
                    │ PENDING │
                    └────┬────┘
                         │
                         │ (Auto-transition)
                         ▼
            ┌──────────────────────┐
            │ AWAITING_APPROVAL    │
            └──────┬───────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌───────────────┐    ┌──────────────┐
│   APPROVED    │    │   REJECTED   │
└───────┬───────┘    └──────────────┘
        │
        │ (Master confirms)
        ▼
┌───────────────┐
│   CONFIRMED   │
└───────┬───────┘
        │
        │ (Transfer starts)
        ▼
┌───────────────┐
│  IN_PROGRESS  │
└───────┬───────┘
        │
        │ (Transfer completes)
        ▼
┌───────────────┐
│   COMPLETED   │
└───────────────┘

(Any state can transition to CANCELLED)
```

## Communication Flow

```
┌──────────────┐                    ┌──────────────┐
│   CLIENT     │                    │    MASTER    │
└──────┬───────┘                    └──────┬───────┘
       │                                    │
       │ 1. Submit Booking                  │
       ├────────────────────────────────────>│
       │                                    │
       │ 2. Acknowledgment                 │
       │<──────────────────────────────────┤
       │                                    │
       │                                    │ 3. Review & Approve
       │                                    │
       │ 4. Approval Notification           │
       │<──────────────────────────────────┤
       │                                    │
       │ 5. WebSocket Connection           │
       │<══════════════════════════════════>│
       │                                    │
       │ 6. Real-time Messages             │
       │<══════════════════════════════════>│
       │                                    │
       │ 7. Transfer Updates                │
       │<──────────────────────────────────┤
       │                                    │
       │ 8. Completion Notification         │
       │<──────────────────────────────────┤
       │                                    │
```

## Notification Strategy Selection

```
                    ┌─────────────────────┐
                    │ NotificationRequest  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  NotificationService│
                    │   (Facade)          │
                    └──────────┬───────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
    ┌──────────────────────┐    ┌──────────────────────┐
    │ EmailNotification    │    │ WhatsAppNotification │
    │ Strategy             │    │ Strategy             │
    └──────────────────────┘    └──────────────────────┘
                │                             │
                ▼                             ▼
    ┌──────────────────────┐    ┌──────────────────────┐
    │  JavaMailSender      │    │  Twilio API          │
    └──────────────────────┘    └──────────────────────┘
```

## Event-Driven Architecture

```
┌─────────────────┐
│ BookingService  │
└────────┬────────┘
         │
         │ publishEvent()
         ▼
┌─────────────────────────────────┐
│  ApplicationEventPublisher       │
│  (Spring Event System)          │
└────────┬────────────────────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│ Listener│ │ Listener│
│ 1       │ │ 2       │
└────┬────┘ └────┬────┘
     │          │
     ▼          ▼
┌────────┐ ┌────────┐
│Notify  │ │Approval│
│Service │ │Service │
└────────┘ └────────┘
```
