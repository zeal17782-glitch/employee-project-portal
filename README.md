# 🏢 Employee & Project Management Portal

A full-stack web application that allows organizations to manage employees and their assigned projects.

![Dashboard Preview](https://via.placeholder.com/800x400?text=Employee+Portal+Dashboard)

## 🌐 Live Demo
- Frontend: https://employee-project-portal-six.vercel.app
- Backend: https://employee-project-portal-production.up.railway.app
---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + TypeScript |
| Styling | Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | PostgreSQL |
| Auth | JWT (JSON Web Tokens) |
| HTTP Client | Axios |

---

## ✨ Features

### 🔐 Authentication
- Login with email & password
- JWT token based authentication
- Protected routes
- Logout functionality

### 📊 Dashboard
- Total Employees count
- Total Projects count
- Active Projects count

### 👥 Employee Management
- ➕ Add new employee
- ✏️ Edit employee details
- 🗑️ Delete employee
- 📋 View all employees
- 🖼️ Profile image upload

**Employee Fields:**
- Full Name
- Email
- Phone Number
- Designation
- Department
- Joining Date
- Profile Image

### 📁 Project Management
- ➕ Create new project
- ✏️ Edit project details
- 🗑️ Delete project
- 📋 View all projects

**Project Fields:**
- Project Name
- Description
- Start Date
- End Date
- Status (Active / Completed / On Hold)

### 🔗 Employee-Project Assignment
- Assign employees to projects
- Remove employees from projects
- View all assigned employees per project

---

## 📁 Project Structure

employee-project-portal/

│

├── 📂 frontend/                    # React.js Frontend

│   └── 📂 src/

│       ├── 📂 components/          # Reusable UI Components

│       │   ├── Navbar.tsx          # Top navigation bar

│       │   └── Sidebar.tsx         # Side navigation menu

│       ├── 📂 context/             # React Context

│       │   └── AuthContext.tsx     # Authentication state

│       ├── 📂 pages/               # Page Components

│       │   ├── Login.tsx           # Login page

│       │   ├── Dashboard.tsx       # Dashboard page

│       │   ├── Employees.tsx       # Employee management

│       │   └── Projects.tsx        # Project management

│       └── 📂 services/            # API Services

│           └── api.ts              # Axios API calls

│

└── 📂 backend/                     # Node.js Backend

├── 📂 config/

│   └── database.js             # PostgreSQL connection

├── 📂 controllers/             # Business Logic

│   ├── authController.js       # Login/Signup logic

│   ├── employeeController.js   # Employee CRUD

│   └── projectController.js    # Project CRUD

├── 📂 middleware/

│   └── auth.js                 # JWT verification

├── 📂 routes/                  # API Routes

│   ├── auth.js                 # Auth routes

│   ├── employees.js            # Employee routes

│   └── projects.js             # Project routes

├── 📂 uploads/                 # Profile images

└── server.js                   # Main server file

---

## 🗄️ Database Schema

### 👤 users table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 👥 employees table
```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    designation VARCHAR(100),
    department VARCHAR(100),
    joining_date DATE,
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 📁 projects table
```sql
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    project_name VARCHAR(150) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 🔗 employee_projects table
```sql
CREATE TABLE employee_projects (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employees(id) ON DELETE CASCADE,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, project_id)
);
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v14+)
- npm

### 1️⃣ Clone Repository
```bash
git clone https://github.com/zeal17782-glitch/employee-project-portal.git
cd employee-project-portal
```

### 2️⃣ Backend Setup
```bash
# Go to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
DB_HOST=localhost
DB_PORT=5432
DB_NAME=employee_portal
DB_USER=postgres
DB_PASSWORD=your_password
PORT=5000
JWT_SECRET=your_secret_key

# Start backend server
node server.js
```

### 3️⃣ Frontend Setup
```bash
# Go to frontend folder
cd frontend

# Install dependencies
npm install

# Start React app
npm start
```

### 4️⃣ Open Browser
http://localhost:3000

---

## 🔗 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login & get token |

### 👥 Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | Get all employees |
| POST | `/api/employees` | Create employee |
| GET | `/api/employees/:id` | Get single employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |

### 📁 Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/:id` | Get single project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| POST | `/api/projects/:id/assign` | Assign employee |
| DELETE | `/api/projects/:id/remove/:empId` | Remove employee |

### 📊 Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Get statistics |

---

## 🔒 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 5432 |
| DB_NAME | Database name | employee_portal |
| DB_USER | Database user | postgres |
| DB_PASSWORD | Database password | admin123 |
| PORT | Server port | 5000 |
| JWT_SECRET | JWT secret key | mysecretkey |

---

## 👨‍💻 Developer

**Zeal Hiren Gori**
- GitHub: [@zeal17782-glitch](https://github.com/zeal17782-glitch)

---

## 📝 License

This project is built for educational purposes.

