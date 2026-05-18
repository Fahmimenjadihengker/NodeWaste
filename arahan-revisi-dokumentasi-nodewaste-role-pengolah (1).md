# Arahan Revisi Dokumentasi Project NodeWaste — Penambahan Role Pengolah/Pengangkut

## 1. Konteks Revisi

Project NodeWaste sudah berjalan, tetapi saat ini terdapat revisi besar pada struktur sistem. Revisi utama adalah penambahan role baru, yaitu **Pengolah** atau **Pengangkut**, yang memiliki alur penggunaan berbeda dari **User Biasa**.

Dokumen ini digunakan sebagai arahan awal untuk AI Agent dalam merevisi dokumentasi dan project NodeWaste secara menyeluruh. Agent harus membaca dokumen ini sebagai dasar untuk memperbarui SRS, PRD, struktur fitur, database, routing, UI, API, dan alur sistem.

NodeWaste tetap menjadi platform web edukasi, pelacakan, dan gamifikasi pengelolaan sampah. Namun, setelah revisi, sistem tidak hanya berfokus pada pengguna yang melakukan scan sampah, tetapi juga pada pihak pengolah/pengangkut sampah yang bertugas melihat lokasi pengambilan, wilayah kerja, dan informasi tujuan pengolahan sampah.

---

## 2. Tujuan Revisi

Tujuan revisi adalah menambahkan role baru ke dalam sistem NodeWaste agar aplikasi dapat mendukung dua jenis pengguna utama:

1. **User Biasa**  
   Pengguna umum yang melakukan scan sampah, melihat jadwal pengangkutan, mendapatkan edukasi pemilahan, memantau statistik aktivitas, dan berinteraksi dengan virtual pet.

2. **Pengolah/Pengangkut**  
   Pengguna operasional yang bertugas melakukan pengangkutan atau pengolahan sampah berdasarkan wilayah kecamatan, plat kendaraan, lokasi rumah pengguna, dan lokasi tempat pengolahan sampah.

Dengan revisi ini, dokumentasi project harus diubah dari sistem single-role menjadi sistem multi-role dengan autentikasi, dashboard, data, dan akses halaman yang berbeda.

---

## 3. Role Sistem

### 3.1 User Biasa

User Biasa adalah pengguna utama aplikasi yang menggunakan NodeWaste untuk memindai sampah dan mendapatkan arahan pengelolaan sampah.

Hak akses utama User Biasa:

- Login dan registrasi akun.
- Mengakses dashboard user.
- Melihat statistik scan sampah.
- Melihat virtual pet.
- Melihat jadwal pengangkutan sampah.
- Melakukan scan sampah.
- Melihat hasil klasifikasi sampah.
- Melihat panduan pemilahan dan pembuangan sampah.
- Mengakses profil.
- Logout.

### 3.2 Pengolah/Pengangkut

Pengolah/Pengangkut adalah role baru yang digunakan oleh pihak operasional pengangkutan atau pengolahan sampah pada wilayah tertentu, misalnya berdasarkan kecamatan.

Hak akses utama Pengolah/Pengangkut:

- Login dan registrasi akun pengangkut.
- Mengakses dashboard pengangkut.
- Melihat data kendaraan dan wilayah pengangkutan.
- Melihat maps lokasi rumah pengguna.
- Melihat maps tempat pengolahan sampah.
- Melihat titik koordinat, alamat lengkap, dan foto depan rumah/tempat pengolahan.
- Melihat rute dari lokasi awal ke lokasi tujuan.
- Mengakses profil pengangkut.
- Logout.

Catatan: Pada spreadsheet, role ini disebut sebagai **Driver**. Dalam dokumentasi final, tentukan satu istilah konsisten. Rekomendasi istilah: **Pengolah/Pengangkut** untuk konsep bisnis, dan `collector` atau `waste_operator` untuk nama role teknis.

---

## 4. Revisi Struktur Fitur Berdasarkan Role

## 4.1 Fitur User Biasa

### 4.1.1 Login User

**Halaman:** Login  
**Isi halaman:** Form login  
**Data yang diperlukan:**

- Email
- Password

**Fungsi:**  
User memasukkan email dan password untuk masuk ke dashboard user.

**Arahan revisi dokumentasi:**

