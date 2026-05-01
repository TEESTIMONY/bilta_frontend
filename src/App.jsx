import { Suspense, lazy } from 'react'
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
          {teamEditorEnabled ? <Route path="/team/products-editor" element={<TeamProductsEditor />} /> : null}
          {teamEditorEnabled ? <Route path="/team/orders" element={<TeamOrdersDashboard />} /> : null}
          {teamEditorEnabled ? <Route path="/team/customers" element={<TeamCustomersPage />} /> : null}
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
