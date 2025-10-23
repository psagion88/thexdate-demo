# The X Date — Product Overview

**Purpose:** Help people discover and buy **discounted, soon-to-expire food** nearby, while helping vendors reduce waste and capture incremental sales.

**Demo:** https://xdate-demo.vercel.app

---

## What the demo shows

- **iPhone-style web app** (single-page, responsive, scrollable)
- **Map & List discovery** of nearby discounted items
- **Real geolocation** (“Use my location”) and reverse-geocode in Vendor setup
- **Vendor posting flow:** store profile, address, phone, “use my location,” post items (description, image upload, price, quantity, expiry date)
- **Ratings:** simple vendor star rating visible on map popups & list
- **Checkout (mock):** saved cards, preferred payment, purchase success flow
- **Refunds (mock):** view and mark orders as refunded
- **Notifications (mock):** opt in/out for nearby deals, transactions, and vendor purchase alerts (browser notifications)
- **Analytics:** Vercel Web Analytics (pageviews + custom purchase event)
- **PWA-friendly** structure (can be added to Home Screen, though we’re keeping browser frame for this demo)

---

## Roles & primary flows

### User (Buyer)
1. **Signup (mock)** via Google / Apple / Email (or Skip)
2. Pick **role** (User or Vendor)
3. Discover **Map/List** → search, filter by **Type** (Bakery, Produce, Deli, Salad, Italian, Bowl, Sushi)
4. View item details (price, vendor, expiry date, rating)
5. **Buy** (mock payment) → see success → refund available in Profile

### Vendor
1. Switch to **Vendor** role
2. **Store Profile:** set name, address (or “Use my location”), phone
3. **Post items:** description, image upload, title, qty, price, original price (optional), **expiry date** (no time)
4. Manage posted items (remove) — items appear on Discover immediately

---

## Screens & routes

- `/#/signup` — Signup options (mock), Skip
- `/#/role` — Choose User or Vendor
- `/#/discover` — Map/List, search, filter, ratings
- `/#/checkout` — Payment select + “Pay now” (mock)
- `/#/payments` — Add cards, set preferred
- `/#/refunds` — See orders, mark refunded (mock)
- `/#/profile` — Profile & preferences, (optional) reset demo
- `/#/notifications` — Nearby deals, transaction, vendor alerts (mock)
- `/#/vendor` — Store profile, post item, my items
- `/#/vendor-payout` — Link bank (mock)

---

## Data model (demo)

- **LocalStorage** only (no backend)  
  - `thexdate.profile` — displayName/email/phone  
  - `thexdate.role` — "user" | "vendor"  
  - `thexdate.notifications` — toggles + radius + permission state  
  - `thexdate.vendor.store` — store name, address, lat/lon, phone  
  - `thexdate.vendor.items` — posted items (id, title, price, qty, expiry, image, lat/lng)  
  - `thexdate.payments` — saved payment methods  
  - `thexdate.preferredPayment` — card id  
  - `thexdate.orders` — mock purchases
- **SessionStorage**  
  - `thexdate.checkoutItem` — selected item for checkout

---

## Tech stack

- **Vite + React 18** with **React Router (HashRouter)**
- **Leaflet** + **OpenStreetMap** tiles for maps
- **Vercel Web Analytics** (`/_vercel/insights/script.js`)
- **Inline SVG placeholders** per food type → fast, stable thumbnails (no broken hotlinks)
- **Static hosting ready:** Vercel (base `/`) + GitHub Pages (base `/thexdate-demo/` via script)

---

## Analytics events

- **Pageview** on every route change
- **Custom event — `purchase`** with `{ title, vendor, amount, method }`

View in Vercel → Project → **Analytics**.

---

## Current limitations (intentional for demo)

- Auth providers are **mocked** (no Google/Apple OAuth)
- Payments & payouts are **mocked** (no Stripe/Connect/Plaid)
- Notifications simulate **browser** notifications only (no FCM/APNs)
- No backend; persistence is local to the browser

---

## Next steps (recommended)

- Real auth (Firebase/Auth0)
- Real payments (Stripe) + webhooks
- Vendor payouts (Stripe Connect + Plaid)
- Push notifications (FCM/APNs) via backend
- Search filters: diet, price range, distance
- Image storage (S3/Cloudinary) + thumbnails
- Order QR for pickup + Vendor order screen
