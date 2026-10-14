import type { ReactNode } from 'react';
import AdminGate from '@/app/components/admin/AdminGate';
import AdminSidebar from '@/app/components/admin/AdminSidebar';
import Navbar from '@/app/components/Navbar';

export default function AdminLayout({
children,
}: {
children: ReactNode;
}) {
return (
  <AdminGate>
    <div className="flex min-h-screen flex-col bg-[#EEF3F6] text-[#111111] antialiased">
    <Navbar />
    <div className="flex flex-1 flex-col lg:flex-row">
      <AdminSidebar />

      <main className="min-w-0 flex-1 px-3 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>
    </div>
    </div>
    </AdminGate>
);
}