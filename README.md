# THE ELEGANT — Frontend

React storefront for THE ELEGANT premium Indian sportswear & lifestyle brand.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build Tool | Vite (rolldown-vite) |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion |
| 3D | React Three Fiber + Drei |
| Routing | React Router DOM v6 |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Email | EmailJS |

---

## Project Structure

```
frontend/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── src/
│   ├── main.jsx               # App entry point
│   ├── App.jsx                # Root router
│   ├── index.css              # Global styles + Tailwind directives
│   ├── context/
│   │   └── CartContext.jsx    # Global cart state
│   ├── utils/
│   │   └── api.js             # Axios instance — auth headers, 401 auto-logout
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── CollectionPage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── AuthPage.jsx
│   │   ├── CustomerDashboard.jsx
│   │   ├── WishlistPage.jsx
│   │   ├── TrackOrderPage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── ContactPage.jsx
│   │   ├── FAQsPage.jsx
│   │   ├── SizeGuidePage.jsx
│   │   ├── ShippingPage.jsx
│   │   ├── ReturnsPage.jsx
│   │   ├── PrivacyPage.jsx
│   │   ├── TermsPage.jsx
│   │   ├── ComingSoonPage.jsx
│   │   └── ResetPasswordPage.jsx
│   ├── components/
│   │   ├── home/              # Hero, featured sections, banners
│   │   ├── product/           # Product cards, image gallery, filters
│   │   ├── cart/              # Cart drawer, line items
│   │   └── layout/            # Navbar, footer, page wrappers
│   └── admin/
│       ├── components/
│       │   └── AdminLayout.jsx
│       └── pages/
│           ├── AdminLogin.jsx
│           ├── AdminDashboard.jsx
│           ├── AdminProducts.jsx
│           ├── AdminOrders.jsx
│           └── AdminUsers.jsx
└── public/                    # Static assets
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Backend server running (see `../backend/README.md`)

### Installation

```bash
cd frontend
npm install
```

### Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api

# EmailJS (used on Contact page)
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Razorpay
VITE_RAZORPAY_KEY_ID=your_key_id
```

### Running the Dev Server

```bash
npm run dev
```

Opens at `http://localhost:5173`.

### Build for Production

```bash
npm run build     # Outputs to dist/
npm run preview   # Preview the production build locally
```

---

## Design System

The project uses a **black & white luxury athletic** aesthetic. Custom Tailwind utility classes are defined in `index.css`:

| Class | Usage |
|---|---|
| `.btn` | Base button styles |
| `.btn-primary` | Filled black button |
| `.btn-secondary` | Outlined button |
| `.container-custom` | Centered content wrapper with consistent padding |
| `.product-grid` | Responsive product card grid |
| `.input` | Styled form input |
| `.badge-new` / `.badge-sale` | Product label badges |

**Fonts:**
- `Outfit` — display headings
- `Inter` — body text

---

## Key Patterns

### API Calls

All API calls go through `src/utils/api.js`, which is a pre-configured Axios instance. It:
- Automatically attaches the JWT from `localStorage` to every request
- Redirects to `/auth` on 401 responses

```js
import api from '../utils/api';

const { data } = await api.get('/products');
await api.post('/orders', orderPayload);
```

### Cart State

Global cart state lives in `CartContext`. Wrap consuming components with `useCart()`:

```js
import { useCart } from '../context/CartContext';

const { cart, addToCart, removeFromCart, clearCart } = useCart();
```

### Admin Panel

The admin panel is accessible at `/admin`. It requires an account with `role: "admin"` in the database. All admin pages share `AdminLayout` which provides the sidebar and top navigation.

---

## Pages Overview

| Route | Page | Auth |
|---|---|---|
| `/` | HomePage | Public |
| `/collections` | CollectionPage | Public |
| `/product/:id` | ProductDetailPage | Public |
| `/checkout` | CheckoutPage | Required |
| `/auth` | AuthPage (Login/Register) | Public |
| `/dashboard` | CustomerDashboard | Required |
| `/wishlist` | WishlistPage | Required |
| `/track-order` | TrackOrderPage | Required |
| `/about` | AboutPage | Public |
| `/contact` | ContactPage | Public |
| `/admin` | Admin Panel | Admin |

---

## Linting

```bash
npm run lint
```

ESLint is configured with `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`.