- Tambahkan penjelasan bahwa login harus memvalidasi role pengguna.
- Setelah login berhasil, user dengan role `user` diarahkan ke dashboard user.
- Jika akun memiliki role pengolah/pengangkut, maka diarahkan ke dashboard pengangkut.

---

### 4.1.2 Registrasi User

**Halaman:** Register  
**Isi halaman:** Form registrasi  
**Data yang diperlukan:**

- Nama pengguna
- Email
- Password
- Captcha/authorizer jika digunakan

**Fungsi:**  
User membuat akun baru dan setelah berhasil dapat masuk ke dashboard user.

**Arahan revisi dokumentasi:**

- Jelaskan validasi data registrasi user.
- Default role untuk registrasi umum adalah `user`.
- Tambahkan validasi email unik.
- Password harus disimpan dalam bentuk hash di backend.

---

### 4.1.3 Dashboard User

**Halaman:** Dashboard User  
**Isi halaman:** Statistik dan virtual pet  
**Data yang ditampilkan:**

- Jumlah scan.
- Jumlah scan per kategori sampah.
- Chart/history scan.
- Statistik aktivitas pengguna.
- Kondisi virtual pet.

**Fungsi:**  
Menampilkan ringkasan aktivitas user dalam mengelola sampah serta perkembangan gamifikasi melalui pet.

**Arahan revisi dokumentasi:**

- Dashboard user harus berbeda dari dashboard pengangkut.
- Data dashboard user hanya menampilkan data milik user yang sedang login.
- Tambahkan chart untuk riwayat scan berdasarkan tanggal dan kategori.
- Tambahkan ringkasan poin atau reward jika sistem gamifikasi digunakan.

---

### 4.1.4 Virtual Pet

**Halaman:** Pet  
**Isi halaman:** Virtual pet interaktif  
**Data yang digunakan:**

- Status pet.
- Poin user.
- Aktivitas scan.
- Kondisi pet seperti happy, hungry, dirty, sick, atau excited.

**Fungsi:**  
Memberikan unsur gamifikasi agar user termotivasi melakukan aktivitas pengelolaan sampah.

**Arahan revisi dokumentasi:**

- Jelaskan hubungan aktivitas scan dengan kondisi pet.
- Tentukan aturan perubahan status pet.
- Jika menggunakan Lottie, dokumentasikan struktur file animasi dan mapping status pet ke file animasi.

---

### 4.1.5 Jadwal Pengangkutan Sampah

**Halaman:** Jadwal  
**Isi halaman:** Tabel jadwal pengangkutan  
**Data yang ditampilkan:**

- Kategori sampah.
- Hari pengangkutan.
- Jam pengangkutan.
- Peringatan agar sampah tidak diletakkan pada malam hari.

**Fungsi:**  
Memberikan informasi kepada user tentang kapan sampah boleh dikeluarkan dari rumah sesuai kategori sampah.

**Arahan revisi dokumentasi:**

- Jadwal harus dibedakan berdasarkan kategori sampah.
- Minimal kategori yang perlu disiapkan: organik, anorganik, berbahaya/B3, dan daur ulang/residu sesuai kebutuhan project.
- Tambahkan aturan bahwa sampah sebaiknya dikeluarkan pagi hari sebelum jadwal pengangkutan, misalnya sebelum pukul 08.00, bukan dari malam hari.
- Jika jadwal bergantung pada wilayah/kecamatan, tambahkan relasi ke data wilayah.

---

### 4.1.6 Scan Sampah

**Halaman:** Scan  
**Isi halaman:** Kamera/upload gambar dan hasil scan  
**Data hasil scan:**

- Jenis sampah.
- Kategori sampah, misalnya organik, anorganik, berbahaya/B3.
- Klasifikasi perlakuan, misalnya bisa dibakar, tidak bisa dibakar, daur ulang, atau berbahaya.
- Panduan pemilahan.
- Panduan cara membuang.
- Waktu yang disarankan untuk mengeluarkan sampah dari rumah.

**Fungsi:**  
User memindai sampah, lalu sistem memberikan hasil identifikasi dan edukasi pengelolaan sampah.

**Arahan revisi dokumentasi:**

- Dokumentasikan alur scan dari input gambar sampai hasil klasifikasi.
- Tambahkan fallback jika hasil scan tidak dikenali.
- Hasil scan harus tersimpan ke history user.
- Hasil scan harus dapat digunakan untuk statistik dashboard.
- Tambahkan teks edukasi cara mengelola dan membuang sampah berdasarkan jenis/kategori sampah.

