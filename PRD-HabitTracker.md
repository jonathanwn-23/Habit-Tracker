# Product Requirements Document (PRD)
## HabitTracker — SaaS Fullstack Next.js 16 + Supabase
**Versi:** 1.0.0  
**Tanggal:** 26 Juni 2026  
**Durasi Pengerjaan:** 7 Hari  
**Status:** Draft

---

## 1. Overview Produk

### 1.1 Deskripsi Singkat
HabitTracker adalah aplikasi web berbasis SaaS yang membantu pengguna mencatat, memantau, dan memvisualisasikan kebiasaan harian mereka. Pengguna dapat mendefinisikan target kebiasaan (misalnya "olahraga 30 menit", "baca buku", "tidak merokok"), mencentangnya setiap hari, dan melihat perkembangan melalui streak serta visualisasi kalender.

### 1.2 Tujuan Produk
- Membantu pengguna membangun kebiasaan positif secara konsisten
- Memberikan feedback visual (streak & kalender heatmap) sebagai motivasi
- Menyediakan antarmuka yang simpel dan responsif agar mudah digunakan setiap hari

### 1.3 Target Pengguna
- Individu berusia 18–40 tahun yang ingin membentuk rutinitas harian
- Pengguna yang sudah familiar dengan aplikasi produktivitas (Notion, Todoist, dsb.)
- Tidak memerlukan keahlian teknis

### 1.4 Tech Stack
| Layer | Teknologi |
|---|---|
| Frontend & Backend | Next.js 16 (App Router) |
| Database & Auth | Supabase (PostgreSQL + Auth) |
| Styling | Tailwind CSS |
| Bahasa | TypeScript |
| Deployment | Vercel |

---

## 2. Ruang Lingkup MVP (7 Hari)

### Yang MASUK dalam scope MVP:
- Autentikasi via Google OAuth & Email/Password (Supabase Auth)
- CRUD Habit (buat, lihat, edit, arsip)
- Check-in harian (centang habit per hari)
- Kalkulasi streak otomatis
- Visualisasi kalender heatmap per habit
- Dashboard ringkasan semua habit hari ini
- RLS (Row Level Security) Supabase untuk keamanan data

### Yang TIDAK masuk scope MVP (future roadmap):
- Habit dengan frekuensi mingguan/bulanan
- Notifikasi pengingat (push notification / email)
- Fitur sosial (berbagi progress, tantangan bersama)
- Statistik lanjutan (tren mingguan, analitik AI)
- Mobile app (iOS/Android)
- Langganan berbayar / payment gateway

---

## 3. Desain Database (ERD)

### 3.1 Tabel: `public.users`
Disinkronisasi otomatis dari `auth.users` Supabase via database trigger.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` | Primary key, referensi ke `auth.users.id` |
| `email` | `text` | Email pengguna |
| `full_name` | `text` | Nama lengkap (dari Google OAuth atau input manual) |
| `avatar_url` | `text` | URL foto profil (dari Google OAuth) |
| `created_at` | `timestamptz` | Waktu akun dibuat |

**Trigger:** Setiap INSERT di `auth.users` → otomatis INSERT ke `public.users`.

### 3.2 Tabel: `public.habits`
Menyimpan definisi habit milik setiap pengguna.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | Foreign key → `public.users.id` |
| `name` | `text` | Nama habit (e.g., "Olahraga 30 menit") |
| `description` | `text` | Deskripsi opsional |
| `icon` | `text` | Kode ikon (e.g., "🏃" atau "ti-run") |
| `color` | `text` | Warna hex (e.g., "#6366f1") |
| `frequency` | `text` | "daily" untuk MVP |
| `is_archived` | `boolean` | Soft delete, default `false` |
| `created_at` | `timestamptz` | Waktu habit dibuat |

**RLS Policy:** User hanya bisa SELECT, INSERT, UPDATE, DELETE habit miliknya sendiri (`user_id = auth.uid()`).

### 3.3 Tabel: `public.habit_logs`
Mencatat setiap centang yang dilakukan pengguna.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` | Primary key |
| `habit_id` | `uuid` | Foreign key → `public.habits.id` |
| `log_date` | `date` | Tanggal centang (bukan timestamp) |
| `created_at` | `timestamptz` | Waktu record dibuat |

**Constraint:** `UNIQUE(habit_id, log_date)` — satu habit hanya bisa dicentang sekali per hari.  
**RLS Policy:** User hanya bisa mengakses log dari habit miliknya sendiri (via JOIN ke habits).

### 3.4 Relasi
```
USERS (1) ──────< HABITS (many)
                   HABITS (1) ──────< HABIT_LOGS (many)
```

---

## 4. Fitur & User Stories

### 4.1 Autentikasi

