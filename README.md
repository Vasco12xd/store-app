# Store App — Payment Onboarding
 
A full-stack e-commerce payment onboarding application built with React, NestJS, and integrated with a payment gateway API. Implements a complete 5-step purchase flow with real-time stock management.
 
## 🌐 Live Demo
 
| Service | URL |
|---|---|
| Frontend | https://store-app-drab.vercel.app |
| Backend API | https://store-app-develop.up.railway.app/api |
 
---
 
## 📱 Application Screens
 
| Product List | Checkout | Payment Summary | Result |
|---|---|---|---|
| ![Product List](./docs/screenshots/product-list.png) | ![Checkout](./docs/screenshots/checkout.png) | ![Summary](./docs/screenshots/summary.png) | ![Result](./docs/screenshots/result.png) |
 
> Screenshots can be found in `/docs/screenshots`
 
---
 
## 🖥️ 5-Step Business Flow
 
```
1. Product Page     → Browse products with real-time stock
        ↓
2. Checkout Form    → Card data (VISA/MC detection) + delivery info
        ↓
3. Summary Backdrop → Payment breakdown (product + base fee + delivery fee)
        ↓
4. Final Status     → Transaction result (approved / declined / error)
        ↓
5. Product Page     → Updated stock reflected immediately
```
 
### Fees Structure
| Fee | Amount | Description |
|---|---|---|
| Base fee | COP $3,000 | Always applied per transaction |
| Delivery fee | COP $8,000 | Shipping cost |
 
---
 
## 🛠️ Tech Stack
 
### Frontend
- **React 18** + TypeScript + Vite
- **Redux Toolkit** — Flux architecture & state management
- **React Router v6** — SPA navigation
- **Tailwind CSS v3** — Mobile-first responsive design (min iPhone SE 375px)
- **Axios** — HTTP client
- **Jest** + React Testing Library — Unit testing
### Backend
- **NestJS** + TypeScript
- **Prisma ORM v5** — Database access layer
- **PostgreSQL** — Relational database
- **Docker** — Local development environment
- **Jest** — Unit testing
### Infrastructure
- **Vercel** — Frontend deployment
- **Railway** — Backend & database deployment
---
 
## 🏗️ Architecture
 
The backend follows **Hexagonal Architecture (Ports & Adapters)** with **Railway Oriented Programming (ROP)** for use cases.
 
```mermaid
graph TD
    A[React SPA - Vercel] --> B[NestJS API - Railway]
    B --> C[PostgreSQL - Railway]
    B --> D[Payment Gateway UAT API]
    A --> E[Redux Store + localStorage]
```
 
```
src/modules/{module}/
├── domain/
│   ├── entities/        # Business entities — pure TypeScript classes
│   └── ports/           # Interface contracts — no framework dependencies
├── application/
│   └── use-cases/       # Business logic with ROP Result<T, E> type
├── infrastructure/
│   ├── controllers/     # HTTP layer — only handles request/response
│   └── repositories/    # Prisma implementations of domain ports
└── dto/                 # Data Transfer Objects with class-validator
```
 
### Railway Oriented Programming (ROP)
 
All use cases return a `Result<T, E>` type, eliminating exceptions from business logic:
 
```typescript
type Result<T, E = string> = Success<T> | Failure<E>;
 
const ok  = <T>(value: T): Success<T> => ({ ok: true, value });
const fail = <E>(error: E): Failure<E> => ({ ok: false, error });
 
// Usage in use case
async execute(dto: CreateTransactionDto): Promise<Result<TransactionResponseDto>> {
  const product = await this.productRepository.findById(dto.productId);
  if (!product)            return fail('Producto no encontrado');
  if (!product.hasStock()) return fail('Sin stock disponible');
  const transaction = await this.transactionRepository.create(dto);
  return ok(TransactionResponseDto.fromEntity(transaction));
}
```
 
---
 
## 🧠 Technical Decisions
 
### Why Hexagonal Architecture?
To isolate business logic from framework dependencies. The domain layer has zero NestJS imports — it is pure TypeScript. This makes use cases independently testable and allows swapping infrastructure (e.g. switching from Prisma to TypeORM) without touching business logic.
 
