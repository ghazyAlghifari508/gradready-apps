import React from "react";
import Link from "next/link";

export default function GuestFooter() {
  return (
    <footer className="bg-white border-t-2 border-[#E5E5E5] py-8 px-6">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link href="/" className="no-underline">
            <span className="font-['Fredoka_One'] font-bold text-[32px] text-[#58CC02]">
              gradready
            </span>
          </Link>
          <p className="text-[#777777] text-[16px] font-semibold text-center md:text-left max-w-sm">
            Platform web berbasis AI yang membantu fresh graduate mempersiapkan karir secara menyeluruh.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 text-center md:text-left">
          <div className="flex flex-col gap-3">
            <h4 className="text-[14px] font-bold text-[#AFAFAF] uppercase tracking-wide">Produk</h4>
            <Link href="#features" className="text-[#777777] hover:text-[#4EC604] font-semibold no-underline">Fitur</Link>
            <Link href="/market" className="text-[#777777] hover:text-[#4EC604] font-semibold no-underline">Market Insight</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-[14px] font-bold text-[#AFAFAF] uppercase tracking-wide">Perusahaan</h4>
            <Link href="#" className="text-[#777777] hover:text-[#4EC604] font-semibold no-underline">Tentang Kami</Link>
            <Link href="#" className="text-[#777777] hover:text-[#4EC604] font-semibold no-underline">Kontak</Link>
          </div>
        </div>
      </div>
      
      <div className="max-w-[1200px] mx-auto mt-8 pt-6 border-t-2 border-[#E5E5E5] flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[14px] font-bold text-[#AFAFAF]">© 2026 GradReady. Hak cipta dilindungi.</p>
        <div className="flex gap-4">
          <span className="text-[14px] font-bold text-[#AFAFAF] hover:text-[#4EC604] cursor-pointer">Privasi</span>
          <span className="text-[14px] font-bold text-[#AFAFAF] hover:text-[#4EC604] cursor-pointer">Persyaratan</span>
        </div>
      </div>
    </footer>
  );
}
