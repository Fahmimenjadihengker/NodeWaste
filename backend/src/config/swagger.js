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
        summary: "Memperbarui nama dan email profil",
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
          "Mengirimkan foto sampah untuk dianalisis dan mendapatkan imbalan EcoPoints.",
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
          "Menukar EcoPoints untuk melakukan aksi: feed (makan), play (main), atau bath (mandi).",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "action",
            in: "path",
            required: true,
            description: "Jenis aksi yang akan dilakukan",
            schema: {
              type: "string",
              enum: ["feed", "play", "bath"],
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
