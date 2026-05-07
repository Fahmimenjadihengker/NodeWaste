# NodeWaste Backend

Backend NodeWaste berbasis Express. Scope saat ini hanya auth register dan login.

## Scripts

- `npm run dev` menjalankan server dengan watch mode.
- `npm start` menjalankan server.
- `npm run check` mengecek syntax entrypoint.

## Endpoint

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`

## Catatan Data

Untuk tahap awal, user disimpan di `data/users.json` saat server berjalan. File tersebut di-ignore dan hanya untuk development sampai database Prisma/PostgreSQL dibuat.
