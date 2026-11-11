# Database Schema

MongoDB collections:
- User: name, email, password hash, phone, role, active, referredPatients
- Test: name, code, category, sampleType, preparation, fastingRequired, reportTime, price, salePrice, active, samplePrice
- LabPackage: name, description, tests[], price, active, samplePrice
- Branch: name, address, phone, openingHours, mapUrl, active
- Booking: bookingCode, patient, patient details, tests[], packages[], total, collectionType, branch/address, slot, status, paymentMethod, consent
- Report: booking, patient, storedName, originalName, mimeType, uploadedBy
- Message: name, email, phone, message, status
- Post: title, slug, excerpt, body, published
- Faq: question, answer, active

Relationships:
- Booking belongs to a patient and optionally a branch.
- Booking embeds a snapshot of selected test/package names and prices.
- Report belongs to one booking and patient.
- Doctor referral relationship is maintained on User.referredPatients.

Note: The current booking endpoint validates selected catalog items and calculates price server-side. Production slot-capacity locking, family member booking linkage, audit logs and transaction-based inventory/slot reservation are additional hardening tasks before real use.