---

### 4.1.7 Profil User

**Halaman:** Profile  
**Isi halaman:** Data profil user  
**Data yang ditampilkan:**

- Nama pengguna.
- Email.
- Informasi tambahan jika tersedia.

**Fungsi:**  
User melihat atau memperbarui data akunnya.

**Arahan revisi dokumentasi:**

- Tentukan data profil yang dapat diedit.
- Tambahkan validasi keamanan agar user hanya dapat mengakses profil miliknya sendiri.

---

### 4.1.8 Logout User

**Halaman/Fungsi:** Logout  
**Fungsi:**  
Menghapus sesi/token user dan mengarahkan kembali ke halaman login atau landing page.

---

## 4.2 Fitur Pengolah/Pengangkut

### 4.2.1 Login Pengolah/Pengangkut

**Halaman:** Login  
**Isi halaman:** Form login  
**Data yang diperlukan:**

- Email
- Password

**Fungsi:**  
Pengolah/pengangkut login untuk masuk ke dashboard pengangkut sesuai wilayah kerjanya.

**Arahan revisi dokumentasi:**

- Sistem login dapat menggunakan halaman yang sama dengan user biasa, tetapi redirect berdasarkan role.
- Role pengolah/pengangkut tidak boleh masuk ke halaman dashboard user.
- Setelah login berhasil, role pengolah/pengangkut diarahkan ke dashboard khusus pengangkut.

---

### 4.2.2 Registrasi Pengolah/Pengangkut

**Halaman:** Register Pengangkut  
**Isi halaman:** Form registrasi  
**Data yang diperlukan:**

- Plat mobil/kendaraan.
- Kecamatan atau wilayah pengangkutan.
- Email.
- Password.

**Fungsi:**  
Pengolah/pengangkut membuat akun berdasarkan data kendaraan dan wilayah operasional.

**Arahan revisi dokumentasi:**

- Registrasi pengangkut sebaiknya dipisahkan dari registrasi user biasa atau menggunakan pilihan role dengan validasi khusus.
- Tambahkan validasi plat kendaraan.
- Tambahkan validasi wilayah/kecamatan.
- Email pengangkut bisa dikaitkan dengan kecamatan atau instansi pengelola.
- Pertimbangkan status verifikasi akun pengangkut oleh admin jika project memiliki role admin.

---

### 4.2.3 Dashboard Pengangkut

**Halaman:** Dashboard Pengangkut  
**Isi halaman:** Data pengangkut  
**Data yang ditampilkan:**

- Jenis kendaraan atau identitas kendaraan.
- Plat mobil.
- Wilayah pengangkutan/kecamatan.
- Ringkasan tugas pengangkutan jika tersedia.
- Ringkasan titik lokasi yang perlu dikunjungi.

**Fungsi:**  
Menampilkan informasi utama pengangkut berdasarkan kendaraan dan wilayah kerja.

**Arahan revisi dokumentasi:**

- Dashboard pengangkut tidak menampilkan pet atau statistik scan user pribadi.
- Dashboard pengangkut harus fokus pada operasional pengangkutan.
- Data yang ditampilkan harus difilter berdasarkan kecamatan/wilayah pengangkut.
- Tambahkan kemungkinan status tugas, misalnya menunggu, sedang diproses, selesai, atau gagal diangkut.

---

### 4.2.4 Maps Rumah User

**Halaman:** Maps Rumah  
**Isi halaman:** Peta lokasi rumah user  
**Data yang ditampilkan:**

- Tampilan peta seperti Google Maps.
- Titik koordinat/marker rumah user.
- Alamat lengkap.
- Foto depan rumah jika tersedia.
- Informasi kategori sampah yang akan diangkut jika tersedia.

**Fungsi:**  
Membantu pengangkut mengetahui lokasi rumah user yang menjadi titik awal pengambilan sampah.

**Arahan revisi dokumentasi:**

- Maps rumah harus dipisahkan dari maps tempat pengolahan sampah agar alur lebih jelas.
- Marker dapat diklik untuk membuka detail alamat, foto depan rumah, dan informasi terkait pengangkutan.
- Data rumah user harus difilter berdasarkan wilayah/kecamatan pengangkut.
- Perlu ada perhatian terhadap privasi data alamat dan foto rumah.

---

