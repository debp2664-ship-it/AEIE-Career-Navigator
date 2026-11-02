# AEIE Career Navigator (2026–2030)

> **Plan Your Skills. Build Your Future.**  
> A professional, full-stack career roadmap and progress tracking platform designed specifically for students pursuing a Bachelor of Engineering (B.E.) in **Applied Electronics and Instrumentation Engineering (AEIE)** at the **University Institute of Technology (UIT), The University of Burdwan**, West Bengal, India.

---

## 1. Project Overview

The **AEIE Career Navigator** is a specialized engineering career planning and skill development system built for the 2026–2030 undergraduate batch. It bridges the critical divide between university curriculum, lab practicals, modern software tooling, industrial automation (PLC, SCADA, DCS), embedded systems, and competitive examinations (GATE IN/EE/EC, PSU recruitments, and premier M.Tech/MS programs).

The application functions as a full-stack platform featuring an Express/Node.js REST API with MongoDB/Mongoose persistence, combined with a responsive, high-performance client interface that includes real-time Chart.js visualizations, offline-first fallback, and cloud synchronization.

---

## 2. Key Features

### 🎓 4-Year Academic & Skills Roadmap (Semesters 1 to 8)
- **Year 1: Foundation (2026–2027)** – Engineering Mathematics, Physics, Basic Electrical Engineering, C Programming, Git & GitHub, Python fundamentals, Basic Electronics, Circuit Analysis, and HTML/CSS/JS.
- **Year 2: Skill Development (2027–2028)** – Analog Electronics, Digital Electronics, Network Theory, Signals & Systems, C++ Data Structures, Arduino, Measurements & Instrumentation, Microcontrollers (8051/8086), Control Systems, Python NumPy/Pandas, and Sensor Interfacing.
- **Year 3: Specialization (2028–2029)** – Industrial Instrumentation, Advanced Control Systems, Embedded C, PLC & SCADA, Industrial Communication Protocols (Modbus, CAN, Profibus, HART), DSA & Aptitude, GATE Preparation Strategy, and Summer Internship Applications.
- **Year 4: Career Launch (2029–2030)** – Technical Interview Whiteboarding, GATE Final Sprint, Placement Aptitude, Capstone Project Phases 1 & 2, Campus Drives, and COAP/CCMT Counseling.

### 📊 Real-Time Analytics & Chart.js Visualizations
- **Semester Completion Bar Chart:** Dynamic horizontal/vertical bar chart showing real-time percentage completion across all 8 semesters.
- **Skill Pillars Doughnut Chart:** Breakdown across AEIE Core & Transducers, Embedded & Microcontrollers, Programming & Software, and Mathematics & Control Theory.
- **Master Radial SVG Gauge:** Animated circular completion meter in the tracker dashboard.

### 🔐 Permanent User Accounts, Auto-Save & Cloud Persistence
- **JWT-Based Authentication:** Secure user registration, login, and password hashing with `bcryptjs`.
- **Permanent State Restoration:** When a student logs in from any device or browser, their exact previous state is fetched from MongoDB and restored: completed subjects, projects, saved resources, GATE milestones, personal notes, and theme preference.
- **Automatic Cloud Progress Saving:** Changes are debounced and synchronized automatically with tri-state status badge:
  - `Saving...` (pulsing indicator during network sync)
  - `Saved ✓` (confirmed persistence in cloud database)
  - `Unable to save` (graceful offline fallback to local browser cache)
- **Personal Study Notes & Goals Widget:** Integrated in the personal dashboard drawer with character count, allowing students to record formulas, viva notes, and semester targets that persist per user ID.
- **User Data Isolation:** Strict tenancy isolation guaranteeing User A's data can never be read or modified by User B.

