# Cloud Box

### Description

A modern, high-performance cloud storage web platform (mvp) that allows users to securely upload, manage, and store files. The system features secure user authentication, cookie-based session management, automated background job queues, automatic public/private S3-compatible file streaming.

### Frontend

* Next.js
* Zustand + @tanstack/react-query
* React Hook Form + @hookform/resolvers
* Tailwind CSS v4 + Shadcn UI + Radix UI + Swiper
* Axios
* Sonner (Toast notifications)

### Backend

* NestJS TypeScript 
* PostgreSQL 16 + TypeORM
* Redis 7 + Express Session + Connect Redis
* BullMQ (Background operations & processing)
* AWS S3 SDK Client (S3-compatible bucket engine)
* Passport.js (Local & Yandex OAuth 2.0) + Argon2 hashing + Cookie Parser
* NestJS Mailer + React Email Templates
* Swagger UI 

### Screens:

- Main page of the app.
![Main Page](/screens/mainPage.png)
- Auth & Yandex Login interface.
![Auth Page](/screens/authPage.png)
- Dashboard page.
![Storage page](/screens/dashboardPage.png)
- Profile settings page.
![Tariffs page](/screens/settingsPage.png)
- Mobile view of Dashboard.
![Tariffs page](/screens/mobileView.png)

### Docker Commands

To spin up the entire application stack (Frontend, Backend, Database, Redis, MinIO S3) in the background with a single command, ensure you have your environment variables defined in `infra/.env.local`, then use:

```bash
# 1. Navigate to the infrastructure config folder
cd infra

# 2. Build and launch all services in detached background mode
docker compose --env-file .env.local -f docker-compose.local.yml up -d --build
```

#### Handy Maintenance Commands:

* **View live microservice logs:**
  ```bash
  docker compose -f docker-compose.local.yml logs -f
  ```
* **Stop all running project containers safely:**
  ```bash
  docker compose -f docker-compose.local.yml down
  ```
* **Hard reset containers and clear database/S3 volumes:**
  ```bash
  docker compose -f docker-compose.local.yml down -v
  ```