### 4.2.5 Maps Tempat Pengolahan Sampah

**Halaman:** Maps Tempat Pengolahan  
**Isi halaman:** Peta lokasi tempat pengolahan sampah  
**Data yang ditampilkan:**

- Titik lokasi tempat pengolahan sampah.
- Alamat lengkap tempat pengolahan.
- Foto lokasi jika tersedia.
- Jenis/kategori sampah yang diterima tempat tersebut.
- Status kapasitas jika fitur overload diterapkan.

**Fungsi:**  
Membantu pengangkut melihat lokasi tujuan akhir setelah mengambil sampah dari user.

**Arahan revisi dokumentasi:**

- Pisahkan maps tempat pengolahan dari maps rumah user.
- Tampilkan tujuan akhir berdasarkan kategori sampah atau wilayah pengangkutan.
- Tambahkan data kapasitas tempat pengolahan jika tersedia.
- Jika memungkinkan, tambahkan indikator overload atau hampir penuh.

---

### 4.2.6 Rute Pengangkutan

**Halaman/Fitur:** Rute Maps  
**Isi halaman:** Rute dari titik awal ke titik tujuan  
**Data yang digunakan:**

- Koordinat titik awal, misalnya rumah user atau lokasi pengangkut.
- Koordinat titik tujuan, misalnya tempat pengolahan sampah.
- Alamat lengkap.
- Titik marker.

**Fungsi:**  
Menampilkan rute pengangkutan dari tujuan awal sampai tujuan akhir.

**Arahan revisi dokumentasi:**

- Dokumentasikan apakah rute menggunakan Google Maps API, Mapbox, Leaflet, atau library lain.
- Tentukan apakah rute hanya menampilkan marker atau juga navigasi jalur.
- Jika menggunakan API eksternal, dokumentasikan kebutuhan API key dan environment variable.

---

### 4.2.7 Profil Pengangkut

**Halaman:** Profile Pengangkut  
**Isi halaman:** Data profil pengangkut  
**Data yang ditampilkan:**

- Nama kecamatan/wilayah.
- Plat mobil/kendaraan.
- Email.
- Data kendaraan tambahan jika tersedia.

**Fungsi:**  
Pengangkut melihat data akun, kendaraan, dan wilayah operasionalnya.

**Arahan revisi dokumentasi:**

- Data profil pengangkut harus berbeda dari user biasa.
- Pengangkut hanya boleh melihat data profil miliknya sendiri.
- Jika pengangkut mewakili instansi/kecamatan, dokumentasikan relasinya ke data wilayah.

---

### 4.2.8 Logout Pengangkut

**Halaman/Fungsi:** Logout  
**Fungsi:**  
Menghapus sesi/token pengangkut dan mengarahkan kembali ke halaman login atau landing page.

---

## 5. Arahan Revisi Autentikasi dan Authorization

Agent harus merevisi dokumentasi autentikasi agar mendukung role-based access control.

### 5.1 Role yang Dibutuhkan

Minimal role:

```text
user
collector / pengolah / pengangkut
```

Rekomendasi teknis:

```text
USER
COLLECTOR
```

Jika project membutuhkan verifikasi atau manajemen data, dapat dipertimbangkan role tambahan:

```text
ADMIN
```

Namun, role admin tidak wajib jika belum ada kebutuhan eksplisit.

### 5.2 Redirect Setelah Login

Aturan redirect:

| Role | Redirect setelah login |
|---|---|
| USER | `/dashboard` atau `/user/dashboard` |
| COLLECTOR | `/collector/dashboard` atau `/pengangkut/dashboard` |

### 5.3 Proteksi Route

Route user biasa hanya dapat diakses oleh role `USER`.

Route pengangkut hanya dapat diakses oleh role `COLLECTOR`.

Jika role tidak sesuai:

- Redirect ke dashboard sesuai role, atau
- Tampilkan halaman forbidden/unauthorized.

---

## 6. Arahan Revisi Struktur Halaman Frontend

Rekomendasi struktur halaman frontend:

```text
src/
  pages/
    auth/
      Login.jsx
      RegisterUser.jsx
      RegisterCollector.jsx
    user/
      UserDashboard.jsx
      Pet.jsx
      Schedule.jsx
      Scan.jsx
      UserProfile.jsx
    collector/
      CollectorDashboard.jsx
      HouseMap.jsx
      ProcessingMap.jsx
      RouteMap.jsx
      CollectorProfile.jsx
  components/
    auth/
    user/
    collector/
    maps/
    shared/
  routes/
    ProtectedRoute.jsx
    RoleRoute.jsx
```

