import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Navbar';

export default function ProductDetailsLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#EEF3F6] text-[#111111]">
      <Navbar />
      <main
        aria-label="Loading product details"
        aria-busy="true"
        className="flex-grow w-full px-3 py-8 sm:px-6 sm:py-12 lg:px-8"
      >
        <div className="mx-auto grid w-full max-w-7xl animate-pulse grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="aspect-[4/5] rounded-lg bg-gray-200" />
          <div className="space-y-5 py-4">
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="h-10 w-3/4 rounded bg-gray-200" />
            <div className="h-6 w-36 rounded bg-gray-200" />
            <div className="h-20 w-full rounded bg-gray-200" />
            <div className="h-10 w-full rounded bg-gray-200" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}