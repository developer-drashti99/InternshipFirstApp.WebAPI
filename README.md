# ❤️ Dating App – .NET Web API & Angular

A full-stack **Dating Application** built using **ASP.NET Core Web API** for the backend and **Angular** for the frontend.
This project is developed as part of an **internship** to demonstrate clean architecture, authentication, error handling, and frontend-backend integration.

---

## 🚀 Tech Stack

### Backend

* ASP.NET Core Web API
* Entity Framework Core
* SQLite (Development)
* JWT Authentication
* Middleware-based Global Exception Handling

### Frontend

* Angular (Standalone Components)
* TypeScript
* Angular Signals
* HTTP Interceptors
* Route Guards
* Modular Feature-Based Structure

---

## 📁 Project Structure

```
FirstApp.WebAPI
│
├── FirstApp.WebAPI/        # ASP.NET Core Web API
│   ├── Controllers
│   ├── DTOs
│   ├── Data
│   ├── Middleware
│   ├── Services
│   ├── Interfaces
│   ├── Errors
│   └── Extensions
│
├── client/                # Angular Frontend
│   ├── src/
│   │   ├── app
│   │   ├── core
│   │   ├── features
│   │   ├── shared
│   │   └── layout
│   ├── public
│   └── ssl
│
└── README.md
```

---

## ✨ Features

### 🔐 Authentication & Authorization

* User Registration
* Login with JWT token
* Auth Guards for protected routes

### 🧑‍🤝‍🧑 Dating App Functionality

* Member List
* Member Details
* User Profiles
* Default user avatars

### ⚠️ Error Handling (Centralized)

* Global HTTP Error Interceptor (Angular)
* Custom Error Pages:

  * 404 – Not Found
  * 500 – Server Error
* ASP.NET Core Exception Middleware
* Standardized API error responses

### 🧠 Architecture Highlights

* DTO-based API communication
* Separation of concerns
* Reusable services and interceptors
* Feature-based Angular structure

---

## 🛠️ Getting Started

### Prerequisites

* .NET SDK 7+
* Node.js 18+
* Angular CLI
* Git

---

## ▶️ Run Backend (ASP.NET Core)

```bash
cd FirstApp.WebAPI
dotnet restore
dotnet run
```

API will run on:

```
https://localhost:5178
```

---

## ▶️ Run Frontend (Angular)

```bash
cd client
npm install
ng serve
```

Frontend will run on:

```
http://localhost:4200
```

---

## 🔄 API & Frontend Integration

* Angular communicates with Web API using `HttpClient`
* JWT token is attached using an HTTP Interceptor
* Errors are handled centrally and routed to proper error pages

---

## 🧪 Testing Error Handling

You can test error handling using:

* Invalid routes → **404 page**
* API exceptions → **Server Error page**
* Unauthorized access → **Auth Guard redirect**

---

## 📌 Internship Notes

This project demonstrates:

* Real-world full-stack development
* Proper Git usage and commit practices
* Clean and maintainable code structure
* Industry-standard error handling patterns

---

## 👩‍💻 Author

**Drashti**
Intern – Full Stack Developer
GitHub: [developer-drashti99](https://github.com/developer-drashti99)

---

## 📜 License

This project is created for **learning and internship purposes**.
