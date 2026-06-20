# JKCards

JKCards is a real e-commerce MVP for Pokémon TCG and collectible card products, built with a Java/Spring Boot backend and a React frontend.

The project has two goals:

1. Build a working online store for my own card business.
2. Use the project as a professional portfolio while simulating the routine of a backend developer working on a real product: MVP delivery, production deployment, bug fixes, incremental tasks and continuous improvements.

Live project: https://jkcards.tech

## Project Status

The project is currently in MVP stage and deployed to production.

The current MVP supports:

- Customer registration
- Customer login
- Product catalog
- Shopping cart
- Checkout/order creation
- Customer order history
- Admin panel
- Admin order management
- Manual order status update
- Product, category and user administration screens
- Product image upload integration with Cloudinary
- PostgreSQL database running in Docker
- Production deployment on a VPS with Nginx and SSL

Online payment is not integrated yet. Orders are created with `WAITING_PAYMENT` status, and the admin manually updates the order status after payment confirmation.

## Tech Stack

### Backend

- Java 21
- Spring Boot 3.5.3
- Spring Web
- Spring Data JPA / Hibernate
- Spring Security
- OAuth2 Authorization Server
- JWT
- Bean Validation
- PostgreSQL
- Cloudinary
- Docker

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

### Infrastructure

- Hostinger VPS
- Docker Compose
- Nginx
- Let's Encrypt SSL
- Domain: `jkcards.tech`

## Main Features

### Customer Flow

- Browse products
- Search products
- Create an account
- Log in
- Add products to cart
- Review cart
- Create an order
- View order details and status

### Admin Flow

- Log in as admin
- View dashboard page
- Manage products
- Manage categories
- View customer orders
- Update order status manually
- View registered users

## Backend Overview

The backend is a REST API built with Spring Boot.

Main resources:

- `User`
- `Role`
- `Product`
- `Category`
- `Order`
- `OrderItem`
- `Payment`

Order statuses:

- `WAITING_PAYMENT`
- `PAID`
- `SHIPPED`
- `DELIVERED`
- `CANCELED`

Main endpoints include:

- `POST /auth/register`
- `POST /oauth2/token`
- `GET /users/me`
- `GET /products`
- `GET /products/{id}`
- `POST /products`
- `PUT /products/{id}`
- `DELETE /products/{id}`
- `POST /products/upload-image`
- `GET /categories`
- `POST /orders`
- `GET /orders/my`
- `GET /orders`
- `GET /orders/{id}`
- `PUT /orders/{id}/status`

## Authentication and Authorization

Authentication is handled through a custom OAuth2 password grant flow using Spring Authorization Server.

After login, the API returns a JWT containing the authenticated username and authorities.

Roles used by the application:

- `ROLE_OPERATOR`: regular customer
- `ROLE_ADMIN`: admin user

Protected backend operations use role-based authorization with Spring Security.

## Frontend Overview

The frontend is a React SPA built with Vite and TypeScript.

It includes:

- Public store layout
- Authentication pages
- Protected customer routes
- Protected admin routes
- Persistent cart using Zustand
- API data fetching with TanStack Query
- Forms with React Hook Form and Zod
- Dark theme styled with Tailwind CSS

## Production Deployment

The application is deployed on a VPS.

Current production setup:

- Backend runs in a Docker container
- PostgreSQL runs in a Docker container
- Frontend is built with Vite and served by Nginx
- Nginx also works as a reverse proxy to the backend
- HTTPS is enabled with Let's Encrypt

## Running Locally

### Backend

Requirements:

- Java 21
- Docker
- Docker Compose

Build the backend:

```bash
./mvnw clean package -DskipTests
```

Start the application with Docker Compose:

```bash
docker compose up -d --build
```

### Frontend

Enter the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Environment Variables

The project uses environment variables for production configuration.

Examples:

```env
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=

SECURITY_CLIENT_ID=
SECURITY_CLIENT_SECRET=
JWT_DURATION=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

ADMIN_EMAIL=
ADMIN_PASSWORD=

CORS_ORIGINS=
VITE_API_URL=
VITE_CLIENT_ID=
VITE_CLIENT_SECRET=
```

Sensitive values are not committed to the repository.

## Current Roadmap

Planned improvements:

- Implement backend dashboard summary endpoint
- Add automatic PostgreSQL backups
- Improve product stock management
- Add product active/inactive status
- Add institutional pages
- Improve admin dashboard metrics
- Add API documentation with Swagger/OpenAPI
- Add database migrations with Flyway
- Improve automated tests
- Add CI/CD deployment pipeline
- Improve UI and mobile experience
- Add payment instructions and future payment integration

## Why This Project Matters

This project is not only a study project.

JKCards is being developed as a real product for my own Pokémon TCG sales operation. I currently sell through WhatsApp and marketplaces, and this application is my first step toward building my own sales platform.

At the same time, I use this project to practice real backend development routines:

- breaking work into small tasks
- fixing bugs found during production usage
- deploying changes manually
- improving the system incrementally
- documenting technical decisions
- maintaining a real MVP used by real customers

The goal is to grow this project as both a business tool and a professional Java backend portfolio.

## Author

Developed by Jeff Silva.

GitHub: https://github.com/JeffSilva1981