Catatan:

- Jika project menggunakan Next.js, sesuaikan struktur dengan `app/` atau `pages/`.
- Jika project menggunakan React Router, tambahkan route group untuk user dan collector.
- Komponen umum seperti navbar, button, card, dan modal dapat diletakkan di `components/shared`.

---

## 7. Arahan Revisi Routing

Contoh route yang perlu didokumentasikan:

### Auth

```text
/login
/register
/register/collector
```

### User Biasa

```text
/user/dashboard
/user/pet
/user/schedule
/user/scan
/user/profile
```

### Pengolah/Pengangkut

```text
/collector/dashboard
/collector/maps/houses
/collector/maps/processing-sites
/collector/route
/collector/profile
```

Catatan: Jika project saat ini sudah menggunakan path lama seperti `/dashboard`, dokumentasikan strategi migrasi agar tidak membingungkan.

---

## 8. Arahan Revisi Database

Agent harus menyesuaikan dokumentasi database agar mendukung data multi-role dan data operasional pengangkutan.

### 8.1 Tabel/Model User

Minimal field:

```text
id
name
email
passwordHash
role
createdAt
updatedAt
```

Role dapat berisi:

```text
USER
COLLECTOR
```

### 8.2 Tabel/Model CollectorProfile

Model khusus untuk data pengolah/pengangkut.

```text
id
userId
vehiclePlate
vehicleType
districtId
createdAt
updatedAt
```

Relasi:

- `CollectorProfile.userId` terhubung ke `User.id`.
- `CollectorProfile.districtId` terhubung ke `District.id`.

### 8.3 Tabel/Model District

Model untuk kecamatan/wilayah.

```text
id
name
city
province
createdAt
updatedAt
```

### 8.4 Tabel/Model UserAddress

Model untuk alamat rumah user.

```text
id
userId
address
latitude
longitude
frontPhotoUrl
districtId
createdAt
updatedAt
```

### 8.5 Tabel/Model WasteScanHistory

Model untuk riwayat scan user.

```text
id
userId
wasteType
wasteCategory
wasteClassification
disposalGuide
scanImageUrl
createdAt
```

### 8.6 Tabel/Model WasteSchedule

Model untuk jadwal pengangkutan sampah.

```text
id
districtId
wasteCategory
pickupDay
pickupTime
instruction
createdAt
updatedAt
```

### 8.7 Tabel/Model ProcessingSite

Model untuk tempat pengolahan sampah.

```text
id
name
address
latitude
longitude
photoUrl
acceptedWasteCategories
capacityStatus
createdAt
updatedAt
```

`capacityStatus` dapat berisi:

```text
AVAILABLE
NEAR_FULL
FULL
OVERLOADED
```

### 8.8 Tabel/Model PickupTask Opsional

Jika project ingin mengembangkan fitur tugas pengangkutan, tambahkan model:

```text
id
collectorId
userAddressId
processingSiteId
wasteCategory
status
scheduledAt
completedAt
createdAt
updatedAt
```

Status dapat berisi:

```text
PENDING
IN_PROGRESS
COMPLETED
FAILED
```

---

## 9. Arahan Revisi API Backend

Agent harus menambahkan atau merevisi endpoint backend agar sesuai dengan role baru.

### 9.1 Auth API

```text
POST /api/auth/login
POST /api/auth/register
POST /api/auth/register/collector
POST /api/auth/logout
GET  /api/auth/me
```

### 9.2 User API

```text
GET  /api/user/dashboard
GET  /api/user/profile
PUT  /api/user/profile
GET  /api/user/schedules
POST /api/user/scan
GET  /api/user/scan-history
```

### 9.3 Collector API

```text
GET /api/collector/dashboard
GET /api/collector/profile
PUT /api/collector/profile
GET /api/collector/houses
GET /api/collector/processing-sites
GET /api/collector/routes
```

### 9.4 Maps API

Jika maps membutuhkan endpoint terpisah:

```text
GET /api/maps/houses?districtId={id}
GET /api/maps/processing-sites
GET /api/maps/route?startLat={lat}&startLng={lng}&endLat={lat}&endLng={lng}
```

Catatan:

