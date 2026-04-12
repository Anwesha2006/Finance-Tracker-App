# 💸 R4rupee – AI Powered Finance Tracker

> Turning raw financial data into **insight, fairness, and smarter decisions**

---

## 🚀 Overview

R4rupee is a full-stack finance tracker that helps users:

* Track expenses & income 📊
* Split bills fairly 👥
* Analyze spending patterns 📈
* Get AI-powered insights 🤖

It combines a **modern frontend (Next.js)** with a **Node.js backend** and smart logic for financial analysis.

---

## 🌐 Live Demo

* Frontend (Vercel): 👉 https://finance-tracker-app-p78e.vercel.app
* Backend (Render): 👉 https://r4rupee.onrender.com

---

## 📁 Project Structure

```bash
Finance-Tracker-App/
│
├── frontend/                # Next.js App (Vercel)
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── utils/
│
├── backend/                # Node.js / Express API (Render)
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── config/
│
├── README.md
```

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repo

```bash
git clone https://github.com/Anwesha2006/Finance-Tracker-App.git
cd Finance-Tracker-App
```

---

### 2️⃣ Setup Backend

```bash
cd backend
npm install
npm run dev
```

---

### 3️⃣ Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

---

### 4️⃣ Environment Variables

Create `.env` inside `/backend`:

```env
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET_KEY=your_secret
```

---

## 🔌 API Endpoints

### 🔐 Auth

```http
POST /api/auth/signup
POST /api/auth/login
```

---

### 💸 Transactions

```http
POST /api/transactions/add
GET  /api/transactions
DELETE /api/transactions/:id
```

---

### 📊 Analytics

```http
GET /api/analytics/summary
```

---

## 🔁 Workflow

```text
Frontend (Next.js) → API (Express) → MongoDB → Response → UI Update
```

---

## ✨ Features

* Add & track expenses/income
* Split bills among friends
* Dynamic split calculation (no hardcoding)
* Clean modern UI
* Authentication (JWT)
* Deployed full-stack (Vercel + Render)

---

## 🌟 Unique Points

* Works with **dynamic friend lists (no hardcoded values)**
* Real-time split calculation
* Full-stack deployment setup
* Clean separation of frontend & backend

---

## 🚀 Deployment

### Frontend

* Hosted on **Vercel**
* Auto deploy on push

### Backend

* Hosted on **Render**
* API base URL:

```bash
https://r4rupee.onrender.com
```

---

## ⚠️ Important Notes

* Backend root (`/`) may show:

  ```
  Cannot GET /
  ```

  ✔️ This is normal (API-only server)

* CORS is configured to allow:

  * localhost
  * Vercel domains

---

## 📈 Future Improvements

* AI-based insights (planned)
* Receipt scanning (OCR)
* Smart expense predictions
* Group settlements optimization

---

## 🤝 Author

**Anwesha Baidya**

---

## 📄 License

MIT License

---

## 🧠 Final Note

> This project focuses on **understanding money, not just tracking it**.
