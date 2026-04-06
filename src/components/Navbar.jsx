import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, ShoppingCart, X } from 'lucide-react'

const navItems = [
  { label: 'Products', to: '/products' },
  { label: 'Services', to: '/#services' },
  { label: 'How It Works', to: '/#how-it-works' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.hash])

  const isActive = (to) => {
    if (to.includes('#')) {
      const [path, hash] = to.split('#')
      return location.pathname === path && location.hash === `#${hash}`
    }
    return location.pathname === to
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/80 backdrop-blur ${scrolled ? 'border-slate-300' : 'border-transparent'}`}
    >
      <nav className="container-shell py-3">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="font-sora text-2xl font-extrabold tracking-tight text-navy">
            BILTA<span className="text-yellow">.</span>
          </Link>

          <div className="hidden items-center gap-5 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`text-sm font-semibold transition hover:text-navy ${
                  isActive(item.to) ? 'text-navy' : 'text-slate-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button
              className="relative p-2 text-slate-700 transition hover:text-navy"
              aria-label="Open cart"
            >
              <ShoppingCart size={18} />
              <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center bg-yellow px-1 text-[10px] font-bold text-navy">
                0
              </span>
            </button>
            <Link to="/contact" className="btn-primary text-sm">
              Get a Quote
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              className="relative p-2 text-slate-700"
              aria-label="Open cart"
            >
              <ShoppingCart size={18} />
              <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center bg-yellow px-1 text-[10px] font-bold text-navy">
                0
              </span>
            </button>

            <button
              onClick={() => setOpen((v) => !v)}
              className="rounded-lg border border-slate-300 p-2 text-slate-700"
              aria-label="Toggle menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 lg:hidden ${open ? 'max-h-[420px] pt-4' : 'max-h-0'}`}
        >
          <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`block rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive(item.to)
                    ? 'bg-navy text-white'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-navy'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/contact" className="btn-primary block text-center text-sm">
              Get a Quote
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar