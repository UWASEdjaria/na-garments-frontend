'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import {
  FiBell,
  FiCheck,
  FiChevronDown,
  FiClipboard,
  FiGrid,
  FiHeadphones,
  FiHome,
  FiLogOut,
  FiMail,
  FiMenu,
  FiPackage,
  FiPhone,
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiX,
} from 'react-icons/fi';

import useAuth from '../hooks/useAuth';
import { useCartCount } from '../hooks/useCartCount';
import { CONTACT_INFO } from '../lib/constants';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const cartCount = useCartCount();
  const { user, isLoading, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isAdmin = user?.role === 'ADMIN';
  const isAdminPage = pathname.startsWith('/admin');
  const isCustomer = user?.role === 'CUSTOMER';

  const initials =
    user?.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || 'U';

  const publicLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/shop' },
    { label: 'Custom Order', href: '/custom-order' },
  ];

  const navigationLinks = isAdmin
    ? isAdminPage
      ? []
      : [
          { label: 'Home', href: '/' },
          { label: 'Dashboard', href: '/admin/custom-orders' },
        ]
    : isCustomer
      ? [...publicLinks, { label: 'Dashboard', href: '/account' }]
      : publicLinks;

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) return;

    router.push(`/shop?search=${encodeURIComponent(query)}`);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    router.replace('/auth/login');
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const iconButtonClass =
    'relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#123B5D] transition hover:bg-[#EEF3F6] hover:text-[#F28C28] focus-visible:outline-2 focus-visible:outline-[#F28C28]';

  const profileLinkClass =
    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#111111] transition hover:bg-[#EEF3F6] hover:text-[#123B5D]';

  const renderProfileButton = () => (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsProfileOpen((open) => !open)}
        aria-label="Open profile menu"
        aria-expanded={isProfileOpen}
        className="flex items-center gap-2 rounded-full p-1 transition hover:bg-[#EEF3F6] focus-visible:outline-2 focus-visible:outline-[#F28C28]"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#123B5D] text-sm font-bold text-white ring-2 ring-[#EEF3F6]">
          {initials}
        </span>

        <FiChevronDown
          className={`hidden h-4 w-4 text-[#123B5D] transition sm:block ${
            isProfileOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {isProfileOpen && (
        <>
          <button
            type="button"
            aria-label="Close profile menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setIsProfileOpen(false)}
          />

          <div className="absolute right-0 top-12 z-50 w-72 overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
            <div className="border-b border-gray-100 px-3 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Signed in as
              </p>

              <p className="mt-1 truncate text-sm font-bold text-[#123B5D]">
                {user?.name}
              </p>

              <p className="truncate text-xs text-gray-500">
                {user?.email}
              </p>

              {isAdmin && (
                <span className="mt-2 inline-flex rounded-full bg-[#EEF3F6] px-2.5 py-1 text-xs font-semibold text-[#123B5D]">
                  Administrator
                </span>
              )}
            </div>

            {isAdmin ? (
              <>
                <Link
                  href="/admin/custom-orders"
                  onClick={() => setIsProfileOpen(false)}
                  className={profileLinkClass}
                >
                  <FiGrid className="h-4 w-4" />
                  Dashboard
                </Link>

                <Link
                  href="/account"
                  onClick={() => setIsProfileOpen(false)}
                  className={profileLinkClass}
                >
                  <FiUser className="h-4 w-4" />
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/account"
                  onClick={() => setIsProfileOpen(false)}
                  className={profileLinkClass}
                >
                  <FiUser className="h-4 w-4" />
                  Profile
                </Link>

                <Link
                  href="/account"
                  onClick={() => setIsProfileOpen(false)}
                  className={profileLinkClass}
                >
                  <FiClipboard className="h-4 w-4" />
                  Orders
                </Link>

                <a
                  href={CONTACT_INFO.emailHref}
                  onClick={() => setIsProfileOpen(false)}
                  className={profileLinkClass}
                >
                  <FiHeadphones className="h-4 w-4" />
                  Contact Support
                </a>
              </>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="mt-1 flex w-full items-center gap-3 rounded-lg border-t border-gray-100 px-3 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              <FiLogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-white text-[#111111] shadow-md">
      {/* Announcement bar */}
      <div className="flex min-h-8 items-center justify-between gap-3 bg-[#111111] px-3 py-1.5 text-xs text-[#EEF3F6] sm:px-6 lg:px-8">
        <p className="truncate">
          Custom Tailoring & Quality Apparel in Kigali, Rwanda
        </p>

        <div className="hidden shrink-0 items-center gap-4 sm:flex">
          <a
            href={CONTACT_INFO.phoneHref}
            className="transition-colors hover:text-[#F28C28]"
          >
            {CONTACT_INFO.phoneDisplay}
          </a>

          <span aria-hidden="true" className="text-gray-600">
            |
          </span>

          <a
            href={CONTACT_INFO.emailHref}
            className="transition-colors hover:text-[#F28C28]"
          >
            {CONTACT_INFO.emailDisplay}
          </a>
        </div>
      </div>

      {/* Main navigation */}
      <div className="mx-auto flex min-h-[64px] max-w-7xl items-center justify-between gap-3 px-3 py-1.5 sm:px-6 lg:min-h-[72px] lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          aria-label="nagarments homepage"
          className="flex shrink-0 items-center"
          onClick={closeMobileMenu}
        >
          <div className="relative h-11 w-32 sm:h-14 sm:w-40 lg:h-16 lg:w-48">
            <Image
              src="https://res.cloudinary.com/ziwgo9pj/image/upload/v1790878768/For_a_white_background.png"
              alt="nagarments"
              fill
              priority
              sizes="(max-width: 640px) 128px, (max-width: 1024px) 160px, 192px"
              className="object-contain"
            />
          </div>
        </Link>

        {/* Desktop navigation */}
        {!isLoading && (
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-5 lg:flex xl:gap-7"
          >
            {navigationLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(`${link.href}/`));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative whitespace-nowrap py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-[#F28C28]'
                      : 'text-[#111111] hover:text-[#F28C28]'
                  }`}
                >
                  {link.label}

                  {isActive && (
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-[#F28C28]" />
                  )}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right-side actions */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {/* Admin notifications */}
          {!isLoading && isAdmin && isAdminPage && (
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setIsNotificationsOpen((open) => !open)
                }
                aria-label="Open notifications"
                aria-expanded={isNotificationsOpen}
                className={iconButtonClass}
              >
                <FiBell className="h-5 w-5" />
              </button>

              {isNotificationsOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close notifications"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setIsNotificationsOpen(false)}
                  />

                  <div className="absolute right-0 top-12 z-50 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-xl sm:w-80">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                      <FiBell className="h-5 w-5 text-[#123B5D]" />

                      <h2 className="font-bold text-[#123B5D]">
                        Notifications
                      </h2>
                    </div>

                    <div className="py-6 text-center">
                      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#EEF3F6] text-[#123B5D]">
                        <FiCheck className="h-5 w-5" />
                      </span>

                      <p className="mt-3 text-sm font-semibold text-[#111111]">
                        No notifications to display
                      </p>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        Stock alerts, new orders, and new messages will appear
                        here when notification data is connected.
                      </p>
                    </div>

                    <Link
                      href="/admin/custom-orders"
                      onClick={() => setIsNotificationsOpen(false)}
                      className="block rounded-lg bg-[#EEF3F6] px-3 py-2 text-center text-sm font-semibold text-[#123B5D] transition hover:bg-[#123B5D] hover:text-white"
                    >
                      View custom orders
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Search, contact and cart */}
          {!isAdminPage && (
            <>
              <button
                type="button"
                onClick={() => setIsSearchOpen((open) => !open)}
                aria-label={isSearchOpen ? 'Close search' : 'Search products'}
                aria-expanded={isSearchOpen}
                className={iconButtonClass}
              >
                {isSearchOpen ? (
                  <FiX className="h-5 w-5" />
                ) : (
                  <FiSearch className="h-5 w-5" />
                )}
              </button>

              {!isLoading && !isAdmin && (
                <Link
                  href="/contact"
                  aria-label="Contact nagarments"
                  title="Contact us"
                  className={`${iconButtonClass} hidden sm:inline-flex`}
                >
                  <FiPhone className="h-5 w-5" />
                </Link>
              )}

              {!isLoading && !isAdmin && (
                <Link
                  href="/cart"
                  aria-label={`Shopping cart, ${cartCount} items`}
                  className={iconButtonClass}
                >
                  <FiShoppingCart className="h-5 w-5" />

                  <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#F28C28] px-1 text-[10px] font-bold text-[#111111]">
                    {cartCount}
                  </span>
                </Link>
              )}
            </>
          )}

          {/* Guest actions */}
          {!isLoading && !user && (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/auth/login"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-[#123B5D] transition hover:bg-[#EEF3F6] hover:text-[#F28C28]"
              >
                Login
              </Link>

              <Link
                href="/auth/register"
                className="rounded-lg bg-[#123B5D] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#F28C28] hover:text-[#111111]"
              >
                Register
              </Link>
            </div>
          )}

          {/* Customer and admin profiles */}
          {!isLoading && user && renderProfileButton()}

          {/* Mobile menu button */}
          {!isAdminPage && (
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={
                isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
              }
              aria-expanded={isMenuOpen}
              className={`${iconButtonClass} lg:hidden`}
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Search panel */}
      {isSearchOpen && !isAdminPage && (
        <div className="border-t border-[#123B5D] bg-[#111111] px-3 py-4 sm:px-6">
          <form
            onSubmit={handleSearch}
            className="mx-auto flex max-w-3xl items-center gap-2"
          >
            <FiSearch
              aria-hidden="true"
              className="h-5 w-5 shrink-0 text-[#F28C28]"
            />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search garments and uniforms..."
              aria-label="Search products"
              className="w-full rounded-lg border border-[#123B5D] bg-[#123B5D]/30 px-3 py-2.5 text-sm text-white placeholder-gray-400 outline-none focus:border-[#F28C28]"
              autoFocus
            />

            <button
              type="submit"
              className="rounded-lg bg-[#F28C28] px-4 py-2.5 text-sm font-bold text-[#111111] transition hover:bg-white"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile navigation */}
      {isMenuOpen && !isAdminPage && (
        <div className="max-h-[calc(100dvh-6rem)] overflow-y-auto border-t border-[#123B5D] bg-[#111111] px-4 py-4 lg:hidden">
          <nav aria-label="Mobile navigation" className="space-y-1">
            {navigationLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(`${link.href}/`));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-[#123B5D]/40 text-[#F28C28]'
                      : 'text-[#EEF3F6] hover:bg-[#123B5D]/30 hover:text-[#F28C28]'
                  }`}
                >
                  {link.href === '/' ? (
                    <FiHome className="h-5 w-5" />
                  ) : link.href === '/shop' ? (
                    <FiPackage className="h-5 w-5" />
                  ) : link.href === '/custom-order' ? (
                    <FiClipboard className="h-5 w-5" />
                  ) : (
                    <FiGrid className="h-5 w-5" />
                  )}

                  {link.label}
                </Link>
              );
            })}

            {!isLoading && user && (
              <>
                <Link
                  href="/account"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-[#EEF3F6] transition hover:bg-[#123B5D]/30 hover:text-[#F28C28]"
                >
                  <FiUser className="h-5 w-5" />
                  Profile
                </Link>

                {isCustomer && (
                  <a
                    href={CONTACT_INFO.emailHref}
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-[#EEF3F6] transition hover:bg-[#123B5D]/30 hover:text-[#F28C28]"
                  >
                    <FiMail className="h-5 w-5" />
                    Contact Support
                  </a>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
                >
                  <FiLogOut className="h-5 w-5" />
                  Logout
                </button>
              </>
            )}

            {!isLoading && !user && (
              <>
                <Link
                  href="/auth/login"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-[#EEF3F6] transition hover:bg-[#123B5D]/30 hover:text-[#F28C28]"
                >
                  <FiUser className="h-5 w-5" />
                  Login
                </Link>

                <Link
                  href="/auth/register"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-[#EEF3F6] transition hover:bg-[#123B5D]/30 hover:text-[#F28C28]"
                >
                  <FiUser className="h-5 w-5" />
                  Register
                </Link>
              </>
            )}
          </nav>

          <div className="mt-4 space-y-3 border-t border-gray-800 pt-4">
            <a
              href={CONTACT_INFO.phoneHref}
              className="flex items-center justify-center gap-2 py-2 text-xs text-[#EEF3F6]/80 transition hover:text-[#F28C28]"
            >
              <FiPhone className="h-4 w-4" />
              Need help? {CONTACT_INFO.phoneDisplay}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}