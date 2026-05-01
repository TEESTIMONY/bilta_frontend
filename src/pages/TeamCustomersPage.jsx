import { useEffect, useMemo, useState } from 'react'
import Footer from '../components/Footer'
import TeamNavbar from '../components/TeamNavbar'
import { createCustomer, getCustomersData } from '../services/customersService'

function TeamCustomersPage() {
  const [customers, setCustomers] = useState([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', city: '' })

  async function loadCustomers() {
    const data = await getCustomersData()
    setCustomers(data.customers)
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return customers
    return customers.filter((item) => {
      return (
        String(item.full_name || '').toLowerCase().includes(q) ||
        String(item.phone || '').toLowerCase().includes(q) ||
        String(item.email || '').toLowerCase().includes(q)
      )
    })
  }, [customers, query])

  const stats = useMemo(() => {
    const returning = customers.filter((item) => item.isReturningCustomer).length
    return {
      total: customers.length,
      returning,
      firstTime: customers.length - returning,
    }
  }, [customers])

  async function handleCreate(e) {
    e.preventDefault()
    if (!form.full_name) {
      setStatus('Customer name is required.')
      return
    }
    const created = await createCustomer(form)
    setCustomers((current) => [created, ...current])
    setForm({ full_name: '', phone: '', email: '', city: '' })
    setStatus('Customer added.')
  }

  return (
    <>
      <TeamNavbar />
      <main>
        <section className="container-shell py-10">
          <h1 className="text-3xl font-extrabold text-navy">Customers</h1>
          <p className="mt-2 text-sm text-slate-600">Manage your customer contact list and track first-time vs returning buyers.</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Stat label="Total Customers" value={stats.total} />
            <Stat label="Returning" value={stats.returning} />
            <Stat label="First-time" value={stats.firstTime} />
          </div>

          <form onSubmit={handleCreate} className="mt-8 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-bold text-navy">Add Customer</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Full name" value={form.full_name} onChange={(e) => setForm((curr) => ({ ...curr, full_name: e.target.value }))} />
              <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Phone" value={form.phone} onChange={(e) => setForm((curr) => ({ ...curr, phone: e.target.value }))} />
              <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Email" value={form.email} onChange={(e) => setForm((curr) => ({ ...curr, email: e.target.value }))} />
              <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="City" value={form.city} onChange={(e) => setForm((curr) => ({ ...curr, city: e.target.value }))} />
            </div>
            <button className="btn-primary mt-3" type="submit">Add Customer</button>
          </form>

          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              placeholder="Search by name, phone, email"
            />
          </div>

          {status ? (
            <div className="mt-4 rounded-md border border-navy/20 bg-navy/5 px-4 py-3 text-sm text-slate-700">{status}</div>
          ) : null}

          <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[680px] text-left text-sm md:min-w-[820px]">
              <thead className="bg-slate-100 text-xs uppercase tracking-[0.12em] text-slate-600">
                <tr>
                  <th className="px-3 py-3">Name</th>
                  <th className="px-3 py-3">Phone</th>
                  <th className="px-3 py-3">Email</th>
                  <th className="px-3 py-3">City</th>
                  <th className="px-3 py-3">Orders</th>
                  <th className="px-3 py-3">Customer Type</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length ? (
                  filtered.map((item) => (
                    <tr key={item.id} className="border-t border-slate-100">
                      <td className="px-3 py-3 font-semibold text-slate-900">{item.full_name}</td>
                      <td className="px-3 py-3">{item.phone || '-'}</td>
                      <td className="px-3 py-3">{item.email || '-'}</td>
                      <td className="px-3 py-3">{item.city || '-'}</td>
                      <td className="px-3 py-3">{item.ordersCount}</td>
                      <td className="px-3 py-3">
                        <span className={`rounded-full px-2 py-1 text-xs font-bold ${item.isReturningCustomer ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                          {item.isReturningCustomer ? 'Returning' : 'First-time'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-3 py-4 text-slate-600" colSpan={6}>No customers found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-slate-900">{value}</p>
    </div>
  )
}

export default TeamCustomersPage
