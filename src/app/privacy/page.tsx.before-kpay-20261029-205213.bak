import Link from 'next/link';
import type { Metadata } from 'next';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How nagarments collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#EEF3F6] text-[#111111]">
      <Navbar />
      <main className="flex-grow w-full max-w-3xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-xs font-extrabold uppercase tracking-widest text-[#F28C28] mb-2">Legal</p>
        <h1 className="text-3xl font-extrabold text-[#123B5D] mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: January 2025</p>

        <div className="prose prose-sm max-w-none space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-extrabold text-[#123B5D] mb-2">1. Information We Collect</h2>
            <p>When you use nagarments, we may collect the following information:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Name, email address, and phone number when you register or place an order</li>
              <li>Shipping address when you complete a purchase</li>
              <li>Order history and custom order details</li>
              <li>Payment reference numbers (we do not store full payment credentials)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[#123B5D] mb-2">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Process and fulfil your orders</li>
              <li>Communicate with you about your orders and custom requests</li>
              <li>Send order confirmations and status updates</li>
              <li>Respond to your enquiries and support requests</li>
              <li>Improve our products and services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[#123B5D] mb-2">3. Payment Information</h2>
            <p>
              Payments are processed through Paypack, a Rwanda Mobile Money payment provider.
              nagarments does not store your Mobile Money PIN or full payment credentials.
              Payment references are stored solely for order reconciliation purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[#123B5D] mb-2">4. Data Sharing</h2>
            <p>
              We do not sell or rent your personal information to third parties.
              We may share your information with delivery partners solely to fulfil your order,
              and with payment processors to complete transactions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[#123B5D] mb-2">5. Data Security</h2>
            <p>
              We implement appropriate technical and organisational measures to protect your personal
              information against unauthorised access, alteration, disclosure, or destruction.
              Passwords are stored using industry-standard hashing.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[#123B5D] mb-2">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your account and associated data</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
            <p className="mt-2">To exercise these rights, contact us at the address below.</p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[#123B5D] mb-2">7. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact nagarments at{' '}
              <a href="mailto:info@nagarments.com" className="text-[#F28C28] hover:underline font-semibold">
                info@nagarments.com
              </a>{' '}
              or visit our{' '}
              <Link href="/contact" className="text-[#F28C28] hover:underline font-semibold">
                contact page
              </Link>.
            </p>
          </section>
        </div>

        <div className="mt-10 flex gap-4 text-sm">
          <Link href="/terms" className="text-[#123B5D] font-semibold hover:text-[#F28C28] transition-colors">
            Terms of Service →
          </Link>
          <Link href="/" className="text-gray-500 hover:text-[#123B5D] transition-colors">
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
