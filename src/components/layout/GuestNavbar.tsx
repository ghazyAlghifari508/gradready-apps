"use client";

import React from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function GuestNavbar() {
  return (
    <header className="sticky top-0 z-50 h-[72px] bg-white border-b-2 border-[#E5E5E5] flex items-center px-6 gap-6">
      {/* Logo */}
      <Link href="/" className="no-underline shrink-0">
        <span className="font-['Fredoka_One'] font-bold text-[28px] text-[#58CC02]">
          gradready
        </span>
      </Link>

      <div className="flex-1" />

      <nav className="hidden md:flex gap-6 lg:gap-8 items-center">
        <Link href="#features" className="no-underline text-[14px] font-bold text-[#AFAFAF] hover:text-[#777777] uppercase tracking-[0.5px] transition-colors">
          FITUR
        </Link>
        <Link href="#how-it-works" className="no-underline text-[14px] font-bold text-[#AFAFAF] hover:text-[#777777] uppercase tracking-[0.5px] transition-colors">
          CARA KERJA
        </Link>
        <Link href="#about" className="no-underline text-[14px] font-bold text-[#AFAFAF] hover:text-[#777777] uppercase tracking-[0.5px] transition-colors">
          TENTANG
        </Link>
        <Link href="#faq" className="no-underline text-[14px] font-bold text-[#AFAFAF] hover:text-[#777777] uppercase tracking-[0.5px] transition-colors">
          FAQ
        </Link>
      </nav>

      {/* Auth Buttons */}
      <div className="flex gap-3 items-center ml-3">
        <Link href="/login" className="no-underline">
          <Button variant="ghost">LOGIN</Button>
        </Link>
        <Link href="/register" className="no-underline">
          <Button variant="primary">REGISTER</Button>
        </Link>
      </div>
    </header>
  );
}
