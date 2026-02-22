# Ktransport – Email templates (with logo)

HTML email templates for the booking workflow, aligned with the frontend design and using the **Ktransport logo** in the header.

---

## Idea (rewritten)

- **Logo in every email:** Header includes a single logo image so each email is clearly from Ktransport. The logo is loaded from a **public URL** (e.g. your frontend origin). Backend must provide `{logoUrl}` as a full absolute URL (e.g. `https://ktransport.online/assets/logo-transparent.png` or `logo-transparent-bg.png`). If images are blocked, the header still shows the brand name “Ktransport” as fallback text.
- **Design match:** Same colours as the site (dark navy `#0b132b`, gold `#f59e0b`, white, light grey backgrounds), serif for headings and sans for body, gold primary button and outline secondary where needed.
- **One layout:** All templates share the same header (logo + strip), content area, and footer so the experience is consistent.

---

## Logo usage

- **Placeholder:** `{logoUrl}` — backend must replace with the full absolute URL to the logo image.
- **Example:** `https://ktransport.online/assets/logo-transparent.png` (or your real frontend origin + path).
- **In HTML:** `<img src="{logoUrl}" alt="Ktransport" width="180" height="48" style="...">` so the logo displays in Gmail/Outlook/Apple Mail. Width/height reserve space and reduce layout shift; `alt="Ktransport"` is the fallback when images are disabled.

---

## Templates and steps

| Step | File | Recipient | Purpose |
|------|------|-----------|--------|
| 1 | `booking-request-admin.html` | Admin | New booking request + Approve / Reject buttons |
| 2 | `booking-approved-client.html` | Client | “Approved” + CTA to complete booking |
| 3 | `booking-rejected-client.html` | Client | Rejection + reason + support/rebook CTA |
| 4 | `booking-completed-client.html` | Client | “Booking confirmed” + summary |
| 5 | `booking-link.html` | Fragment | Reusable “Complete your booking” block (e.g. for step 2) |

---

## Placeholders (backend replace)

- **Global:** `{logoUrl}`, `{baseUrl}` (e.g. frontend or backend base), `{CurrentYear}`.
- **Admin (step 1):** `{ServiceType}`, `{BookingReference}`, `{FullName}`, `{Email}`, `{Phone}`, `{CreatedAt}`, `{bookingId}`, `{adminToken}` (for approve/reject links).
- **Client approval (step 2):** `{BookingReference}`, `{ServiceType}`, `{bookingLink}`.
- **Client rejection (step 3):** `{BookingReference}`, `{rejectedReason}`, `{contactEmail}` (e.g. from config so “Contact us” mailto works).
- **Client completed (step 4):** `{BookingReference}`, `{ServiceType}`, and any summary fields you send.

---

## Technical notes

- **Inline CSS only** for compatibility (no external stylesheets).
- **Logo:** Always use absolute URL in `src`; no base64 in email (many clients block it).
- **Responsive:** Meta viewport + fluid table; logo and buttons scale on small screens.

Copy these files into the backend (e.g. `src/main/resources/templates/mail/`) and replace placeholders with Thymeleaf (`th:src`, `th:href`, `th:text`) or your engine’s syntax.
