'use client';

import Link from 'next/link';
import { useState } from 'react';
import { NAV_LINKS } from '../lib/constants';
import Image from 'next/image';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white text-[#111111] shadow-md w-full overflow-x-hidden">
      {/* Top Announcement Bar */}
      <div className="bg-[#111111] text-[#EEF3F6] text-xs py-1.5 px-3 text-center border-b border-gray-800 flex items-center justify-between max-w-7xl mx-auto">
        <span className="truncate">
          Bespoke Tailoring & Apparel Manufacturing in Kigali, Rwanda
        </span>

        <div className="hidden sm:flex items-center gap-4 text-xs shrink-0">
          <a
            href="tel:+250788000000"
            className="hover:text-[#F28C28] transition-colors"
          >
            +250 788 000 000
          </a>

          <span>|</span>

          <a
            href="mailto:nagarmentss@gmail.com"
            className="hover:text-[#F28C28] transition-colors"
          >
            nagarmentss@gmail.com
          </a>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0 group focus:outline-none"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-md bg-[#123B5D] flex items-center justify-center overflow-hidden">
            <Image
              src="https://res.cloudinary.com/ziwgo9pj/image/upload/v1790879861/75affa54-fc00-4a9c-b196-ac0892d8f8d6.png"
              alt="NA-GARMENTS"
              width={50}
              height={50}
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
            />
          </div>

          <div className="flex flex-col">
            <span className="font-extrabold text-base sm:text-xl tracking-wider text-[#123B5D] uppercase leading-none group-hover:text-[#F28C28] transition-colors">
              NA-GARMENTS
            </span>

            <span className="text-[9px] sm:text-[10px] text-[#111111]/70 font-medium tracking-widest uppercase mt-0.5">
              Apparel & Tailoring
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-[#111111] hover:text-[#F28C28] transition-colors tracking-wide py-2"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Header Utilities / Action Icons */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Search Toggle */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 text-[#123B5D] hover:text-[#F28C28] hover:bg-[#EEF3F6] rounded-full transition-colors focus:outline-none min-w-[38px] min-h-[38px] flex items-center justify-center"
            aria-label="Search site"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {/* Wishlist Link */}
          <Link
            href="/wishlist"
            className="p-2 text-[#123B5D] hover:text-[#F28C28] hover:bg-[#EEF3F6] rounded-full transition-colors relative focus:outline-none min-w-[38px] min-h-[38px] flex items-center justify-center"
            aria-label="Wishlist"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>

            <span className="absolute top-1 right-1 bg-[#F28C28] text-[#111111] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              0
            </span>
          </Link>

          {/* Cart Link */}
          <Link
            href="/cart"
            className="p-2 text-[#123B5D] hover:text-[#F28C28] hover:bg-[#EEF3F6] rounded-full transition-colors relative focus:outline-none min-w-[38px] min-h-[38px] flex items-center justify-center"
            aria-label="Shopping Cart"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>

            <span className="absolute top-1 right-1 bg-[#F28C28] text-[#111111] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              0
            </span>
          </Link>

          {/* Account/Login Link */}
          <Link
            href="/account"
            className="hidden sm:flex p-2 text-[#123B5D] hover:text-[#F28C28] hover:bg-[#EEF3F6] rounded-full transition-colors focus:outline-none min-w-[38px] min-h-[38px] items-center justify-center"
            aria-label="Account Login"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </Link>

          {/* CTA Button */}
          <Link
            href="/custom-order"
            className="hidden xl:inline-flex bg-[#F28C28] text-[#111111] hover:bg-[#123B5D] hover:text-white font-bold text-xs uppercase tracking-wider px-3.5 py-2 rounded transition-all shrink-0 ml-1"
          >
            Custom Order
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-[#123B5D] hover:text-[#F28C28] hover:bg-[#EEF3F6] rounded transition-colors focus:outline-none ml-1 min-w-[42px] min-h-[42px] flex items-center justify-center"
            aria-label="Toggle Navigation Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      {isSearchOpen && (
        <div className="bg-[#111111] border-t border-[#123B5D] px-3 sm:px-6 py-3 transition-all">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <input
              type="text"
              placeholder="Search garments, uniforms, or bespoke suits..."
              className="w-full bg-[#123B5D]/40 border border-[#123B5D] text-white placeholder-gray-400 text-sm rounded px-3 py-2 focus:outline-none focus:border-[#F28C28]"
              autoFocus
            />

            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="text-xs text-[#EEF3F6] hover:text-[#F28C28] px-3 py-2 shrink-0"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[#111111] border-t border-[#123B5D] px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block text-base font-semibold text-[#EEF3F6] hover:text-[#F28C28] py-2 px-3 rounded hover:bg-[#123B5D]/30 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/account"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 text-base font-semibold text-[#EEF3F6] hover:text-[#F28C28] py-2 px-3 rounded hover:bg-[#123B5D]/30 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7-7 7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>

              My Account / Login
            </Link>
          </nav>

          <div className="pt-2 border-t border-gray-800 flex flex-col gap-2">
            <Link
              href="/custom-order"
              onClick={() => setIsMenuOpen(false)}
              className="w-full text-center bg-[#F28C28] text-[#111111] font-bold text-sm uppercase tracking-wider py-3 rounded hover:bg-white hover:text-[#123B5D] transition-colors"
            >
              Start Custom Order
            </Link>

            <div className="text-center pt-2">
              <a
                href="tel:+250788000000"
                className="text-xs text-[#EEF3F6]/80 hover:text-[#F28C28] block"
              >
                Need help? Call: +250 788 000 000
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}