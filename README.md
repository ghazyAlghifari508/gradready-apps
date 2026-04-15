# GradReady 🚀

**GradReady** adalah platform persiapan karir komprehensif yang dirancang untuk membantu mahasiswa dan *fresh graduate* dalam menavigasi perjalanan dari dunia akademik ke dunia profesional. Dengan menggunakan teknologi AI, GradReady memberikan berbagai insight dan panduan interaktif guna memaksimalkan potensi setiap penggunanya.

## Fitur Utama

- 📄 **CV Analyzer**: Analisis CV cerdas berbasis AI yang memberikan skor dan saran perbaikan komprehensif agar ATS-friendly.
- 🎯 **Roadmap Generator**: Pembuatan *roadmap* karir dan tahapan belajar yang dikhususkan berdasarkan minat serta posisi pekerjaan sasaran.
- 💡 **Skill Gap Analysis**: Mengidentifikasi kesenjangan keterampilan antara kemampuan pengguna saat ini dengan kualifikasi pekerjaan yang diinginkan.
- 🎤 **Mock Interview**: Sesi latihan wawancara komprehensif yang didukung oleh teknologi pengenalan suara dan AI untuk menjamin kelancaran *interview* sungguhan.
- 📝 **Document Builder**: Generator cerdas yang membantu merumuskan *Cover Letter*, *Motivation Letter*, kerangka *Portfolio*, serta narasi *Self Introduction*.
- 📊 **Dashboard & Market Insights**: Dasbor pengguna yang dapat memantau *progress* atau tren pasar kerja berbasis data saat ini.
- 🛡️ **Role-Based Access**: Dilengkapi panel admin khusus yang dapat mengatur *resources* pekerjaan, parameter skor, serta memantau analisis pengguna secara umum!

## Teknologi yang Digunakan

Proyek ini dibangun menggunakan *modern web stack* untuk memastikan performa yang cepat dan antarmuka yang sangat menarik (*gamified* bergaya Duolingo):

- **Framework**: [Next.js 15](https://nextjs.org/) (App Directory)
- **Styling**: Vanilla CSS (*Modules*)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **AI Integration**: AI Provider for Smart Analytics
- **Icons**: [Lucide React](https://lucide.dev/)

## Cara Memulai (Development)

1. Clone repositori ini dan masuk ke dalam folder proyek.
2. Install semua *dependencies*:
   ```bash
   npm install
   ```
3. Konfigurasi kredensial environment (seperti `.env`) dan jalankan migrasi database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
4. Jalankan *development server*:
   ```bash
   npm run dev
   ```
5. Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya!

---
*Siapkan dirimu. Taklukkan masa depan.* **GradReady!**
