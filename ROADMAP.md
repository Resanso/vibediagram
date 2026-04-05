# VibeDiagram Roadmap & Next Steps

Dokumen ini berisi rencana fase pengembangan untuk VibeDiagram. 

**Prinsip Utama Proyek:** Pastikan mesin utama (Parser, Layout Engine, & React Flow) 100% solid, memiliki UX yang mulus (*Two-Way Binding*), dan tahan banting terhadap error (*Graceful Degradation*) **sebelum** mengintegrasikan API LLM (AI) apa pun.

---

## ✅ Phase 1: Core Engine & Custom Elements (COMPLETED)
**Status:** Selesai
**Pencapaian:**
- Parser dan Dagre Layout Engine berhasil memetakan struktur Node, Edge, dan Group.
- Implementasi `CustomNode`, `GroupNode`, dan `CustomEdge` dengan Tailwind CSS.
- Fitur *Specific Export to PNG* menggunakan `html-to-image` dengan kalkulasi *bounding box* manual yang presisi.
- Fitur *Layout Toggle* (Top-Bottom / Left-Right).

---

## ✅ Phase 2: Fully Editable Canvas (COMPLETED)
**Status:** Selesai
**Pencapaian:**
- Implementasi *Two-Way Data Binding* (Kanvas <-> DSL).
- *Inline text editing* pada Node dan Edge.
- Kemampuan menarik garis (Edge) secara manual dan sinkronisasi dengan teks DSL.
- *Node Resizer* untuk memperbesar/memperkecil kotak Grup.
- Sinkronisasi event `Delete/Backspace` pada elemen kanvas ke DSL.

---

## 🟡 Phase 3: UX Stability & Live Preview (CURRENT WIP)
**Status:** Sedang Berjalan (Tahap Penyempurnaan)
**Tujuan:** Memastikan pengeditan teks dan kanvas berjalan sangat mulus tanpa *lag*, tanpa *crash*, dan tanpa *infinite loop*.
**Task yang Sedang/Akan Dikerjakan:**
- **Auto-Render (Debouncing):** Menghapus tombol render manual, menggantinya dengan `setTimeout` debounce agar diagram ter-update otomatis saat user mengetik teks DSL.
- **Graceful Error Handling:** Menggunakan `try-catch` di proses parsing agar kanvas tidak *crash* (layar putih) saat user mengetik sintaks yang belum lengkap. Menampilkan pesan error UI yang elegan.
- **Visual Cues:** Memberikan indikator "Auto-saved" atau "Syntax Error" di bawah kotak teks DSL.

---

## ⏳ Phase 4: AI Prompt Integration (NEXT UP)
**Status:** Menunggu Phase 3 stabil 100%.
**Tujuan:** Mengubah VibeDiagram menjadi *AI-Powered Diagram Generator*.
**Rencana Implementasi:**
- Pembuatan komponen UI `PromptInput` untuk menerima deskripsi natural user (misal: "Buatkan arsitektur e-commerce aws").
- Integrasi ke API LLM (OpenAI / Gemini) menggunakan Vercel AI SDK.
- Pembuatan *System Prompt* ketat yang memaksa AI merespons HANYA dengan sintaks Custom DSL VibeDiagram.
- Mengalirkan respons AI (*streaming*) langsung ke kotak teks DSL agar kanvas ter-render secara *real-time* saat AI sedang mengetik.

---

## 🛠️ Template Testing (Untuk Pengujian Manual)
Gunakan template berikut untuk menguji ketahanan *parser* dan *layout* saat mengembangkan Phase 3:

```text
Group Sistem Utama {
  Web Interface [monitor]
  API Gateway [shield]
}
Backend [server]
Database [database]

Web Interface -> API Gateway : HTTPS
API Gateway -> Backend : Routing
Backend -> Database : Query Data