| ID | User Story | Prioritas |
|---|---|---|
| AUTH-01 | Sebagai pengguna baru, saya bisa daftar dengan email & password | P0 |
| AUTH-02 | Sebagai pengguna, saya bisa login dengan akun Google (OAuth) | P0 |
| AUTH-03 | Sebagai pengguna, saya bisa logout dari aplikasi | P0 |
| AUTH-04 | Sebagai pengguna, saya diarahkan ke dashboard setelah login berhasil | P0 |
| AUTH-05 | Sebagai pengguna yang belum login, saya diarahkan ke halaman login | P0 |

**Acceptance Criteria AUTH-02:**
- Tombol "Login dengan Google" tersedia di halaman login
- Setelah OAuth berhasil, profil Google (nama & foto) tersimpan di `public.users`
- Pengguna langsung masuk ke dashboard tanpa langkah tambahan

### 4.2 Manajemen Habit

| ID | User Story | Prioritas |
|---|---|---|
| HABIT-01 | Saya bisa membuat habit baru dengan nama, ikon, dan warna | P0 |
| HABIT-02 | Saya bisa melihat daftar semua habit aktif saya | P0 |
| HABIT-03 | Saya bisa mengedit nama, ikon, warna, dan deskripsi habit | P1 |
| HABIT-04 | Saya bisa mengarsipkan habit yang sudah tidak relevan | P1 |
| HABIT-05 | Habit yang diarsipkan tidak muncul di dashboard utama | P1 |
| HABIT-06 | Saya bisa melihat daftar habit yang sudah diarsipkan | P2 |

**Acceptance Criteria HABIT-01:**
- Form berisi field: Nama (wajib, maks 100 karakter), Deskripsi (opsional), Ikon (pilih dari preset atau emoji), Warna (color picker)
- Habit langsung muncul di dashboard setelah disimpan
- Validasi: nama tidak boleh kosong, tidak boleh duplikat dalam akun yang sama

### 4.3 Check-in Harian

| ID | User Story | Prioritas |
|---|---|---|
| LOG-01 | Saya bisa mencentang habit yang sudah dilakukan hari ini | P0 |
| LOG-02 | Saya bisa membatalkan centang habit hari ini | P0 |
| LOG-03 | Status centang hari ini langsung terlihat di dashboard | P0 |
| LOG-04 | Saya tidak bisa mencentang habit untuk tanggal yang sudah lewat dari dashboard | P1 |

**Acceptance Criteria LOG-01:**
- Checkbox / tombol toggle tersedia di setiap habit card di dashboard
- Perubahan status tersimpan ke Supabase secara real-time (optimistic update)
- Tidak ada halaman baru yang terbuka — semua dilakukan in-place

### 4.4 Streak & Statistik

| ID | User Story | Prioritas |
|---|---|---|
| STREAK-01 | Saya bisa melihat streak saat ini (berapa hari berturut-turut) untuk setiap habit | P0 |
| STREAK-02 | Streak reset ke 0 jika saya melewatkan satu hari | P0 |
| STREAK-03 | Saya bisa melihat streak terpanjang yang pernah dicapai | P1 |
| STREAK-04 | Saya bisa melihat total hari berhasil dari semua waktu | P1 |

**Logika Kalkulasi Streak:**
- Ambil semua log untuk habit tertentu, urutkan descending berdasarkan `log_date`
- Hitung berapa hari berturut-turut dari hari ini (atau kemarin) ke belakang tanpa gap
- Kalkulasi dilakukan di sisi aplikasi (Next.js) bukan database function, untuk MVP

### 4.5 Visualisasi Kalender

| ID | User Story | Prioritas |
|---|---|---|
| CAL-01 | Saya bisa melihat kalender heatmap untuk setiap habit | P0 |
| CAL-02 | Kalender menampilkan 12 bulan terakhir (GitHub-style) | P0 |
| CAL-03 | Hari yang sudah di-check ditampilkan dengan warna berbeda | P0 |
| CAL-04 | Saya bisa hover pada cell untuk melihat tanggal dan status | P1 |

**Acceptance Criteria CAL-01:**
- Tampilkan grid 52 minggu x 7 hari
- Warna cell: abu-abu (belum check-in), warna habit (sudah check-in)
- Label bulan tampil di atas grid
- Responsive: dapat di-scroll horizontal di mobile

---

## 5. Arsitektur Aplikasi