### Why Railway Oriented Programming?
To handle errors as values instead of exceptions, making the flow explicit and predictable. Each use case either succeeds or fails with a typed error — no try/catch in controllers.
 
### Why Redux Toolkit over Context API?
The payment flow requires sharing state across 5 screens with persistence. Redux Toolkit provides structured state management with DevTools support and easy localStorage integration via reducers.
 
### Why API-first instead of Widget Checkout?
The provided UAT staging credentials (`pub_stagtest_*`) are exclusive to the UAT environment (`api.co.uat.wompi.dev`). The standard public checkout widget connects to production/standard sandbox URLs which reject these keys with 422. An API-first approach gives full control over the payment flow and is more aligned with the assessment's evaluation criteria (architecture, backend logic, testing).
 
### Why Vercel + Railway over AWS?
For a technical assessment, demonstrating a working deployed application is more valuable than spending time on AWS IAM/VPC configuration. Both platforms provide production-grade infrastructure with free tiers sufficient for this use case.
 
---
 
## 📊 Data Model
 
```
┌─────────────────┐       ┌───────────────────┐
│    products     │       │     customers     │
├─────────────────┤       ├───────────────────┤
│ id (uuid) PK    │       │ id (uuid) PK      │
│ name            │       │ fullName          │
│ description     │       │ email             │
│ price           │       │ phone             │
│ stockQuantity   │       │ address           │
│ imageUrl        │       │ city              │
│ createdAt       │       │ zipCode           │
│ updatedAt       │       │ createdAt         │
└────────┬────────┘       └────────┬──────────┘
         │                         │
         │    ┌────────────────────┴──────────┐
         │    │        transactions           │
         │    ├───────────────────────────────┤
         └────┤ id (uuid) PK                  │
              │ customerId FK                 │
              │ productId FK                  │
              │ status (PENDING/APPROVED/     │
              │         DECLINED/ERROR)       │
              │ productAmount                 │
              │ baseFee                       │
              │ deliveryFee                   │
              │ totalAmount                   │
              │ paymentReference              │
              │ gatewayTransactionId          │
              │ cardLastFour                  │
              │ cardBrand                     │
              │ createdAt / updatedAt         │
              └───────────────┬───────────────┘
                              │
              ┌───────────────┴───────────────┐
              │          deliveries           │
              ├───────────────────────────────┤
              │ id (uuid) PK                  │
              │ transactionId FK (unique)     │
              │ customerId FK                 │
              │ productId FK                  │
              │ status (ASSIGNED/DISPATCHED/  │
              │         DELIVERED)            │
              │ address / city / zipCode      │
              │ assignedAt / updatedAt        │
              └───────────────────────────────┘
```
 
---
 
## 🔌 API Endpoints
 
### Products
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Get all products with stock availability |
 
### Customers
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/customers` | Create a new customer with delivery info |
 
### Transactions
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/transactions` | Create transaction in `PENDING` state |
| `PATCH` | `/api/transactions/:id` | Update transaction status |
 
### Deliveries
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/deliveries/:transactionId` | Create delivery for `APPROVED` transaction |
 
### Payments
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/payments/signature` | Generate SHA256 integrity signature |
| `POST` | `/api/payments/:id/verify` | Verify payment result and trigger delivery |
 
> 📬 **Postman Collection** available at `/docs/store-app.postman_collection.json`
 
---
 
## 💳 Payment Integration
 
The app integrates with a payment gateway API using an **API-first approach**:
 
```
Frontend (card form)
      ↓ card data
Backend → tokenize card via payment API
      ↓ card token
Backend → generate SHA256 integrity signature
      ↓ signature + reference
Frontend → displays payment summary
      ↓ user confirms
Backend → create transaction (PENDING)
      ↓ gateway transaction ID
Backend → verify status + update transaction
      ↓ if APPROVED
Backend → create delivery + update stock
```
 
### Integration Notes — UAT Environment Limitations
 
The staging credentials provided (`pub_stagtest_*`) belong to a UAT environment (`api.co.uat.wompi.dev`) that presents the following constraints:
 