- Semua endpoint collector harus memvalidasi role `COLLECTOR`.
- Endpoint rumah user harus memfilter data berdasarkan kecamatan collector.
- Jangan mengembalikan data alamat user di luar wilayah kerja collector.

---

## 10. Arahan Revisi UI/UX

### 10.1 Perbedaan Navigasi User dan Pengangkut

Navbar/sidebar user biasa berisi:

```text
Dashboard
Pet
Jadwal
Scan
Profile
Logout
```

Navbar/sidebar pengangkut berisi:

```text
Dashboard
Maps Rumah
Maps Tempat Pengolahan
Rute
Profile
Logout
```

### 10.2 Prinsip Tampilan

- UI harus membedakan konteks user dan pengangkut.
- Dashboard pengangkut harus terasa operasional, bukan gamifikasi.
- Dashboard user tetap fokus pada edukasi dan gamifikasi.
- Maps harus mudah dibaca dan marker harus informatif.
- Informasi penting seperti alamat, kategori sampah, dan status pengangkutan harus jelas.

### 10.3 Halaman Maps

Untuk marker rumah user:

- Tampilkan alamat lengkap.
- Tampilkan foto depan rumah jika tersedia.
- Tampilkan kategori sampah yang relevan.
- Tampilkan tombol lihat rute jika fitur rute tersedia.

Untuk marker tempat pengolahan:

- Tampilkan nama tempat.
- Tampilkan alamat.
- Tampilkan kategori sampah yang diterima.
- Tampilkan status kapasitas.

---

## 11. Arahan Fitur TPA/Tempat Pengolahan Overload

Pada spreadsheet terdapat catatan bahwa sistem dapat ditambahkan pendeteksi apakah TPA/tempat pengolahan overload atau tidak.

Fitur ini bersifat opsional, tetapi direkomendasikan untuk dokumentasi sebagai pengembangan lanjutan.

### 11.1 Data yang Dibutuhkan

```text
processingSiteId
currentCapacity
maxCapacity
capacityStatus
lastUpdatedAt
```

### 11.2 Status Kapasitas

```text
AVAILABLE: kapasitas masih aman
NEAR_FULL: hampir penuh
FULL: penuh
OVERLOADED: melebihi kapasitas
```

### 11.3 Dampak ke Sistem

- Pengangkut dapat melihat tempat pengolahan mana yang penuh.
- Sistem dapat menyarankan tempat pengolahan alternatif.
- Maps dapat menampilkan warna marker berbeda berdasarkan status kapasitas.

---

## 12. Arahan Keamanan dan Privasi

Karena revisi menambahkan data alamat, koordinat, dan foto depan rumah, dokumentasi harus memuat aspek privasi.

Hal yang harus diperhatikan:

- Pengangkut hanya boleh melihat data rumah user dalam wilayah/kecamatannya.
- Foto depan rumah hanya ditampilkan jika diperlukan untuk proses pengangkutan.
- Data koordinat tidak boleh diakses publik.
- Token login harus memuat role atau backend harus mengecek role dari database.
- Password wajib di-hash.
- API collector harus dilindungi middleware authentication dan authorization.

---

## 13. Arahan Revisi Dokumentasi Project

Agent harus memperbarui dokumen berikut jika ada di repository:

```text
README.md
SRS.md
PRD.md
docs/api.md
docs/database.md
docs/frontend-routes.md
docs/backend-routes.md
docs/deployment.md
docs/roles-and-permissions.md
```

Jika dokumen belum ada, agent harus membuatnya.

### 13.1 README.md

Tambahkan ringkasan bahwa NodeWaste sekarang mendukung dua role:

- User Biasa
- Pengolah/Pengangkut

Tambahkan cara menjalankan project, env yang dibutuhkan, dan struktur folder terbaru.

### 13.2 SRS.md

Tambahkan:

- Functional requirement untuk role user.
- Functional requirement untuk role pengangkut.
- Non-functional requirement terkait privasi lokasi.
- Use case diagram berbasis teks jika belum ada diagram.
- Data requirement untuk maps dan pengangkutan.

### 13.3 PRD.md

Tambahkan:

- Tujuan produk setelah revisi.
- Persona baru: Pengolah/Pengangkut.
- User journey untuk pengangkut.
- Success metrics untuk fitur maps dan pengangkutan.

### 13.4 docs/api.md

