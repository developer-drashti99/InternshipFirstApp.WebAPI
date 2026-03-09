# ❤️ Dating App – API-first Overview

This repository contains a **Dating App backend** built with **ASP.NET Core Web API** (plus an Angular client in `/client`).

A full-stack Dating Application built with ASP.NET Core Web API (backend) and Angular (frontend). Developed during an internship to demonstrate clean architecture, JWT authentication, centralized error handling, and real-world frontend–backend integration.

---

📌 Overview
This application allows users to register, authenticate, and browse member profiles securely using JWT-based authentication. The project follows industry-style folder structure, DTO-based APIs, and a feature-driven Angular architecture, making it easy to scale and maintain.



---

## 🚀 Backend Tech Stack

- ASP.NET Core Web API
- Entity Framework Core
- SQL Server (configured via `DefaultConnection`)
- ASP.NET Core Identity (users + roles)
- JWT Authentication + refresh token cookie
- SignalR (presence + messaging)
- Cloudinary integration for photos
- Global exception middleware

---

## 📍 Base URL and Route Pattern

- Default local API URL (from launch profile): `https://localhost:5178`
- Base controller route: `api/[controller]`

So, for example:
- `AccountController` → `/api/account/...`
- `UsersController` → `/api/users/...`
- `MessagesController` → `/api/messages/...`

---

## 🔐 Authentication & Account Endpoints (`/api/account`)

- `POST /register` – Register new user and create member profile
- `POST /login` – Login with email/password
- `POST /refresh-token` – Get a new access token using refresh token cookie
- `POST /logout` – Logout user and clear refresh token (authorized)

### Auth notes
- Access token is JWT.
- Refresh token is stored in an HTTP-only secure cookie named `refreshToken`.

---

## 👤 User / Member Endpoints (`/api/users`)

> Most endpoints require authorization unless marked anonymous.

- `GET /` – Get members list (supports query params from `MemberParams`)
- `GET /{id}` – Get member details by id
- `PUT /` – Update current member profile
- `POST /change-pwd` – Change current user password
- `GET /{id}/photos` – Get photos for a member
- `POST /add-photo` – Upload a photo
- `PUT /set-main-photo/{photoId}` – Set profile/main photo
- `DELETE /delete-photo/{photoId}` – Soft-delete a photo

### Password reset flow (anonymous)
- `POST /forgot-password` – Send OTP email
- `POST /verify-otp` – Verify OTP
- `POST /reset-password` – Reset password

---

## 💌 Message Endpoints (`/api/messages`)

- `POST /` – Send a new message
- `GET /` – Get paginated messages for current member (`MessageParams`)
- `GET /thread/{recipientId}` – Get message thread with another member
- `DELETE /{id}` – Delete message (sender/recipient soft delete behavior)
- `GET /unread` – Get unread messages for current member

---

## ❤️ Like Endpoints (`/api/likes`)

- `POST /{targetMemberId}` – Toggle like/unlike member
- `GET /list` – Get liked member IDs for current member
- `GET /` – Get paginated members by likes filter (`LikesParams`)

---

## 🛡️ Admin Endpoints (`/api/admin`)

Requires policies/roles as configured in API:

- `GET /users-with-roles` – Get users with roles (admin policy)
- `POST /edit-roles/{userId}?roles=Admin,Moderator` – Edit user roles (admin policy)
- `GET /photos-to-moderate` – List unapproved photos (moderator policy)
- `POST /photos-to-moderate/{photoId}?action=Approve|Reject` – Moderate photo

---

## ⚡ SignalR Hubs

- `/hubs/presence`
- `/hubs/messages`

JWT for SignalR is accepted via query string `access_token`.

---

## 🛠️ Run the API

```bash
cd FirstApp.WebAPI
dotnet restore
dotnet run
```

---

## 📁 Key Backend Folders

- `Controllers` – API endpoints
- `DTOs` – Request/response models
- `Data` – EF Core context, repositories, migrations, seeding
- `Services` – Token, photo, email services
- `SignalR` – Hub implementations
- `Middleware` – Global exception handling
- `Helpers` – params, pagination, cross-cutting helpers

---

## 🧪 Optional: Run Angular Client

```bash
cd client
npm install
ng serve
```

Client URL: `http://localhost:4200`

---

## 👩‍💻 Author

**Drashti**  
Intern – Full Stack Developer  
GitHub: [developer-drashti99](https://github.com/developer-drashti99)
