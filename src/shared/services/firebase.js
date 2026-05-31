import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp,
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from "firebase/firestore";
import { 
  getStorage, 
  ref, 
  uploadString, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";

export const firebaseEnabled = true;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project-id.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-project-id.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

export async function loginAdmin(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    let message = "An unexpected error occurred. Please try again.";
    switch (error.code) {
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        message = "Invalid email or password.";
        break;
      case "auth/invalid-email":
        message = "Invalid email format.";
        break;
      case "auth/network-request-failed":
        message = "Network error. Check your internet connection and try again.";
        break;
      case "auth/too-many-requests":
        message = "Too many failed login attempts. Please try again later.";
        break;
      case "auth/user-disabled":
        message = "This account has been disabled.";
        break;
    }
    return { success: false, error: message };
  }
}

export async function logoutAdmin() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export function getCurrentUser() {
  return auth.currentUser;
}

const defaultFirestoreSettings = {
  // Branding & Logo
  workshopName: "Oak & Iron Studio",
  workshopDescription: "",
  workshopShortName: "",
  workshopTagline: "",
  brandLogoUrl: "",
  heroBannerUrl: "",
  // About Showroom
  aboutBrandIntroduction: "",
  aboutCraftsmanship: "",
  yearsOfExperience: "",
  projectsCompleted: "",
  masterCraftsmenCount: "",
  // Contact & Location
  whatsappNumber: "",
  whatsappApiLink: "",
  phoneCallLink: "",
  phoneDisplayText: "",
  email: "",
  physicalAddress: "",
  googleMapsLink: "",
  googleMapsEmbedUrl: "",
  // Social Showroom Handles
  instagramUrl: "",
  facebookUrl: "",
  pinterestUrl: "",
  youtubeUrl: "",
  // Homepage / Hero
  heroTitle: "",
  heroSubtitle: "",
  heroDescription: "",
  // Footer
  footerContent: "",
  copyrightText: ""
};

export async function getFirestoreSettings() {
  try {
    const docRef = doc(db, "settings", "siteSettings");
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      const docData = {
        ...defaultFirestoreSettings,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await setDoc(docRef, docData);
      return { ...defaultFirestoreSettings };
    }
    const data = docSnap.data();
    return { ...defaultFirestoreSettings, ...data };
  } catch (error) {
    console.error("Firestore settings read error:", error);
    throw error;
  }
}

export async function saveFirestoreSettings(settings) {
  try {
    const docRef = doc(db, "settings", "siteSettings");
    await setDoc(docRef, {
      ...settings,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("Firestore settings write error:", error);
    return { success: false, error: error.message };
  }
}

// ── CATEGORIES FIRESTORE CRUD ──

const defaultFirestoreCategories = [
  { id: "doors", name: "Doors", coverImage: "/assets/images/door_single.png", description: "Bespoke interior and exterior doors designed to make a grand entrance.", displayOrder: 0, visible: true },
  { id: "windows", name: "Windows", coverImage: "/assets/images/door_single.png", description: "Architectural sliding and French windows that connect indoor elegance with outdoor beauty.", displayOrder: 1, visible: true },
  { id: "tables", name: "Tables", coverImage: "/assets/images/door_single.png", description: "Premium dining, coffee, and office tables crafted from solid wood.", displayOrder: 2, visible: true },
  { id: "chairs", name: "Chairs", coverImage: "/assets/images/door_single.png", description: "Handcrafted ergonomic seating, lounge chairs, and stools highlighting wood grains.", displayOrder: 3, visible: true },
  { id: "beds", name: "Beds", coverImage: "/assets/images/door_single.png", description: "Premium solid wood bed frames and bedroom collections built for comfort.", displayOrder: 4, visible: true },
  { id: "cupboards", name: "Cupboards", coverImage: "/assets/images/door_single.png", description: "Architectural cabinetry, modern cupboards, wardrobes, and credenzas.", displayOrder: 5, visible: true }
];

export async function getFirestoreCategories() {
  try {
    const colRef = collection(db, "categories");
    const q = query(colRef, orderBy("displayOrder", "asc"));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      for (const cat of defaultFirestoreCategories) {
        await setDoc(doc(db, "categories", cat.id), {
          ...cat,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      return [...defaultFirestoreCategories];
    }
    return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
  } catch (error) {
    console.error("Firestore categories read error:", error);
    throw error;
  }
}

export async function addFirestoreCategory(cat) {
  try {
    await setDoc(doc(db, "categories", cat.id), {
      ...cat,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("Firestore categories write error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateFirestoreCategory(id, data) {
  try {
    await setDoc(doc(db, "categories", id), {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("Firestore categories update error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteFirestoreCategory(id) {
  try {
    await deleteDoc(doc(db, "categories", id));
    return { success: true };
  } catch (error) {
    console.error("Firestore categories delete error:", error);
    return { success: false, error: error.message };
  }
}

// ── SUBCATEGORIES FIRESTORE CRUD ──

const defaultFirestoreSubcategories = [
  // DOORS
  { slug: "single-door", categoryId: "doors", name: "Single Door", coverImage: "/assets/images/door_single.png", description: "Handcrafted single doors featuring solid wood construction with traditional joinery techniques.", displayOrder: 0, visible: true },
  { slug: "double-door", categoryId: "doors", name: "Double Door", coverImage: "/assets/images/door_single.png", description: "Grand double-entry doors with symmetrical designs and matching wood grain across panels.", displayOrder: 1, visible: true },
  { slug: "designer-door", categoryId: "doors", name: "Designer Door", coverImage: "/assets/images/door_single.png", description: "Custom designer doors with unique architectural features and modern styles.", displayOrder: 2, visible: true },
  { slug: "entrance-door", categoryId: "doors", name: "Main Entrance Door", coverImage: "/assets/images/door_single.png", description: "Solid wood main entrance doors with enhanced security features and weather-resistant finishes.", displayOrder: 3, visible: true },
  // WINDOWS
  { slug: "sliding-window-2", categoryId: "windows", name: "2 Track Sliding", coverImage: "/assets/images/door_single.png", description: "Dual track sliding windows with smooth gliding mechanism and weather-tight seals.", displayOrder: 0, visible: true },
  { slug: "sliding-window-3", categoryId: "windows", name: "3 Track Sliding", coverImage: "/assets/images/door_single.png", description: "Triple track sliding windows offering maximum ventilation with flexible panel configurations.", displayOrder: 1, visible: true },
  { slug: "french-window", categoryId: "windows", name: "French Window", coverImage: "/assets/images/door_single.png", description: "Elegant French casement windows with classic styling and modern energy efficiency.", displayOrder: 2, visible: true },
  { slug: "casement-window", categoryId: "windows", name: "Casement Window", coverImage: "/assets/images/door_single.png", description: "Modern casement windows with crank-out operation, clean sightlines, and excellent ventilation.", displayOrder: 3, visible: true },
  // TABLES
  { slug: "dining-table", categoryId: "tables", name: "Dining Table", coverImage: "/assets/images/door_single.png", description: "Solid wood dining tables for family gatherings with extendable designs.", displayOrder: 0, visible: true },
  { slug: "coffee-table", categoryId: "tables", name: "Coffee Table", coverImage: "/assets/images/door_single.png", description: "Modern and traditional coffee tables featuring live-edge slabs and minimalist silhouettes.", displayOrder: 1, visible: true },
  { slug: "office-table", categoryId: "tables", name: "Office Table", coverImage: "/assets/images/door_single.png", description: "Executive desks with integrated cable management and ergonomic designs.", displayOrder: 2, visible: true },
  { slug: "study-table", categoryId: "tables", name: "Study Table", coverImage: "/assets/images/door_single.png", description: "Compact study tables and writing desks with built-in storage for home offices.", displayOrder: 3, visible: true },
  // CHAIRS
  { slug: "dining-chair", categoryId: "chairs", name: "Dining Chair", coverImage: "/assets/images/door_single.png", description: "Dining chairs crafted for comfort with upholstered seats and solid wood frames.", displayOrder: 0, visible: true },
  { slug: "office-chair", categoryId: "chairs", name: "Office Chair", coverImage: "/assets/images/door_single.png", description: "Ergonomic office chairs with lumbar support, adjustable mechanisms, and premium materials.", displayOrder: 1, visible: true },
  { slug: "lounge-chair", categoryId: "chairs", name: "Lounge Chair", coverImage: "/assets/images/door_single.png", description: "Comfortable lounge chairs with premium upholstery and mid-century inspired designs.", displayOrder: 2, visible: true },
  { slug: "armchair", categoryId: "chairs", name: "Wooden Armchair", coverImage: "/assets/images/door_single.png", description: "Elegant armchairs with solid wood frames, plush cushioning, and traditional craftsmanship.", displayOrder: 3, visible: true },
  // BEDS
  { slug: "single-bed", categoryId: "beds", name: "Single Bed", coverImage: "/assets/images/door_single.png", description: "Space-saving single bed frames for kids and guest rooms with under-bed storage options.", displayOrder: 0, visible: true },
  { slug: "double-bed", categoryId: "beds", name: "Double Bed", coverImage: "/assets/images/door_single.png", description: "Double bed frames with elegant headboard designs for smaller master bedrooms.", displayOrder: 1, visible: true },
  { slug: "king-bed", categoryId: "beds", name: "King Size Bed", coverImage: "/assets/images/door_single.png", description: "King size platform beds with built-in storage options and hand-finished details.", displayOrder: 2, visible: true },
  { slug: "storage-bed", categoryId: "beds", name: "Storage Bed", coverImage: "/assets/images/door_single.png", description: "Beds with integrated drawer storage and hydraulic lift mechanisms.", displayOrder: 3, visible: true },
  // CUPBOARDS
  { slug: "wardrobe", categoryId: "cupboards", name: "Wardrobe", coverImage: "/assets/images/door_single.png", description: "Custom built-in and freestanding wardrobes with adjustable shelving.", displayOrder: 0, visible: true },
  { slug: "sliding-wardrobe", categoryId: "cupboards", name: "Sliding Wardrobe", coverImage: "/assets/images/door_single.png", description: "Modern sliding door wardrobes with mirrored panels for contemporary bedrooms.", displayOrder: 1, visible: true },
  { slug: "modular-cupboard", categoryId: "cupboards", name: "Modular Cupboard", coverImage: "/assets/images/door_single.png", description: "Flexible modular cupboard systems with customizable configurations.", displayOrder: 2, visible: true },
  { slug: "display-cabinet", categoryId: "cupboards", name: "Display Cabinet", coverImage: "/assets/images/door_single.png", description: "Elegant display cabinets with glass doors and interior lighting.", displayOrder: 3, visible: true }
];

export async function getFirestoreSubcategories() {
  try {
    const colRef = collection(db, "subcategories");
    const q = query(colRef, orderBy("displayOrder", "asc"));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      for (const sub of defaultFirestoreSubcategories) {
        await setDoc(doc(db, "subcategories", sub.slug), {
          ...sub,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      return defaultFirestoreSubcategories.map(s => ({ id: s.slug, ...s }));
    }
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() || data.updatedAt,
        createdAt: data.createdAt?.toDate?.()?.toISOString?.() || data.createdAt
      };
    });
  } catch (error) {
    console.error("Firestore subcategories read error:", error);
    throw error;
  }
}

export async function addFirestoreSubcategory(sub) {
  try {
    await setDoc(doc(db, "subcategories", sub.slug), {
      ...sub,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("Firestore subcategories write error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateFirestoreSubcategory(slug, data) {
  try {
    await setDoc(doc(db, "subcategories", slug), {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("Firestore subcategories update error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteFirestoreSubcategory(slug) {
  try {
    await deleteDoc(doc(db, "subcategories", slug));
    return { success: true };
  } catch (error) {
    console.error("Firestore subcategories delete error:", error);
    return { success: false, error: error.message };
  }
}

// ── GALLERIES FIRESTORE CRUD ──

export async function getFirestoreGalleries() {
  try {
    const colRef = collection(db, "galleries");
    const snapshot = await getDocs(colRef);
    const galleries = {};
    snapshot.docs.forEach(docSnap => {
      const data = docSnap.data();
      galleries[docSnap.id] = {
        ...data,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() || data.updatedAt,
      };
    });
    return galleries;
  } catch (error) {
    console.error("Firestore galleries read error:", error);
    throw error;
  }
}

export async function setFirestoreGallery(slug, data) {
  try {
    await setDoc(doc(db, "galleries", slug), {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("Firestore gallery write error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteFirestoreGallery(slug) {
  try {
    await deleteDoc(doc(db, "galleries", slug));
    return { success: true };
  } catch (error) {
    console.error("Firestore gallery delete error:", error);
    return { success: false, error: error.message };
  }
}
