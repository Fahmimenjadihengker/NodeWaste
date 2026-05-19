# NodeWaste

NodeWaste adalah web app edukasi dan gamifikasi pengelolaan sampah. Aplikasi ini membantu user belajar memilah sampah, melakukan scan sampah, mengumpulkan EcoPoints/XP, merawat pet Leafy, melihat jadwal pengangkutan, serta menyediakan area khusus driver dan admin.

Project memakai struktur monorepo sederhana:

```txt
NodeWaste/
|-- frontend/  # React + Vite + Tailwind CSS + PWA
|-- backend/   # Express API + PostgreSQL + Prisma
```

## Scope Saat Ini

- Public app: landing page, login, dan register.
- User app: dashboard, scan sampah, pet Leafy, jadwal, profile, alamat berbasis wilayah.id, dan fasilitas daur ulang.
- Driver app: map rumah user berdasarkan district driver, profile driver, dan upload foto profile.
- Admin app: dashboard, manajemen akun/user/driver, dan jadwal pengangkutan.
- Backend API: auth role-aware, profile, dashboard, pet, activity, schedules, scans, regions, recycling facilities, driver, dan admin.
- Database: PostgreSQL lewat Prisma. Supabase dapat dipakai untuk deployment.
- PWA: frontend installable dengan app shell caching melalui `vite-plugin-pwa`.

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

Backend membutuhkan `.env` dengan `DATABASE_URL` PostgreSQL. Frontend dapat memakai `VITE_API_BASE_URL` jika ingin override API base URL.

Contoh backend:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
PORT=5000
CORS_ORIGIN="http://localhost:5173"
```

Contoh frontend:

```env
VITE_API_BASE_URL="http://localhost:5000/api"
```

## Script Penting

Backend:

- `npm run dev` menjalankan server dengan watch mode.
- `npm run check` mengecek syntax entrypoint.
- `npm run smoke:test` mengetes flow utama auth/dashboard/pet/activity ke database.
- `npm run seed:driver` membuat data demo driver, district, rumah user, jadwal, dan tempat pengolahan.
- `npm run seed:admin` membuat akun admin demo.
- `npm run prisma:migrate` menjalankan migration development.

Frontend:

- `npm run dev` menjalankan Vite dev server.
- `npm run build` membuat production build.
- `npm run lint` menjalankan ESLint.

## Dokumentasi Detail

- Backend: `backend/README.md`
- Frontend: `frontend/README.md`
