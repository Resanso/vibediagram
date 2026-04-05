# VibeDiagram Roadmap & Next Steps

Dokumen ini berisi rencana fase pengembangan untuk VibeDiagram. 

**Prinsip Utama Proyek:** Pastikan mesin utama (Parser, Layout Engine, & React Flow) 100% solid dan dapat dirender dengan sempurna melalui pengujian manual (teks *hardcoded*) **sebelum** mengintegrasikan prompt AI apa pun.

---

## Phase 0: Core Engine Validation & Template Testing
**Status:** Sedang Berjalan (WIP)
**Tujuan:** Memastikan `parser.ts` dan `layout.ts` dapat menangani berbagai bentuk topologi diagram tanpa *error* sebelum AI mulai diizinkan men-generate teks.

Gunakan *template* berikut untuk diuji secara manual ke dalam `<textarea>`:

### Template 1: Linear Flow (Alur Lurus)
```text
User [user]
Web Interface [monitor]
Backend API [server]
Database [database]

User -> Web Interface : Mengakses web
Web Interface -> Backend API : HTTP Request
Backend API -> Database : Query Data