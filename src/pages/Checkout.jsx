import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { clearCart, getCartItems } from '../services/cartService'
import { submitPublicCheckoutRequest } from '../services/publicOrdersService'
import { clearUploadDraftFiles, getUploadDraftFiles } from '../services/uploadDraftVault'

const countryOptions = [
  'Nigeria',
  'Ghana',
  'Kenya',
  'South Africa',
  'United Kingdom',
  'United States',
  'Canada',
  'United Arab Emirates',
]

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

function Checkout() {
  const location = useLocation()
  const cartItems = useMemo(() => getCartItems(), [])
  const fallbackProduct = cartItems[0] || null
  const product = location.state?.product || fallbackProduct

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    country: '',
    streetAddress: '',
    phone: '',
    email: '',
    additionalNote: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const summaryItems = useMemo(() => {
    if (cartItems.length) return cartItems
    return product ? [{ ...product, quantity: 1 }] : []
  }, [cartItems, product])

  const totalItems = useMemo(() => summaryItems.reduce((sum, item) => sum + Number(item.quantity || 1), 0), [summaryItems])
  const subtotal = useMemo(() => {
    return summaryItems.reduce((sum, item) => {
      const price = parsePrice(item.price)
      if (price == null) return sum
      return sum + price * Number(item.quantity || 1)
    }, 0)
  }, [summaryItems])
  const hasUnpricedItems = useMemo(() => summaryItems.some((item) => parsePrice(item.price) == null), [summaryItems])

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!summaryItems.length) {
      setStatusMessage('Add at least one item before placing an order request.')
      return
    }

    setSubmitting(true)
    setStatusMessage('')

    try {
      const uploadOrderItems = summaryItems.filter(
        (item) => item.requestMode === 'upload' && item.uploadedDesignNames?.length,
      )

      const missingUploadBundle = uploadOrderItems.find((item) => {
        if (!item.uploadBundleId) return true
        return getUploadDraftFiles(item.uploadBundleId).length === 0
      })

      if (missingUploadBundle) {
        throw new Error('Your uploaded design file is no longer available. Please go back and upload it again before checkout.')
      }

      const attachedFiles = uploadOrderItems.flatMap((item) =>
        getUploadDraftFiles(item.uploadBundleId).map((entry) => entry.file),
      )

      const payload = {
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        country: form.country.trim(),
        street_address: form.streetAddress.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        additional_note: form.additionalNote.trim(),
        items: summaryItems.map((item) => ({
          slug: item.slug || '',
          title: item.title || 'Selected Product',
          price: item.price || 'Price on request',
          quantity: Number(item.quantity || 1),
          requestMode: item.requestMode || 'standard',
          specificationSummary: item.specificationSummary || '',
          uploadedDesignNames: Array.isArray(item.uploadedDesignNames) ? item.uploadedDesignNames : [],
        })),
      }

      await submitPublicCheckoutRequest(payload, attachedFiles)
      setSubmitted(true)
      setStatusMessage('')
      uploadOrderItems.forEach((item) => clearUploadDraftFiles(item.uploadBundleId))
      clearCart()
    } catch (error) {
      setStatusMessage(error.message || 'We could not submit your order request right now.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/15'

  return (
    <>
      <Navbar />
      <main>
        <section className="container-shell py-14 md:py-18">
          <p className="text-sm font-semibold uppercase tracking-widest text-navy">Checkout</p>
          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">Complete your order details</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Fill in your information and we’ll confirm pricing, production timeline, and delivery details.
          </p>
        </section>

        <section className="bg-[#F4F8FC] py-10 md:py-12">
          <div className="container-shell grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <h2 className="text-xl font-extrabold text-navy">Customer Information</h2>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <label className="text-sm font-semibold text-slate-700">
                  First Name
                  <input value={form.firstName} onChange={(e) => updateField('firstName', e.target.value)} className={inputClass} required />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Last Name
                  <input value={form.lastName} onChange={(e) => updateField('lastName', e.target.value)} className={inputClass} required />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Country
                  <select value={form.country} onChange={(e) => updateField('country', e.target.value)} className={inputClass} required>
                    <option value="">Select country</option>
                    {countryOptions.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Phone Number
                  <input value={form.phone} onChange={(e) => updateField('phone', e.target.value)} className={inputClass} required />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Email Address
                  <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} className={inputClass} required />
                </label>
                <label className="text-sm font-semibold text-slate-700 md:col-span-2">
                  Street Address
                  <input value={form.streetAddress} onChange={(e) => updateField('streetAddress', e.target.value)} className={inputClass} required />
                </label>
                <label className="text-sm font-semibold text-slate-700 md:col-span-2">
                  Additional Note
                  <textarea value={form.additionalNote} onChange={(e) => updateField('additionalNote', e.target.value)} rows={4} className={inputClass} placeholder="Design preferences, deadline, special instructions..." />
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary mt-5 rounded-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : 'Place Order Request'}
              </button>

              {statusMessage ? (
                <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                  {statusMessage}
                </p>
              ) : null}

              {submitted ? (
                <p className="mt-3 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
                  Thank you! Your order request has been submitted successfully. We&apos;ll contact you with the next step.
                </p>
              ) : null}
            </form>

            <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <h2 className="text-xl font-extrabold text-navy">Order Summary</h2>
              <div className="mt-4 space-y-3">
                {summaryItems.length ? (
                  summaryItems.map((item) => (
                    <div key={item.cartKey || item.slug || item.title} className="flex items-start justify-between gap-3 border-b border-slate-100 pb-2 text-sm">
                      <div>
                        <p className="font-semibold text-slate-800">{item.title || 'Selected Product'}</p>
                        <p className="text-xs text-slate-500">Qty: {Number(item.quantity || 1)}</p>
                        {item.specificationSummary ? (
                          <p className="mt-1 text-xs leading-5 text-slate-500">{item.specificationSummary}</p>
                        ) : null}
                        {item.uploadedDesignNames?.length ? (
                          <p className="mt-1 text-xs font-semibold text-emerald-700">
                            Uploaded: {item.uploadedDesignNames.join(', ')}
                          </p>
                        ) : null}
                      </div>
                      <p className="font-semibold text-navy">{item.price || 'Price on request'}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-600">No item in cart yet.</p>
                )}

                <div className="space-y-1 pt-2 text-sm text-slate-700">
                  <div className="flex items-center justify-between">
                    <span>Items</span>
                    <span className="font-semibold">{totalItems}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatNaira(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-base font-extrabold text-slate-900">
                    <span>Total</span>
                    <span>{formatNaira(subtotal)}</span>
                  </div>
                  {hasUnpricedItems ? (
                    <p className="text-xs text-amber-700">Some items are “Price on request”; final total will be confirmed.</p>
                  ) : null}
                </div>
              </div>

              <Link to="/products" className="mt-5 inline-block text-sm font-semibold text-navy hover:underline">
                ← Back to Products
              </Link>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Checkout