### 📬 Contact Us & Direct Mentorship Feedback System
- **Dedicated Contact Section:** Positioned right above the footer with fields for Full Name, Email, Subject, Feedback Category (`Suggestion`, `Bug Report`, `General Feedback`), and Message.
- **Backend Email Delivery:** Messages are validated, saved in MongoDB, and dispatched via Nodemailer SMTP to **`debdeveloper2207@gmail.com`**.
- **Transparent Status Reporting:** Accurately distinguishes between successful email dispatch, queued database storage, and delivery errors without misleading claims.
- **Rate-Limited Protection:** Anti-spam middleware prevents accidental or malicious flood submissions.

### 🌟 Website Creator Credit
- Elegant, non-intrusive credit at the very bottom of the website:
  `"Made with care by Deb."` • `AEIE Career Navigator` • `© 2026 All Rights Reserved.`
- Includes subtle hover scaling and heart pulse animations.

### 💼 Portfolio Showcase & Domain Filter
- Interactive showcase of 6 high-impact engineering projects:
  1. *Student Management System using C* (CLI, File I/O, Structs)
  2. *Python Sensor Data Logger* (PySerial, CSV, Matplotlib)
  3. *Temperature Monitoring & Alert Station* (Arduino, I2C LCD, Calibration)
  4. *Virtual Instrumentation Dashboard* (PyQt / Streamlit, Gauge Dials, HMI)
  5. *Industrial IoT Condition Monitoring System* (ESP32, FreeRTOS, MQTT, Cloud)
  6. *Digital Closed-Loop Motor Speed Controller* (Discrete PID in bare-metal C, Optical Encoders)
- Filter projects by domain: *Embedded, IoT, Python, or C Language*.

### 🎯 GATE & Higher Studies Master Guide
- Comprehensive guidance comparing **GATE IN vs GATE EE vs GATE EC**.
- Core syllabus weightage breakdown and recommended standard textbooks (Nagrath & Gopal, Sawhney, Van Valkenburg, Oppenheim, Sedra & Smith).
- 4-stage preparation timeline from Semester 5 through Semester 8.

### 🏭 Dedicated Internship Preparation Framework
- Chronological 4-year transition guide from first-year Git repositories to final-year pre-placement offers (PPOs).
- Direct integration with the official **[AICTE Internship Portal](https://internship.aicte-india.org/)**.
- Practical advice for industrial training across West Bengal core industrial belts (Durgapur/Asansol Steel, Thermal Power Stations, Refineries).

### 📚 Curated Learning Resources Directory
- Direct, clickable access to 10 verified learning platforms:
  - **NPTEL (SWAYAM)** – IIT video courses for Control Systems & Sensors
  - **Harvard CS50x** – Gold standard computer science & C programming
  - **freeCodeCamp** – Interactive coding & Python certifications
  - **Wokwi Simulator** – In-browser circuit simulation for Arduino/ESP32
  - **Kaggle Learn** – Python, Pandas, and data science micro-courses
  - **GitHub Skills** – Interactive version control workflows
  - **Python Official Docs** – Authoritative language tutorials
  - **Arduino Documentation** – Hardware guides and API references
  - **MATLAB Academy** – Free hands-on MATLAB & Simulink Onramps
  - **AICTE Portal** – Verified pan-India internships
- Live search and category filters with interactive "Mark Done" tracking.

### 🌓 UI/UX Polish & Theme Engine
- **Light / Dark Mode Toggle** with smooth transitions and theme-aware Chart.js palette updates.
- **Print / PDF Export** with clean, media-optimized print stylesheets.
- **Ephemeral Toast Notifications** for real-time user feedback.
- Accessible semantic HTML with keyboard navigation support (Enter / Space on accordions).

---

## 3. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | HTML5, CSS3 (Custom Variables, Flexbox, Grid), JavaScript (ES6+), Chart.js, Lucide Icons |
| **Backend** | Node.js, Express.js (v5), REST API Architecture |
| **Database** | MongoDB with Mongoose (Hybrid In-Memory fallback if offline) |
| **Security & Auth** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, CORS, Input Sanitization |
| **Dev Tools** | `dotenv`, Git, GitHub Pages / Node HTTP Server |

---

## 4. Folder Structure

```
AEIE/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection & ready-state handler
│   ├── controllers/
│   │   ├── authController.js     # User registration, login & profile
│   │   ├── progressController.js # Real-time checklist tracking & bulk sync
│   │   ├── resourceController.js # Learning resources catalog & completion
│   │   └── roadmapController.js  # 8 Semesters, projects & metadata
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT Bearer token verification
│   │   ├── errorMiddleware.js    # 404 & centralized error handler
│   │   └── validationMiddleware.js # Input validation rules
│   ├── models/
│   │   ├── LearningResource.js   # Resource schema
│   │   ├── Project.js            # Portfolio project schema
│   │   ├── Semester.js           # Academic semester curriculum schema
│   │   ├── Skill.js              # Technical & core skill schema
│   │   ├── User.js               # Student user schema with bcrypt hashing
│   │   └── UserProgress.js       # Cloud progress tracking schema
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth endpoints
│   │   ├── progressRoutes.js     # /api/progress endpoints
│   │   ├── resourceRoutes.js     # /api/resources endpoints
│   │   └── roadmapRoutes.js      # /api/roadmap endpoints
│   ├── tests/
│   │   └── api.test.js           # 12-point automated REST API test suite
│   ├── seeder.js                 # Database seeder script
│   └── server.js                 # Express server & static asset host
├── index.html                    # Responsive semantic UI structure
├── style.css                     # Dark/Light theme design system
├── script.js                     # Client-side engine & Chart.js integration
├── .env.example                  # Environment template
├── .env                          # Local environment variables
├── .gitignore                    # Ignored files (node_modules, logs, secrets)
├── package.json                  # Project manifest and scripts
└── README.md                     # Documentation
```

---

## 5. Installation & Setup

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)
- **MongoDB** (Local instance running at `mongodb://127.0.0.1:27017` or a free MongoDB Atlas cloud cluster)

