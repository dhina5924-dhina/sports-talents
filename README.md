# ⚡ Sports Platform - Full-Stack Application

A social platform for sports enthusiasts built with **Python FastAPI**, **SQLAlchemy ORM**, **MySQL** (with SQLite auto-fallback), and a responsive **Single-Page Application (SPA)** frontend.

---

## 🌟 Features

1. **Authentication & Authorization**:
   - User Registration, Login, Logout with JWT tokens.
   - Password security using salted hash algorithms (Bcrypt / PBKDF2).
   - Protected API routes and role-based permissions (User / Admin).

2. **Home Feed**:
   - High-energy social feed showing posts chronologically (recent first).
   - Support for photo and video posts with custom media player.
   - Author profile avatar, sports category badges, captions, hashtags, like count, comment count, and action buttons.

3. **Upload Sports Media**:
   - Upload Photos (JPG, PNG, WEBP, GIF) and Videos (MP4, WEBM, MOV).
   - Select sports categories (*Cricket, Football, Basketball, Volleyball, Tennis, Badminton, Athletics, Other*).
   - Automatic file type & size validation (10MB image limit, 50MB video limit).
   - Instant file preview before publishing.

4. **Like System**:
   - One-click like/unlike with optimistic UI updates.
   - Duplicate like prevention at API & DB constraint level.

5. **Comment System**:
   - Add comments, view live comment threads.
   - Authors or admins can delete comments.

6. **Follow System**:
   - Follow & unfollow athletes with real-time follower/following count updates.

7. **User Profile**:
   - Personalized athlete profile showing avatar, bio, total posts, total likes, followers, following, and uploaded media feed.
   - Profile editing for avatar URL, bio, and username.

8. **Explore & Search**:
   - Universal search across athletes, post captions, and hashtags.
   - Sports category filtering pills.
   - Popular posts and trending hashtags.

9. **Notifications**:
   - Activity notifications for likes, comments, and new followers.
   - Unread notification counter badge in navigation header.

10. **Admin Moderation Panel**:
    - Platform metrics overview (total users, posts, likes, pending reports).
    - Content moderation reports table with Resolve/Dismiss actions.
    - Registered user accounts table with administrator user deletion capability.

---

## 📁 Project Architecture

```
sports_platform/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI Application Entry & Static Mounts
│   │   ├── database.py          # SQLAlchemy Engine & SQLite/MySQL Fallback
│   │   ├── models/              # SQLAlchemy ORM Models (10 Tables)
│   │   │   ├── user.py, post.py, media.py, like.py, comment.py,
│   │   │   ├── follow.py, hashtag.py, notification.py, report.py
│   │   ├── schemas/             # Pydantic Schemas & Data Transfer Objects
│   │   ├── auth/                # JWT Token & Password Security
│   │   ├── routers/             # API Routers (/auth, /users, /posts, etc.)
│   │   ├── services/            # Storage & Notification Services
│   │   └── utils/               # File Validation & Helpers
│   ├── requirements.txt
│   ├── .env.example
│   └── schema.sql               # Production MySQL Schema DDL Script
├── frontend/
│   ├── index.html               # Single Page Application HTML Shell
│   ├── css/styles.css           # Modern Sports Aesthetic Stylesheet
│   └── js/app.js                # Router, State Manager & API Integration
├── seed_data.py                 # Initial Demo Data Generator
└── README.md
```

---

## 🚀 Quick Setup & Running Locally

### Prerequisites
- Python 3.9+
- Pip package manager
- (Optional) MySQL Server (SQLite runs automatically out of the box if MySQL is not running)

### 1. Install Dependencies
```bash
pip install -r backend/requirements.txt
```

### 2. Environment Configuration
Copy the example environment file:
```bash
cp backend/.env.example .env
```

*(Optional for MySQL Users)*: Set `DATABASE_URL="mysql+pymysql://username:password@localhost:3306/sports_db"` in `.env` and execute `backend/schema.sql` in MySQL.

### 3. Seed Demo Data (Recommended)
Populate the platform with demo athletes (Cricket, Football, Basketball, Tennis, Athletics), photos, comments, and likes:
```bash
python seed_data.py
```

### 4. Run Application Server
Start the Uvicorn FastAPI server:
```bash
python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

### 5. Access Application
Open your web browser and visit:
- **Application Web UI**: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- **Interactive OpenAPI Specs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🔑 Demo Account Credentials

| Role | Username | Password |
|---|---|---|
| **Administrator** | `admin` | `adminpassword123` |
| **Cricket Athlete** | `sarah_cricket` | `password123` |
| **Basketball Player** | `marcus_dunk` | `password123` |
| **Football Player** | `david_kick` | `password123` |
| **Tennis Contender** | `elena_tennis` | `password123` |
| **Runner / Athletics** | `alex_runner` | `password123` |
