# NodeWaste Web

Frontend NodeWaste berbasis React, Vite, dan Tailwind CSS.

## Scripts

- `npm run dev` menjalankan development server.
- `npm run build` membuat production build.
- `npm run lint` menjalankan ESLint.
- `npm run preview` menjalankan preview build.

## Scope Saat Ini

Saat ini aplikasi berisi landing page publik di `/`, halaman login di `/login`, halaman register di `/register`, dan area protected berbasis app shell di `/dashboard`, `/scan`, `/pet`, `/map`, dan `/profile`.

Dashboard memakai mock data lokal sementara sampai endpoint stats, pet, dan activity dibuat di backend.
Frontend juga sudah dikonfigurasi sebagai PWA installable dengan app shell caching melalui `vite-plugin-pwa`.

## Referensi

- Dokumentasi landing page: `../docs/features/landing-page.md`.
- Route frontend: `../docs/frontend/routes.md`.
- UI/UX mobile-first: `../docs/frontend/ui-ux-guidelines.md`.
- PWA frontend: `../docs/frontend/pwa.md`.
