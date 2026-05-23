export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "NodeWaste API Documentation",
    version: "1.0.0",
    description:
      "Dokumentasi interaktif API untuk aplikasi NodeWaste. Gunakan fitur Authorize untuk memasukkan token JWT yang didapat dari proses Login.",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Development Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Pesan error" },
          errors: { type: "array", items: { type: "string" } },
        },
      },
    },
  },
  paths: {
    // --- HEALTH ---
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Health check service backend",
        responses: { 200: { description: "Backend aktif" } },
      },
    },
    "/api/health/db": {
      get: {
        tags: ["Health"],
        summary: "Health check koneksi database",
        responses: {
          200: { description: "Database terhubung" },
          500: { description: "Database tidak terhubung" },
        },
      },
    },

    // --- AUTHENTICATION ---
    "/api/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Mendaftar akun baru",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Abbad Raid" },
                  email: { type: "string", example: "abbad@example.com" },
                  password: { type: "string", example: "password123" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description:
              "Registrasi berhasil, mengembalikan data user dan Token",
          },
          400: {
            description:
              "Format email tidak valid atau password kurang dari 8 karakter",
          },
        },
      },
    },
    "/api/auth/register/driver": {
      post: {
        tags: ["Authentication"],
        summary: "Mendaftar akun driver beserta profil kendaraan dan wilayah",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password", "vehiclePlate", "districtName"],
                properties: {
                  name: { type: "string", example: "Driver Demo" },
                  email: { type: "string", example: "driver@example.com" },
                  password: { type: "string", example: "password123" },
                  vehiclePlate: { type: "string", example: "AB1234CD" },
                  vehicleType: { type: "string", example: "Pickup" },
                  districtName: { type: "string", example: "Umbulharjo" },
                  city: { type: "string", example: "Kota Yogyakarta" },
                  province: { type: "string", example: "DI Yogyakarta" },
                  provinceCode: { type: "string", example: "34" },
                  cityCode: { type: "string", example: "34.71" },
                  districtCode: { type: "string", example: "34.71.06" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Registrasi driver berhasil" },
          400: { description: "Payload tidak valid" },
          409: { description: "Email atau plat kendaraan sudah digunakan" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Masuk (Login) ke dalam akun",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", example: "abbad@example.com" },
                  password: { type: "string", example: "password123" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Login berhasil, mengembalikan Token JWT" },
          401: { description: "Email atau password salah" },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Authentication"],
        summary: "Mengambil user aktif dari token JWT",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "User aktif berhasil diambil" },
          401: { description: "Unauthorized" },
          403: { description: "Akun dinonaktifkan" },
        },
      },
    },

    // --- DASHBOARD ---
    "/api/dashboard": {
      get: {
        tags: ["Dashboard"],
        summary: "Mengambil ringkasan data dasbor",
        description:
          "Menarik data poin, riwayat aktivitas terbaru, status pet, dan ringkasan scan.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Data dasbor berhasil diambil" },
          401: { description: "Unauthorized" },
        },
      },
    },

    // --- PROFILE ---
    "/api/profile": {
      get: {
        tags: ["Profile"],
        summary: "Mendapatkan data profil saat ini",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Data profil berhasil diambil" },
          401: { description: "Unauthorized" },
        },
      },
      put: {
        tags: ["Profile"],
        summary: "Memperbarui nama, email, dan alamat profil user",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Muhammad Abbad" },
                  email: { type: "string", example: "abbad.baru@example.com" },
                  address: {
                    type: "object",
                    properties: {
                      address: { type: "string", example: "Jl. Kebun Hijau No. 10" },
                      latitude: { type: "number", example: -7.7956 },
                      longitude: { type: "number", example: 110.3695 },
                      districtName: { type: "string", example: "Umbulharjo" },
                      city: { type: "string", example: "Kota Yogyakarta" },
                      province: { type: "string", example: "DI Yogyakarta" },
                      provinceCode: { type: "string", example: "34" },
                      cityCode: { type: "string", example: "34.71" },
                      districtCode: { type: "string", example: "34.71.06" },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Profil berhasil diperbarui" },
        },
      },
    },
    "/api/profile/photo": {
      put: {
        tags: ["Profile"],
        summary: "Memperbarui foto profile user",
        description: "Menerima multipart/form-data field photo maksimal 2 MB.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: { photo: { type: "string", format: "binary" } },
              },
            },
          },
        },
        responses: {
          200: { description: "Foto profile berhasil diperbarui" },
          400: { description: "Foto tidak valid" },
        },
      },
    },
    "/api/profile/password": {
      put: {
        tags: ["Profile"],
        summary: "Memperbarui kata sandi",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  currentPassword: { type: "string", example: "password123" },
                  newPassword: { type: "string", example: "passwordBaru456" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Kata sandi berhasil diperbarui" },
          400: { description: "Kata sandi saat ini salah" },
        },
      },
    },

    // --- SCAN ---
    "/api/scans": {
      post: {
        tags: ["Scan & Gamification"],
        summary: "Klasifikasi gambar sampah",
        description:
          "Mengirimkan foto sampah ke AI classifier untuk dianalisis dan mendapatkan imbalan EcoPoints.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  image: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Gambar berhasil diproses" },
        },
      },
    },

    // --- ACTIVITIES ---
    "/api/activities": {
      get: {
        tags: ["Activity History"],
        summary: "Mendapatkan daftar riwayat aktivitas",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "filter",
            in: "query",
            description: "Menyaring berdasarkan jenis aktivitas",
            required: false,
            schema: {
              type: "string",
              enum: ["all", "scan", "pet", "organik", "anorganik", "b3"],
              default: "all",
            },
          },
          {
            name: "limit",
            in: "query",
            description: "Jumlah data yang dikembalikan (Maks: 50)",
            required: false,
            schema: { type: "integer", default: 20 },
          },
        ],
        responses: {
          200: { description: "Daftar aktivitas berhasil ditarik" },
        },
      },
    },

    // --- VIRTUAL PET ---
    "/api/pet": {
      get: {
        tags: ["Virtual Pet"],
        summary: "Melihat status kesehatan dan indikator pet",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Status pet berhasil diambil" },
        },
      },
    },
    "/api/pet/{action}": {
      post: {
        tags: ["Virtual Pet"],
        summary: "Melakukan interaksi dengan pet",
        description:
          "Menukar EcoPoints untuk melakukan aksi: feed (makan) atau play (main).",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "action",
            in: "path",
            required: true,
            description: "Jenis aksi yang akan dilakukan",
            schema: {
              type: "string",
              enum: ["feed", "play"],
            },
          },
        ],
        responses: {
          200: {
            description:
              "Aksi berhasil, status pet meningkat dan poin berkurang",
          },
          400: {
            description: "Aksi tidak valid atau EcoPoints tidak mencukupi",
          },
        },
      },
    },

    // --- SCHEDULES ---
    "/api/schedules": {
      get: {
        tags: ["Schedules"],
        summary: "Mengambil jadwal angkut global untuk user",
        description:
          "Mengembalikan jadwal angkut aktif. Jadwal saat ini bersifat global dan tidak dibatasi wilayah user.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Jadwal berhasil diambil" },
          401: { description: "Unauthorized" },
          403: { description: "Hanya role USER yang dapat mengakses endpoint ini" },
        },
      },
    },

    // --- REGIONS ---
    "/api/regions/provinces": {
      get: {
        tags: ["Regions"],
        summary: "Daftar provinsi dari proxy wilayah.id",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Provinsi berhasil diambil" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/regions/regencies/{provinceCode}": {
      get: {
        tags: ["Regions"],
        summary: "Daftar kabupaten/kota berdasarkan kode provinsi",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "provinceCode",
            in: "path",
            required: true,
            schema: { type: "string", example: "34" },
          },
        ],
        responses: {
          200: { description: "Kabupaten/kota berhasil diambil" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/regions/districts/{regencyCode}": {
      get: {
        tags: ["Regions"],
        summary: "Daftar kecamatan berdasarkan kode kabupaten/kota",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "regencyCode",
            in: "path",
            required: true,
            schema: { type: "string", example: "34.71" },
          },
        ],
        responses: {
          200: { description: "Kecamatan berhasil diambil" },
          401: { description: "Unauthorized" },
        },
      },
    },

    // --- DRIVER ---
    "/api/driver/dashboard": {
      get: {
        tags: ["Driver"],
        summary: "Mengambil ringkasan dashboard driver",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Dashboard driver berhasil diambil" },
          403: { description: "Hanya role DRIVER yang dapat mengakses endpoint ini" },
        },
      },
    },
    "/api/driver/profile": {
      get: {
        tags: ["Driver"],
        summary: "Mengambil profil driver saat ini",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Profile driver berhasil diambil" },
          403: { description: "Hanya role DRIVER yang dapat mengakses endpoint ini" },
        },
      },
      put: {
        tags: ["Driver"],
        summary: "Memperbarui profil dan kendaraan driver",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Driver Demo" },
                  email: { type: "string", example: "driver.demo@nodewaste.test" },
                  vehiclePlate: { type: "string", example: "AB1234CD" },
                  vehicleType: { type: "string", example: "Motor bak" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Profile driver berhasil diperbarui" },
          400: { description: "Payload tidak valid" },
          403: { description: "Hanya role DRIVER yang dapat mengakses endpoint ini" },
        },
      },
    },
    "/api/driver/profile/photo": {
      put: {
        tags: ["Driver"],
        summary: "Memperbarui foto profile driver",
        description: "Menerima multipart/form-data field photo maksimal 2 MB.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: { photo: { type: "string", format: "binary" } },
              },
            },
          },
        },
        responses: {
          200: { description: "Foto profile driver berhasil diperbarui" },
          400: { description: "Foto tidak valid" },
          403: { description: "Hanya role DRIVER yang dapat mengakses endpoint ini" },
        },
      },
    },
    "/api/driver/map": {
      get: {
        tags: ["Driver"],
        summary: "Mengambil titik rumah user untuk map driver",
        description:
          "Mengembalikan user yang memiliki alamat dan koordinat untuk wilayah kerja driver.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Map driver berhasil diambil" },
          403: { description: "Hanya role DRIVER yang dapat mengakses endpoint ini" },
        },
      },
    },

    // --- ADMIN ---
    "/api/admin/dashboard": {
      get: {
        tags: ["Admin"],
        summary: "Mengambil ringkasan dashboard admin",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Dashboard admin berhasil diambil" },
          403: { description: "Hanya role ADMIN yang dapat mengakses endpoint ini" },
        },
      },
    },
    "/api/admin/accounts": {
      get: {
        tags: ["Admin"],
        summary: "Daftar akun semua role",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "role",
            in: "query",
            required: false,
            schema: { type: "string", enum: ["USER", "DRIVER", "ADMIN"] },
          },
        ],
        responses: {
          200: { description: "Daftar akun berhasil diambil" },
          403: { description: "Hanya role ADMIN yang dapat mengakses endpoint ini" },
        },
      },
      post: {
        tags: ["Admin"],
        summary: "Membuat akun USER, DRIVER, atau ADMIN",
        description: "Jika role DRIVER, payload juga membutuhkan data kendaraan dan wilayah kerja.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password", "role"],
                properties: {
                  name: { type: "string", example: "Admin Baru" },
                  email: { type: "string", example: "admin.baru@example.com" },
                  password: { type: "string", example: "password123" },
                  role: { type: "string", enum: ["USER", "DRIVER", "ADMIN"] },
                  vehiclePlate: { type: "string", example: "AB1234CD" },
                  vehicleType: { type: "string", example: "Motor bak" },
                  districtName: { type: "string", example: "Umbulharjo" },
                  city: { type: "string", example: "Kota Yogyakarta" },
                  province: { type: "string", example: "DI Yogyakarta" },
                  provinceCode: { type: "string", example: "34" },
                  cityCode: { type: "string", example: "34.71" },
                  districtCode: { type: "string", example: "34.71.06" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Akun berhasil dibuat" },
          400: { description: "Payload tidak valid" },
        },
      },
    },
    "/api/admin/accounts/{id}": {
      put: {
        tags: ["Admin"],
        summary: "Memperbarui akun atau status aktif akun",
        description: "Admin dapat mengubah nama, email, role, isActive, serta data driver bila role DRIVER. Admin tidak dapat menonaktifkan atau mengubah role akun sendiri.",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Nama Baru" },
                  email: { type: "string", example: "akun.baru@example.com" },
                  role: { type: "string", enum: ["USER", "DRIVER", "ADMIN"] },
                  isActive: { type: "boolean", example: true },
                  vehiclePlate: { type: "string", example: "AB4321CD" },
                  vehicleType: { type: "string", example: "Pickup" },
                  district: {
                    type: "object",
                    properties: {
                      districtName: { type: "string", example: "Umbulharjo" },
                      city: { type: "string", example: "Kota Yogyakarta" },
                      province: { type: "string", example: "DI Yogyakarta" },
                      provinceCode: { type: "string", example: "34" },
                      cityCode: { type: "string", example: "34.71" },
                      districtCode: { type: "string", example: "34.71.06" },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Akun berhasil diperbarui" },
          400: { description: "Payload tidak valid" },
          404: { description: "Akun tidak ditemukan" },
        },
      },
      delete: {
        tags: ["Admin"],
        summary: "Menghapus akun permanen",
        description: "Admin tidak dapat menghapus akun sendiri.",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Akun berhasil dihapus permanen" },
          400: { description: "Admin tidak bisa menghapus akun sendiri" },
          404: { description: "Akun tidak ditemukan" },
        },
      },
    },
    "/api/admin/accounts/{id}/points/add": {
      post: {
        tags: ["Admin"],
        summary: "Menambahkan EcoPoints user",
        description: "Hanya berlaku untuk akun role USER.",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["amount"],
                properties: { amount: { type: "integer", example: 50 } },
              },
            },
          },
        },
        responses: {
          200: { description: "EcoPoints berhasil ditambahkan" },
          400: { description: "Payload tidak valid atau akun bukan USER" },
          404: { description: "Akun tidak ditemukan" },
        },
      },
    },
    "/api/admin/accounts/{id}/points/subtract": {
      post: {
        tags: ["Admin"],
        summary: "Mengurangi EcoPoints user",
        description: "Hanya berlaku untuk akun role USER dan tidak boleh membuat EcoPoints negatif.",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["amount"],
                properties: { amount: { type: "integer", example: 25 } },
              },
            },
          },
        },
        responses: {
          200: { description: "EcoPoints berhasil dikurangi" },
          400: { description: "Payload tidak valid, akun bukan USER, atau poin menjadi negatif" },
          404: { description: "Akun tidak ditemukan" },
        },
      },
    },
    "/api/admin/users": {
      get: {
        tags: ["Admin"],
        summary: "Daftar akun untuk kompatibilitas halaman admin lama",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Daftar user berhasil diambil" },
          403: { description: "Hanya role ADMIN yang dapat mengakses endpoint ini" },
        },
      },
    },
    "/api/admin/drivers": {
      get: {
        tags: ["Admin"],
        summary: "Daftar akun driver",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Daftar driver berhasil diambil" } },
      },
      post: {
        tags: ["Admin"],
        summary: "Membuat akun driver beserta profil kendaraan dan wilayah kerja",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password", "vehiclePlate", "districtName"],
                properties: {
                  name: { type: "string", example: "Driver Baru" },
                  email: { type: "string", example: "driver.baru@example.com" },
                  password: { type: "string", example: "password123" },
                  vehiclePlate: { type: "string", example: "AB1234CD" },
                  vehicleType: { type: "string", example: "Pickup" },
                  districtName: { type: "string", example: "Umbulharjo" },
                  city: { type: "string", example: "Kota Yogyakarta" },
                  province: { type: "string", example: "DI Yogyakarta" },
                  provinceCode: { type: "string", example: "34" },
                  cityCode: { type: "string", example: "34.71" },
                  districtCode: { type: "string", example: "34.71.06" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Driver berhasil dibuat" },
          400: { description: "Payload tidak valid" },
        },
      },
    },
    "/api/admin/drivers/{id}": {
      put: {
        tags: ["Admin"],
        summary: "Memperbarui data driver",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Driver Update" },
                  email: { type: "string", example: "driver.update@example.com" },
                  vehiclePlate: { type: "string", example: "AB4321CD" },
                  vehicleType: { type: "string", example: "Motor bak" },
                  district: {
                    type: "object",
                    properties: {
                      districtName: { type: "string", example: "Umbulharjo" },
                      city: { type: "string", example: "Kota Yogyakarta" },
                      province: { type: "string", example: "DI Yogyakarta" },
                      provinceCode: { type: "string", example: "34" },
                      cityCode: { type: "string", example: "34.71" },
                      districtCode: { type: "string", example: "34.71.06" },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Driver berhasil diperbarui" },
          404: { description: "Driver tidak ditemukan" },
        },
      },
    },
    "/api/admin/schedules": {
      get: {
        tags: ["Admin"],
        summary: "Daftar jadwal angkut global",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Jadwal berhasil diambil" } },
      },
      post: {
        tags: ["Admin"],
        summary: "Membuat jadwal angkut global",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["wasteCategory", "pickupDay", "pickupTime"],
                properties: {
                  wasteCategory: { type: "string", example: "Organik" },
                  pickupDay: { type: "string", example: "Senin" },
                  pickupTime: { type: "string", example: "08:00" },
                  instruction: { type: "string", example: "Letakkan sampah di depan rumah" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Jadwal berhasil dibuat" },
          400: { description: "Payload tidak valid" },
        },
      },
    },
    "/api/admin/schedules/{id}": {
      put: {
        tags: ["Admin"],
        summary: "Memperbarui jadwal angkut global",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Jadwal berhasil diperbarui" },
          404: { description: "Jadwal tidak ditemukan" },
        },
      },
      delete: {
        tags: ["Admin"],
        summary: "Menghapus jadwal angkut global",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Jadwal berhasil dihapus" },
          404: { description: "Jadwal tidak ditemukan" },
        },
      },
    },

    // --- FACILITIES (MAP) ---
    "/api/recycling-facilities": {
      get: {
        tags: ["Maps & Facilities"],
        summary: "Daftar lokasi fasilitas pengelolaan sampah",
        description:
          "Endpoint ini bersifat publik (tanpa token) untuk ditarik oleh fitur Peta Interaktif.",
        responses: {
          200: { description: "Daftar titik lokasi fasilitas" },
        },
      },
    },
  },
};
