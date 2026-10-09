import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import CustomOrderForm from '../components/CustomOrderForm';
import FadeIn from '@/app/components/animations/FadeIn';
import SlideUp from '@/app/components/animations/SlideUp';
import MarqueeText from '@/app/components/animations/MarqueeText';

export default function CustomOrderPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#EEF3F6]">
        {/* Hero Section */}
        <section className="bg-[#123B5D] text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn>
              <p className="text-[#F28C28] font-semibold uppercase tracking-wider text-sm mb-3">
                Request a Quote
              </p>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Request a Custom Order
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-[#EEF3F6] max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                Tell us what you need, and our team will review your request
                and get back to you with the details and a quote.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Moving Brand Strip */}
        <section className="bg-white border-y border-[#EEF3F6] py-4">
          <MarqueeText duration={45}>
            <div className="flex items-center gap-8 px-4">
              <span className="text-sm font-semibold uppercase tracking-widest text-[#123B5D]">
                Custom Order
              </span>

              <span className="text-[#F28C28]">•</span>

              <span className="text-sm font-semibold uppercase tracking-widest text-[#123B5D]">
                Quality Tailoring
              </span>

              <span className="text-[#F28C28]">•</span>

              <span className="text-sm font-semibold uppercase tracking-widest text-[#123B5D]">
                Made To Measure
              </span>

              <span className="text-[#F28C28]">•</span>

              <span className="text-sm font-semibold uppercase tracking-widest text-[#123B5D]">
                Premium Finishing
              </span>

              <span className="text-[#F28C28]">•</span>

              <span className="text-sm font-semibold uppercase tracking-widest text-[#123B5D]">
                Unique Styles
              </span>

              <span className="text-[#F28C28]">•</span>

              <span className="text-sm font-semibold uppercase tracking-widest text-[#123B5D]">
                Professional Workwear
              </span>

              <span className="text-[#F28C28]">•</span>

              <span className="text-sm font-semibold uppercase tracking-widest text-[#123B5D]">
                Institutional Uniforms
              </span>

              <span className="text-[#F28C28]">•</span>

              <span className="text-sm font-semibold uppercase tracking-widest text-[#123B5D]">
                Designed For You
              </span>

              <span className="text-[#F28C28]">•</span>
            </div>
          </MarqueeText>
        </section>

        {/* Custom Order Form */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <SlideUp delay={0.3}>
            <CustomOrderForm />
          </SlideUp>
        </section>
      </main>

      <Footer />
    </>
  );
}