import { Suspense, lazy, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Products = lazy(() => import('./pages/Products'))
const ProductDetails = lazy(() => import('./pages/ProductDetails'))
const Contact = lazy(() => import('./pages/Contact'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Cart = lazy(() => import('./pages/Cart'))
const Services = lazy(() => import('./pages/Services'))
const BusinessKits = lazy(() => import('./pages/BusinessKits'))
const EventBranding = lazy(() => import('./pages/EventBranding'))
const BookPrinting = lazy(() => import('./pages/BookPrinting'))
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'))
const FAQ = lazy(() => import('./pages/FAQ'))
const TeamProductsEditor = lazy(() => import('./pages/TeamProductsEditor'))
const TeamOrdersDashboard = lazy(() => import('./pages/TeamOrdersDashboard'))
const TeamCustomersPage = lazy(() => import('./pages/TeamCustomersPage'))

const teamEditorEnabled = import.meta.env.VITE_ENABLE_TEAM_EDITOR === 'true'
const teamAccessCode = String(import.meta.env.VITE_TEAM_ACCESS_CODE || '').trim()
const TEAM_ACCESS_STORAGE_KEY = 'bilta_team_access_granted'

function TeamAccessGate({ children }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const accessGranted =
    typeof window !== 'undefined' &&
    window.localStorage.getItem(TEAM_ACCESS_STORAGE_KEY) === 'true'

  if (teamAccessCode && accessGranted) {
    return children
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!teamAccessCode) {
      setError('Team access code is not configured yet. Set VITE_TEAM_ACCESS_CODE in environment variables.')
      return
    }
    if (code.trim() !== teamAccessCode) {
      setError('Invalid access code. Please try again.')
      return
    }
    window.localStorage.setItem(TEAM_ACCESS_STORAGE_KEY, 'true')
    window.location.reload()
  }

  return (
    <main className="min-h-screen grid place-items-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-navy">Team Area Security</p>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-900">Enter Access Code</h1>
        <p className="mt-2 text-sm text-slate-600">This page is restricted. Enter the admin code to continue.</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <label className="block text-sm font-semibold text-slate-700">
            Access code
            <input
              type="password"
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
                setError('')
              }}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/20"
              placeholder="Enter code"
              autoFocus
            />
          </label>
          {error ? <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          <button type="submit" className="btn-primary w-full">Continue</button>
        </form>
      </section>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="min-h-screen grid place-items-center px-4 text-sm text-slate-600">
            Loading page...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetails />} />
          <Route path="/services" element={<Services />} />
          <Route path="/business-kits" element={<BusinessKits />} />
          <Route path="/event-branding" element={<EventBranding />} />
          <Route path="/book-printing" element={<BookPrinting />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          {teamEditorEnabled ? (
            <Route
              path="/team/products-editor"
              element={
                <TeamAccessGate>
                  <TeamProductsEditor />
                </TeamAccessGate>
              }
            />
          ) : null}
          {teamEditorEnabled ? (
            <Route
              path="/team/orders"
              element={
                <TeamAccessGate>
                  <TeamOrdersDashboard />
                </TeamAccessGate>
              }
            />
          ) : null}
          {teamEditorEnabled ? (
            <Route
              path="/team/customers"
              element={
                <TeamAccessGate>
                  <TeamCustomersPage />
                </TeamAccessGate>
              }
            />
          ) : null}
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
