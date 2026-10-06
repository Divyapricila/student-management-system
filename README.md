# Student Management System

A comprehensive full-stack Student Management System built with **Spring Boot** (Backend) and **React + Vite** (Frontend).

---

## 📁 Project Structure

```
student-management-system/
├── backend/                  # Spring Boot REST API
│   ├── src/                  # Source code (Controllers, Services, Repositories, Entities)
│   └── pom.xml               # Maven dependencies and configurations
├── frontend/                 # React frontend with Vite
│   ├── src/                  # UI Components, Pages, Services, Contexts
│   ├── public/               # Static assets
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite build configuration
└── database/                 # Database scripts
    ├── schema.sql            # Database schema definition
    └── sample_data.sql       # Seed data for initial setup
```

---

## 🚀 Tech Stack

### Backend
- **Java 21**
- **Spring Boot 3.3.4**
- **Spring Data JPA & Hibernate**
- **Spring Security & JWT Authentication**
- **MySQL / H2 Database**
- **Maven**

### Frontend
- **React 18**
- **Vite**
- **Lucide Icons**
- **Recharts**
- **Axios**

---

## 🛠️ Getting Started

### Prerequisites
- Java 21+ JDK
- Node.js 18+ and npm
- MySQL / MariaDB (or use embedded H2 profile)

### 1. Database Setup
Execute the scripts in the `database/` directory:
```bash
# In MySQL / MariaDB:
source database/schema.sql;
source database/sample_data.sql;
```

### 2. Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
The backend server runs on `http://localhost:8080`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend application runs on `http://localhost:5173`.

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
