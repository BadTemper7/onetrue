# Client Integration

The redesigned client portal is connected to the existing OTLI API.

## Zustand stores

- `src/stores/authStore.js`: login, session restoration, current user, logout
- `src/stores/bookingStore.js`: booking list, create booking, Gate-Out request, payment upload

## Connected workflows

- Client login and registration with email OTP and document uploads
- Forgot password
- Account verification status
- Create booking
- Booking history and booking details
- Payment proof upload
- Gate-Out request
- Pre-advice
- Real-time Socket.IO updates
- Protected and verified-client routes

## UI consistency update

- Replaced remaining green/teal accents with the client portal indigo and blue palette.
- Added reusable pagination to the Booking History table.
- Pagination includes first, previous, next, last, page size, and record range controls.