### Step 1: Clone or Navigate to the Project Folder
```bash
cd "c:\Users\debp2\OneDrive\Desktop\AEIE"
```

### Step 2: Install Backend Dependencies
```bash
npm install
```
*(On Windows PowerShell with execution policy restrictions, use `npm.cmd install`)*

### Step 3: Configure Environment Variables
Create a `.env` file based on `.env.example`:
```ini
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/aeie_roadmap
JWT_SECRET=aeie_uit_burdwan_super_secret_jwt_key_2026_2030
JWT_EXPIRES_IN=30d
```

> **Note on Hybrid Fallback:** If you do not have MongoDB running locally, the application automatically enters **Hybrid In-Memory Fallback Mode**. All authentication, progress tracking, and roadmap endpoints will work smoothly in memory without crashing!

### Step 4: Seed the Database (Optional)
To pre-populate MongoDB with all 8 semesters, 6 projects, and curated learning resources:
```bash
npm run seed
```

---

## 6. How to Run the Application

### Option A: Full-Stack Mode (Recommended)
Start the Node.js backend server:
```bash
npm start
```
The server will start listening at:
- **Application URL:** [http://localhost:5000](http://localhost:5000)
- **API Health Endpoint:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

Open your browser and navigate to `http://localhost:5000` to interact with the full-stack application.

### Option B: Standalone Frontend Mode
You can also open `index.html` directly in any web browser without running Node.js. The frontend will automatically operate in offline guest mode using `localStorage`.

---

## 7. Running the Automated Test Suite

The project includes an automated integration test suite verifying all 12 backend endpoints:
```bash
npm test
```
The suite verifies:
1. Health check & database connection
2. Roadmap summary metadata
3. 8 Academic semesters
4. Single semester detail retrieval
5. 6 Portfolio projects
6. Learning resources catalog & live search
7. Student registration (password hashing + JWT)
8. Student login (credential verification)
9. Protected routes (`/api/auth/me`)
10. Task toggling & percentage recalculation
11. Bulk progress synchronization
12. Progress reset

---

## 8. REST API Documentation

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new student account (hashes password, returns JWT) |
| `POST` | `/api/auth/login` | Public | Authenticate student & return session JWT |
| `GET` | `/api/auth/me` | Private | Get current authenticated student profile & progress |
| `PUT` | `/api/auth/profile` | Private | Update student profile (semester, career goal) |

### Progress Routes (`/api/progress`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/progress` | Private | Retrieve user's complete milestone checklist |
| `POST` | `/api/progress/task` | Private | Check or uncheck a specific subject or project |
| `PUT` | `/api/progress/sync` | Private | Bulk synchronize local guest progress to cloud account |
| `DELETE`| `/api/progress/reset` | Private | Reset student's roadmap progress |

### Learning Resources Routes (`/api/resources`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/resources` | Public | List learning resources with optional `?search=` and `?category=` |
| `POST` | `/api/resources/:id/toggle-complete` | Private | Toggle user completion status for a resource |

### Roadmap Curriculum Routes (`/api/roadmap`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/roadmap/summary` | Public | High-level metrics, department data & pathways |
| `GET` | `/api/roadmap/semesters` | Public | Retrieve full 8-semester curriculum breakdown |
| `GET` | `/api/roadmap/semesters/:semNumber` | Public | Retrieve detailed single semester (1 to 8) |
| `GET` | `/api/roadmap/projects` | Public | Retrieve all 6 portfolio projects |

### Contact & Feedback Routes (`/api/feedback`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/feedback` | Public (Rate-Limited) | Submit student feedback or query (saves in DB, sends email to `debdeveloper2207@gmail.com`) |
| `GET` | `/api/feedback` | Private / Review | Retrieve recorded feedback submissions |

---

## 9. Screenshots & Visual Interface

### 1. Hero & Academic Timeline
*Dark navy aesthetic with electric blue accents, academic journey pill, live completion bar, and interactive 4-year milestone navigation.*

### 2. Analytics & Visual Dashboard
*Real-time Chart.js bar chart displaying completion percentage across Semesters 1 to 8 alongside an engineering skill domain doughnut chart.*

### 3. Curriculum & Skills Breakdown
*Expandable semester cards featuring core concepts with interactive checkboxes, technical skills, programming stacks, AEIE core engineering topics, internship preparation, and mentor advice tips.*

### 4. Light & Dark Mode
*Instant toggle between high-contrast Dark Navy and crisp Modern Light themes with preserved accessibility and readability.*

---

## 10. Future Improvements
- **Alumni Mentorship Connect:** In-app messaging or Q&A forum connecting current undergraduates with UIT Burdwan AEIE alumni working in core PSUs and MNCs.
- **GATE Quiz Engine:** Interactive daily multiple-choice questions for GATE IN/EE with timer and score tracking.
- **Automated Resume Builder:** One-click generation of ATS-friendly LaTeX and PDF resumes formatted with the student's completed projects and verified skills.
- **Lab Experiment Walkthroughs:** Interactive circuit simulation sandboxes embedded directly into semester lab pages.

---

## 11. Academic Context & Disclaimer

- **Department:** Applied Electronics & Instrumentation Engineering (AEIE)
- **Institution:** University Institute of Technology (UIT)
- **Affiliation:** The University of Burdwan, West Bengal, India
- **Batch:** 2026–2030

*Disclaimer: Course syllabus, subject codes, and recruitment conditions are subject to university ordinances and corporate recruitment guidelines. No roadmap can guarantee placement; consistent problem-solving and rigorous engineering effort determine individual outcomes.*

---

## 12. License & Author Credit

Created with care by **Deb** ([debdeveloper2207@gmail.com](mailto:debdeveloper2207@gmail.com)).

This project is licensed under the [MIT License](LICENSE) — see the [LICENSE](LICENSE) file for complete terms and permissions.
© 2026 AEIE Career Navigator. All Rights Reserved.

