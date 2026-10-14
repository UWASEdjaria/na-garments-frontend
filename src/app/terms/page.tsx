import Link from 'next/link';
import type { Metadata } from 'next';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for using nagarments.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#EEF3F6] text-[#111111]">
      <Navbar />
      <main className="flex-grow w-full max-w-3xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-xs font-extrabold uppercase tracking-widest text-[#F28C28] mb-2">Legal</p>
        <h1 className="text-3xl font-extrabold text-[#123B5D] mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: January 2025</p>

        <div className="prose prose-sm max-w-none space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-extrabold text-[#123B5D] mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using nagarments, you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[#123B5D] mb-2">2. Products and Orders</h2>
            <p>nagarments offers two types of products:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>
                <strong>Ready to Wear:</strong> Finished garments available for immediate purchase.
                Prices are confirmed at the time of order. Stock availability is verified at checkout.
              </li>
              <li>
                <strong>Made to Order:</strong> Garments produced after you submit a custom order request.
                Prices are not confirmed until nagarments provides a formal quote.
                No payment is required until you accept the quote.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[#123B5D] mb-2">3. Pricing and Payment</h2>
            <p>
              All prices are displayed in Rwandan Francs (RWF). Display currencies (USD, NGN) are
              for reference only and do not represent confirmed prices. Payment is collected exclusively
              in RWF via Rwanda Mobile Money through Paypack.
            </p>
            <p className="mt-2">
              For Made to Order garments, the advance payment percentage and remaining balance terms
              will be specified in the quote provided by nagarments. Production does not begin until
              the required advance payment has been confirmed.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[#123B5D] mb-2">4. Custom Orders</h2>
            <p>
              Submitting a custom order request does not constitute a binding order or payment obligation.
              nagarments will review your request and provide a quote. You may accept or decline the quote.
              Once you accept and make the required advance payment, production will begin.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[#123B5D] mb-2">5. Cancellations and Returns</h2>
            <p>
              Ready to Wear orders may be cancelled before dispatch. Please contact us immediately
              if you need to cancel. Made to Order garments cannot be cancelled once production has begun.
              Returns are accepted for defective or incorrectly produced items within 7 days of delivery.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[#123B5D] mb-2">6. Intellectual Property</h2>
            <p>
              All designs, images, and content on nagarments are the property of nagarments or its
              licensors. You may not reproduce or distribute our content without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[#123B5D] mb-2">7. Limitation of Liability</h2>
            <p>
              nagarments is not liable for indirect, incidental, or consequential damages arising
              from the use of our services. Our liability is limited to the amount paid for the
              specific order in question.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[#123B5D] mb-2">8. Contact</h2>
            <p>
              For questions about these terms, contact us at{' '}
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
          <Link href="/privacy" className="text-[#123B5D] font-semibold hover:text-[#F28C28] transition-colors">
            Privacy Policy →
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