### 5.1 Struktur Folder Next.js 16
```
habit-tracker/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx          ← Protected layout (cek session)
│   │   ├── page.tsx            ← Dashboard utama
│   │   ├── habits/
│   │   │   ├── page.tsx        ← Kelola habit (list, arsip)
│   │   │   ├── new/
│   │   │   │   └── page.tsx    ← Form tambah habit
│   │   │   └── [id]/
│   │   │       ├── page.tsx    ← Detail & kalender habit
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   └── settings/
│   │       └── page.tsx        ← Profil & akun
│   ├── api/
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts    ← OAuth callback handler
│   └── layout.tsx              ← Root layout
├── components/
│   ├── ui/                     ← Komponen UI generik (Button, Input, Modal)
│   ├── habits/
│   │   ├── HabitCard.tsx
│   │   ├── HabitForm.tsx
│   │   └── HabitCalendar.tsx
│   └── dashboard/
│       └── TodayChecklist.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts           ← Supabase client-side
│   │   └── server.ts           ← Supabase server-side (SSR)
│   └── utils/
│       └── streak.ts           ← Logika kalkulasi streak
├── types/
│   └── database.ts             ← TypeScript types dari schema Supabase
└── middleware.ts               ← Route protection
```

### 5.2 Pola Data Fetching
- **Server Components** untuk data awal (dashboard, list habit) → SSR
- **Client Components** untuk interaksi real-time (check-in, form) → Supabase client
- **Optimistic Updates** untuk toggle check-in agar terasa cepat

---

## 6. Rencana Pengerjaan 7 Hari

### Hari 1 — Setup & Fondasi (Senin)
**Goal:** Project bisa dijalankan, auth berfungsi, database siap

- [ ] Inisialisasi project Next.js 16 + TypeScript + Tailwind CSS
- [ ] Setup project Supabase (new project, get API keys)
- [ ] Buat schema database: 3 tabel + trigger + RLS policies
- [ ] Setup Supabase client (client-side & server-side)
- [ ] Implementasi halaman Login (email/password + Google OAuth)
- [ ] Implementasi halaman Register
- [ ] Setup middleware untuk route protection
- [ ] Deploy ke Vercel (staging)

**Deliverable:** User bisa login dengan Google, session tersimpan, redirect ke dashboard

---

### Hari 2 — CRUD Habit (Selasa)
**Goal:** User bisa membuat, melihat, dan mengelola habit

- [ ] Buat layout dashboard (sidebar navigasi, header dengan profil user)
- [ ] Halaman daftar habit (`/habits`)
- [ ] Form tambah habit (`/habits/new`) dengan field: nama, deskripsi, ikon, warna
- [ ] Form edit habit (`/habits/[id]/edit`)
- [ ] Fitur arsip habit (soft delete dengan `is_archived`)
- [ ] Validasi form (client-side + server-side)

**Deliverable:** User bisa buat, lihat, edit, dan arsipkan habit

---

### Hari 3 — Dashboard & Check-in (Rabu)
**Goal:** Fungsionalitas utama — centang habit harian

- [ ] Dashboard utama: daftar habit hari ini dengan status check-in
- [ ] Komponen `HabitCard` dengan toggle checkbox
- [ ] Logika INSERT/DELETE ke `habit_logs` saat toggle
- [ ] Optimistic update agar UI responsif tanpa delay
- [ ] Tampilkan streak saat ini di setiap habit card
- [ ] Fungsi kalkulasi streak (`lib/utils/streak.ts`)

**Deliverable:** User bisa centang habit, melihat perubahan status real-time & streak

---

### Hari 4 — Kalender Heatmap (Kamis)
**Goal:** Visualisasi progress habit secara historis

- [ ] Komponen `HabitCalendar` (grid 52 minggu × 7 hari)
- [ ] Fetch semua log untuk habit tertentu
- [ ] Render cell dengan warna berdasarkan status check-in
- [ ] Label bulan di atas grid
- [ ] Tooltip saat hover (tanggal + status)
- [ ] Halaman detail habit (`/habits/[id]`) dengan kalender + statistik

**Deliverable:** Kalender heatmap per habit tampil dengan akurat

---

### Hari 5 — Statistik & Halaman Profil (Jumat)
**Goal:** Informasi tambahan untuk user

- [ ] Streak terpanjang (all-time best streak) per habit
- [ ] Total hari berhasil per habit
- [ ] Persentase keberhasilan bulan ini
- [ ] Halaman Settings/Profil (`/settings`): tampilkan nama, foto, email
- [ ] Opsi: edit nama profil
- [ ] Opsi: logout

**Deliverable:** Statistik per habit lengkap, halaman profil berfungsi

---

### Hari 6 — Polish & UX (Sabtu)
**Goal:** Aplikasi terasa profesional dan enak digunakan

- [ ] Loading states (skeleton loader untuk habit cards & kalender)
- [ ] Empty states (ilustrasi/teks saat belum ada habit)
- [ ] Error handling dan toast notification (sukses/gagal)
- [ ] Responsive design: pastikan tampil baik di mobile
- [ ] Animasi/transisi halus saat toggle check-in
- [ ] Favicon dan meta tags (Open Graph)
- [ ] Audit RLS: pastikan semua endpoint aman

