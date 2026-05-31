# NodeWaste Backend

Backend NodeWaste berbasis Express, PostgreSQL, dan Prisma. API memakai JWT auth, role `USER`, `DRIVER`, dan `ADMIN`, serta menyimpan data aplikasi lewat Prisma Client.

Scope implementasi saat ini mencakup auth role-aware, profile user dengan alamat wilayah.id, upload foto profile, dashboard user, pet Leafy, activity, scan gambar dengan AI classifier eksternal, jadwal pengangkutan global, recycling facilities, endpoint wilayah, endpoint driver, endpoint admin, dan dokumentasi Swagger.

## Environment

Backend membaca environment variable berikut:

- `DATABASE_URL` wajib untuk koneksi PostgreSQL.
- `PORT` default `5000`.
- `CORS_ORIGIN` opsional, bisa berisi beberapa origin dipisah koma. Selain default lokal, backend juga mengizinkan hostname `*.vercel.app` lewat HTTPS.
- `JWT_SECRET`, `JWT_EXPIRES_IN`, dan `BCRYPT_SALT_ROUNDS` mengatur autentikasi dan hashing password.
- `AI_CLASSIFIER_BASE_URL` default `https://nodewaste-ai-api-production.up.railway.app`.
- `AI_CLASSIFIER_TIMEOUT_MS` default `15000`.

Contoh lengkap tersedia di `.env.example`.

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
- `POST /api/pet/:action` dengan action `feed` atau `play`
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
- `GET /api/admin/accounts?role=USER|DRIVER|ADMIN`
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
- Authenticated all roles: `GET /api/auth/me` dan endpoint `regions`.
- `USER`: profile user, dashboard, pet, activities, schedules, dan scans.
- `DRIVER`: dashboard driver, profile driver, upload foto profile driver, dan map driver.
- `ADMIN`: dashboard admin, accounts, users, drivers, dan schedules.

## Catatan Data

Data disimpan di PostgreSQL melalui Prisma. Pastikan `DATABASE_URL` di `.env` mengarah ke database PostgreSQL, lalu jalankan `npm run prisma:generate` dan `npm run prisma:migrate` sebelum menjalankan server pertama kali.

Endpoint scan meneruskan upload gambar ke AI classifier eksternal melalui `POST /predict`. Default service AI adalah `https://nodewaste-ai-api-production.up.railway.app` dan dapat dioverride lewat `AI_CLASSIFIER_BASE_URL`. Timeout request AI default 15 detik dan dapat diatur lewat `AI_CLASSIFIER_TIMEOUT_MS`.

Kategori jadwal (`waste_schedules.waste_category`), kategori scan (`scans.category`), dan klasifikasi scan (`scans.classification`) disimpan sebagai teks biasa (`String`). Kategori scan berasal dari `recommendation["Kategori sampah"]`, sedangkan klasifikasi scan berasal dari `recommendation["Klasifikasi jenis sampah"]` milik AI (`Berbahaya`, `Daur Ulang`, `Dibakar`, atau `Tidak dibakar`). Jadwal sekarang berdiri sendiri dan tidak berelasi ke `districts`. Untuk database lama yang masih punya enum/kolom district pada jadwal, jalankan SQL manual `backend/prisma/schedule-standalone.sql` satu kali. Untuk migrasi scan baru yang menghapus data scan lama dan memastikan kolom `category`/`classification` sesuai kontrak baru, jalankan `backend/prisma/scan-classification.sql` satu kali. Jika database sudah telanjur menjalankan versi awal migrasi scan yang belum mengembalikan `category`, jalankan patch non-destruktif `backend/prisma/scan-category.sql`.

Untuk deploy Vercel dengan Supabase, gunakan Supabase pooler connection string di environment variable `DATABASE_URL`, bukan direct host `db.<project-ref>.supabase.co:5432`. Direct host Supabase dapat gagal dari Vercel karena koneksi IPv6/pooling serverless. Format umumnya:

```env
DATABASE_URL="postgresql://postgres.<project-ref>:<password>@<region>.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require"
```

Deploy backend di Vercel memakai `backend/vercel.json`. Function `api/index.js` diset `maxDuration` 30 detik agar request scan punya waktu lebih panjang dari timeout AI classifier default 15 detik dan tidak diputus Vercel lebih dulu.

Saat user register, backend membuat row `users` dengan 100 EcoPoints awal dan pet default di `pets` lewat nested write Prisma yang atomic. Pet baru dimulai dengan happiness 100% dan hunger 0% sehingga indikator kenyang tampil 100%. User dapat mengisi alamat rumah lewat `PUT /api/profile`; alamat ini memakai kode wilayah dari wilayah.id, masuk ke `user_addresses`, dan menjadi titik rumah pada map driver jika district-nya sesuai. Saat driver dibuat, backend membuat row `users` role `DRIVER` dan `DriverProfile` tanpa membuat pet. Model `DriverProfile` masih memetakan tabel lama `collector_profiles` untuk migrasi aman.

Status Leafy mengalami decay harian saat data pet dibuka: happiness berkurang 3 poin per hari dan hunger naik 5 poin per hari. Frontend menampilkan hunger sebagai indikator kenyang (`100 - hunger`).

Jadwal user dan admin memakai tabel `waste_schedules` standalone. Jika belum ada data jadwal di database, endpoint user mengembalikan fallback default untuk kategori `Organik`, `Anorganik`, `B3`, dan `Daur Ulang/Residu`.

Seed driver/admin tidak berjalan otomatis. Jalankan `npm run seed:driver` atau `npm run seed:admin` hanya saat membutuhkan data demo. Akun demo driver adalah `driver.demo@nodewaste.test`; akun demo admin adalah `admin.demo@nodewaste.test`. Keduanya memakai password `password123`.

Endpoint scan menerima upload gambar JPEG/PNG maksimal 5 MB. Backend mengirim file tersebut ke AI classifier sebagai `multipart/form-data` field `file`, lalu menyimpan `classification.predicted_class`, confidence, `recommendation["Kategori sampah"]`, dan `recommendation["Klasifikasi jenis sampah"]` sebelum menyimpan reward EcoPoints/XP.

Upload foto profile user dan driver menerima field `photo` maksimal 2 MB dan saat ini disimpan sebagai data URL base64 di kolom `users.profile_photo_url`.

Supabase RLS diaktifkan memakai `backend/prisma/rls.sql` dengan policy deny-by-default untuk direct client access. Backend tetap mengakses data lewat Prisma server-side.
