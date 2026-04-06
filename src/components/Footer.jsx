import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-navy-deeper text-white">
      <div className="container-shell grid gap-8 py-12 md:grid-cols-3">
        <div>
          <p className="font-sora text-2xl font-extrabold tracking-tight">
            BILTA<span className="text-yellow">.</span>
          </p>
          <p className="mt-3 max-w-sm text-sm text-slate-300">
            Professional print, branding, and packaging partner helping businesses show up better.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white">Services</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>Printing</li>
            <li>Branding Materials</li>
            <li>Packaging & Labels</li>
            <li>Event Production</li>
            <li>Book Printing</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white">Company</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>
              <Link to="/about" className="transition hover:text-yellow">
                About
              </Link>
            </li>
            <li>
              <Link to="/products" className="transition hover:text-yellow">
                Products
              </Link>
            </li>
            <li>
              <Link to="/contact" className="transition hover:text-yellow">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4">
        <div className="container-shell flex flex-col justify-between gap-2 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Bilta. All rights reserved.</p>
          <p>Print · Brand · Package</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer