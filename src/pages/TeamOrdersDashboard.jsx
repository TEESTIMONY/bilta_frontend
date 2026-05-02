import { useEffect, useMemo, useState } from 'react'
import Footer from '../components/Footer'
import TeamNavbar from '../components/TeamNavbar'
import { createManualOrder, getOrdersData, updateOrderQuickFields } from '../services/ordersService'

const orderStatusOptions = [
  'new',
  'confirmed',
  'in_design',
  'in_production',
  'ready',
  'dispatched',
  'delivered',
  'delayed',
  'cancelled',
]

function formatMoney(value) {
  const amount = Number(value || 0)
  return `₦${amount.toLocaleString('en-NG')}`
}

function TeamOrdersDashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusMessage, setStatusMessage] = useState('')
  const [form, setForm] = useState({ customerName: '', phone: '', totalAmount: '', notes: '' })

  async function loadOrders() {
    setLoading(true)
    try {
      const data = await getOrdersData()
      setOrders(data.orders)
    } catch (error) {
      setStatusMessage(`Failed to load orders: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const summary = useMemo(() => {
    const paidOrders = orders.filter((item) => item.paymentStatus === 'paid')
    const delivered = orders.filter((item) => item.status === 'delivered').length
    const pendingMessaging = orders.filter((item) => !item.hasBeenMessaged).length
    const revenue = paidOrders.reduce((acc, item) => acc + Number(item.amountPaid || 0), 0)

    return {
      total: orders.length,
      paid: paidOrders.length,
      delivered,
      pendingMessaging,
      revenue,
    }
  }, [orders])

  async function handleStatusChange(orderId, value) {
    const updated = await updateOrderQuickFields(orderId, { status: value })
    setOrders((current) => current.map((item) => (item.id === orderId ? updated : item)))
    setStatusMessage('Order status updated.')
  }

  async function handleMessagedToggle(order) {
    const updated = await updateOrderQuickFields(order.id, { hasBeenMessaged: !order.hasBeenMessaged })
    setOrders((current) => current.map((item) => (item.id === order.id ? updated : item)))
    setStatusMessage('Order message flag updated.')
  }

  async function handleCreateManualOrder(e) {
    e.preventDefault()

    if (!form.customerName || !form.totalAmount) {
      setStatusMessage('Customer name and amount are required for a manual job order.')
      return
    }

    const created = await createManualOrder(form)
    setOrders((current) => [created, ...current])
    setForm({ customerName: '', phone: '', totalAmount: '', notes: '' })
    setStatusMessage('Manual job order created successfully.')
  }

  return (
    <>
      <TeamNavbar />
      <main>
        <section className="container-shell py-10">
          <h1 className="text-3xl font-extrabold text-navy">Orders Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">Track paid orders, status workflow, messaging state, and create manual job orders.</p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <Stat label="Total Orders" value={summary.total} />
            <Stat label="Paid Orders" value={summary.paid} />
            <Stat label="Delivered" value={summary.delivered} />
            <Stat label="Need Messaging" value={summary.pendingMessaging} />
            <Stat label="Paid Revenue" value={formatMoney(summary.revenue)} />
          </div>

          <form onSubmit={handleCreateManualOrder} className="mt-8 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-bold text-navy">Create Manual Job Order</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <input
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="Customer name"
                value={form.customerName}
                onChange={(e) => setForm((curr) => ({ ...curr, customerName: e.target.value }))}
              />
              <input
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm((curr) => ({ ...curr, phone: e.target.value }))}
              />
              <input
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="Total amount"
                value={form.totalAmount}
                onChange={(e) => setForm((curr) => ({ ...curr, totalAmount: e.target.value }))}
              />
              <input
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="Notes"
                value={form.notes}
                onChange={(e) => setForm((curr) => ({ ...curr, notes: e.target.value }))}
              />
            </div>
            <button type="submit" className="btn-primary mt-3">Create Job Order</button>
          </form>

          {statusMessage ? (
            <div className="mt-4 rounded-md border border-navy/20 bg-navy/5 px-4 py-3 text-sm text-slate-700">{statusMessage}</div>
          ) : null}

          <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[760px] text-left text-sm md:min-w-[980px]">
              <thead className="bg-slate-100 text-xs uppercase tracking-[0.12em] text-slate-600">
                <tr>
                  <th className="px-3 py-3">Order</th>
                  <th className="px-3 py-3">Customer</th>
                  <th className="px-3 py-3">Source</th>
                  <th className="px-3 py-3">Amount</th>
                  <th className="px-3 py-3">Payment</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Messaged?</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-3 py-4" colSpan={7}>Loading orders...</td>
                  </tr>
                ) : orders.length ? (
                  orders.map((order) => (
                    <tr key={order.id} className="border-t border-slate-100">
                      <td className="px-3 py-3 font-semibold text-slate-900">{order.code}</td>
                      <td className="px-3 py-3">{order.customerName || '-'}</td>
                      <td className="px-3 py-3 uppercase">{order.source}</td>
                      <td className="px-3 py-3">{formatMoney(order.totalAmount)}</td>
                      <td className="px-3 py-3 uppercase">{order.paymentStatus}</td>
                      <td className="px-3 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                        >
                          {orderStatusOptions.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-3">
                        <button
                          onClick={() => handleMessagedToggle(order)}
                          className={`rounded-md border px-2 py-1 text-xs font-semibold ${
                            order.hasBeenMessaged
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                              : 'border-amber-200 bg-amber-50 text-amber-700'
                          }`}
                        >
                          {order.hasBeenMessaged ? 'Yes' : 'No'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-3 py-4 text-slate-600" colSpan={7}>No orders yet. Create one from the form above.</td>
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

export default TeamOrdersDashboard
