'use client';



import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FiClipboard, FiLayers, FiMail, FiMenu, FiPackage, FiShoppingBag, FiX } from 'react-icons/fi';

const links = [
{ label: 'Custom orders', href: '/admin/custom-orders', icon: FiClipboard },
{ label: 'Products', href: '/admin/products', icon: FiShoppingBag },
{ label: 'Categories', href: '/admin/categories', icon: FiLayers },
{ label: 'Messages', href: '/admin/messages', icon: FiMail },
{ label: 'Stock', href: '/admin/stock', icon: FiPackage },
];

export default function AdminSidebar() {
const pathname = usePathname();
const [isMenuOpen, setIsMenuOpen] = useState(false);

return (
    <aside aria-label="Admin sections" className="w-full shrink-0 border-b border-gray-200 bg-[#EEF3F6] text-[#123B5D] lg:min-h-full lg:w-60 lg:border-b-0 lg:border-r lg:border-gray-200" >
     <div className="flex items-center justify-between px-3 py-2 lg:hidden">
      <span className="text-sm font-bold">Admin menu</span>
       <button
         type="button"
         onClick={() => setIsMenuOpen((open) => !open)}
         aria-label={isMenuOpen ? 'Close admin navigation' : 'Open admin navigation'}
         aria-expanded={isMenuOpen}
         aria-controls="admin-navigation"
         className="inline-flex h-10 w-10 items-center justify-center rounded-md text-[#123B5D] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-[#F28C28]"
       >
         {isMenuOpen ? <FiX aria-hidden="true" className="h-5 w-5" /> : <FiMenu aria-hidden="true" className="h-5 w-5" />}
       </button>
     </div>
     <nav id="admin-navigation" className={`${isMenuOpen ? 'flex' : 'hidden'} flex-col gap-2 overflow-x-auto p-3 lg:sticky lg:top-[104px] lg:flex lg:gap-1 lg:overflow-visible lg:p-4`}>
    <p className="hidden px-3 pb-3 pt-2 text-xs font-bold uppercase tracking-[0.16em] text-gray-500 lg:block">
     Workspace
     </p>

    {links.map(({ label, href, icon: Icon }) => {
      const active =
        pathname === href || pathname.startsWith(`${href}/`);

      return (
        <Link
          key={href}
          href={href}
          onClick={() => setIsMenuOpen(false)}
          aria-current={active ? 'page' : undefined}
          className={`inline-flex shrink-0 items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition-colors duration-200 lg:w-full ${
            active
              ? 'bg-[#F28C28] text-[#111111] shadow-sm'
              : 'text-[#123B5D] hover:bg-white hover:text-[#F28C28]'
          }`}
        >
          <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
          {label}
        </Link>
      );
    })}
  </nav>
</aside>


);
}