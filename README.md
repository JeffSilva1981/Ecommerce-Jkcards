# JKCards

Full-stack e-commerce platform for Pokémon TCG cards and collectible products, developed as a real business MVP and a professional Java/Spring Boot portfolio project.

[![CI/CD](https://github.com/JeffSilva1981/Ecommerce-Jkcards/actions/workflows/ci.yml/badge.svg)](https://github.com/JeffSilva1981/Ecommerce-Jkcards/actions/workflows/ci.yml)

**Live application:** [https://jkcards.tech](https://jkcards.tech)

## About the project

JKCards was created to support a real collectible-card sales operation while applying professional software development practices to a production application.

The project covers the complete development lifecycle: business modeling, REST API design, authentication and authorization, external integrations, automated tests, containerization, secure configuration, production infrastructure and automated deployment.

## Current status

The application is deployed to production as an evolving MVP.

Implemented features include:

- Customer registration and authentication
- Stateless authorization using signed JWTs
- Role-based access control for customers and administrators
- Password recovery by e-mail
- Product and category catalog
- Product search and pagination
- Persistent shopping cart
- Checkout and order creation
- Customer order history
- Mercado Pago checkout and payment webhook processing
- Shipping quotes through Melhor Envio
- Product image upload through Cloudinary
- Administrative dashboard
- Product, category, order and user management
- Automated backend and frontend validation
- Automated production deployment through GitHub Actions

## Technology stack

### Backend

- Java 21
- Spring Boot 3.5.3
- Spring Web
- Spring Data JPA and Hibernate
- Spring Security
- OAuth2 Resource Server
- JWT with RSA/RS256 signatures
- Bean Validation
- Spring Mail
- PostgreSQL
- H2 for automated tests
- Maven Wrapper

### Frontend

- React
- Vite
- TypeScript
- React Router
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Tailwind CSS
- Axios
- Lucide React

### Integrations

- Mercado Pago for checkout and payment confirmation
- Melhor Envio for shipping quotes and OAuth authorization
- Cloudinary for product image storage
- SMTP for password recovery e-mails

### Infrastructure and delivery

- Docker and Docker Compose
- Hostinger VPS
- Nginx reverse proxy and static frontend hosting
- HTTPS with Let's Encrypt
- GitHub Actions CI/CD
- Production backups and automatic backend rollback

## Main application flows

### Customer flow

1. Browse and search the product catalog.
2. Create an account or sign in.
3. Add products to the shopping cart.
4. Calculate available shipping options.
5. Create an order and continue to Mercado Pago.
6. Track the order and payment status.

### Administrator flow

1. Sign in with an administrator account.
2. View the administrative dashboard.
3. Manage products, categories and product images.
4. View customers and orders.
5. Update order statuses.
6. Manage the Melhor Envio authorization.

## Authentication and authorization

Authentication is handled by the application through `POST /auth/login`.

The backend validates the supplied credentials with Spring Security and returns a signed JWT. Tokens are signed with a private RSA key using RS256 and validated with the corresponding public key.

The API is stateless: the server does not keep an HTTP session for authenticated users. Each protected request must send the token using the following header:

```http
Authorization: Bearer <access_token>
```

Application roles:

- `ROLE_OPERATOR`: regular customer
- `ROLE_ADMIN`: administrator

Private RSA keys, passwords and external-service credentials are provided through environment variables or mounted secret files and are not committed to the repository.

## Main API endpoints

### Authentication

- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

### Products and categories

- `GET /products`
- `GET /products/{id}`
- `POST /products`
- `PUT /products/{id}`
- `DELETE /products/{id}`
- `POST /products/upload-image`
- `GET /categories`
- `GET /categories/{id}`
- `POST /categories`
- `PUT /categories/{id}`
- `DELETE /categories/{id}`

### Orders, payments and shipping

- `POST /orders`
- `GET /orders/my`
- `GET /orders/{id}`
- `GET /orders`
- `PUT /orders/{id}/status`
- `DELETE /orders/{id}`
- `POST /payments/webhook`
- `POST /shipping/quotes`

### Users and administration

- `GET /users/me`
- `GET /users`
- `GET /users/{id}`
- `POST /users`
- `PUT /users/{id}`
- `DELETE /users/{id}`
- `GET /dashboard`
- `GET /shipping/oauth/status`
- `GET /shipping/oauth/authorization-url`
- `GET /shipping/oauth/callback`

Administrative endpoints are protected by role-based authorization.

## CI/CD pipeline

Every push to the `main` branch starts the GitHub Actions pipeline.

The pipeline performs the following steps:

1. Checks out the repository.
2. Configures Java 21 and Node.js 22.
3. Generates temporary RSA keys for backend tests.
4. Runs the backend test suite and Maven build.
5. Installs frontend dependencies with `npm ci`.
6. Runs frontend tests and creates the production build.
7. Stores backend and frontend build artifacts.
8. Connects to the VPS with a dedicated restricted deployment user.
9. Uploads the validated artifacts.
10. Rebuilds and restarts only the backend container.
11. Performs a backend health check.
12. Publishes the frontend and keeps a backup of the previous release.

The production deployment runs only after both backend and frontend jobs succeed. Pull requests run validation but do not deploy. If the backend health check fails during deployment, the deployment script restores the previous backend version.

## Production architecture

- Nginx serves the React application and works as a reverse proxy.
- The Spring Boot backend runs in a Docker container.
- PostgreSQL runs in a separate Docker container with a persistent volume.
- HTTPS is provided through Let's Encrypt.
- RSA keys are mounted into the backend container as read-only secret files.
- Production credentials remain outside version control.

## Running locally

### Requirements

- Java 21
- Docker and Docker Compose
- Node.js and npm

### 1. Clone the repository

```bash
git clone https://github.com/JeffSilva1981/Ecommerce-Jkcards.git
cd Ecommerce-Jkcards
```

### 2. Configure environment variables

Create a local `.env` file from the provided example and fill in the required values:

```bash
cp .env.example .env
```

The `.env` file contains sensitive local configuration and must not be committed.

### 3. Generate development JWT keys

```bash
java scripts/GenerateJwtKeys.java
```

This creates the RSA key pair used to sign and validate JWTs. The generated `secrets` directory is ignored by Git.

### 4. Start PostgreSQL

```bash
docker compose up -d db
```

### 5. Start the backend

On Linux or macOS:

```bash
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
```

The development profile loads idempotent sample data from `data-dev.sql`.

### 6. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend is available at `http://localhost:5173` and the backend at `http://localhost:8080` by default.

## Running the tests

Backend:

```bash
./mvnw clean verify
```

Frontend:

```bash
cd frontend
npm ci
npm test
npm run build
```

## Environment configuration

The main configuration groups are documented in `.env.example`:

- PostgreSQL connection
- JWT duration and RSA key paths
- Cloudinary credentials
- CORS and frontend URL
- Initial administrator credentials
- Mercado Pago access token
- SMTP configuration
- Melhor Envio API and OAuth configuration

Never commit `.env`, production credentials or private RSA keys.

## Roadmap

- Add OpenAPI/Swagger documentation
- Introduce database migrations with Flyway
- Expand unit and integration test coverage
- Automate PostgreSQL backups and retention
- Improve stock reservation and inventory control
- Improve observability, structured logging and monitoring
- Continue accessibility and mobile UX improvements

## Project purpose

JKCards is both a real business application and a continuously evolving engineering project. It is used to practice the responsibilities involved in maintaining production software:

- translating business needs into features;
- designing secure backend flows;
- integrating external services;
- diagnosing production issues;
- protecting sensitive configuration;
- writing and maintaining automated tests;
- deploying changes safely;
- documenting architectural decisions;
- improving the product incrementally.

## Author

Developed by **Jeferson Ferreira da Silva**.

- GitHub: [JeffSilva1981](https://github.com/JeffSilva1981)
- Live project: [jkcards.tech](https://jkcards.tech)
