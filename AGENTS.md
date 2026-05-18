# NodeWaste Agent Instructions

File ini wajib dibaca oleh AI agent sebelum mengerjakan task di project NodeWaste.

## Aturan Utama

1. Baca dokumentasi sebelum mengubah kode: mulai dari `docs/README.md`, lalu dokumen yang relevan dengan task.
2. Gunakan kode yang sudah ada sebagai fondasi. Jangan rewrite project dari nol kecuali user meminta secara eksplisit.
3. Revisi saat ini fokus ke multi-role `USER` dan `COLLECTOR`.
4. Sistem scan/classifier tidak dikerjakan ulang. Scope scan saat ini hanya menjaga UI lama dan kontrak integrasi karena implementasi classifier ditangani pihak Path AI.
5. Jika task mengubah API, database, route, role, env, business rule, atau UX flow, update dokumentasi pada perubahan yang sama.
6. Jika dokumentasi dan kode tidak cocok, cek kode aktual terlebih dahulu, lalu update dokumen atau minta klarifikasi jika berdampak pada requirement.
7. Jangan commit secret, token, API key, password, database URL production, atau file `.env` asli.
8. Jangan menghapus fitur user lama seperti dashboard, pet, profile, dan scan placeholder tanpa instruksi eksplisit.

## Urutan Kerja Agent

1. Baca `docs/README.md` untuk peta dokumen.
2. Baca `docs/phases/README.md` dan fase yang sedang dikerjakan.
3. Baca dokumen domain terkait, misalnya `docs/api/rest-api.md`, `docs/backend/database.md`, atau `docs/frontend/routes.md`.
4. Cek kode aktual sebelum membuat perubahan.
5. Implementasikan perubahan terkecil yang benar.
6. Jalankan verifikasi yang relevan jika tersedia.
7. Update dokumentasi dan checklist fase.
8. Laporkan file yang berubah, verifikasi, dan sisa risiko.

## Dokumen Yang Harus Diupdate

| Jika mengubah | Update dokumen |
|---|---|
| Role atau akses fitur | `docs/roles-and-permissions.md` |
| Endpoint API | `docs/api/rest-api.md` |
| Auth atau route guard | `docs/api/auth-and-authorization.md`, `docs/frontend/routes.md` |
| Database atau Prisma schema | `docs/backend/database.md` |
| Halaman frontend | `docs/frontend/routes.md` dan dokumen fitur terkait |
| Fase pengerjaan | `docs/phases/status-board.md` dan file fase terkait |
| Env/deployment | `docs/standards/environment.md` atau `docs/standards/deployment.md` |

## Definition of Done Agent

Sebuah task belum selesai jika dokumentasi terkait masih tertinggal. Minimal, agent harus mencatat status fase, perubahan yang dibuat, test/verifikasi, dan follow-up yang tersisa.
