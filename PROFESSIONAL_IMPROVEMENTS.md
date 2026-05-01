# Professional Improvements Guide

## 🔒 SECURITY TIPS

### 1. **Environment Variables & API Configuration**
**Current Issue**: Hardcoded `http://localhost:8081/api` in api.js

```javascript
// ❌ BAD - api.js (current)
const api = axios.create({
  baseURL: "http://localhost:8081/api",
  withCredentials: true
});

// ✅ GOOD - api.js (improved)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api",
  withCredentials: true,
  timeout: 10000, // Prevent hanging requests
});

// Add error interceptor for security
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**Create `.env.local` file**:
```
VITE_API_BASE_URL=http://localhost:8081/api
VITE_API_TIMEOUT=10000
```

---

### 2. **Authentication with HttpOnly Cookies (No Token Storage)**
**Current Approach**: Server manages auth via httpOnly cookies (✅ MORE SECURE)

```javascript
// ✅ GOOD - authService.js (improved)
import api from "./api";

export const loginUser = async (credentials) => {
  const { email, password } = credentials;
  try {
    const { data } = await api.post("/auth/signin", { email, password });
    // Server sets httpOnly cookie automatically via response
    return data.user;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const registerUser = async (userData) => {
  const { email, password, name } = userData;
  try {
    const { data } = await api.post("/auth/register", { 
      email, 
      password, 
      name 
    });
    // Server sets httpOnly cookie automatically
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export const getCurrentUser = async () => {
  try {
    const { data } = await api.get("/auth/user");
    return data.user;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await api.post("/auth/logout");
    // Server clears httpOnly cookie
  } catch (error) {
    console.error("Logout error:", error);
  }
};
```

**API Configuration** - Keep `withCredentials: true` (sends httpOnly cookies):
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api",
  withCredentials: true, // ✅ Sends httpOnly cookies automatically
  timeout: 10000,
});
```

---

### 3. **CSRF Protection & Request Headers**
```javascript
// ✅ Add CSRF token to requests (if backend requires)
api.interceptors.request.use((config) => {
  // Get CSRF token from meta tag if available
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
  if (csrfToken) {
    config.headers["X-CSRF-Token"] = csrfToken;
  }
  return config;
});

// Handle 401 Unauthorized (session expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // User session expired, redirect to login
      // Server cleared httpOnly cookie automatically
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

### 4. **XSS Prevention**
```javascript
// ❌ AVOID: Direct innerHTML
element.innerHTML = userInput;

// ✅ USE: React's automatic escaping
<div>{userInput}</div>

// ✅ For user-generated content with HTML, sanitize:
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />
```

**Install**: `npm install dompurify`

---

### 5. **Input Validation & Sanitization**
```javascript
// ✅ GOOD - Validate inputs before sending
import { z } from 'zod'; // or joi

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password too short"),
});

export const loginUser = async (credentials) => {
  const validated = loginSchema.parse(credentials);
  const { data } = await api.post("/auth/signin", validated);
  return data;
};
```

**Install**: `npm install zod`

---

### 6. **Rate Limiting & Throttling**
```javascript
// ✅ Prevent spam with debouncing
import { debounce } from "lodash-es";

const handleSearch = debounce(async (query) => {
  const results = await api.get(`/search?q=${encodeURIComponent(query)}`);
  setResults(results.data);
}, 300);
```

---

## 🎯 DESTRUCTURING & CODE REFACTORING

### 1. **Component Props Destructuring**
```javascript
// ❌ BAD - EventForm.jsx (current)
function EventForm({
  values,
  setValues,
  file,
  setFile,
  roleMap,
  onSubmit,
}) {
  // lots of props

// ✅ GOOD - Better organization
function EventForm({
  // Form state
  values,
  setValues,
  
  // File handling
  file,
  setFile,
  
  // Data
  roleMap,
  
  // Callbacks
  onSubmit,
}) {
  // Much clearer structure
}

// ✅ BEST - Extract to custom hooks for complex forms
import useEventForm from "../../hooks/useEventForm";

function EventForm({ onSubmit }) {
  const { values, setValues, file, setFile, roleMap } = useEventForm();
  
  return (
    // Cleaner component
  );
}
```

---

### 2. **Service Function Destructuring**
```javascript
// ❌ BAD - api.js (current)
export const loginUser = (data) => {
  return api.post("/auth/signin", data);
};

// ✅ GOOD - api.js (improved)
export const loginUser = async (credentials) => {
  const { data, status } = await api.post("/auth/signin", credentials);
  return { user: data.user, token: data.token, status };
};

export const getEvents = async ({ 
  page = 1, 
  limit = 10, 
  status = null 
} = {}) => {
  const { data } = await api.get("/events", {
    params: { page, limit, ...(status && { status }) }
  });
  return data;
};
```

---

### 3. **Component Destructuring with Defaults**
```javascript
// ✅ GOOD - Navbar.jsx improvement
function Navbar({ user = null, onLogout = () => {} }) {
  const {
    name = "Guest",
    role = "User",
    avatar = null
  } = user || {};

  return (
    <nav>
      <p>{name}</p>
      <p>{role}</p>
      <button onClick={onLogout}>Logout</button>
    </nav>
  );
}
```

---

### 4. **State Grouping & Object Destructuring**
```javascript
// ❌ BAD - Too many useState calls
const [places, setPlaces] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [message, setMessage] = useState("");
const [showModal, setShowModal] = useState(false);

// ✅ GOOD - Group related state
const [formState, setFormState] = useState({
  places: [],
  loading: false,
  error: "",
  message: "",
  showModal: false
});

const { places, loading, error, message, showModal } = formState;

const updateFormState = (updates) => {
  setFormState(prev => ({ ...prev, ...updates }));
};

// Usage
updateFormState({ 
  loading: true,
  error: "" 
});
```

---

### 5. **Custom Hooks for Logic Extraction**
Create `src/hooks/useEventForm.js`:
```javascript
import { useState, useEffect, useRef } from "react";
import { getAllPlaces, getResponsiblePersons } from "../services/eventService";

export function useEventForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const { data } = await getAllPlaces();
      setPlaces(data || []);
    } catch (err) {
      console.error("Failed to fetch places:", err);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceChange = async (placeId) => {
    if (!placeId) {
      setValues(prev => ({ ...prev, eventPlace: null, approvers: [] }));
      return;
    }

    try {
      setLoading(true);
      const { data } = await getResponsiblePersons(placeId);
      setValues(prev => ({
        ...prev,
        eventPlace: placeId,
        approvers: data.approvers || []
      }));
    } catch (err) {
      console.error("Failed to fetch approvers:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    values,
    setValues,
    places,
    loading,
    fileInputRef,
    handlePlaceChange
  };
}
```

Then use in component:
```javascript
function EventForm({ onSubmit }) {
  const { values, setValues, places, loading, handlePlaceChange } = useEventForm();

  return (
    <form>
      <select 
        value={values.eventPlace || ""} 
        onChange={(e) => handlePlaceChange(e.target.value)}
      >
        {places.map(place => (
          <option key={place.id} value={place.id}>{place.name}</option>
        ))}
      </select>
    </form>
  );
}
```

---

## 📁 PROJECT STRUCTURE IMPROVEMENTS

### Current Issues:
- No context/state management (Context API or Redux)
- No custom hooks directory
- No constants file
- No utilities folder
- No error handling strategy

### ✅ Improved Structure:
```
src/
├── components/
│   ├── common/
│   ├── events/
│   ├── forms/
│   ├── ui/              # ← NEW: Reusable UI components
│   └── index.js         # ← NEW: Central exports
├── hooks/               # ← NEW: Custom React hooks
│   ├── useAuth.js
│   ├── useEventForm.js
│   ├── useFetch.js
│   └── index.js
├── context/             # ← NEW: React Context
│   ├── AuthContext.jsx
│   └── AppContext.jsx
├── constants/           # ← NEW: App constants
│   ├── api.constants.js
│   ├── routes.constants.js
│   └── validation.constants.js
├── utils/               # ← NEW: Utility functions
│   ├── validators.js
│   ├── formatters.js
│   ├── storage.js
│   └── logger.js
├── services/
├── routes/
├── pages/
└── layouts/
```

---

## 🔧 UTILITY FUNCTIONS TO CREATE

### 1. **Storage Utility** - `src/utils/storage.js`
```javascript
// ✅ NOTE: Tokens are managed by server via httpOnly cookies
// This utility handles user data and app preferences only

const STORAGE_KEYS = {
  USER: "user_data",
  PREFERENCES: "app_preferences",
  THEME: "theme_preference"
};

export const storage = {
  getUser: () => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },
  setUser: (user) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },
  
  getPreferences: () => {
    const prefs = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return prefs ? JSON.parse(prefs) : {};
  },
  setPreferences: (prefs) => {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  },
  
  // Clears non-sensitive data when user logs out
  // (Server clears httpOnly cookie automatically)
  clearUserData: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
  }
};
```

### 2. **Validators** - `src/utils/validators.js`
```javascript
export const validators = {
  email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  
  password: (password) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password)
    );
  },
  
  eventName: (name) => name.trim().length > 0 && name.length <= 100,
  
  eventDate: (date) => new Date(date) > new Date(),
  
  isValidForm: (values, schema) => {
    // Implement form validation
    return true;
  }
};
```

### 3. **Formatters** - `src/utils/formatters.js`
```javascript
export const formatters = {
  date: (date) => new Date(date).toLocaleDateString('en-US'),
  
  dateTime: (date) => new Date(date).toLocaleString('en-US'),
  
  capitalizeFirst: (str) => str.charAt(0).toUpperCase() + str.slice(1),
  
  formatRole: (role) => {
    const roleMap = { admin: "Administrator", user: "User", approver: "Approver" };
    return roleMap[role] || role;
  },
  
  truncate: (text, length) => text.length > length ? text.slice(0, length) + "..." : text
};
```

### 4. **Logger** - `src/utils/logger.js`
```javascript
const isDev = import.meta.env.DEV;

export const logger = {
  info: (message, data) => {
    if (isDev) console.log(`[INFO] ${message}`, data);
  },
  
  warn: (message, data) => {
    console.warn(`[WARN] ${message}`, data);
  },
  
  error: (message, error) => {
    console.error(`[ERROR] ${message}`, error);
    // Send to error tracking service in production
    if (!isDev) {
      // logErrorToService(message, error);
    }
  }
};
```

---

## 🔐 ERROR HANDLING STRATEGY

### 1. **Global Error Boundary** - `src/components/ErrorBoundary.jsx`
```javascript
import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
    // Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-red-800 font-bold">Something went wrong</h2>
          <p className="text-red-600">{this.state.error?.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 2. **HTTP Error Handler** (httpOnly Cookies approach)
```javascript
// In api.js
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const statusCode = error.response?.status;
    const message = error.response?.data?.message || "An error occurred";

    switch (statusCode) {
      case 400:
        console.error("Bad Request:", message);
        break;
      case 401:
        // Session expired, server cleared httpOnly cookie
        storage.clearUserData();
        window.location.href = '/login';
        break;
      case 403:
        console.error("Forbidden:", message);
        break;
      case 404:
        console.error("Not Found:", message);
        break;
      case 500:
        console.error("Server Error:", message);
        break;
      default:
        console.error("Error:", message);
    }

    return Promise.reject(error);
  }
);
```

---

## 🔑 CONTEXT API SETUP

### `src/context/AuthContext.jsx`
```javascript
import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, logoutUser as logoutAPI } from "../services/authService";
import { storage } from "../utils/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  // Initialize auth by checking current session via API
  const initializeAuth = async () => {
    try {
      // Server checks httpOnly cookie and returns user data
      const userData = await getCurrentUser();
      setUser(userData);
      storage.setUser(userData);
    } catch (err) {
      // No valid session
      setError(err.message);
      storage.clearUserData();
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutAPI(); // Server clears httpOnly cookie
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      storage.clearUserData();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
```

---

## 📦 ENVIRONMENT SETUP

Create `.env.local`:
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8081/api
VITE_API_TIMEOUT=10000

# App Configuration
VITE_APP_NAME=EventSync
VITE_APP_VERSION=1.0.0

# Feature Flags (httpOnly cookies managed by server)
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

**Security Note**: 
- ✅ Tokens stored in httpOnly cookies (server-side, more secure)
- ✅ Credentials sent automatically with `withCredentials: true`
- ✅ No localStorage token storage needed
- ✅ CSRF tokens in request headers if backend requires

Update `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable in production
  },
})
```

---

## ✅ CODE QUALITY IMPROVEMENTS

### 1. **ESLint Rules** - Update `.eslintrc.js`:
```javascript
export default [
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        React: 'readonly',
        JSX: 'readonly',
      },
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': 'warn',
      'prefer-const': 'warn',
      'no-var': 'error',
    },
  },
];
```

### 2. **Add Scripts** to `package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --fix"
  }
}
```

---

## 🎨 UI/UX BEST PRACTICES

### 1. **Loading States**
```javascript
// Create reusable Spinner component
function Spinner() {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
    </div>
  );
}
```

### 2. **Error Messages**
```javascript
// Reusable Alert component
function Alert({ type = 'info', message, onClose }) {
  const bgColor = {
    error: 'bg-red-50 text-red-800 border-red-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200'
  }[type];

  return (
    <div className={`p-4 border rounded-lg ${bgColor}`}>
      <p>{message}</p>
      {onClose && <button onClick={onClose}>Dismiss</button>}
    </div>
  );
}
```

### 3. **Form Validation UI**
```javascript
function FormField({ label, error, ...props }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input 
        {...props}
        className={`w-full px-4 py-2 border rounded ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
```

---

## 🚀 PERFORMANCE OPTIMIZATIONS

### 1. **Code Splitting**
```javascript
import { lazy, Suspense } from 'react';

const EventsPage = lazy(() => import('../pages/Events/EventsPage'));
const CalendarPage = lazy(() => import('../pages/Events/CalendarPage'));

function AppRouter() {
  return (
    <Routes>
      <Route path="/events" element={
        <Suspense fallback={<Spinner />}>
          <EventsPage />
        </Suspense>
      } />
    </Routes>
  );
}
```

### 2. **Memoization for Performance**
```javascript
import { memo, useCallback } from 'react';

const LetterCard = memo(function LetterCard({ letter, onDelete }) {
  const handleDelete = useCallback(() => {
    onDelete(letter.id);
  }, [letter.id, onDelete]);

  return (
    <div>
      <h3>{letter.title}</h3>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
});
```

### 3. **Image Optimization**
```javascript
// Use next-gen formats like WebP
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.jpg" alt="description" />
</picture>
```

---

## 📋 IMPLEMENTATION CHECKLIST

- [x] Set up environment variables (.env.local)
- [x] Update API configuration with timeout
- [x] Create custom hooks directory and useEventForm hook
- [x] Create utility files (storage, validators, formatters, logger)
- [x] Add AuthContext for state management (httpOnly cookie based)
- [x] Create ErrorBoundary component
- [ ] Add Zod/Joi for input validation
- [x] Update API interceptors for error handling & CSRF
- [x] Create reusable UI components (Alert, Spinner, FormField)
- [x] Implement code splitting with lazy loading
- [x] Update ESLint configuration
- [x] Add missing scripts to package.json
- [x] Create constants files
- [ ] Add error tracking service (optional - e.g., Sentry)
- [ ] Document API endpoints and authentication flow

---

## 📚 RECOMMENDED PACKAGES TO ADD

```bash
npm install --save-dev zod                    # Input validation
npm install dompurify                         # XSS prevention
npm install lodash-es                         # Utility functions
npm install react-helmet                      # SEO meta tags
npm install @sentry/react                     # Error tracking
npm install react-query                       # Data fetching & caching
```

---

**Priority Implementation Order**:
1. Environment variables & API timeout setup ⭐⭐⭐
2. Custom hooks extraction (useEventForm) ⭐⭐⭐
3. AuthContext for state management ⭐⭐⭐
4. Utility functions (storage, validators, formatters) ⭐⭐
5. Error boundary & HTTP error handling ⭐⭐
6. Code splitting & performance optimizations ⭐
