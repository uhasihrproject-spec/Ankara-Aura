"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CheckoutPage() {
  const { items, totalPrice, totalQty } = useCart();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.24em] text-black/45">Checkout</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">Your cart, ready to confirm</h1>
        <p className="mt-2 text-sm text-black/60">{totalQty} item{totalQty === 1 ? "" : "s"} carried over from your bag.</p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-black/10 p-8">
          <p className="text-black/70">Your cart is empty.</p>
          <Link href="/shop" className="mt-4 inline-block rounded-xl bg-black px-4 py-2 text-sm text-white">Go to shop</Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border border-black/10 p-5">
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={`${item.slug}-${item.size}`} className="flex items-center justify-between border-b border-black/10 pb-3">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-black/55">Size {item.size} • Qty {item.qty}</p>
                  </div>
                  <p className="font-medium">GH₵ {(item.qty * item.price).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          </div>

          <aside className="h-fit rounded-2xl border border-black/10 p-5">
            <h2 className="text-sm uppercase tracking-[0.2em] text-black/55">Order Summary</h2>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span>Subtotal</span>
              <span>GH₵ {totalPrice.toLocaleString()}</span>
            </div>
            <button className="mt-5 w-full rounded-xl bg-black px-4 py-3 text-sm font-medium text-white hover:bg-black/90">
              Place Order
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
