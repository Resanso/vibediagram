# Project Context: Custom Diagram-as-Code Engine

## 1. Project Overview
Aplikasi ini adalah sebuah web-based *Diagram-as-Code* (DaC) generator dengan arsitektur **Pluggable Architecture**. Sistem akan menerima input teks dengan sintaks modular, lalu merendernya ke berbagai jenis mesin diagram yang didukung, sehingga sangat _scalable_ untuk berbagai kasus standar UML maupun Cloud Architecture.

## 2. Pluggable Architecture & Engines
Aplikasi ini beroperasi sebagai *Container* yang dapat memuat bermacam-macam mesin *rendering*:
1. **Vibe Engine (Architecture):** Menggunakan `@xyflow/react` (React Flow) yang dipadukan dengan Auto-Layout Dagre. Dioptimalkan untuk menggambar topologi arsitektur infrastruktur IT berbantuan DSL kustom yang intuitif.
2. **Mermaid Engine:** Secara mulus mem-parsing formasi DSL `mermaid.js` untuk merender Sequence Diagram, Entity Relationship Diagram (ERD), Activity diagram, dll.

## 3. Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Diagram Renderer:** `@xyflow/react` (React Flow)
- **Auto-Layout Engine:** `dagre` (untuk menghitung posisi X dan Y secara hirarkis)
- **Language:** JavaScript/TypeScript (pilih salah satu sesuai inisialisasi awal proyek)

## 4. Architecture & Data Flow
Aplikasi menggunakan pola alur data linear:
`Text Input (DSL)` -> `Parser Function` -> `Dagre Layout Engine` -> `React Flow Canvas`

**Detail Komponen:**
1. **Editor UI:** Kolom teks (textarea) di sisi kiri layar tempat pengguna mengetik DSL.
2. **Parser (utils/parser.js):** Fungsi murni (*pure function*) yang memecah string baris per baris. Mengubah teks DSL menjadi array `nodes` dan `edges` dasar.
3. **Layout Engine (utils/layout.js):** Fungsi yang menerima array dari Parser, lalu menggunakan algoritma `dagre` (graph `TB` / Top to Bottom atau `LR` / Left to Right) untuk menyisipkan koordinat `position: {x, y}` ke setiap node.
4. **Canvas UI:** Komponen React Flow atau Mermaid Renderer di sisi kanan layar yang menerima data akhir dan merendernya secara kondisional.

## 5. Custom DSL Syntax Specification
Parser harus dirancang untuk membaca aturan sintaks berikut:

### Aturan Dasar
- Mengabaikan baris kosong.
- Mengabaikan spasi berlebih di awal/akhir string.

### A. Nodes (Kotak/Elemen)
Format: `Nama Node [opsional_ikon]`
Contoh: 
Client App [smartphone]
Database [database]

Output JSON React Flow yang diharapkan:
{ id: "Client App", data: { label: "Client App", icon: "smartphone" }, position: { x: 0, y: 0 } }

### B. Edges (Garis Penghubung)
Format: `SourceNode -> TargetNode` (Bisa ditambahkan label dengan titik dua `: label`)
Contoh:
Client App -> API Gateway
API Gateway -> Database : Mengambil data

Output JSON React Flow yang diharapkan:
{ id: "Client App-API Gateway", source: "Client App", target: "API Gateway", label: "Mengambil data" }

## 6. Rules for AI Copilot
Saat membantu menulis kode untuk proyek ini, AI Copilot WAJIB mematuhi aturan berikut:
1. **Gunakan @xyflow/react:** Jangan gunakan versi lama (`reactflow` atau `react-flow-renderer`).
2. **Jangan Hitung Koordinat:** AI tidak boleh mencoba menghitung posisi `x` dan `y` secara manual di dalam Parser. Serahkan semua perhitungan posisi pada fungsi Layout (`dagre`).
3. **Fokus pada Regex Sederhana & String Split:** Di dalam Parser, gunakan metode bawaan seperti `line.split('->')` atau regex ringan. Jangan membuat parser AST yang *over-engineered*.
4. **Client Components:** Karena menggunakan Next.js App Router dan hooks React Flow, pastikan file komponen UI memiliki direktif `"use client";` di baris paling atas.
5. **Kerapian:** Pastikan tinggi editor dan canvas mengambil layar penuh (`h-screen`) dan menggunakan tata letak Tailwind yang responsif (`flex` atau `grid`).