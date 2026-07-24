# LogMood - Aplikasi Absensi & Monitoring Mood Karyawan

LogMood adalah aplikasi berbasis web yang dirancang untuk memudahkan manajemen absensi karyawan sekaligus memonitor kesejahteraan (mood) mereka setiap harinya. Sistem ini terdiri dari frontend yang dibangun menggunakan **SvelteKit** dan backend menggunakan **Node.js, Express, dan Drizzle ORM**.

## 🚀 Fitur Utama

Aplikasi ini dibagi menjadi dua peran (role) utama: **Admin** dan **Karyawan**.

### Fitur Karyawan
- **Dashboard**: Ringkasan data absensi dan jadwal kerja karyawan saat ini.
- **Absensi (Check In / Check Out)**: Fitur absensi harian yang dilengkapi dengan pengambilan foto (kamera) dan pencatatan waktu masuk serta pulang.
- **Jurnal Mood**: Karyawan dapat mencatat perasaan (mood) harian mereka beserta catatan opsional.
- **Riwayat Absensi**: Melihat riwayat absensi dan mood yang telah dicatat pada hari-hari sebelumnya.
- **Profil**: Melihat dan memperbarui informasi profil, termasuk mengganti nama dan password akun.

### Fitur Admin
- **Dashboard Admin**: Ringkasan statistik kehadiran, jumlah karyawan, dan tren mood.
- **Manajemen Karyawan**: CRUD (Create, Read, Update, Delete) data karyawan, mengatur status aktif, dan menugaskan divisi serta jadwal kerja.
- **Manajemen Department (Divisi)**: Mengelola struktur departemen di dalam perusahaan.
- **Manajemen Jadwal Kerja**: Membuat dan mengatur berbagai tipe jadwal kerja (jam masuk, jam pulang, dan toleransi keterlambatan).
- **Monitoring Absensi**: Memantau daftar hadir karyawan secara real-time.
- **Monitoring Mood**: Memantau tren dan catatan mood karyawan untuk menganalisis kesejahteraan tim.
- **Laporan (Report)**: Mengunduh laporan bulanan dalam bentuk file **Excel (.xlsx)**:
  - Laporan Presensi Karyawan
  - Laporan Presensi per Department
  - Laporan Jurnal Mood Bulanan

## 📂 Struktur Direktori (Frontend)

Berikut adalah struktur folder utama dari proyek frontend (`absensi_logModFE`):

```text
src/
├── lib/                      # Kode utilitas dan shared resources
│   ├── components/           # Komponen UI Svelte yang dapat digunakan ulang
│   │   ├── attendance/       # Komponen khusus fitur absensi
│   │   ├── common/           # Komponen umum (EmptyState, dll)
│   │   ├── layout/           # Komponen tata letak (Sidebar, Header)
│   │   └── ui/               # Komponen dasar (Button, Input, Modal, Card, dll)
│   ├── config/               # Konfigurasi aplikasi (Environment variables)
│   ├── services/             # Integrasi dengan API Backend (Cors/Fetch wrappers)
│   ├── stores/               # Manajemen state global (Svelte stores untuk Auth, dll)
│   ├── theme/                # Pengaturan tema aplikasi
│   └── types/                # Definisi tipe data TypeScript (Interfaces)
├── routes/                   # Routing halaman SvelteKit
│   ├── admin/                # Halaman khusus Admin
│   │   ├── absensi/          # Monitoring Absensi
│   │   ├── dashboard/        # Dashboard Admin
│   │   ├── divisi/           # Kelola Department
│   │   ├── jadwal-kerja/     # Kelola Jadwal Kerja
│   │   ├── karyawan/         # Kelola Data Karyawan
│   │   ├── laporan/          # Export Laporan Excel
│   │   └── mood-monitoring/  # Monitoring Mood Karyawan
│   ├── karyawan/             # Halaman khusus Karyawan
│   │   ├── absensi/          # Form Check In / Check Out
│   │   ├── dashboard/        # Dashboard Karyawan
│   │   ├── mood-jurnal/      # Input Jurnal Mood
│   │   ├── profile/          # Pengaturan Profil & Password
│   │   └── riwayat-absensi/  # Histori Absensi & Mood
│   ├── login/                # Halaman Autentikasi
│   ├── register/             # Halaman Pendaftaran Akun Karyawan
│   └── +layout.svelte        # Layout utama aplikasi
└── app.html                  # Template HTML dasar
```

## 🛠️ Teknologi yang Digunakan

**Frontend:**
- [SvelteKit](https://kit.svelte.dev/) - Framework Svelte untuk membangun aplikasi web.
- [TypeScript](https://www.typescriptlang.org/) - Pengetikan statis untuk JavaScript.
- [Vite](https://vitejs.dev/) - Build tool yang sangat cepat.
- CSS Vanilla - Desain UI yang responsif dan modern.

**Backend (absensi_logMoodBE):**
- Node.js & Express.js
- TypeScript
- Drizzle ORM - Object Relational Mapper untuk MySQL.
- MySQL - Basis data relasional.
- ExcelJS - Untuk ekspor laporan dalam bentuk Excel.

## ⚙️ Cara Menjalankan Aplikasi

1. **Persiapan Backend:**
   - Pastikan database MySQL berjalan.
   - Buka terminal di folder `absensi_logMoodBE`.
   - Install dependencies: `npm install`
   - Konfigurasi file `.env` untuk koneksi database.
   - Jalankan server: `npm run dev`

2. **Persiapan Frontend:**
   - Buka terminal di folder `absensi_logModFE`.
   - Install dependencies: `npm install`
   - Pastikan variabel environment mengarah ke API Backend yang benar (biasanya `http://localhost:3000`).
   - Jalankan server development: `npm run dev`
   - Buka browser dan akses `http://localhost:5173`.

---
*Dibuat untuk memenuhi tugas UAS pengembangan aplikasi web terintegrasi.*
