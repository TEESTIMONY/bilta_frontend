import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { clearCart, getCartItems, removeCartItem, updateCartItemQuantity } from '../services/cartService'

function parsePrice(value) {
  const raw = String(value ?? '').trim()
  const numericCandidate = raw.replace(/[₦,\s]/g, '')
  if (!/^\d+(\.\d+)?$/.test(numericCandidate)) return null
  const amount = Number(numericCandidate)
  return Number.isFinite(amount) ? amount : null
}

function formatNaira(value) {
  return `₦${Number(value || 0).toLocaleString('en-NG')}`
}

function Cart() {
  const [items, setItems] = useState(() => getCartItems())

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const unitPrice = parsePrice(item.price)
      if (unitPrice == null) return sum
      return sum + unitPrice * item.quantity
    }, 0)
  }, [items])
  const shippingFee = useMemo(() => (items.length ? 0 : 0), [items.length])
  const total = subtotal + shippingFee
  const hasUnpricedItems = useMemo(() => items.some((item) => parsePrice(item.price) == null), [items])

  function handleRemove(slug) {
    removeCartItem(slug)
    setItems(getCartItems())
  }

  function handleQty(slug, quantity) {
    updateCartItemQuantity(slug, quantity)
    setItems(getCartItems())
  }

  function handleClear() {
    clearCart()
    setItems([])
  }

  return (
    <>
      <Navbar />
      <main>
        <section className="container-shell py-14 md:py-18">
          <p className="text-sm font-semibold uppercase tracking-widest text-navy">Cart</p>
          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">Your Cart</h1>
        </section>

        <section className="bg-[#F4F8FC] py-10 md:py-12">
          <div className="container-shell grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              {items.length ? (
                <div className="space-y-4">
                  {items.map((item) => (
                    <article key={item.cartKey} className="flex gap-4 border-b border-slate-100 pb-4">
                      <img src={item.image} alt={item.title} className="h-28 w-28 rounded-md border border-slate-200 object-cover sm:h-32 sm:w-32" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-900">{item.title}</p>
                        <p className="mt-1 text-sm text-navy">{item.price}</p>
                        {item.specificationSummary ? (
                          <p className="mt-2 text-xs leading-5 text-slate-500">{item.specificationSummary}</p>
                        ) : null}
                        {item.uploadedDesignNames.length ? (
                          <p className="mt-1 text-xs font-semibold text-emerald-700">
                            Design uploaded: {item.uploadedDesignNames.join(', ')}
                          </p>
                        ) : null}
                        <div className="mt-2 flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQty(item.cartKey, e.target.value)}
                            className="w-20 rounded-md border border-slate-300 px-2 py-1 text-sm"
                          />
                          <button onClick={() => handleRemove(item.cartKey)} className="text-xs font-semibold text-red-600 hover:underline">
                            Remove
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                  <button onClick={handleClear} className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    Clear Cart
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-slate-600">Your cart is currently empty.</p>
                  <Link to="/products" className="mt-3 inline-block text-sm font-semibold text-navy hover:underline">Browse products</Link>
                </div>
              )}
            </div>

            <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <h2 className="text-xl font-extrabold text-navy">Cart Summary</h2>

              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <div className="flex items-center justify-between">
                  <span>Items</span>
                  <span className="font-semibold">{totalItems}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatNaira(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold">{shippingFee === 0 ? 'Calculated at checkout' : formatNaira(shippingFee)}</span>
                </div>
              </div>

              <div className="mt-4 border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between text-base font-extrabold text-slate-900">
                  <span>Total</span>
                  <span>{formatNaira(total)}</span>
                </div>
                {hasUnpricedItems ? (
                  <p className="mt-2 text-xs text-amber-700">
                    Some cart items are marked “Price on request”. Final total will be confirmed at checkout.
                  </p>
                ) : null}
              </div>

              <Link
                to="/products"
                className="mt-4 inline-flex w-full items-center justify-center rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Continue Shopping
              </Link>

              <Link to="/checkout" className="btn-primary mt-5 inline-block w-full rounded-md text-center">
                Proceed to Checkout
              </Link>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Cart
