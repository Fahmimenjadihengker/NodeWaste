# NodeWaste Backend

Backend NodeWaste berbasis Express, PostgreSQL, dan Prisma. Scope implementasi saat ini mencakup auth register/login role-aware, profile user aktif, dashboard, pet, activity, scan mock sementara, jadwal dummy/database-ready, recycling facilities, endpoint collector dasar, serta schema awal untuk scan.

## Scripts

- `npm run dev` menjalankan server dengan watch mode.
- `npm start` menjalankan server.
- `npm run check` mengecek syntax entrypoint.
- `npm run smoke:test` membuat user sementara, mengetes auth/dashboard/pet/activity ke database, lalu menghapus user test.
- `npm run prisma:generate` generate Prisma Client.
- `npm run prisma:migrate` menjalankan migration development.
- `npm run prisma:studio` membuka Prisma Studio.

## Endpoint

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/register/collector`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/profile`
- `PUT /api/profile`
- `PUT /api/profile/password`
- `GET /api/dashboard`
- `GET /api/pet`
- `POST /api/pet/feed`
- `POST /api/pet/play`
- `POST /api/pet/bath`
- `GET /api/activities`
- `GET /api/schedules`
- `POST /api/scans`
- `GET /api/collector/dashboard`
- `GET /api/collector/profile`
- `PUT /api/collector/profile`
- `GET /api/collector/houses`
- `GET /api/collector/processing-sites`
- `GET /api/collector/routes`
- `GET /api/recycling-facilities`
- `GET /api-docs`

## Catatan Data

Data disimpan di PostgreSQL melalui Prisma. Pastikan `DATABASE_URL` di `.env` mengarah ke database PostgreSQL, lalu jalankan `npm run prisma:migrate` sebelum menjalankan server pertama kali.

Untuk deploy Vercel dengan Supabase, gunakan Supabase pooler connection string di environment variable `DATABASE_URL`, bukan direct host `db.<project-ref>.supabase.co:5432`. Direct host Supabase dapat gagal dari Vercel karena koneksi IPv6/pooling serverless. Format umumnya:

```env
DATABASE_URL="postgresql://postgres.<project-ref>:<password>@<region>.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require"
```

Saat user register, backend membuat row `users` dan pet default di `pets` lewat nested write Prisma yang atomic. Saat collector register, backend membuat row `users` role `COLLECTOR` dan `collector_profiles` tanpa membuat pet.

Endpoint scan saat ini masih memakai mock backend sementara. Integrasi classifier final tetap menunggu kontrak Path AI.

Supabase RLS diaktifkan memakai `backend/prisma/rls.sql` dengan policy deny-by-default untuk direct client access. Backend tetap mengakses data lewat Prisma server-side.
