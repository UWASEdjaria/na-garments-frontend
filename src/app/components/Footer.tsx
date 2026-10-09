import Link from 'next/link';
import { CONTACT_INFO, FOOTER_COLLECTIONS, FOOTER_PAGES, SOCIAL_LINKS } from '../lib/constants';
import Image from 'next/image';
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
} from 'react-icons/fa';

const SOCIAL_ICONS = {
  Facebook: FaFacebookF,
  Instagram: FaInstagram,
  TikTok: FaTiktok,
  WhatsApp: FaWhatsapp,
};
const SOCIAL_COLORS = {
  Facebook: 'bg-[#1877F2]',
  Instagram: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
  TikTok: 'bg-black',
  WhatsApp: 'bg-[#25D366]',
};
export default function Footer() {
  return (
    <footer className="bg-[#111111] text-[#EEF3F6] pt-14 pb-8 border-t-4 border-[#F28C28] w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-gray-800">
          {/* Section 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block focus:outline-none py-1">
              <img
                src="https://res.cloudinary.com/ziwgo9pj/image/upload/f_auto,q_auto,w_800/v1790878768/For_a_dark_background.png"
                alt="nagarments"
                className="h-16 sm:h-20 lg:h-24 w-auto object-contain object-left"
                loading="eager"
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              nagarments is Rwanda’s premier apparel manufacturer and bespoke tailoring studio. We produce tailored school uniforms, industrial workwear, and bespoke men’s fashion crafted for precision, fit, and endurance.
            </p>
            <div className="pt-2">
              <span className="inline-block text-xs font-semibold text-[#F28C28] uppercase tracking-widest bg-[#123B5D]/40 px-3 py-1 rounded border border-[#123B5D]">
                Based in Kigali, Rwanda
              </span>
            </div>
          </div>

          {/* Section 2: Collections */}
          <div className="space-y-3">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider border-b border-[#F28C28]/40 pb-2">
              Collections
            </h3>
            <ul className="space-y-2">
              {FOOTER_COLLECTIONS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-xs sm:text-sm text-gray-400 hover:text-[#F28C28] transition-colors inline-block py-0.5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: Pages & Customer */}
          <div className="space-y-3">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider border-b border-[#F28C28]/40 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {FOOTER_PAGES.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-xs sm:text-sm text-gray-400 hover:text-[#F28C28] transition-colors inline-block py-0.5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: Atelier / Contact & Connect */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider border-b border-[#F28C28]/40 pb-2">
              Atelier Contact
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li>
                <a
                  href={CONTACT_INFO.phoneHref}
                  className="flex items-center gap-2.5 text-gray-300 hover:text-[#F28C28] transition-colors group"
                >
                  <svg className="w-4 h-4 text-[#F28C28] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="break-all">{CONTACT_INFO.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={CONTACT_INFO.emailHref}
                  className="flex items-center gap-2.5 text-gray-300 hover:text-[#F28C28] transition-colors group"
                >
                  <svg className="w-4 h-4 text-[#F28C28] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="break-all">{CONTACT_INFO.emailDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={CONTACT_INFO.locationMapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-gray-300 hover:text-[#F28C28] transition-colors group"
                >
                  <svg className="w-4 h-4 text-[#F28C28] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{CONTACT_INFO.locationDisplay}</span>
                </a>
              </li>
            </ul>

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="text-xs text-gray-400 block mb-2 font-medium">Connect With Us</span>
              <div className="flex items-center gap-2 flex-wrap">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.platform}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.platform}
                    className={`w-8 h-8 rounded-full text-white transition-all duration-200 flex items-center justify-center hover:scale-105 ${
                    SOCIAL_COLORS[s.platform as keyof typeof SOCIAL_COLORS]
                  }`}
                  >
                    {(() => {
                  const Icon = SOCIAL_ICONS[s.platform as keyof typeof SOCIAL_ICONS];
                  return Icon ? <Icon className="w-4 h-4" /> : null;
                  })()}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 7: Footer Bottom */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} nagarments. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}