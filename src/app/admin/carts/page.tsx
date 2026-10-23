"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiMail,
  FiPhone,
  FiRefreshCw,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";
import { adminCartService } from "@/app/services/admin-cart.service";
import type { AdminCart } from "@/app/types/admin-cart";

function formatMoney(amount: number | null): string {
  if (amount === null) return "Price unavailable";

  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Unavailable";

  return new Intl.DateTimeFormat("en-RW", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getProductImage(cartItem: AdminCart["items"][number]): string {
  const primaryImage = cartItem.product.images.find(
    (image) => image.isPrimary,
  );

  return (
    primaryImage?.url ||
    cartItem.product.images[0]?.url ||
    "/images/placeholder-garment.jpg"
  );
}

export default function AdminCartsPage() {
  const [carts, setCarts] = useState<AdminCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadCarts = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await adminCartService.getAllCarts();
      setCarts(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load customer carts. Please try again.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadCarts();
  }, [loadCarts]);

  const totalCustomers = carts.length;
  const customersWithItems = carts.filter(
    (cart) => cart.items.length > 0,
  ).length;
  const emptyCarts = totalCustomers - customersWithItems;
  const totalItems = carts.reduce(
    (total, cart) => total + cart.totalQuantity,
    0,
  );

  return (
    <main className="space-y-6 p-4 sm:p-6 lg:p-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          
          <h1 className="mt-1 text-2xl font-bold text-[#123B5D] sm:text-3xl">
            Cart Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            View registered customers and the products in their carts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadCarts(true)}
          disabled={loading || refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#123B5D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0D2C46] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiRefreshCw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Refreshing..." : "Refresh carts"}
        </button>
      </section>

      {error && (
        <section
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">Could not load customer carts</p>
            <p className="mt-1">{error}</p>
            <button
              type="button"
              onClick={() => void loadCarts()}
              className="mt-2 font-semibold underline"
            >
              Try again
            </button>
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Registered customers"
          value={loading ? "—" : String(totalCustomers)}
          icon={<FiUser className="h-5 w-5" />}
        />
        <SummaryCard
          label="Customers with items"
          value={loading ? "—" : String(customersWithItems)}
          icon={<FiShoppingCart className="h-5 w-5" />}
        />
        <SummaryCard
          label="Empty carts"
          value={loading ? "—" : String(emptyCarts)}
          icon={<FiUser className="h-5 w-5" />}
        />
        <SummaryCard
          label="Items across carts"
          value={loading ? "—" : String(totalItems)}
          icon={<FiShoppingCart className="h-5 w-5" />}
        />
      </section>

      {loading ? (
        <section
          aria-live="polite"
          className="rounded-xl border border-gray-200 bg-white p-10 text-center"
        >
          <FiRefreshCw className="mx-auto h-7 w-7 animate-spin text-[#123B5D]" />
          <p className="mt-3 text-sm text-gray-500">
            Loading customer carts...
          </p>
        </section>
      ) : carts.length === 0 && !error ? (
        <section className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <FiShoppingCart className="mx-auto h-10 w-10 text-gray-400" />
          <h2 className="mt-3 text-lg font-semibold text-gray-800">
            No registered customers found
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Customer carts will appear here when customer accounts exist.
          </p>
        </section>
      ) : (
        <section className="space-y-5">
          {carts.map((cart) => (
            <article
              key={cart.userId}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              <header className="flex flex-col gap-4 border-b border-gray-100 bg-gray-50 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
                <div className="min-w-0">
                  <h2 className="break-words text-lg font-bold text-gray-900">
                    {cart.customer.name || "Unnamed customer"}
                  </h2>

                  <div className="mt-2 flex flex-col gap-2 text-sm text-gray-600 sm:flex-row sm:flex-wrap sm:gap-x-5">
                    <span className="inline-flex items-center gap-2 break-all">
                      <FiMail className="h-4 w-4 shrink-0" />
                      {cart.customer.email}
                    </span>

                    {cart.customer.phone && (
                      <span className="inline-flex items-center gap-2">
                        <FiPhone className="h-4 w-4 shrink-0" />
                        {cart.customer.phone}
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    Last updated: {formatDate(cart.updatedAt)}
                  </p>
                </div>

                <div className="shrink-0 sm:text-right">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      cart.items.length > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {cart.items.length > 0 ? "Has items" : "Empty cart"}
                  </span>

                  <p className="mt-2 text-sm text-gray-600">
                    {cart.itemCount} product type
                    {cart.itemCount === 1 ? "" : "s"} ·{" "}
                    {cart.totalQuantity} item
                    {cart.totalQuantity === 1 ? "" : "s"}
                  </p>
                </div>
              </header>

              {cart.items.length === 0 ? (
                <div className="p-6 text-center sm:p-8">
                  <FiShoppingCart className="mx-auto h-8 w-8 text-gray-300" />
                  <p className="mt-2 font-medium text-gray-700">
                    This customer&apos;s cart is empty.
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Products added to their account cart will appear here.
                  </p>
                </div>
              ) : (
                <>
                  <div className="divide-y divide-gray-100">
                    {cart.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5"
                      >
                        <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-24 sm:w-24">
                          <Image
                            src={getProductImage(item)}
                            alt={item.product.name}
                            fill
                            unoptimized
                            sizes="96px"
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {item.product.name}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            {item.product.productType.replace(/_/g, " ")}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2 text-xs">
                            {item.size && (
                              <span className="rounded-md bg-gray-100 px-2 py-1 text-gray-700">
                                Size: {item.size}
                              </span>
                            )}

                            {item.color && (
                              <span className="rounded-md bg-gray-100 px-2 py-1 text-gray-700">
                                Color: {item.color}
                              </span>
                            )}

                            <span className="rounded-md bg-blue-50 px-2 py-1 text-blue-800">
                              Quantity: {item.quantity}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 sm:text-right">
                          <p className="text-sm text-gray-500">
                            {formatMoney(item.product.price)} each
                          </p>
                          <p className="mt-1 font-bold text-[#123B5D]">
                            {formatMoney(item.lineTotal)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <footer className="flex flex-col gap-2 border-t border-gray-100 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <p className="text-xs text-gray-500">
                      Estimated total using current product prices.
                    </p>
                    <div className="sm:text-right">
                      <p className="text-xs text-gray-500">Estimated total</p>
                      <p className="text-xl font-bold text-[#123B5D]">
                        {formatMoney(cart.totalAmount)}
                      </p>
                    </div>
                  </footer>
                </>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

interface SummaryCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function SummaryCard({ label, value, icon }: SummaryCardProps) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-gray-500">{label}</p>
        <span className="rounded-lg bg-blue-50 p-2 text-[#123B5D]">
          {icon}
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
    </article>
  );
}
