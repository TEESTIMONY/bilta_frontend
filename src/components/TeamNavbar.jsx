import { Link, useLocation } from 'react-router-dom'

const teamLinks = [
  { label: 'Products', to: '/team/products-editor' },
  { label: 'Orders', to: '/team/orders' },
  { label: 'Customers', to: '/team/customers' },
]

function TeamNavbar() {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950 text-white">
      <nav className="container-shell py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Bilta Internal</p>
            <h1 className="text-lg font-extrabold leading-tight">Team CMS</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {teamLinks.map((item) => {
              const isActive = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-md border px-3 py-1.5 text-sm font-semibold transition ${
                    isActive
                      ? 'border-yellow bg-yellow text-slate-900'
                      : 'border-slate-700 text-slate-200 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}

            <Link
              to="/"
              className="rounded-md border border-slate-700 px-3 py-1.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
            >
              Main Website
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default TeamNavbar