| Issue | Detail |
|---|---|
| Merchant endpoint | `GET /merchants/:key` returns `422` — key format rejected |
| Standard widget | `checkout.wompi.co/widget.js` rejects UAT keys with `INPUT_VALIDATION_ERROR` |
| UAT Sandbox URL | `api-sandbox.co.uat.wompi.dev` returns `504 Gateway Timeout` |
 
**Resilient fallback strategy implemented:**
 
| Step | Status |
|---|---|
| Integrity signature generation (SHA256) | ✅ Real |
| Transaction creation in PENDING | ✅ Real |
| Transaction persistence in DB | ✅ Real |
| Payment verification flow | ✅ Real |
| Delivery creation on approval | ✅ Real |
| Stock decrement on delivery | ✅ Real |
| Merchant token retrieval | ⚠️ Mocked (UAT limitation) |
 
In production with `pub_prod_*` keys and the production API URL, the full flow works seamlessly.
 
---
 
## 🔐 Security Considerations
 
- **Integrity signatures generated exclusively on backend** — integrity key never exposed to client
- **Sensitive payment data never persisted** — only last 4 digits and card brand stored
- **CVV/CVC never stored** — processed transiently and discarded
- **Environment variables isolated by deployment platform** — Railway & Vercel secrets management
- **CORS restricted by environment** — only whitelisted origins allowed
- **Input validation with DTOs** — `class-validator` decorators on all endpoints
- **Domain validation** — business rules enforced at use-case level, not controller
---
 
## 💾 State Persistence
 
Checkout and transaction state are persisted using **Redux Toolkit + localStorage** to preserve payment flow continuity across page refreshes.
 
```typescript
// Persisted fields (safe to store)
const toSave = {
  step: state.step,                  // current screen (product/form/summary/status)
  customerId: state.customerId,
  transactionId: state.transactionId,
  customerData: state.customerData,  // delivery address info
  selectedProduct: state.selectedProduct,
  fees: state.fees,
};
 
// NOT persisted (security)
// cardData — sensitive payment info cleared on refresh
```
 
If a user refreshes mid-checkout, the app restores their progress: pre-filled delivery form, preserved transaction ID, and correct screen step. Only card data requires re-entry.
 
---
 
## ✅ Validation Strategy
 
### Frontend
- Real-time card validation with **Luhn algorithm**
- VISA / Mastercard brand detection by card number prefix
- Field-level validation on `onBlur` with visual feedback (green ✅ / red ⚠)
- Card number auto-formatting (spaces every 4 digits)
- Expiry date auto-formatting (`MM/YY`)
### Backend
- **DTO validation** with `class-validator` decorators (`@IsUUID`, `@IsEmail`, `@IsNumber`, etc.)
- **Domain validation** in use cases (stock check before transaction, PENDING-only updates)
- **Delivery guard** — delivery only created for `APPROVED` transactions
- **Duplicate delivery prevention** — checks for existing delivery before creating
---
 
## ⚠️ Error Handling
 
| Scenario | Handling |
|---|---|
| Payment declined | Transaction marked `DECLINED`, user shown clear error screen |
| Invalid card token | Caught at payment service, transaction marked `ERROR` |
| Out of stock | Blocked at use-case level before transaction creation |
| Duplicate transaction | `paymentReference` is unique — DB constraint prevents duplicates |
| Delivery creation failure | Transaction still updated, delivery skipped gracefully |
| API timeout | Try/catch in use cases returns `fail()` result |
| Page refresh mid-flow | State restored from localStorage |
 
---
 
## 🧪 Test Coverage
 
| Layer | Coverage |
|---|---|
| Backend | **96%** |
| Frontend | **88%** |
 
### Backend — 96%
 
```
File                                             | % Stmts | % Branch | % Funcs | % Lines
-------------------------------------------------|---------|----------|---------|--------
All files                                        |   96.14 |    86.20 |   94.87 |   95.61
shared/result/result.ts                          |     100 |      100 |     100 |     100
products/use-cases/get-products.use-case.ts      |     100 |      100 |     100 |     100
customers/use-cases/create-customer.use-case.ts  |     100 |      100 |     100 |     100
transactions/use-cases/create-transaction...     |   95.23 |      100 |     100 |   94.73
transactions/use-cases/update-transaction...     |   94.11 |      100 |     100 |   93.33
payments/application/generate-signature...       |   94.44 |    66.66 |     100 |   93.33
payments/application/verify-payment...           |   82.35 |    68.75 |      50 |   79.31
```
 
### Frontend — 88%
 
```
File                              | % Stmts | % Branch | % Funcs | % Lines
----------------------------------|---------|----------|---------|--------
All files                         |   88.00 |    67.08 |   79.12 |   88.00
shared/utils/cardValidator.ts     |     100 |      100 |     100 |     100
features/transaction/slice        |     100 |      100 |     100 |     100
features/product/productSlice.ts  |     100 |      100 |     100 |     100
features/checkout/checkoutSlice   |   96.87 |       50 |     100 |   96.87
```
 
```bash
cd backend && npm run test:cov
cd frontend && npm run test:cov
```
 
---
 
## 🚀 Running Locally
 
### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- npm
### Full Setup
 
```bash
# Clone repository
git clone https://github.com/Vasco12xd/store-app.git
cd store-app
 
# Start database
docker compose up -d
 
# Backend
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev       # → http://localhost:3000/api
 
# Frontend (new terminal)
cd frontend
npm install
npm run dev             # → http://localhost:5173
```
 
### Environment Variables
 
**`backend/.env`**
```env
DATABASE_URL="postgresql://storeapp:storeapp123@localhost:5432/storeapp_db"
FRONTEND_URL="http://localhost:5173"
PORT=3000
PAYMENT_API_URL="https://api.co.uat.wompi.dev/v1"
PAYMENT_PUBLIC_KEY="pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7"
PAYMENT_PRIVATE_KEY="prv_stagtest_5i0ZGIGiFcDQifYsXxvsny7Y37tKqFWg"
PAYMENT_INTEGRITY_KEY="stagtest_integrity_nAIBuqayW70XpUqJS4qf4STYiISd89Fp"
```
 
**`frontend/.env`**
```env
VITE_API_URL="http://localhost:3000/api"
```
 
---
 
## 📈 Scalability Considerations
 
The hexagonal architecture enables:
 
- **Payment provider swap** — implement a new port adapter without touching domain or use cases
- **Database migration** — replace Prisma with any ORM by implementing repository interfaces
- **Independent scaling** — frontend (Vercel CDN) and backend (Railway) scale separately
- **Event-driven delivery** — delivery creation can be moved to a queue/event system
- **Multi-currency support** — fee structure isolated in use cases, easy to extend
---
 
## ⚠️ Known Limitations
 
| Limitation | Detail |
|---|---|
| UAT merchant endpoint | Returns 422 for `pub_stagtest_*` keys — UAT environment constraint |
| Payment widget | Incompatible with staging credentials in UAT environment |
| Single product purchase | Current flow handles one product per transaction |
| No webhook | Payment status updated via verify endpoint, not real-time webhook |
 
---
 
## 🔮 Future Improvements
 
- **Webhook-based payment confirmation** — real-time status updates instead of polling
- **Queue-based delivery processing** — async delivery creation with retry logic
- **Rate limiting** — protect payment endpoints from abuse
- **Observability & tracing** — OpenTelemetry integration
- **CI/CD pipelines** — automated testing and deployment on PR merge
- **E2E testing** — Cypress for full user flow testing
- **Multi-product cart** — extend transaction model for multiple items
---
 
## 🌿 Git Strategy
 
```
main          ← Production (auto-deployed to Vercel + Railway)
  └── develop ← Integration branch
        └── feature/* ← One branch per feature, PR into develop
```
 
Feature branches: `project-setup` · `backend-setup` · `products-module` · `customers-module` · `transactions-module` · `deliveries-module` · `payment-integration` · `frontend-setup` · `product-page` · `card-delivery-form` · `summary-backdrop` · `final-status-page` · `backend-tests` · `frontend-tests`
 
---
 
## 🤖 AI-Assisted Development
 
This project was developed using **Claude (Anthropic)** as a coding assistant, following the assessment recommendation to use AI tools. AI assistance was used for:
 
- Architecture design and pattern decisions
- Code implementation and debugging
- Test writing and coverage improvement
- Documentation and README structuring
All architectural decisions, code review, and integration debugging were performed collaboratively with full understanding of the implementation.