**Deliverable:** UX halus, tidak ada broken state, mobile-friendly

---

### Hari 7 — Testing & Deployment (Minggu)
**Goal:** Produk siap digunakan oleh user nyata

- [ ] End-to-end testing manual semua user flows
- [ ] Cek edge cases: habit baru tanpa log, streak hari pertama, arsip & unarchive
- [ ] Fix bug yang ditemukan
- [ ] Konfigurasi environment variables production di Vercel
- [ ] Set custom domain (opsional)
- [ ] Setup Supabase RLS final audit
- [ ] Soft launch: share ke 3–5 orang untuk beta testing

**Deliverable:** Aplikasi live di production, siap digunakan

---

## 7. Desain & UI/UX Guidelines

### 7.1 Design System
- **Font:** Inter (Google Fonts)
- **Warna Utama:** Indigo (#6366f1) untuk aksi utama
- **Warna Netral:** Zinc (Tailwind scale)
- **Radius:** `rounded-xl` untuk card, `rounded-full` untuk tombol aksi
- **Shadow:** `shadow-sm` untuk card, `shadow-md` untuk modal

### 7.2 Komponen Utama
| Komponen | Deskripsi |
|---|---|
| `HabitCard` | Card dengan nama habit, ikon, warna, streak badge, dan toggle checkbox |
| `HabitCalendar` | Grid heatmap 52×7, warna dari properti `color` habit |
| `StreakBadge` | Badge kecil menampilkan 🔥 + jumlah hari streak |
| `HabitForm` | Form modal atau halaman untuk buat/edit habit |
| `EmptyState` | Ilustrasi + CTA untuk user yang belum punya habit |

### 7.3 Halaman & Navigasi
```
/ (redirect ke /login atau /dashboard)
/login
/register
/dashboard          ← Halaman utama: semua habit hari ini
/habits             ← Kelola semua habit
/habits/new
/habits/[id]        ← Detail + kalender + statistik
/habits/[id]/edit
/settings           ← Profil user
```

---

## 8. Keamanan

### 8.1 Row Level Security (RLS)
Semua tabel mengaktifkan RLS. Policy yang diterapkan:

**`public.users`**
- `SELECT`: hanya bisa baca profil sendiri
- `UPDATE`: hanya bisa update profil sendiri

**`public.habits`**
- `SELECT`, `INSERT`, `UPDATE`, `DELETE`: hanya untuk `user_id = auth.uid()`

**`public.habit_logs`**
- Akses via habit yang dimiliki user (`habit_id IN (SELECT id FROM habits WHERE user_id = auth.uid())`)

### 8.2 Keamanan Lainnya
- Environment variables tidak pernah di-expose ke client selain `NEXT_PUBLIC_*`
- Supabase `anon` key hanya digunakan client-side; operasi sensitif pakai `service_role` di server
- Middleware Next.js memblokir semua route protected jika session tidak valid

---

## 9. Definisi Selesai (Definition of Done)

Sebuah fitur dianggap selesai apabila:
1. Fungsionalitas sesuai acceptance criteria di atas
2. Tidak ada error di console browser atau terminal
3. RLS sudah diverifikasi (user A tidak bisa akses data user B)
4. Tampil dengan benar di desktop (1280px) dan mobile (375px)
5. Loading state dan empty state ditangani
6. Ter-deploy di Vercel staging dan tidak crash

---

## 10. Risiko & Mitigasi

| Risiko | Kemungkinan | Dampak | Mitigasi |
|---|---|---|---|
| Kalkulasi streak kompleks | Medium | High | Buat unit test untuk fungsi streak, handle edge case (hari pertama, skip hari) |
| RLS policy bocor | Low | Critical | Test dengan 2 akun berbeda sebelum launch |
| Google OAuth callback error | Medium | High | Pastikan redirect URL dikonfigurasi di Supabase & Google Console |
| Performa kalender lambat (banyak log) | Low | Medium | Limit query ke 365 hari terakhir saja |
| Waktu melebihi 7 hari | High | Medium | Prioritaskan P0 dulu, P1/P2 bisa setelah launch |

---

## 11. Metrik Keberhasilan (Post-Launch)

Dalam 2 minggu setelah soft launch, target:
- Minimal 10 pengguna aktif yang login setidaknya 3 kali
- Minimal 30 habit dibuat
- Tidak ada bug critical (data loss, tidak bisa login)
- Rata-rata session duration > 2 menit

---

*Dokumen ini adalah living document — akan diperbarui seiring progres pengerjaan.*  
*Dibuat: 26 Juni 2026 | Pemilik: Tim Pengembang HabitTracker*
