# NodeWaste

NodeWaste adalah web app edukasi dan gamifikasi pengelolaan sampah. Aplikasi ini membantu user belajar memilah sampah, melakukan scan sampah dengan AI classifier, mengumpulkan EcoPoints/XP, merawat pet Leafy, melihat jadwal pengangkutan, serta menyediakan area khusus driver dan admin.

Project memakai struktur monorepo sederhana:

```txt
NodeWaste/
|-- frontend/  # React 19 + Vite + Tailwind CSS + React Router + PWA
|-- backend/   # Express 5 API + PostgreSQL + Prisma
```

## Scope Saat Ini

- Public app: landing page, login, dan register.
- User app: dashboard, scan sampah, pet Leafy, jadwal standalone, profile, alamat berbasis wilayah.id, dan fasilitas daur ulang.
- Driver app: map rumah user berdasarkan district driver, processing site, profile driver, dan upload foto profile.
- Admin app: dashboard, manajemen semua akun role `USER`/`DRIVER`/`ADMIN`, EcoPoints user, dan jadwal pengangkutan standalone.
- Backend API: auth role-aware, profile, dashboard, pet, activity, schedules, scans, regions, recycling facilities, driver, dan admin.
- Database: PostgreSQL lewat Prisma. Supabase dapat dipakai untuk deployment.
- Scan gambar dikirim ke AI classifier eksternal melalui endpoint `/predict`; field `recommendation["Kategori sampah"]` disimpan sebagai kategori scan dan `recommendation["Klasifikasi jenis sampah"]` disimpan sebagai klasifikasi scan (`Berbahaya`, `Daur Ulang`, `Dibakar`, atau `Tidak dibakar`).
- Klasifikasi scan dan kategori jadwal disimpan sebagai teks biasa agar fleksibel untuk admin dan hasil classifier.
- PWA: frontend installable dengan app shell caching melalui `vite-plugin-pwa`.
- Security: backend memakai Helmet security headers, CORS allowlist terbatas, rate limit, body size limit, validasi JWT secret production, dan validasi magic bytes untuk upload gambar.

## Menjalankan Project

Jalankan backend dan frontend di terminal terpisah.

Backend:

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Default URL lokal:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- API base: `http://localhost:5000/api`
- API docs: `http://localhost:5000/api-docs`

## Environment

Backend membutuhkan `.env` dengan `DATABASE_URL` PostgreSQL. Lihat juga `backend/.env.example` untuk contoh lengkap. Frontend dapat memakai `VITE_API_BASE_URL` jika ingin override API base URL.

Contoh backend:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
PORT=5000
CORS_ORIGIN="http://localhost:5173"
JWT_SECRET="change_this_secret"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="https://nodewaste.vercel.app"
API_DOCS_ENABLED="false"
AI_CLASSIFIER_BASE_URL="https://nodewaste-ai-api-production.up.railway.app"
AI_CLASSIFIER_TIMEOUT_MS=15000
```

Contoh frontend:

```env
VITE_API_BASE_URL="http://localhost:5000/api"
```

## Script Penting

Backend:

- `npm run dev` menjalankan server dengan watch mode.
- `npm start` menjalankan server tanpa watch mode.
- `npm run check` mengecek syntax entrypoint.
- `npm run smoke:test` mengetes flow utama auth/dashboard/pet/activity ke database.
- `npm run seed:driver` membuat data demo driver, district, rumah user, jadwal, dan tempat pengolahan.
- `npm run seed:admin` membuat akun admin demo.
- `npm run prisma:generate` generate Prisma Client.
- `npm run prisma:migrate` menjalankan migration development.
- `npm run prisma:studio` membuka Prisma Studio.

Frontend:

- `npm run dev` menjalankan Vite dev server.
- `npm run build` membuat production build.
- `npm run lint` menjalankan ESLint.
- `npm run preview` menjalankan preview build.

## Dokumentasi Detail

- Backend: `backend/README.md`
- Frontend: `frontend/README.md`
- Dokumentasi aktif: `docs/README.md`

## Security Notes

- `JWT_SECRET` production wajib random, kuat, dan minimal 32 karakter.
- CORS production mengizinkan `https://nodewaste.vercel.app`, origin dari `CORS_ORIGIN`, dan preview Vercel project dengan hostname `nodewaste-*.vercel.app`.
- Swagger `/api-docs` mati otomatis saat `NODE_ENV=production` kecuali `API_DOCS_ENABLED=true`.
- Token frontend masih disimpan di `localStorage`; jangan render HTML mentah dari data user/server dan tetap jaga dependency dari XSS.
