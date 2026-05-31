# 🪚 Oak & Iron Studio 

**A premium, mobile-first single-page application for joinery workshops and furniture showrooms.**

![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-purple?style=flat&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css)
![Firebase](https://img.shields.io/badge/Firebase-v12-FFCA28?style=flat&logo=firebase)

> *Built with React 19, Vite 8, Tailwind CSS v4, and React Router DOM v7, with Firebase Firestore as the single source of truth for all content.*

---

## 📸 Screenshots

*(Replace these with actual screenshots of your application)*

| Customer Showroom | Admin Dashboard |
|:---:|:---:|
| <img src="https://via.placeholder.com/400x250.png?text=Showroom+Screenshot" width="400"/> | <img src="https://via.placeholder.com/400x250.png?text=Admin+Screenshot" width="400"/> |

---

## ✨ Key Features

### 🛍️ Customer Showroom
- **Dynamic Categories:** Browse designs by categories (Doors, Windows, Tables, Chairs, Beds, Cupboards) with drill-down into subcategory galleries.
- **Lightbox Viewer:** Fullscreen gesture-enabled lightbox viewer with swipe navigation for a premium viewing experience.
- **Seamless Contact:** WhatsApp inquiry button with pre-filled context messages per design, plus floating action buttons (Call / WhatsApp) on every page.
- **CMS Driven:** Dynamic content driven entirely by Firestore settings (branding, hero, about, contact, social links, footer).

### ⚙️ Admin Control Panel
- **Secure Access:** Firebase Email/Password authentication at `/admin/login` with protected routes and session persistence.
- **Dashboard:** Summary cards with category, subcategory, and total image counts.
- **Categories & Subcategories:** Full CRUD operations with inline creation, drag-and-drop reorder, visibility toggling, and image uploads.
- **Settings Center:** Single-page control center for Branding, About, Contact, Socials, Hero, and Footer. 

---

## 🛠️ Technology Stack

- **Framework**: React 19.2.6
- **Bundler**: Vite 8
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM v7
- **Backend & Auth**: Firebase v12 (Auth, Firestore)
- **Data Storage**: Base64 strings in Firestore for images (no external hosting needed for images).

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase
Create a `.env` file in the project root with your Firebase config values:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```
> **Note**: Do not use quotes or trailing commas in `.env` values.

### 3. Set Up Firestore Rules
For development, use the following permissive rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).

---

## 🚢 Deployment

This project can be easily deployed to services like Vercel, Netlify, or Firebase Hosting.

1. Build the production bundle:
   ```bash
   npm run build
   ```
2. The output will be generated in the `dist/` directory.
3. Deploy the `dist/` directory to your hosting provider of choice. Remember to set up environment variables on your hosting provider to match your local `.env`.

---

## 📂 Directory Structure

```text
Carpenter/
├── public/assets/images/       # Static assets
├── src/
│   ├── customer/               # Public showroom module
│   ├── admin/                  # Admin CMS module
│   ├── shared/                 # Contexts, Firebase services, utilities
│   ├── App.jsx                 # Global router + nested providers
│   ├── index.css               # Typography & global styles
│   └── main.jsx                # React entry point
├── .env                        # VITE_FIREBASE_* configuration
├── package.json
└── vite.config.js
```

---

## 🗄️ Firestore Structure

| Path | Purpose | Key fields |
|------|---------|------------|
| `settings/siteSettings` | Global website settings | `workshopName`, `heroTitle`, `whatsappNumber`, etc. |
| `categories/{id}` | Product categories | `name`, `coverImage`, `description`, `visible` |
| `subcategories/{slug}` | Product subcategories | `categoryId`, `name`, `coverImage`, `visible` |
| `galleries/{slug}` | Gallery images | `subcategoryId`, `images[{id, url}]` |
