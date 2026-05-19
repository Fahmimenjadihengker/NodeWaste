# NodeWaste Frontend

Frontend NodeWaste berbasis React, Vite, Tailwind CSS, React Router, dan PWA melalui `vite-plugin-pwa`.

## Scripts

- `npm run dev` menjalankan development server.
- `npm run build` membuat production build.
- `npm run lint` menjalankan ESLint.
- `npm run preview` menjalankan preview build.

## Scope Saat Ini

Saat ini aplikasi berisi:

- Public routes: `/`, `/login`, dan `/register`.
- User routes: `/dashboard`, `/scan`, `/pet`, `/schedule`, `/profile`, dan `/profile/edit`.
- Driver routes: `/driver/map`, `/driver/profile`, dan `/driver/profile/edit`.
- Admin routes: `/admin/dashboard`, `/admin/users`, `/admin/users/new`, `/admin/users/:id/edit`, `/admin/points`, `/admin/schedules`, `/admin/schedules/new`, dan `/admin/schedules/:id/edit`.
- Role redirect setelah login: `USER` ke `/dashboard`, `DRIVER` ke `/driver/map`, dan `ADMIN` ke `/admin/dashboard`.
- PWA installable dengan app shell caching dan auto update service worker.

## Struktur Penting

- `src/App.jsx` definisi route utama dan role guard.
- `src/main.jsx` entrypoint React.
- `src/services/apiClient.js` API base URL, auth token, request helper, dan cache localStorage.
- `src/services/authApi.js` API user app dan session helper.
- `src/services/adminApi.js` API admin app.
- `src/services/driverApi.js` API driver app.
- `src/services/regionApi.js` API wilayah.id untuk alamat/district.
- `src/components/AppShell.jsx` shell area user.
- `src/components/driver/DriverShell.jsx` shell area driver.
- `src/components/admin/AdminShell.jsx` shell area admin.

## API Base URL

`src/services/apiClient.js` menentukan base URL dengan urutan berikut:

1. `VITE_API_BASE_URL` jika tersedia.
2. `https://nodewaste-backend.vercel.app/api` jika hostname frontend adalah `nodewaste.vercel.app`.
3. `http://localhost:5000/api` untuk development lokal.

Contoh `.env` frontend:

```env
VITE_API_BASE_URL="http://localhost:5000/api"
```

## Catatan Implementasi

- Auth token disimpan di `localStorage` sebagai `nodewaste_token`.
- Data user tersimpan sebagai `nodewaste_user`.
- Beberapa request memakai cache localStorage dengan prefix `nodewaste_api_cache:` dan dibersihkan setelah mutasi terkait.
- Dashboard, pet, activities, schedules, profile, admin, dan driver mengambil data dari backend API.
- `src/services/dashboardData.js` masih tersedia sebagai data lokal/fallback visual, bukan sumber utama dashboard saat runtime.
- Styling utama memakai Tailwind CSS dan komponen internal, tanpa UI library eksternal.

## PWA

Konfigurasi PWA ada di `vite.config.js`. Manifest memakai nama `NodeWaste`, start URL `/dashboard`, display `standalone`, dan runtime cache untuk dokumen, script, style, image, dan font.
