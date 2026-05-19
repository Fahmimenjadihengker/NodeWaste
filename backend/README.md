# NodeWaste Backend

Backend NodeWaste berbasis Express, PostgreSQL, dan Prisma. API memakai JWT auth, role `USER`, `DRIVER`, dan `ADMIN`, serta menyimpan data aplikasi lewat Prisma Client.

Scope implementasi saat ini mencakup auth role-aware, profile user dengan alamat wilayah.id, upload foto profile, dashboard user, pet Leafy, activity, scan gambar sementara/mock classifier, jadwal pengangkutan, recycling facilities, endpoint wilayah, endpoint driver, endpoint admin, dan dokumentasi Swagger.

## Scripts

- `npm run dev` menjalankan server dengan watch mode.
- `npm start` menjalankan server.
- `npm run check` mengecek syntax entrypoint.
- `npm run smoke:test` membuat user sementara, mengetes auth/dashboard/pet/activity ke database, lalu menghapus user test.
- `npm run seed:driver` menjalankan seed manual idempotent untuk district, akun driver demo, rumah user demo, jadwal, dan tempat pengolahan.
- `npm run seed:admin` membuat akun admin demo manual idempotent.
- `npm run prisma:generate` generate Prisma Client.
- `npm run prisma:migrate` menjalankan migration development.
- `npm run prisma:studio` membuka Prisma Studio.

## Struktur Penting

- `src/server.js` entrypoint server dan koneksi database.
- `src/app.js` konfigurasi Express, CORS, health check, route mounting, Swagger, dan error middleware.
- `src/routes/` mendefinisikan route per domain.
- `src/controllers/` menangani request/response.
- `src/services/` berisi business logic dan akses Prisma.
- `src/validators/` validasi payload request.
- `src/middlewares/auth.middleware.js` JWT auth dan guard role.
- `src/config/prisma.js` Prisma Client singleton.
- `src/config/swagger.js` dokumen Swagger.
- `prisma/schema.prisma` model database utama.
- `prisma/rls.sql` policy Supabase RLS deny-by-default untuk direct client access.

## Endpoint

- `GET /api/health`
- `GET /api/health/db`
- `POST /api/auth/register`
- `POST /api/auth/register/driver`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/profile`
- `PUT /api/profile`
- `PUT /api/profile/photo`
- `PUT /api/profile/password`
- `GET /api/regions/provinces`
- `GET /api/regions/regencies/:provinceCode`
- `GET /api/regions/districts/:regencyCode`
- `GET /api/dashboard`
- `GET /api/pet`
- `POST /api/pet/feed`
- `POST /api/pet/play`
- `POST /api/pet/bath`
- `GET /api/activities`
- `GET /api/schedules`
- `POST /api/scans`
- `GET /api/driver/dashboard`
- `GET /api/driver/profile`
- `PUT /api/driver/profile`
- `PUT /api/driver/profile/photo`
- `GET /api/driver/map`
- `GET /api/admin/dashboard`
- `GET /api/admin/accounts`
- `POST /api/admin/accounts`
- `PUT /api/admin/accounts/:id`
- `DELETE /api/admin/accounts/:id`
- `POST /api/admin/accounts/:id/points/add`
- `POST /api/admin/accounts/:id/points/subtract`
- `GET /api/admin/users`
- `GET /api/admin/drivers`
- `POST /api/admin/drivers`
- `PUT /api/admin/drivers/:id`
- `GET /api/admin/schedules`
- `POST /api/admin/schedules`
- `PUT /api/admin/schedules/:id`
- `DELETE /api/admin/schedules/:id`
- `GET /api/recycling-facilities`
- `GET /api-docs`

## Role dan Akses

- Public: `POST /api/auth/register`, `POST /api/auth/register/driver`, `POST /api/auth/login`, `GET /api/health`, `GET /api/health/db`, `GET /api/recycling-facilities`, dan `GET /api-docs`.
- Authenticated all roles: `GET /api/auth/me`.
- `USER`: profile user, dashboard, pet, activities, schedules, scans, dan regions.
- `DRIVER`: dashboard driver, profile driver, upload foto profile driver, dan map driver.
- `ADMIN`: dashboard admin, accounts, users, drivers, dan schedules.

## Catatan Data

Data disimpan di PostgreSQL melalui Prisma. Pastikan `DATABASE_URL` di `.env` mengarah ke database PostgreSQL, lalu jalankan `npm run prisma:generate` dan `npm run prisma:migrate` sebelum menjalankan server pertama kali.

Untuk deploy Vercel dengan Supabase, gunakan Supabase pooler connection string di environment variable `DATABASE_URL`, bukan direct host `db.<project-ref>.supabase.co:5432`. Direct host Supabase dapat gagal dari Vercel karena koneksi IPv6/pooling serverless. Format umumnya:

```env
DATABASE_URL="postgresql://postgres.<project-ref>:<password>@<region>.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require"
```

Saat user register, backend membuat row `users` dan pet default di `pets` lewat nested write Prisma yang atomic. User dapat mengisi alamat rumah lewat `PUT /api/profile`; alamat ini memakai kode wilayah dari wilayah.id, masuk ke `user_addresses`, dan menjadi titik rumah pada map driver jika district-nya sesuai. Saat driver dibuat, backend membuat row `users` role `DRIVER` dan `DriverProfile` tanpa membuat pet. Model `DriverProfile` masih memetakan tabel lama `collector_profiles` untuk migrasi aman.

Seed driver/admin tidak berjalan otomatis. Jalankan `npm run seed:driver` atau `npm run seed:admin` hanya saat membutuhkan data demo. Akun demo driver adalah `driver.demo@nodewaste.test`; akun demo admin adalah `admin.demo@nodewaste.test`. Keduanya memakai password `password123`.

Endpoint scan menerima upload gambar JPEG/PNG maksimal 5 MB dan saat ini masih memakai mock classifier di backend. Integrasi classifier final tetap menunggu kontrak Path AI.

Supabase RLS diaktifkan memakai `backend/prisma/rls.sql` dengan policy deny-by-default untuk direct client access. Backend tetap mengakses data lewat Prisma server-side.
