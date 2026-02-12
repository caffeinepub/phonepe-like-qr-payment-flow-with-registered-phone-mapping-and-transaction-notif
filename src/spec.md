# Specification

## Summary
**Goal:** Build a PhonePe-like QR scan-and-pay prototype on ICP with Internet Identity login, per-user QR codes mapped to registered phone numbers, transaction recording, and in-app notifications.

**Planned changes:**
- Add Internet Identity sign-in plus a minimal profile setup/view flow to collect and store display name and phone number per principal in the Motoko canister.
- Generate and display a personal “My QR” code per signed-in user encoding a stable identifier, and add backend lookup to resolve QR payload to recipient metadata (principal, display name, phone number).
- Create a “Scan & Pay” screen using the device camera to scan QR codes, resolve recipients, handle invalid/unregistered QR states, and show a payment form (amount + optional note).
- Implement backend transaction creation and persistence (payer, recipient, amount, note, timestamp) with a payer receipt screen and a transactions history view for both parties.
- Implement in-app notifications stored in the canister: scan-resolved notifications to QR owners, and debit/credit notifications on transaction creation; add a notifications inbox with read/unread and mark-as-read.
- Add a home dashboard with navigation to My QR, Scan & Pay, Transactions, Notifications, and Profile, using a consistent non-blue/non-purple visual theme with responsive layouts and styled empty states.
- Add and render generated static brand/illustration assets from `frontend/public/assets/generated` (logo, QR header illustration, empty-state illustration).

**User-visible outcome:** Users can sign in, set up a profile with a phone number, show their own QR, scan someone else’s QR to initiate a payment, see a receipt and transaction history, and receive in-app notifications for QR scans and credit/debit events.
