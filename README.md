# 💼 JobPortal — Full-Stack MERN Job Portal with AI

A modern, full-stack job portal where **job seekers** discover and apply to jobs and
**recruiters** post jobs, manage companies, and review applicants — supercharged with
**AI** for resume-to-job match scoring and automatic company-logo detection.

### 🔗 Live Demo
**👉 https://job-portal-project2-five.vercel.app/**

📄 **Full visual walkthrough:** see [`JobPortal-Documentation.pdf`](./JobPortal-Documentation.pdf) for screenshots and explanations of every screen.

---

## 🚀 Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, Vite, Redux Toolkit, Redux Persist, React Router v7, Tailwind CSS, Radix UI, Axios, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express.js, MongoDB (Mongoose), JWT (cookie-based auth), bcrypt, Multer, Cloudinary, CORS |
| **AI & Integrations** | Groq (LLaMA 3.3 70B via OpenAI-compatible SDK) for skill matching, logo.dev for company logos |
| **Deployment** | Vercel (frontend), Render (backend), MongoDB Atlas (database) |

---

## ✨ Features

### 👤 For Job Seekers
- Browse, **search**, and **filter** jobs by location, industry, and salary
- Detailed **job description** pages
- 🤖 **AI Smart Match** — score how well your profile fits a job (0–100) with feedback and missing-skills analysis
- One-click **apply** and track **applied jobs**
- Profile with **resume upload** (Cloudinary)

### 🧑‍💼 For Recruiters
- **Dashboard profile** with live stats (jobs posted, companies, open positions)
- **Post & manage jobs**
- **Manage companies** with 🤖 **AI auto-detected brand logos** (no upload needed)
- **Per-job applicants** view
- **Applications tab** — every applicant across all jobs, with **email & phone** to contact directly
- 🤖 **AI Match score** auto-calculated for each applicant
- **Accept / Reject** applications

### 🔐 Common
- **JWT authentication** with role-based access (Jobseeker / Recruiter)
- Secure, cookie-based sessions

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary, Groq, and logo.dev API keys

### 1. Clone the repo
```bash
git clone https://github.com/Shaziyahackathon1234/jobPortalProject2.git
cd jobPortalProject2
```

### 2. Backend setup
```bash
cd backend
npm install
npm run dev
```

Create a `backend/.env` file:
```env
MONGO_URI=your_mongodb_atlas_uri
SECRET_KEY=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
LOGODEV_TOKEN=your_logodev_publishable_token
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

---

## 📂 Project Structure
```
JOBPORTALPROJECT/
├── backend/
│   ├── controllers/      # Business logic (auth, jobs, applications, AI, company)
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── middlewares/      # Auth middleware
│   └── utils/            # Cloudinary, logo.dev helper, etc.
└── frontend/
    └── src/
        ├── components/   # Pages & UI (admin, auth, shared)
        ├── hooks/        # Custom data-fetching hooks
        ├── redux/        # Redux Toolkit slices & store
        └── utils/        # API endpoint constants
```

---

## 🤖 How the AI Works
- **Resume–Job Match:** The applicant's skills and the job description are sent to an LLM (LLaMA 3.3 70B via Groq) that returns a 0–100 match score, written feedback, and missing skills.
- **Company Logos:** When no logo is uploaded, the AI maps the company name to its website domain (e.g. *Mahindra → mahindra.com*), then logo.dev returns the real brand logo, falling back to a clean initials avatar.

---

## 👩‍💻 Author
**Shaziya Simran**

> Built with the MERN stack and AI ✨