Tambahkan endpoint auth, user, collector, dan maps.

### 13.5 docs/database.md

Tambahkan model role, collector profile, district, user address, processing site, schedule, dan pickup task jika digunakan.

### 13.6 docs/frontend-routes.md

Tambahkan daftar route user dan collector.

### 13.7 docs/roles-and-permissions.md

Buat matriks akses fitur berdasarkan role.

Contoh:

| Fitur | User | Pengangkut |
|---|---:|---:|
| Dashboard User | Ya | Tidak |
| Scan Sampah | Ya | Tidak |
| Jadwal Sampah | Ya | Opsional |
| Virtual Pet | Ya | Tidak |
| Dashboard Pengangkut | Tidak | Ya |
| Maps Rumah | Tidak | Ya |
| Maps Tempat Pengolahan | Tidak | Ya |
| Rute Pengangkutan | Tidak | Ya |

---

## 14. Acceptance Criteria Revisi

Revisi dianggap selesai jika memenuhi kriteria berikut:

1. Dokumentasi menjelaskan dua role utama: User dan Pengolah/Pengangkut.
2. Login dapat membedakan redirect berdasarkan role.
3. Registrasi user dan registrasi pengangkut terdokumentasi dengan field berbeda.
4. Dashboard user dan dashboard pengangkut terdokumentasi terpisah.
5. Route frontend untuk user dan pengangkut terdokumentasi.
6. API backend untuk user dan pengangkut terdokumentasi.
7. Database sudah memiliki arahan model untuk role, wilayah, alamat, kendaraan, dan tempat pengolahan.
8. Maps rumah dan maps tempat pengolahan dipisahkan dalam dokumentasi.
9. Dokumentasi menjelaskan privasi data alamat dan foto rumah.
10. Ada matriks role dan permission.
11. Ada catatan fitur opsional untuk deteksi tempat pengolahan/TPA overload.

---

## 15. Prioritas Implementasi Revisi

### Prioritas 1 — Wajib

- Tambahkan role `USER` dan `COLLECTOR`.
- Update login dan redirect berdasarkan role.
- Buat dashboard pengangkut.
- Buat route khusus pengangkut.
- Tambahkan model collector profile.
- Tambahkan proteksi route berdasarkan role.

### Prioritas 2 — Penting

- Tambahkan maps rumah user.
- Tambahkan maps tempat pengolahan.
- Tambahkan data kecamatan/wilayah.
- Tambahkan profil pengangkut.
- Perbarui dokumentasi API dan database.

### Prioritas 3 — Pengembangan Lanjutan

- Tambahkan rute otomatis dari titik awal ke tujuan akhir.
- Tambahkan status tugas pengangkutan.
- Tambahkan deteksi kapasitas/overload tempat pengolahan.
- Tambahkan rekomendasi tempat pengolahan alternatif.

---

## 16. Instruksi Khusus untuk AI Agent

Saat merevisi project, lakukan dengan urutan berikut:

1. Baca struktur project saat ini.
2. Identifikasi stack yang digunakan pada frontend, backend, database, dan routing.
3. Jangan menghapus fitur lama user biasa.
4. Tambahkan role baru tanpa merusak alur user lama.
5. Refactor auth agar mendukung role-based access control.
6. Pisahkan halaman user dan pengangkut.
7. Tambahkan dokumentasi database sebelum mengubah schema.
8. Tambahkan endpoint backend sesuai kebutuhan role pengangkut.
9. Tambahkan UI route pengangkut setelah API dan schema jelas.
10. Pastikan env deployment tetap terdokumentasi, terutama jika maps memakai API key.
11. Jalankan pengecekan build/lint/test jika tersedia.
12. Dokumentasikan perubahan akhir pada README atau changelog.

---

## 17. Ringkasan Revisi Utama

Revisi besar NodeWaste adalah perubahan dari aplikasi single-role menjadi aplikasi multi-role. Role lama yaitu User Biasa tetap digunakan untuk scan sampah, jadwal, statistik, dan pet. Role baru yaitu Pengolah/Pengangkut digunakan untuk operasional pengangkutan sampah berdasarkan kendaraan, kecamatan, maps rumah, maps tempat pengolahan, dan rute pengangkutan.

Agent harus memastikan seluruh dokumentasi project mencerminkan perubahan ini, terutama pada bagian role, autentikasi, route, database, API, dan UI/UX.
