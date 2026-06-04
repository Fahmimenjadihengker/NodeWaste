# NodeWaste Frontend

Frontend NodeWaste berbasis React 19, Vite, Tailwind CSS, React Router 7, dan PWA melalui `vite-plugin-pwa`.

## Scripts

- `npm run dev` menjalankan development server.
- `npm run build` membuat production build.
- `npm run lint` menjalankan ESLint.
- `npm run preview` menjalankan preview build.

## Scope Saat Ini

Saat ini aplikasi berisi:

- Public routes: `/`, `/login`, dan `/register`.
- User routes: `/dashboard`, `/scan`, `/pet`, `/schedule`, `/profile`, dan `/profile/edit`.
- Driver routes: `/driver/map`, `/driver/profile`, dan `/driver/profile/edit`. Route `/driver/dashboard` saat ini redirect ke `/driver/map`.
- Admin routes: `/admin/dashboard`, `/admin/users`, `/admin/users/new`, `/admin/users/:id/edit`, `/admin/points`, `/admin/schedules`, `/admin/schedules/new`, dan `/admin/schedules/:id/edit`.
- Admin mengelola role `USER`, `DRIVER`, dan `ADMIN` dari route `/admin/users`; form driver muncul saat role dipilih `DRIVER`.
- Role redirect setelah login: `USER` ke `/dashboard`, `DRIVER` ke `/driver/map`, dan `ADMIN` ke `/admin/dashboard`.
- PWA installable dengan app shell caching dan auto update service worker.

## Struktur Penting

- `src/App.jsx` definisi route utama dan role guard.
- `src/main.jsx` entrypoint React.
- `src/services/apiClient.js` API base URL, auth token, request helper, dan cache localStorage.
- `src/services/authApi.js` API user app dan session helper.
- `src/services/scanApi.js` API upload scan gambar.
- `src/services/adminApi.js` API admin app.
- `src/services/driverApi.js` API driver app.
- `src/services/regionApi.js` API wilayah.id untuk alamat/district.
- `src/hooks/useCachedResource.js` hook cache-first untuk data page.
- `src/components/AppShell.jsx` shell area user.
- `src/components/driver/DriverShell.jsx` shell area driver.
- `src/components/admin/AdminShell.jsx` shell area admin.
- `src/utils/sweetAlert.js` modal konfirmasi/loading/sukses custom tanpa library eksternal.

## API Base URL

`src/services/apiClient.js` menentukan base URL dengan urutan berikut:

1. `VITE_API_BASE_URL` jika tersedia.
2. `https://nodewaste-backend.vercel.app/api` jika hostname frontend bukan `localhost` atau `127.0.0.1`.
3. `http://localhost:5000/api` untuk development lokal.

Contoh `.env` frontend:

```env
VITE_API_BASE_URL="http://localhost:5000/api"
```

## Catatan Implementasi

- Auth token disimpan di `localStorage` sebagai `nodewaste_token`.
- Data user tersimpan sebagai `nodewaste_user`.
- Request cache-first memakai in-memory cache, localStorage prefix `nodewaste_api_cache:`, TTL default 24 jam, request dedupe, dan background revalidate.
- Cache dibersihkan setelah mutasi terkait seperti update profile, pet action, scan, admin account, dan jadwal.
- Setelah login/register, frontend melakukan prefetch data sesuai role.
- Dashboard, pet, activities, schedules, profile, admin, driver, scan, regions, dan recycling facilities mengambil data dari backend API.
- `src/services/dashboardData.js` masih tersedia sebagai data lokal/fallback visual, bukan sumber utama dashboard saat runtime.
- Styling utama memakai Tailwind CSS dan komponen internal, tanpa UI library eksternal.
- Dashboard chart menampilkan `Daily` 7 hari terakhir, `Weekly` M1-M4 bulan berjalan, dan `Monthly` Jan-Des tahun berjalan.
- Profile history dipaginasi 10 aktivitas per halaman.
- Jadwal user diurutkan Senin sampai Minggu, termasuk data cache lama di frontend.
- Landing page menjelaskan alur scan, rekomendasi, progress, Leafy, jadwal, serta role driver/admin secara ringkas.
- Leafy bubble chat hanya dipakai di landing page. Dashboard dan halaman pet memakai model `LeafyAvatar` yang sama tanpa bubble chat otomatis.
- Token di `localStorage` sensitif terhadap XSS; jangan memakai `dangerouslySetInnerHTML` untuk data user/API dan jangan simpan secret di variable `VITE_`.

## PWA

Konfigurasi PWA ada di `vite.config.js`. Manifest memakai nama `NodeWaste`, start URL `/dashboard`, display `standalone`, dan runtime cache untuk dokumen, script, style, image, dan font.
