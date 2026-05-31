# Oak & Iron Studio — Carpenter Portfolio & Showroom Management System

A premium, mobile-first single-page application for joinery workshops and furniture showrooms. Built with **React 19**, **Vite 8**, **Tailwind CSS v4**, and **React Router DOM v7**, with **Firebase Firestore** as the single source of truth for all content.

---

## Features

### Customer Showroom
- Browse designs by category (Doors, Windows, Tables, Chairs, Beds, Cupboards) with drill-down into subcategory galleries
- Fullscreen gesture-enabled lightbox viewer with swipe navigation
- WhatsApp inquiry button with pre-filled context message per design
- Floating action buttons (Call / WhatsApp) on every page
- Dynamic content driven entirely by Firestore settings (branding, hero, about, contact, social links, footer)

### Admin Control Panel
- Firebase Email/Password authentication at `/admin/login`
- Protected admin routes with session persistence via `onAuthStateChanged`
- **Dashboard** — summary cards with category, subcategory, and total image counts
- **Categories** — create, edit, reorder, toggle visibility of categories; inline subcategory creation/deletion
- **Subcategories** — grouped accordion UI with image upload, drag-and-drop reorder, cover image selection, and delete (all synced to Firestore)
- **Settings** — single-page control center with 6 sections:
  - Branding & Logo (name, compact logo text, tagline, description, logo image upload)
  - About Showroom (brand introduction, craftsmanship, stats)
  - Contact & Location (WhatsApp with auto-generated API link, phone with auto-generated tel: link, email, address, Google Maps link + embed)
  - Social Showroom Handles (Instagram, Facebook, Pinterest, YouTube)
  - Homepage Hero (title, subtitle, description, banner image upload)
  - Footer (content, copyright text)
  - Image uploads stored as Base64 in Firestore; auto-generation of WhatsApp/tel: links; URL validation; unsaved changes warning

### Firebase Integration
- **Authentication**: Email/Password sign-in with error handling
- **Settings**: Single `settings/siteSettings` document with automatic default merge for missing fields
- **Categories**: `categories/{id}` documents with seed data (6 defaults on first read)
- **Subcategories**: `subcategories/{slug}` documents with seed data (24 defaults on first read)
- **Galleries**: `galleries/{slug}` documents storing image arrays `[{ id, url, displayOrder }]`; auto-seeded from localStorage on first load

---

## Technology Stack

- **Framework**: React 19.2.6
- **Bundler**: Vite 8
- **CSS**: Tailwind CSS v4 with `@tailwindcss/vite`
- **Routing**: React Router DOM v7
- **Backend**: Firebase v12 (Auth, Firestore, Storage)
- **Image Storage**: Base64 strings in Firestore (no external hosting)

---

## Directory Structure

```
Carpenter/
├── public/assets/images/       # Static assets
├── src/
│   ├── customer/               # Public showroom module
│   │   ├── components/         # Header, Footer, Hero, Breadcrumb, SubcategoryCard
│   │   ├── layouts/            # CustomerLayout.jsx (with floating action buttons)
│   │   └── pages/              # HomePage, AboutPage, ContactPage, CategoryPage, GalleryPage
│   │
│   ├── admin/                  # Admin CMS module
│   │   ├── components/         # ProtectedRoute.jsx
│   │   ├── layouts/            # AdminLayout.jsx (sidebar layout with nav)
│   │   └── pages/              # LoginPage, DashboardPage, CategoriesPage, SubcategoriesPage, SettingsPage
│   │
│   ├── shared/
│   │   ├── contexts/           # SettingsContext, CategoriesContext, SubcategoriesContext, GalleriesContext
│   │   ├── services/           # firebase.js (all Firestore CRUD + auth)
│   │   ├── data/               # mockData.js (orphaned localStorage helpers; only getSubcategoryImages used for seed)
│   │   ├── components/         # ImageViewer.jsx (global gesture lightbox)
│   │   └── utils/              # compressImage.js (canvas-based client-side compression)
│   │
│   ├── App.jsx                 # Global router + nested providers
│   ├── index.css               # Typography, animations, scrollbar styles
│   └── main.jsx                # React entry point
│
├── .env                        # VITE_FIREBASE_* configuration
├── package.json
└── vite.config.js
```

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Firebase

Create a `.env` file in the project root with your Firebase config values:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

> **Important**: Do not use quotes or trailing commas in `.env` values — the dotenv parser treats them as part of the value.

### 3. Set up Firestore rules

For development, use permissive rules:
```
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

### 4. Start dev server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).

### 5. Build for production
```bash
npm run build
```
Output goes to `dist/`.

---

## Firestore Document Structure

| Path | Purpose | Key fields |
|------|---------|------------|
| `settings/siteSettings` | Global website settings | workshopName, heroTitle, whatsappNumber, phoneCallLink, instagramUrl, ... (28 fields) |
| `categories/{id}` | Product categories | name, coverImage, description, displayOrder, visible |
| `subcategories/{slug}` | Product subcategories | categoryId, name, coverImage, description, displayOrder, visible |
| `galleries/{slug}` | Gallery images per subcategory | subcategoryId, coverImage, imageCount, images[{id, url, displayOrder}], updatedAt |

---

## Provider Hierarchy

In `App.jsx`, contexts are nested in dependency order:

```
SettingsProvider
  └── CategoriesProvider
       └── SubcategoriesProvider
            └── GalleriesProvider
                 └── Router / Routes
```

Each provider loads its data from Firestore on mount and exposes it via `useSettings()`, `useCategories()`, `useSubcategories()`, and `useGalleries()`.
