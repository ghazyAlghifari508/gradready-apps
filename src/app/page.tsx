import React from "react";
import Link from "next/link";
/* eslint-disable @next/next/no-img-element */
import Button from "@/components/ui/Button";
import { FileText, Target, Rocket, FileEdit, BarChart, Star, Lock, Bot, Camera, MessageCircle, Briefcase } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-['Nunito',sans-serif] text-gray-700 overflow-x-clip">
      <style>{`
        html {
          scroll-behavior: smooth;
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }

        @keyframes float1 {
          0%, 100% { transform: translateY(0) rotate(-10deg); }
          50% { transform: translateY(-20px) rotate(-5deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0) rotate(10deg); }
          50% { transform: translateY(-15px) rotate(15deg); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-25px) rotate(-10deg); }
        }
        @keyframes float4 {
          0%, 100% { transform: translateY(0) rotate(15deg); }
          50% { transform: translateY(-20px) rotate(20deg); }
        }
        .animate-float-1 { animation: float1 6s ease-in-out infinite; }
        .animate-float-2 { animation: float2 5s ease-in-out infinite; }
        .animate-float-3 { animation: float3 7s ease-in-out infinite; }
        .animate-float-4 { animation: float4 6.5s ease-in-out infinite; }
      `}</style>

      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span className="font-['Fredoka_One'] font-bold text-2xl text-[#58CC02] tracking-wide">
            gradready
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="font-bold text-gray-400 hover:text-gray-700 transition-colors"
          >
            Fitur
          </Link>
          <Link
            href="#how-it-works"
            className="font-bold text-gray-400 hover:text-gray-700 transition-colors"
          >
            Cara Kerja
          </Link>
          <Link
            href="#about"
            className="font-bold text-gray-400 hover:text-gray-700 transition-colors"
          >
            Tentang
          </Link>
          <Link
            href="#faq"
            className="font-bold text-gray-400 hover:text-gray-700 transition-colors"
          >
            FAQ
          </Link>
        </nav>
        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="font-bold text-gray-700 hidden md:block hover:text-[#58CC02] transition-colors"
          >
            Login
          </Link>
          <Link href="/register" className="no-underline">
            <Button variant="primary" className="!rounded-2xl">
              Daftar
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative">
        <div className="max-w-3xl mx-auto text-center relative z-10 pt-10">
          <h1 className="font-['Fredoka_One'] text-5xl md:text-7xl leading-[1.1] mb-6 text-gray-800">
            Langkah terbaik untuk <br />
            <span className="text-[#58CC02] inline-block rotate-[-2deg]">
              analisis CV
            </span>{" "}
            dan{" "}
            <span className="text-yellow-400 inline-block rotate-[2deg]">
              karir
            </span>
            <br />
            masa depanmu!
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-xl mx-auto font-bold px-4">
            Platform berbasis AI untuk membantumu mengevaluasi CV, menemukan
            skill gap, dan bersiap mendapatkan pekerjaan impian.
          </p>
          <Button variant="primary" className="!rounded-2xl text-lg px-8 py-3">
            Mulai Sekarang ↗
          </Button>
        </div>

        {/* Floating images from public/hero */}
        <div className="hidden lg:block absolute top-[10%] left-[8%] w-32 animate-float-1 z-0">
          <img
            src="/hero/foto1.png"
            alt="GradReady User 1"
            className="w-full h-auto object-contain drop-shadow-xl"
          />
        </div>
        <div className="hidden lg:block absolute top-[25%] right-[10%] w-28 animate-float-2 z-0">
          <img
            src="/hero/foto2.png"
            alt="GradReady User 2"
            className="w-full h-auto object-contain drop-shadow-xl"
          />
        </div>
        <div className="hidden lg:block absolute bottom-[5%] right-[15%] w-36 animate-float-3 z-0">
          <img
            src="/hero/foto3.png"
            alt="GradReady User 3"
            className="w-full h-auto object-contain drop-shadow-xl"
          />
        </div>
        <div className="hidden lg:block absolute bottom-[10%] left-[20%] w-32 animate-float-4 z-0">
          <img
            src="/hero/foto4.png"
            alt="GradReady User 4"
            className="w-full h-auto object-contain drop-shadow-xl"
          />
        </div>
      </section>

      {/* Marquee Section */}
      <section className="border-y-4 border-gray-100 bg-gray-50 py-6 overflow-hidden flex">
        <div className="flex animate-marquee min-w-full items-center px-10 gap-20">
          {['GOJEK', 'TOKOPEDIA', 'SHOPEE', 'TRAVELOKA', 'RUANGGURU', 'TIKET.COM', 'MANDIRI', 'BCA'].map((company, idx) => (
             <span key={idx} className="font-['Fredoka_One'] text-gray-300 text-2xl tracking-wider select-none shrink-0">{company}</span>
          ))}
        </div>
        <div className="flex animate-marquee min-w-full items-center px-10 gap-20" aria-hidden="true">
          {['GOJEK', 'TOKOPEDIA', 'SHOPEE', 'TRAVELOKA', 'RUANGGURU', 'TIKET.COM', 'MANDIRI', 'BCA'].map((company, idx) => (
             <span key={idx} className="font-['Fredoka_One'] text-gray-300 text-2xl tracking-wider select-none shrink-0">{company}</span>
          ))}
        </div>
      </section>

      {/* Interactive Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 relative">
        <h2 className="font-['Fredoka_One'] text-4xl md:text-5xl mb-4 max-w-md text-gray-800">
          Fitur <span className="text-[#58CC02] italic">unggulan</span>{" "}
          kami
        </h2>

        {/* Floating tags */}
        <div className="absolute top-[10%] right-[10%] hidden lg:flex flex-col gap-3">
          <span className="bg-[#e6fcd2] text-[#4BB200] font-bold px-5 py-2 rounded-2xl rotate-[-5deg] border-2 border-[#c0f590] shadow-[0_4px_0_#c0f590]">
            #freshgrad
          </span>
          <span className="bg-yellow-300 text-yellow-800 font-bold px-5 py-2 rounded-2xl rotate-[5deg] border-2 border-yellow-400 shadow-[0_4px_0_#FACC15] self-end">
            #career
          </span>
          <span className="bg-[#58CC02] text-white font-bold px-5 py-2 rounded-2xl rotate-[-2deg] border-2 border-[#4BB200] shadow-[0_4px_0_#4BB200] self-center">
            #ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 lg:mt-24">
          {/* Card 1 */}
          <div className="bg-[#e6fcd2] border-2 border-[#c0f590] border-b-[8px] rounded-[32px] p-8 relative overflow-hidden flex flex-col justify-between aspect-square hover:-translate-y-2 transition-transform">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 border-2 border-[#c0f590] shadow-[0_4px_0_#c0f590]">
              <FileText size={32} className="text-[#58CC02]" />
            </div>
            <div>
              <h3 className="font-['Fredoka_One'] text-3xl mb-3 text-gray-800">
                Analisis <br />
                CV AI
              </h3>
              <p className="text-[#4BB200] font-bold">
                Unggah CV kamu dan biarkan AI kami memberikan penilaian akurat dan saran perbaikan!
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#58CC02] border-2 border-[#4BB200] border-b-[8px] rounded-[32px] p-8 relative overflow-hidden flex flex-col justify-between aspect-square text-white lg:scale-105 z-10 lg:-translate-y-8 hover:-translate-y-10 transition-transform">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-6 border-2 border-white/30">
              <Target size={32} className="text-white" />
            </div>
            <div>
              <h3 className="font-['Fredoka_One'] text-3xl mb-3">
                Deteksi <br />
                Skill Gap
              </h3>
              <p className="text-white font-bold">
                Ketahui skill apa yang belum kamu miliki untuk posisi impian di perusahaan ternama.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-yellow-400 border-2 border-yellow-500 border-b-[8px] rounded-[32px] p-8 relative overflow-hidden flex flex-col justify-between aspect-square hover:-translate-y-2 transition-transform">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 border-2 border-yellow-200 shadow-[0_4px_0_#FDE047]">
              <Rocket size={32} className="text-yellow-500" />
            </div>
            <div>
              <h3 className="font-['Fredoka_One'] text-3xl mb-3 text-gray-800">
                Roadmap <br />
                Karir
              </h3>
              <p className="text-yellow-900 font-bold">
                Dapatkan rekomendasi jalur belajar yang personal untuk meningkatkan peluang kerjamu!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enjoyable material section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-16 overflow-hidden">
        <div className="flex-1">
          <h2 className="font-['Fredoka_One'] text-4xl md:text-5xl leading-tight mb-6 text-gray-800">
            Persiapan dunia profesi yang{" "}
            <span className="text-[#58CC02] border-4 border-[#58CC02] rounded-[32px] px-6 py-1 rotate-[-2deg] inline-block bg-[#f2ffe0]">
              efektif
            </span>{" "}
            untuk pemula
          </h2>
          <p className="text-gray-500 font-bold mb-10 max-w-md text-lg">
            Jangan khawatir! Meskipun belum banyak pengalaman, kami siap mengarahkanmu langkah demi langkah agar lolos screening otomatis ATS HRD.
          </p>
          <Button variant="secondary" className="!rounded-2xl">
            Lihat Cara Kerja
          </Button>
        </div>
        <div className="flex-1 relative min-h-[400px] w-full">
          <div className="absolute top-[0%] right-[10%] md:right-[20%] w-32 md:w-40 h-32 md:h-40 rounded-full overflow-hidden border-[6px] border-white shadow-xl z-20 bg-green-100 flex items-center justify-center">
             <FileEdit size={48} className="text-[#58CC02]" />
          </div>
          <div className="absolute top-[20%] right-[30%] md:right-[40%] w-48 md:w-64 h-32 md:h-40 bg-[#b8f57c] rounded-[32px] rotate-[-10deg] z-10 border-[6px] border-white shadow-xl flex items-center justify-center overflow-hidden">
             <BarChart size={64} className="text-[#4BB200] relative z-20" />
          </div>
          <div className="absolute bottom-[10%] right-[5%] w-48 md:w-64 h-20 md:h-24 bg-yellow-400 rounded-full border-[6px] border-white shadow-xl z-30 flex items-center justify-center">
              <span className="text-4xl text-white font-['Fredoka_One']">ATS Friendly</span>
          </div>
        </div>
      </section>

      {/* NEW Section 1: Statistics */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-white border-2 border-gray-200 border-b-[8px] rounded-[32px] p-8 text-center hover:-translate-y-1 transition-transform">
             <h3 className="font-['Fredoka_One'] text-5xl text-[#1CB0F6] mb-2">10K+</h3>
             <p className="font-bold text-gray-400 uppercase tracking-wide">Mahasiswa Bergabung</p>
           </div>
           <div className="bg-white border-2 border-gray-200 border-b-[8px] rounded-[32px] p-8 text-center hover:-translate-y-1 transition-transform">
             <h3 className="font-['Fredoka_One'] text-5xl text-[#FF4B4B] mb-2">50+</h3>
             <p className="font-bold text-gray-400 uppercase tracking-wide">Universitas Mitra</p>
           </div>
           <div className="bg-white border-2 border-gray-200 border-b-[8px] rounded-[32px] p-8 text-center hover:-translate-y-1 transition-transform">
             <h3 className="font-['Fredoka_One'] text-5xl text-[#FFC800] mb-2">95%</h3>
             <p className="font-bold text-gray-400 uppercase tracking-wide">Tingkat Kepuasan</p>
           </div>
        </div>
      </section>

      {/* Target Section 2, 3, 4 Wrapper for Stacking Effect */}
      <div className="relative w-full">
      {/* Target Section 2: Structured Learning Path */}
      <section className="max-w-7xl mx-4 xl:mx-auto bg-[#1CB0F6] py-24 px-6 border-b-[12px] border-[#1899D6] rounded-[48px] my-10 text-white relative overflow-hidden sticky top-8 z-10 transition-transform">
        {/* Decor */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="flex-1">
            <h2 className="font-['Fredoka_One'] text-4xl md:text-5xl mb-6 leading-tight">Ikuti panduan <br/> langkah demi langkah!</h2>
            <p className="font-bold text-blue-100 text-lg md:text-xl mb-10 max-w-md">
              Mulai dari evaluasi CV, melihat rekomendasi karir, hingga simulasi wawancara. Ikuti roadmap komprehensif ini untuk mempersiapkan dirimu menjadi kandidat terbaik!
            </p>
            <button className="bg-white text-[#1CB0F6] font-bold px-8 py-4 rounded-2xl border-b-4 border-blue-200 hover:bg-gray-50 active:border-b-0 active:translate-y-1 transition-all text-lg">
              Mulai Persiapan Karir
            </button>
          </div>
          <div className="flex-1 flex justify-center relative min-h-[300px] w-full">
            {/* Mock Path Elements */}
            <div className="absolute top-[10%] left-[20%] w-24 h-24 bg-yellow-400 rounded-full border-4 border-yellow-200 shadow-[0_8px_0_#ca8a04] z-20 flex items-center justify-center transform hover:-translate-y-2 transition-all cursor-pointer">
              <Star size={40} className="text-white fill-white" />
            </div>
            
            <div className="absolute top-[40%] right-[30%] w-20 h-20 bg-[#58CC02] rounded-full border-4 border-[#c0f590] shadow-[0_6px_0_#4BB200] z-20 flex items-center justify-center transform hover:-translate-y-2 transition-all cursor-pointer">
               <span className="text-3xl text-white font-['Fredoka_One']">1</span>
            </div>

            <div className="absolute bottom-[10%] left-[40%] w-20 h-20 bg-gray-300 rounded-full border-4 border-gray-100 shadow-[0_6px_0_#9ca3af] z-10 flex items-center justify-center cursor-not-allowed">
              <Lock size={32} className="text-gray-500" />
            </div>

            {/* Connecting paths */}
            <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{ filter: "drop-shadow(0 4px 0 rgba(0,0,0,0.1))" }}>
              <path d="M 120 80 Q 250 150 280 180" fill="none" stroke="white" strokeWidth="16" strokeLinecap="round" strokeDasharray="1 30" />
              <path d="M 280 200 Q 250 280 200 280" fill="none" stroke="white" strokeWidth="16" strokeLinecap="round" strokeDasharray="1 30" opacity="0.5" />
            </svg>
          </div>
        </div>
      </section>

      {/* NEW Section 3: AI Mock Interview */}
      <section className="max-w-7xl mx-4 xl:mx-auto bg-[#FF4B4B] py-24 px-6 border-b-[12px] border-[#D33131] rounded-[48px] my-10 text-white text-center sticky top-16 z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] transition-transform">
         <h2 className="font-['Fredoka_One'] text-4xl md:text-5xl mb-6">Takut Wawancara Kerja?</h2>
         <p className="max-w-2xl mx-auto font-bold text-red-100 text-lg mb-12">
            Latih skill bicaramu dengan bot AI kami yang dirancang seperti rekuter sungguhan. Dapatkan feedback instan mengenai nada suara, kejelasan, dan kepercayaan dirimu.
         </p>
         
         <div className="max-w-xl mx-auto flex flex-col gap-6 relative">
            <div className="bg-white rounded-[32px] p-6 border-b-[8px] border-red-200 text-left flex gap-6 items-start shadow-xl transform -rotate-1">
                <div className="w-16 h-16 shrink-0 bg-[#58CC02] rounded-2xl border-4 border-[#c0f590] flex items-center justify-center">
                  <Bot size={32} className="text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl p-5 flex-1 rounded-tl-none border-2 border-gray-200">
                  <p className="text-gray-600 font-bold text-lg leading-snug">&quot;Coba ceritakan tentang pengalaman proyek terbesarmu saat di bangku kuliah!&quot;</p>
                </div>
            </div>

            <div className="bg-white/20 backdrop-blur rounded-[32px] p-6 text-left flex flex-row-reverse gap-6 items-start transform rotate-1 border-2 border-white/30">
                <div className="w-16 h-16 shrink-0 bg-yellow-400 rounded-full border-4 border-yellow-200 flex items-center justify-center overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="User" />
                </div>
                <div className="bg-white rounded-2xl p-5 flex-1 rounded-tr-none border-b-[6px] border-gray-200">
                  <p className="text-gray-700 font-bold text-lg leading-snug">&quot;Tentu. Saat semester 5, saya memimpin tim beranggotakan 4 orang untuk...&quot;</p>
                  <div className="mt-3 flex items-center gap-2">
                     <span className="inline-block w-4 h-4 rounded-full bg-green-400 animate-pulse"></span>
                     <span className="text-sm font-bold text-gray-400">Menganalisis nada suara...</span>
                  </div>
                </div>
            </div>
         </div>
      </section>

      {/* Future roles Section */}
      <section className="max-w-7xl mx-4 xl:mx-auto bg-[#58CC02] text-white rounded-[48px] my-10 py-24 px-6 relative overflow-hidden border-b-[12px] border-[#4BB200] sticky top-24 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] transition-transform">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full border-4 border-yellow-300 opacity-50 blur-[2px]"></div>

        <div className="max-w-4xl mx-auto text-center mb-20 relative z-10">
          <h2 className="font-['Fredoka_One'] text-4xl md:text-5xl leading-tight">
            Tujuan kami membantu lulusan menembus <br className="hidden md:block" />
            <span className="text-yellow-400 italic">
              berbagai profesi impian
            </span>
            <br className="hidden md:block" />
            di industri teknologi masa kini.
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-12 md:gap-8 relative z-10">
          {[
            {
              name: "Software Engineer",
              role: "Banyak Dicari",
              bg: "bg-yellow-400",
              img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
            },
            {
              name: "Data Analyst",
              role: "Gaji Tinggi",
              bg: "bg-[#8AE82C]",
              img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
            },
            {
              name: "UI/UX Designer",
              role: "Kreatif & Kritis",
              bg: "bg-[#1CB0F6]",
              img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop",
            },
            {
              name: "Product Manager",
              role: "Karir Melaju",
              bg: "bg-[#4BB200]",
              img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
            },
          ].map((t, i) => (
            <div key={i} className="text-center group flex flex-col items-center">
              <div
                className={`w-36 h-36 md:w-44 md:h-44 rounded-full border-[6px] border-white shadow-xl overflow-hidden mb-6 ${t.bg} transform transition-transform group-hover:scale-110 group-hover:rotate-3 relative`}
              >
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:opacity-100 group-hover:mix-blend-normal transition-all"
                />
              </div>
              <h4 className="font-['Fredoka_One'] text-xl mb-1">{t.name}</h4>
              <p className="text-[#e6fcd2] text-sm font-bold uppercase tracking-wider">
                {t.role}
              </p>
            </div>
          ))}
        </div>
      </section>
      </div>

      {/* About Section */}
      <section id="about" className="max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1">
          <h2 className="font-['Fredoka_One'] text-4xl md:text-5xl mb-6 text-gray-800">
            Dibuat untuk <span className="text-[#FFC800] border-b-8 border-[#FFC800]">kalian</span>
          </h2>
          <p className="text-gray-500 font-bold text-lg mb-6 leading-relaxed">
            GradReady didirikan dengan satu misi: menutup kesenjangan antara kemahiran akademis dan ekspektasi nyata dari industri. Kami sadar bahwa banyak fresh graduate kebingungan di tahap awal mencari pekerjaan.
          </p>
          <p className="text-gray-500 font-bold text-lg leading-relaxed">
            Menggabungkan teknologi AI pintar dengan tahapan persiapan yang interaktif, kami menyajikan platform yang personal, akurat, dan ramah pengguna untuk membantumu bersaing di dunia kerja.
          </p>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div className="bg-[#e6fcd2] border-2 border-[#c0f590] h-48 rounded-[32px] border-b-[8px] flex flex-col items-center justify-center p-6 text-[#58CC02] hover:-translate-y-2 transition-transform">
             <Target size={40} className="mb-4" />
             <h3 className="font-['Fredoka_One'] text-xl text-center">Fokus Mahasiswa</h3>
          </div>
          <div className="bg-[#e0f2fe] border-2 border-[#bae6fd] h-48 rounded-[32px] border-b-[8px] border-b-[#7dd3fc] flex flex-col items-center justify-center p-6 text-[#1CB0F6] hover:-translate-y-2 transition-transform mt-8">
             <Bot size={40} className="mb-4" />
             <h3 className="font-['Fredoka_One'] text-xl text-center">Berbasis AI</h3>
          </div>
        </div>
      </section>

      {/* NEW Section 4: Testimonials */}
      <section className="max-w-7xl mx-4 xl:mx-auto px-6 py-24 bg-gray-50 rounded-[48px] border-2 border-gray-200 my-10">
        <h2 className="font-['Fredoka_One'] text-4xl md:text-5xl text-center mb-16 text-gray-800">Telah terbukti <span className="text-[#1CB0F6] italic">berhasil</span>!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
           <div className="bg-white border-2 border-gray-200 border-b-[8px] rounded-[32px] p-8 relative hover:-translate-y-2 transition-transform">
             {/* Speech bubble tail */}
             <div className="absolute -top-4 left-10 w-8 h-8 bg-white border-l-2 border-t-2 border-gray-200 rotate-45"></div>
             <p className="font-bold text-gray-600 text-lg mb-8 leading-relaxed">
               &quot;GradReady bener-bener ngebantu aku ngerapihin CV dari nol! Fitur AI-nya tau persis keywords apa yang dicari HRD. Alhasil dapet panggilan interview lebih banyak dari biasanya!&quot;
             </p>
             <div className="flex items-center gap-4">
               <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&h=100&fit=crop" alt="Budi" className="w-14 h-14 rounded-full border-2 border-gray-200 object-cover" />
               <div>
                 <h4 className="font-['Fredoka_One'] text-gray-800 text-xl">Budi Santoso</h4>
                 <p className="text-sm font-bold text-[#1CB0F6]">Diterima sbg UI/UX Designer</p>
               </div>
             </div>
           </div>
           
           <div className="bg-white border-2 border-gray-200 border-b-[8px] rounded-[32px] p-8 relative hover:-translate-y-2 transition-transform">
             <div className="absolute -top-4 left-10 w-8 h-8 bg-white border-l-2 border-t-2 border-gray-200 rotate-45"></div>
             <p className="font-bold text-gray-600 text-lg mb-8 leading-relaxed">
               &quot;Deteksi skill gap-nya juara banget! Aku jadi tau harus belajar React JS lebih dalam untuk memperkuat portfolio. Latihannya seru berasa main game, dan sekarang aku udah kerja!&quot;
             </p>
             <div className="flex items-center gap-4">
               <img src="https://images.unsplash.com/photo-1503454537195-1dc5348a6c6c?w=100&h=100&fit=crop" alt="Siti" className="w-14 h-14 rounded-full border-2 border-gray-200 object-cover" />
               <div>
                 <h4 className="font-['Fredoka_One'] text-gray-800 text-xl">Siti Aminah</h4>
                 <p className="text-sm font-bold text-[#FF4B4B]">Diterima sbg Frontend Dev</p>
               </div>
             </div>
           </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="font-['Fredoka_One'] text-4xl md:text-5xl mb-12 text-gray-800">
          Artikel <span className="text-[#58CC02] italic">Karir</span> Terkini
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Tips Lolos Screening ATS?",
              desc: "Pelajari format CV yang paling aman agar sistem otomatis HRD bisa meloloskan aplikasimu.",
              img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=250&fit=crop",
            },
            {
              title: "10 Ide Portofolio Menarik",
              desc: "Belum punya pengalaman? Berikut 10 ide proyek untuk membuat profil kamu menonjol di mata rekruter.",
              img: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400&h=250&fit=crop",
            },
            {
              title: "Persiapan Wawancara Efektif",
              desc: "Jangan sampai gugup saat interview. Kuasai pertanyaan HRD yang paling sering diajukan beserta contoh jawabannya.",
              img: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400&h=250&fit=crop",
            },
          ].map((b, i) => (
             <div
               key={i}
               className="bg-white border-2 border-gray-200 border-b-[8px] rounded-[32px] overflow-hidden p-5 group hover:-translate-y-2 transition-transform hover:border-[#b8f57c]"
             >
               <div className="rounded-2xl overflow-hidden mb-6 border-2 border-gray-100 aspect-[4/3] bg-gray-50">
                 <img
                   src={b.img}
                   alt={b.title}
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                 />
               </div>
               <div className="px-2 pb-2">
                 <h3 className="font-['Fredoka_One'] text-2xl mb-3 text-gray-800 leading-tight">
                   {b.title}
                 </h3>
                 <p className="text-gray-500 font-bold mb-6 line-clamp-2 text-base">
                   {b.desc}
                 </p>
                 <Link
                   href="#"
                   className="inline-flex items-center gap-2 font-bold text-[#58CC02] hover:text-[#4BB200] bg-[#f2ffe0] px-4 py-2 rounded-xl transition-colors"
                 >
                   Baca Selengkapnya
                   <span className="bg-[#58CC02] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                     ↗
                   </span>
                 </Link>
               </div>
             </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-7xl mx-auto px-6 py-24 border-t-2 border-gray-100">
        <h2 className="font-['Fredoka_One'] text-4xl md:text-5xl text-center mb-16 text-gray-800">
          Pertanyaan yang sering <span className="text-[#FF4B4B] italic">ditanyakan</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {[
            { q: "Apakah evaluasi CV ini gratis?", a: "Tentu! Kamu bisa menggunakan fitur dasar analisa CV secara gratis dengan membuat akun baru." },
            { q: "Seperti apa tes mock interview-nya?", a: "Kamu akan berbicara langsung (atau chat) dengan AI kami. AI akan menilai kepercayaan diri dan isi dari jawabanmu." },
            { q: "Apakah data CV milikku aman?", a: "Sangat aman. Kami menggunakan sistem enkripsi kokoh dan tidak akan pernah menjual datamu ke pihak ketiga." },
            { q: "Bisa ganti target karir nggak?", a: "Tentu dong! Kamu bisa menyesuaikan panduan/roadmap karir sesuai posisi yang sedang jadi fokusmu saat ini." }
          ].map((faq, i) => (
             <div key={i} className="bg-white border-2 border-gray-200 border-b-[6px] rounded-3xl p-6 hover:border-[#b8f57c] transition-colors">
               <h4 className="font-['Fredoka_One'] text-xl text-gray-800 mb-3">{faq.q}</h4>
               <p className="text-gray-500 font-bold">{faq.a}</p>
             </div>
          ))}
        </div>
      </section>

      {/* NEW Section 5: CTA */}
      <section className="max-w-4xl mx-auto text-center px-6 py-24 my-10">
        <h2 className="font-['Fredoka_One'] text-5xl md:text-6xl text-gray-800 mb-8 leading-tight">
          Siap wujudkan karir <br className="hidden md:block" />
          <span className="text-[#58CC02]">impianmu?</span>
        </h2>
        <p className="text-xl text-gray-500 font-bold mb-10 max-w-xl mx-auto">
          Lebih dari 10,000 lulusan telah bergabung dan mempersiapkan diri dengan GradReady. Sekarang giliranmu.
        </p>
        <Button variant="primary" className="!rounded-2xl text-xl px-12 py-5 shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
          Buat Akun Gratis Sekarang! <Rocket size={24} className="fill-white" />
        </Button>
      </section>

      {/* NEW Footer */}
      <footer className="w-full bg-[var(--dark-blue)] py-16 px-6 border-t-4 border-[#1a2235]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="col-span-1 lg:col-span-1 border-b-2 lg:border-b-0 border-[#1a2235] pb-8 lg:pb-0">
             <div className="flex items-center gap-2 mb-4">
                <span className="font-['Fredoka_One'] text-2xl text-white tracking-wide">
                  gradready
                </span>
             </div>
             <p className="text-gray-400 font-bold text-sm leading-relaxed">
               Mempersiapkan fresh graduate menghadapi dunia kerja dengan wawasan dan teknologi AI terkini.
             </p>
          </div>
          <div>
            <h4 className="text-gray-500 font-black mb-6 uppercase tracking-wider text-sm">Produk</h4>
            <ul className="space-y-4 font-bold text-gray-300">
              <li><Link href="#" className="hover:text-[#58CC02] transition-colors">Analisis CV Otomatis</Link></li>
              <li><Link href="#" className="hover:text-[#58CC02] transition-colors">AI Mock Interview</Link></li>
              <li><Link href="#" className="hover:text-[#58CC02] transition-colors">Deteksi Skill Gap</Link></li>
              <li><Link href="#" className="hover:text-[#58CC02] transition-colors">Premium Plan</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-500 font-black mb-6 uppercase tracking-wider text-sm">Perusahaan</h4>
            <ul className="space-y-4 font-bold text-gray-300">
              <li><Link href="#" className="hover:text-[#58CC02] transition-colors">Tentang Kami</Link></li>
              <li><Link href="#" className="hover:text-[#58CC02] transition-colors">Karir</Link></li>
              <li><Link href="#" className="hover:text-[#58CC02] transition-colors">Media Kit</Link></li>
              <li><Link href="#" className="hover:text-[#58CC02] transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-500 font-black mb-6 uppercase tracking-wider text-sm">Bantuan</h4>
            <ul className="space-y-4 font-bold text-gray-300">
              <li><Link href="#" className="hover:text-[#58CC02] transition-colors">Hubungi Kami</Link></li>
              <li><Link href="#" className="hover:text-[#58CC02] transition-colors">Pusat Bantuan (FAQ)</Link></li>
              <li><Link href="#" className="hover:text-[#58CC02] transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="#" className="hover:text-[#58CC02] transition-colors">Syarat & Ketentuan</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t-2 border-[#1a2235] flex flex-col md:flex-row items-center justify-between gap-4 text-gray-400 font-bold text-sm text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} GradReady. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-[#58CC02] cursor-pointer transition-colors"><Camera size={20} /></span>
            <span className="hover:text-[#58CC02] cursor-pointer transition-colors"><MessageCircle size={20} /></span>
            <span className="hover:text-[#58CC02] cursor-pointer transition-colors"><Briefcase size={20} /></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
