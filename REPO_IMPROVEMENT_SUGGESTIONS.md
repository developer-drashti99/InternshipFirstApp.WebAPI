# Repository Improvement Suggestions (API + Angular Client)

## Scope Reviewed
- ASP.NET Core API (`FirstApp.WebAPI`)
- Angular client (`client`)

## Top Priority Improvements

### 1) Harden password-reset and OTP flow
**Why:** Current OTP verification and reset are separate and not cryptographically linked. Reset currently generates a new reset token server-side without requiring previously-verified OTP proof.

**Observed in code**
- OTP stored in in-memory dictionary keyed by email.
- `verify-otp` only compares OTP string.
- `reset-password` generates a fresh token and resets password directly.

**Improvements**
- Store OTP with expiry + attempt count in distributed cache/DB (not static in-memory dictionary).
- On OTP verification, mint short-lived signed reset ticket (JWT/DataProtection token) and require it in `reset-password`.
- Add brute-force protection (max attempts + temporary lockout).
- Return generic responses for forgot/reset endpoints to prevent account enumeration.

---

### 2) Fix refresh-token lifecycle and client interval leak
**Why:** Client creates an unmanaged `setInterval` on login and does not clear previous intervals, which can cause duplicate refresh calls over time. Server rotates refresh token but does not persist per-device/session metadata.

**Improvements**
- Track refresh timer id in `AccountService` and clear it on logout/login before creating a new one.
- Add a startup/session-init call (or route guard) to restore auth state via refresh token on app reload.
- Persist refresh tokens with device/session id, creation IP/user-agent, revoke history, and reuse-detection support.

---

### 3) Remove broad try/catch in controllers; use centralized exception policy
**Why:** Several endpoints catch generic `Exception` and return raw message/data in `BadRequest`, which may leak internals and bypass consistent error formatting.

**Improvements**
- Remove method-level broad catch blocks unless handling known domain exceptions.
- Let global middleware produce standardized ProblemDetails payloads.
- Add domain-specific exception types (validation/business/not-found) and map to proper status codes.

---

### 4) Improve API query efficiency for role listing
**Why:** `GetUsersWithRolesAsync` fetches paged users then requests roles for each user in a loop (N+1 pattern).

**Improvements**
- Query user-role mapping with joins in one query (or batch role retrieval strategy).
- Add index support for user search columns used by filtering/sorting.

---

### 5) Strengthen route/authorization consistency in Angular
**Why:** Some routes (e.g., `lists`, `errors`) are outside authenticated route tree while most app features are protected.

**Improvements**
- Revisit route access policy and ensure intended routes are consistently protected.
- Lazy-load feature routes (members/messages/admin) for faster initial load.
- Add resolver/error fallback handling for member detail child routes.

## Medium Priority Improvements

### API
- Adopt API versioning (`/api/v1/...`) before public release.
- Add rate limiting for auth and messaging endpoints.
- Add health checks (`/health/ready`, `/health/live`) for deployment.
- Expand logging with correlation IDs and structured request context.
- Add integration tests for auth/refresh/password-reset/messaging workflows.

### Angular
- Add linting + formatting CI checks (`ng lint`, prettier check).
- Consolidate API endpoint strings into typed endpoint builders.
- Add unit tests for auth service and interceptors (401/400/500 and refresh edge-cases).
- Consider typed API client generation from OpenAPI to reduce contract drift.

## Suggested 30-Day Execution Plan
1. **Week 1:** Auth hardening (OTP ticket + attempt limits + timer cleanup).
2. **Week 2:** Error-model standardization + controller cleanup + logging correlation.
3. **Week 3:** Query/performance fixes (roles endpoint, indexes, lazy loading).
4. **Week 4:** Test coverage expansion + CI quality gates + health checks.

## Quick Wins (Can Start Immediately)
- Add timer cleanup in Angular auth service.
- Replace raw exception responses with standardized ProblemDetails.
- Add lockout/attempt limits for OTP verification.
- Add integration tests for refresh-token and reset-password flows.
