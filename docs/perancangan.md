# Perancangan Sistem Manajemen Sarana dan Prasarana (Asset Management)

**Mata Kuliah:** Pemrograman Web 2 (Client-Side Programming)  
**Tugas:** Milestone 1 (Project-Based Learning)  
**Nama Mahasiswa:** [Agus Shuherman]  
**NIM:** [231011402716]  
**No. Presensi:** 2

---

## 1. Hirarki Navigation Menu (Sidebar / Navbar)

- 📊 **Dashboard**

  - Summary Card (Total Aset, Kondisi Baik, Perlu Maintenance, Dipinjam)
  - Grafik Kondisi & Peminjaman Aset
  - Activity Log / Aktivitas Terbaru

- 📦 **Data Master Aset**

  - Daftar Inventaris Barang/Sarana
  - Kategori & Spesifikasi
  - Lokasi / Ruangan Asset

- 📝 **Kelola Aset & Peminjaman**

  - Form Input Aset Baru
  - Form Edit / Update Kondisi
  - Pengajuan & Status Peminjaman

- 🖨️ **Laporan & Rekapitulasi**
  - Laporan Asset Maintenance
  - Cetak Rekapitulasi Sarana Prasarana

---

## 2. Conceptual Database / ER-D (Mermaid.js)

```mermaid
erDiagram
    KATEGORI ||--o{ ASET : "mempunyai"
    LOKASI ||--o{ ASET : "ditempatkan_di"
    ASET ||--o{ PEMINJAMAN : "dipinjam_dalam"

    KATEGORI {
        int id_kategori PK
        string nama_kategori
    }

    LOKASI {
        int id_lokasi PK
        string nama_ruangan
        string gedung
    }

    ASET {
        string kode_aset PK
        string nama_barang
        int id_kategori FK
        int id_lokasi FK
        string kondisi
        int jumlah
    }

    PEMINJAMAN {
        int id_pinjam PK
        string kode_aset FK
        string nama_peminjam
        date tgl_pinjam
        date tgl_kembali
        string status
    }
```
2. Link Figma
https://www.figma.com/design/jNnscKeUEmwbXRBYmQmzXD/Untitled?node-id=0-1&t=7OtVz41rUDcwAnkH-1
