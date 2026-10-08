'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  FiArrowLeft,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiCheck,
} from 'react-icons/fi';

import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import FadeIn from '@/app/components/animations/FadeIn';
import SlideUp from '@/app/components/animations/SlideUp';
import { Product } from '@/app/types';
import { productService } from '@/app/services/product.service';
import { cartService } from '@/app/services/cart.service';

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState<string | null>(null);

  useEffect(() => {
    let isCurrentRequest = true;

    productService
      .getProductById(productId)
      .then((foundProduct) => {
        if (!isCurrentRequest) return;

        setProduct(foundProduct);

        const primaryIndex = foundProduct.images?.findIndex(
          (image) => image.isPrimary
        );

        setSelectedImageIndex(primaryIndex >= 0 ? primaryIndex : 0);
        setQuantity(1);
      })
      .catch(() => {
        if (isCurrentRequest) {
          setError('We could not load this product. Please try again.');
        }
      })
      .finally(() => {
        if (isCurrentRequest) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [productId, retryCount]);

  const handleRetry = () => {
    setProduct(null);
    setError(null);
    setIsLoading(true);
    setRetryCount((count) => count + 1);
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);
    setCartMessage(null);

    try {
      await cartService.addToCart(product, quantity);
      setCartMessage('Added to your cart.');
    } catch {
      setCartMessage('Could not add this item. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const pageFrame = (content: React.ReactNode) => (
    <div className="min-h-screen flex flex-col bg-[#EEF3F6] text-[#111111]">
      <Navbar />

      <main className="flex-grow w-full px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">{content}</div>
      </main>

      <Footer />
    </div>
  );

  if (isLoading) {
    return pageFrame(
      <div className="grid animate-pulse grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="aspect-[4/5] rounded-2xl bg-gray-200" />

        <div className="space-y-5 py-4">
          <div className="h-4 w-28 rounded bg-gray-200" />
          <div className="h-12 w-3/4 rounded bg-gray-200" />
          <div className="h-8 w-36 rounded bg-gray-200" />
          <div className="h-5 w-40 rounded bg-gray-200" />
          <div className="h-24 w-full rounded bg-gray-200" />
          <div className="h-12 w-full rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return pageFrame(
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="text-2xl font-bold text-[#123B5D]">
          Product unavailable
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          {error ?? 'We could not find this product.'}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={handleRetry}
            className="rounded-lg bg-[#123B5D] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#F28C28] hover:text-[#111111]"
          >
            Try Again
          </button>

          <Link
            href="/shop"
            className="rounded-lg border border-[#123B5D] px-5 py-3 text-sm font-bold text-[#123B5D] transition-colors hover:bg-white"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images ?? [];

  const activeImage =
    images[selectedImageIndex]?.url ||
    productService.getPrimaryImageUrl(product);

  const isInStock =
    product.isAvailable && product.stockQuantity > 0;

  const formattedPrice = Number(product.price).toLocaleString();

  return pageFrame(
    <>
      {/* Back to shop */}
      <FadeIn>
        <Link
          href="/shop"
          className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-[#123B5D] transition-colors hover:text-[#F28C28]"
        >
          <FiArrowLeft aria-hidden="true" />
          Back to Shop
        </Link>
      </FadeIn>

      {/* Main product section */}
      <SlideUp delay={0.1}>
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Product images */}
            <div className="bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-white">
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  className="object-contain p-5 sm:p-8"
                />
              </div>

              {images.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      aria-label={`Show product image ${index + 1}`}
                      aria-pressed={selectedImageIndex === index}
                      className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-white transition-all ${
                        selectedImageIndex === index
                          ? 'border-[#F28C28] ring-2 ring-[#F28C28]'
                          : 'border-gray-200 hover:border-[#123B5D]'
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt=""
                        fill
                        unoptimized
                        className="object-contain p-2"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product information */}
            <div className="flex flex-col p-6 sm:p-8 lg:p-10">
              {product.category?.name && (
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#123B5D]">
                  {product.category.name}
                </p>
              )}

              <h1 className="mt-3 break-words text-3xl font-black leading-tight text-[#111111] sm:text-4xl">
                {product.name}
              </h1>

              <p className="mt-5 text-2xl font-black text-[#123B5D] sm:text-3xl">
                {formattedPrice}{' '}
                <span className="text-sm font-bold text-gray-500">
                  RWF
                </span>
              </p>

              <div className="my-6 h-px bg-gray-200" />

              {/* Description */}
              <div>
                <h2 className="text-sm font-extrabold uppercase tracking-wide text-[#123B5D]">
                  Description
                </h2>

                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
                  {product.description ||
                    'A carefully crafted garment made with quality materials.'}
                </p>
              </div>

              {/* Availability */}
              <div className="mt-7 rounded-xl bg-[#EEF3F6] p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      isInStock
                        ? 'bg-white text-green-600'
                        : 'bg-white text-red-500'
                    }`}
                  >
                    <FiCheck aria-hidden="true" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#111111]">
                      Availability
                    </p>

                    <p
                      className={`mt-0.5 text-sm font-semibold ${
                        isInStock
                          ? 'text-green-700'
                          : 'text-red-600'
                      }`}
                    >
                      {isInStock
                        ? `${product.stockQuantity} available`
                        : 'Currently out of stock'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quantity and cart */}
              <div className="mt-7">
                <p className="mb-2 text-sm font-bold text-[#111111]">
                  Quantity
                </p>

                <div className="flex flex-col gap-3 min-[420px]:flex-row">
                  <div className="inline-flex h-12 items-center justify-between rounded-lg border border-gray-300 bg-white min-[420px]:w-32">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((current) =>
                          Math.max(1, current - 1)
                        )
                      }
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="flex h-full w-11 items-center justify-center text-[#123B5D] transition-colors hover:text-[#F28C28] disabled:text-gray-300"
                    >
                      <FiMinus aria-hidden="true" />
                    </button>

                    <span
                      aria-live="polite"
                      className="min-w-8 text-center text-sm font-bold"
                    >
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((current) =>
                          Math.min(
                            product.stockQuantity,
                            current + 1
                          )
                        )
                      }
                      disabled={
                        !isInStock ||
                        quantity >= product.stockQuantity
                      }
                      aria-label="Increase quantity"
                      className="flex h-full w-11 items-center justify-center text-[#123B5D] transition-colors hover:text-[#F28C28] disabled:text-gray-300"
                    >
                      <FiPlus aria-hidden="true" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!isInStock || isAddingToCart}
                    className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-[#F28C28] px-6 text-sm font-extrabold text-[#111111] transition-all hover:bg-[#123B5D] hover:text-white disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
                  >
                    <FiShoppingBag
                      aria-hidden="true"
                      className="h-5 w-5"
                    />

                    {isAddingToCart
                      ? 'Adding...'
                      : isInStock
                        ? 'Add to Cart'
                        : 'Out of Stock'}
                  </button>
                </div>

                {cartMessage && (
                  <p
                    role="status"
                    className={`mt-3 text-sm font-semibold ${
                      cartMessage === 'Added to your cart.'
                        ? 'text-green-700'
                        : 'text-red-600'
                    }`}
                  >
                    {cartMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </SlideUp>

      {/* Product information */}
      <SlideUp delay={0.2}>
        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#123B5D]">
              Product Information
            </p>

            <h2 className="mt-2 text-2xl font-black text-[#111111]">
              About this product
            </h2>

            <p className="mt-3 text-sm leading-7 text-gray-600">
              {product.description ||
                'This garment is carefully made with attention to quality, comfort, and finishing.'}
            </p>

            <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-[#EEF3F6] p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                  Category
                </p>

                <p className="mt-1 text-sm font-bold text-[#123B5D]">
                  {product.category?.name || 'Garment'}
                </p>
              </div>

              <div className="rounded-xl bg-[#EEF3F6] p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                  Availability
                </p>

                <p className="mt-1 text-sm font-bold text-[#123B5D]">
                  {isInStock ? 'Available' : 'Out of stock'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </SlideUp>
    </>
  );
}