import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import Footer from '../components/Footer'
import TeamNavbar from '../components/TeamNavbar'
import { useAuth } from '../context/authContext'
import { createCustomer, getCustomersData } from '../services/customersService'
import {
  createJob,
  ensureWalkInCustomer,
  getDailySummary,
  getJobsQueueData,
  updateOrderQuickFields,
} from '../services/ordersService'

const orderStatusOptions = [
  'pending',
  'in_progress',
  'ready_for_pickup',
  'awaiting_delivery',
  'completed',
  'cancelled',
]

const jobTypeOptions = [
  'printing',
  'photocopy',
  'binding',
  'lamination',
  'design',
  'large_format',
  'scanning',
  'branding',
]

const defaultForm = {
  customerName: '',
  phone: '',
  businessName: '',
  customerType: 'recurring',
  jobType: 'printing',
  description: '',
  quantity: '1',
  unitPrice: '',
  amountPaid: '',
  deadline: '',
  specialInstructions: '',
  projectScopeNote: '',
}

const queueViewOptions = [
  { value: 'needs_attention', label: 'Needs Attention' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'ready', label: 'Ready' },
  { value: 'all', label: 'All Jobs' },
]

function getTodayDateValue() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

function formatDateTime(value) {
  if (!value) return 'No deadline'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'No deadline'
  return parsed.toLocaleString('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function formatDate(value) {
  if (!value) return 'No activity yet'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'No activity yet'
  return parsed.toLocaleDateString('en-NG', { dateStyle: 'medium' })
}

function toDateTimeLocalValue(value) {
  if (!value) return ''
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return ''
  const year = parsed.getFullYear()
  const month = String(parsed.getMonth() + 1).padStart(2, '0')
  const day = String(parsed.getDate()).padStart(2, '0')
  const hours = String(parsed.getHours()).padStart(2, '0')
  const minutes = String(parsed.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

function formatFileSize(value) {
  const size = Number(value || 0)
  if (!size) return '0 KB'
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function titleCase(value) {
  return String(value || '')
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function TeamOrdersDashboard() {
  const { isOwner } = useAuth()
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [dailySummary, setDailySummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [savingOrderId, setSavingOrderId] = useState(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [customerMode, setCustomerMode] = useState('walk_in')
  const [customerSearch, setCustomerSearch] = useState('')
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [summaryDate, setSummaryDate] = useState(getTodayDateValue())
  const [form, setForm] = useState(defaultForm)
  const [queueEdits, setQueueEdits] = useState({})
  const [expandedOrderId, setExpandedOrderId] = useState(null)
  const [queueSearch, setQueueSearch] = useState('')
  const [queueView, setQueueView] = useState('needs_attention')
  const [visibleQueueCount, setVisibleQueueCount] = useState(6)
  const deferredCustomerSearch = useDeferredValue(customerSearch)
  const deferredQueueSearch = useDeferredValue(queueSearch)

  const loadDashboard = useCallback(async (date = summaryDate) => {
    setLoading(true)
    try {
      const [queueData, customerData, summaryData] = await Promise.all([
        getJobsQueueData(),
        getCustomersData(),
        getDailySummary(date),
      ])

      setOrders(queueData.orders)
      setCustomers(customerData.customers)
      setDailySummary(summaryData.summary)
    } catch (error) {
      setStatusMessage(`Failed to load desk dashboard: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }, [summaryDate])

  useEffect(() => {
    loadDashboard(summaryDate)
  }, [loadDashboard, summaryDate])

  useEffect(() => {
    setQueueEdits(
      Object.fromEntries(
        orders.map((order) => [
          order.id,
          {
            quantity: String(Math.max(1, Number(order.quantity || 1))),
            unitPrice: String(Number(order.unitPrice || 0)),
            amountPaid: String(Number(order.amountPaid || 0)),
            deadline: toDateTimeLocalValue(order.deadline),
          },
        ]),
      ),
    )
  }, [orders])

  useEffect(() => {
    setExpandedOrderId((current) => {
      if (current && orders.some((order) => order.id === current)) return current
      return null
    })
  }, [orders])

  useEffect(() => {
    setVisibleQueueCount(6)
  }, [deferredQueueSearch, queueView])

  const filteredCustomers = useMemo(() => {
    const query = deferredCustomerSearch.trim().toLowerCase()
    const sorted = [...customers].sort((a, b) => {
      const aTime = a?.last_job_date ? new Date(a.last_job_date).getTime() : 0
      const bTime = b?.last_job_date ? new Date(b.last_job_date).getTime() : 0
      return bTime - aTime
    })

    if (!query) return sorted.slice(0, 8)

    return sorted.filter((item) => {
      const fullName = String(item.full_name || '').toLowerCase()
      const phone = String(item.phone || '').toLowerCase()
      const business = String(item.business_name || '').toLowerCase()
      return fullName.includes(query) || phone.includes(query) || business.includes(query)
    })
  }, [customers, deferredCustomerSearch])

  const deskStats = useMemo(() => {
    const overdue = orders.filter((item) => item.isOverdue).length
    const unpaid = orders.filter((item) => item.paymentStatus === 'unpaid').length
    const partiallyPaid = orders.filter((item) => item.paymentStatus === 'partial').length
    const activeRevenue = orders.reduce((sum, item) => sum + Number(item.totalAmount || 0), 0)

    return {
      activeJobs: orders.length,
      overdue,
      unpaid,
      partiallyPaid,
      activeRevenue,
    }
  }, [orders])

  const customerSegments = useMemo(() => {
    const recurring = customers.filter((item) => item.customer_type === 'recurring').length
    const premium = customers.filter((item) => item.customer_type === 'premium').length
    const followUp = customers.filter((item) => item.follow_up_flag).length
    return { recurring, premium, followUp }
  }, [customers])

  const filteredQueueOrders = useMemo(() => {
    const query = deferredQueueSearch.trim().toLowerCase()

    const matchesFilter = (order) => {
      if (queueView === 'all') return true
      if (queueView === 'needs_attention') return order.isOverdue || order.status === 'pending'
      if (queueView === 'in_progress') {
        return order.status === 'in_progress' || order.status === 'awaiting_delivery'
      }
      if (queueView === 'ready') return order.status === 'ready_for_pickup'
      return true
    }

    const matchesQuery = (order) => {
      if (!query) return true
      const haystack = [
        order.customerName,
        order.customerPhone,
        order.customerEmail,
        order.description,
        order.projectScopeNote,
        order.specialInstructions,
        order.jobType,
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(query)
    }

    return orders
      .filter((order) => matchesFilter(order) && matchesQuery(order))
      .sort((a, b) => {
        if (a.isOverdue !== b.isOverdue) return a.isOverdue ? -1 : 1
        const aDeadline = a.deadline ? new Date(a.deadline).getTime() : Number.MAX_SAFE_INTEGER
        const bDeadline = b.deadline ? new Date(b.deadline).getTime() : Number.MAX_SAFE_INTEGER
        return aDeadline - bDeadline
      })
  }, [deferredQueueSearch, orders, queueView])

  const visibleQueueOrders = useMemo(
    () => filteredQueueOrders.slice(0, visibleQueueCount),
    [filteredQueueOrders, visibleQueueCount],
  )

  const queueCounts = useMemo(
    () => ({
      needsAttention: orders.filter((order) => order.isOverdue || order.status === 'pending').length,
      inProgress: orders.filter(
        (order) => order.status === 'in_progress' || order.status === 'awaiting_delivery',
      ).length,
      ready: orders.filter((order) => order.status === 'ready_for_pickup').length,
      all: orders.length,
    }),
    [orders],
  )

  const totalAmount = useMemo(() => {
    const quantity = Math.max(1, Number(form.quantity || 1))
    const unitPrice = Number(form.unitPrice || 0)
    return quantity * unitPrice
  }, [form.quantity, form.unitPrice])

  const balanceDue = Math.max(0, totalAmount - Number(form.amountPaid || 0))

  async function refreshAfterJobChange(message) {
    await loadDashboard(summaryDate)
    setStatusMessage(message)
  }

  async function handleStatusChange(orderId, value) {
    try {
      await updateOrderQuickFields(orderId, { status: value })
      await refreshAfterJobChange('Job status updated successfully.')
    } catch (error) {
      setStatusMessage(`Could not update status: ${error.message}`)
    }
  }

  function updateQueueEdit(orderId, key, value) {
    setQueueEdits((current) => ({
      ...current,
      [orderId]: {
        ...current[orderId],
        [key]: value,
      },
    }))
  }

  async function handleSaveQueueDetails(order) {
    const draft = queueEdits[order.id]
    if (!draft) return

    const nextQuantity = Math.max(1, Number(draft.quantity || 1))
    const nextUnitPrice = Number(draft.unitPrice || 0)
    const nextAmountPaid = Number(draft.amountPaid || 0)

    if (Number.isNaN(nextQuantity) || nextQuantity <= 0) {
      setStatusMessage('Quantity must be at least 1.')
      return
    }

    if (Number.isNaN(nextUnitPrice) || nextUnitPrice < 0) {
      setStatusMessage('Unit price cannot be negative.')
      return
    }

    if (Number.isNaN(nextAmountPaid) || nextAmountPaid < 0) {
      setStatusMessage('Amount paid cannot be negative.')
      return
    }

    setSavingOrderId(order.id)
    try {
      const payload = {
        deadline: draft.deadline ? new Date(draft.deadline).toISOString() : null,
      }

      if (isOwner) {
        payload.quantity = nextQuantity
        payload.unit_price = String(nextUnitPrice)
        payload.amount_paid = String(nextAmountPaid)
      }

      await updateOrderQuickFields(order.id, payload)
      await refreshAfterJobChange('Queue job details updated successfully.')
    } catch (error) {
      setStatusMessage(`Could not update job details: ${error.message}`)
    } finally {
      setSavingOrderId(null)
    }
  }

  function toggleOrderExpanded(orderId) {
    setExpandedOrderId((current) => (current === orderId ? null : orderId))
  }

  async function resolveCustomerId() {
    if (customerMode === 'walk_in') {
      const walkInCustomer = await ensureWalkInCustomer()
      return walkInCustomer.id
    }

    if (customerMode === 'existing') {
      if (!selectedCustomerId) {
        throw new Error('Select an existing customer before saving the job.')
      }
      return Number(selectedCustomerId)
    }

    if (!form.customerName.trim()) {
      throw new Error('Customer name is required for a new customer job.')
    }

    const createdCustomer = await createCustomer({
      full_name: form.customerName.trim(),
      phone: form.phone.trim(),
      business_name: form.businessName.trim(),
      customer_type: form.customerType,
    })

    return createdCustomer.id
  }

  async function handleCreateJob(e) {
    e.preventDefault()

    if (!form.description.trim()) {
      setStatusMessage('Add a short job description before saving.')
      return
    }

    if (!form.unitPrice || Number(form.unitPrice) <= 0) {
      setStatusMessage('Unit price must be greater than zero.')
      return
    }

    setSubmitting(true)
    try {
      const customerId = await resolveCustomerId()
      await createJob({
        customer: customerId,
        job_type: form.jobType,
        description: form.description.trim(),
        quantity: Math.max(1, Number(form.quantity || 1)),
        unit_price: String(Number(form.unitPrice || 0)),
        amount_paid: String(Number(form.amountPaid || 0)),
        deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
        special_instructions: form.specialInstructions.trim(),
        project_scope_note: form.projectScopeNote.trim(),
        status: 'pending',
      })

      setForm((current) => ({
        ...defaultForm,
        jobType: current.jobType,
      }))
      setCustomerSearch('')
      setSelectedCustomerId('')
      setCustomerMode('walk_in')
      await refreshAfterJobChange('New job order created successfully.')
    } catch (error) {
      setStatusMessage(error.message || 'Could not create job order.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <TeamNavbar />
      <main className="bg-[#F4F8FC]">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#102848] via-[#17365d] to-[#214672] py-10 text-white">
          <div className="pointer-events-none absolute -left-8 top-6 h-28 w-28 bg-yellow/20 blur-3xl" />
          <div className="pointer-events-none absolute right-8 top-10 h-24 w-24 bg-white/10 blur-3xl" />
          <div className="container-shell relative">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-yellow">
              Counter Desk
            </p>
            <div className="mt-3 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
                  Run jobs, customers, and today&apos;s shop activity from one screen.
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-100 sm:text-base">
                  Built for fast counter work: create a job, link the right customer, track payment
                  progress, and keep the active queue visible all day.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <DeskStatCard label="Active Jobs" value={deskStats.activeJobs} tone="dark" />
                <DeskStatCard label="Overdue" value={deskStats.overdue} tone="alert" />
                <DeskStatCard label="Partial Payments" value={deskStats.partiallyPaid} tone="dark" />
                <DeskStatCard label="Queue Value" value={formatCurrency(deskStats.activeRevenue)} tone="accent" />
              </div>
            </div>
          </div>
        </section>

        <section className="container-shell py-8 md:py-10">
          {statusMessage ? (
            <div className="mb-6 border border-navy/20 bg-navy/5 px-4 py-3 text-sm text-slate-700 shadow-sm">
              {statusMessage}
            </div>
          ) : null}

          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <section className="border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Quick Intake
                  </p>
                  <h2 className="mt-1 text-2xl font-extrabold text-navy">Create Job Order</h2>
                </div>
                <div className="grid w-full gap-2 sm:flex sm:w-auto sm:flex-wrap">
                  {[
                    { value: 'walk_in', label: 'Walk-in' },
                    { value: 'existing', label: 'Existing Customer' },
                    { value: 'new', label: 'New Customer' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setCustomerMode(option.value)}
                      className={`w-full border px-3 py-2 text-sm font-semibold transition sm:w-auto sm:py-1.5 ${
                        customerMode === option.value
                          ? 'border-navy bg-navy text-white'
                          : 'border-slate-300 bg-white text-slate-700 hover:border-navy hover:text-navy'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleCreateJob} className="mt-6 space-y-5">
                {customerMode === 'walk_in' ? (
                  <div className="border border-yellow/40 bg-yellow/10 px-4 py-3 text-sm text-slate-700">
                    This job will be saved under the reusable generic <span className="font-bold">Walk-in</span> customer record.
                  </div>
                ) : null}

                {customerMode === 'existing' ? (
                  <div className="space-y-3 border border-slate-200 bg-slate-50 p-4">
                    <label className="block text-sm font-semibold text-slate-700">
                      Search customers
                      <input
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        className="mt-2 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-navy"
                        placeholder="Search by name, phone, or business"
                      />
                    </label>

                    <div className="grid gap-2 sm:grid-cols-2">
                      {filteredCustomers.length ? (
                        filteredCustomers.map((customer) => (
                          <button
                            key={customer.id}
                            type="button"
                            onClick={() => setSelectedCustomerId(String(customer.id))}
                            className={`border p-3 text-left transition ${
                              String(customer.id) === selectedCustomerId
                                ? 'border-navy bg-navy text-white'
                                : 'border-slate-200 bg-white hover:border-navy'
                            }`}
                          >
                            <p className="font-bold">{customer.full_name}</p>
                            <p className={`mt-1 text-xs ${String(customer.id) === selectedCustomerId ? 'text-slate-200' : 'text-slate-500'}`}>
                              {customer.phone || customer.business_name || 'No extra contact info'}
                            </p>
                          </button>
                        ))
                      ) : (
                        <div className="border border-dashed border-slate-300 bg-white px-3 py-4 text-sm text-slate-500 sm:col-span-2">
                          No matching customers found.
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}

                {customerMode === 'new' ? (
                  <div className="grid gap-3 border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Customer name
                      <input
                        value={form.customerName}
                        onChange={(e) => setForm((current) => ({ ...current, customerName: e.target.value }))}
                        className="mt-2 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-navy"
                        placeholder="Customer full name"
                      />
                    </label>

                    <label className="block text-sm font-semibold text-slate-700">
                      Phone number
                      <input
                        value={form.phone}
                        onChange={(e) => setForm((current) => ({ ...current, phone: e.target.value }))}
                        className="mt-2 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-navy"
                        placeholder="080..."
                      />
                    </label>

                    <label className="block text-sm font-semibold text-slate-700">
                      Business name
                      <input
                        value={form.businessName}
                        onChange={(e) => setForm((current) => ({ ...current, businessName: e.target.value }))}
                        className="mt-2 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-navy"
                        placeholder="Optional"
                      />
                    </label>

                    <label className="block text-sm font-semibold text-slate-700">
                      Customer segment
                      <select
                        value={form.customerType}
                        onChange={(e) => setForm((current) => ({ ...current, customerType: e.target.value }))}
                        className="mt-2 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-navy"
                      >
                        <option value="recurring">Recurring</option>
                        <option value="premium">Premium / Project</option>
                      </select>
                    </label>
                  </div>
                ) : null}

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <label className="block text-sm font-semibold text-slate-700">
                    Job type
                    <select
                      value={form.jobType}
                      onChange={(e) => setForm((current) => ({ ...current, jobType: e.target.value }))}
                      className="mt-2 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-navy"
                    >
                      {jobTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {titleCase(option)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block text-sm font-semibold text-slate-700">
                    Quantity
                    <input
                      type="number"
                      min="1"
                      value={form.quantity}
                      onChange={(e) => setForm((current) => ({ ...current, quantity: e.target.value }))}
                      className="mt-2 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-navy"
                    />
                  </label>

                  <label className="block text-sm font-semibold text-slate-700">
                    Unit price
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.unitPrice}
                      onChange={(e) => setForm((current) => ({ ...current, unitPrice: e.target.value }))}
                      className="mt-2 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-navy"
                      placeholder="0.00"
                    />
                  </label>

                  <label className="block text-sm font-semibold text-slate-700">
                    Amount paid now
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.amountPaid}
                      onChange={(e) => setForm((current) => ({ ...current, amountPaid: e.target.value }))}
                      className="mt-2 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-navy"
                      placeholder="0.00"
                    />
                  </label>
                </div>

                <label className="block text-sm font-semibold text-slate-700">
                  Job description
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
                    className="mt-2 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-navy"
                    rows={3}
                    placeholder="What exactly is the customer asking for?"
                  />
                </label>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Deadline
                    <input
                      type="datetime-local"
                      value={form.deadline}
                      onChange={(e) => setForm((current) => ({ ...current, deadline: e.target.value }))}
                      className="mt-2 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-navy"
                    />
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <MiniValueCard label="Total" value={formatCurrency(totalAmount)} />
                    <MiniValueCard label="Balance" value={formatCurrency(balanceDue)} />
                  </div>
                </div>

                <label className="block text-sm font-semibold text-slate-700">
                  Special instructions
                  <textarea
                    value={form.specialInstructions}
                    onChange={(e) => setForm((current) => ({ ...current, specialInstructions: e.target.value }))}
                    className="mt-2 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-navy"
                    rows={3}
                    placeholder="Customer notes, finishing details, color notes, delivery instructions..."
                  />
                </label>

                <label className="block text-sm font-semibold text-slate-700">
                  Project scope note
                  <textarea
                    value={form.projectScopeNote}
                    onChange={(e) => setForm((current) => ({ ...current, projectScopeNote: e.target.value }))}
                    className="mt-2 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-navy"
                    rows={3}
                    placeholder="Optional for bigger jobs: context, references, or project scope."
                  />
                </label>

                <div className="flex flex-col items-stretch gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    New jobs open in Pending by default
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {submitting ? 'Saving Job...' : 'Create Job Order'}
                  </button>
                </div>
              </form>
            </section>

            <section className="space-y-6">
              <div className="border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Daily Summary
                    </p>
                    <h2 className="mt-1 text-2xl font-extrabold text-navy">Today&apos;s Numbers</h2>
                  </div>
                  <input
                    type="date"
                    value={summaryDate}
                    onChange={(e) => setSummaryDate(e.target.value)}
                    className="w-full border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-navy sm:w-auto"
                  />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <MiniValueCard label="Jobs Created" value={dailySummary?.jobs_created ?? 0} />
                  <MiniValueCard label="Jobs Completed" value={dailySummary?.jobs_completed ?? 0} />
                  <MiniValueCard label="Payments Logged" value={dailySummary?.payments_received ?? 0} />
                  <MiniValueCard label="Photocopy Sessions" value={dailySummary?.photocopy_sessions ?? 0} />
                  <MiniValueCard label="Revenue Logged" value={formatCurrency(dailySummary?.total_revenue ?? 0)} />
                  <MiniValueCard label="Outstanding" value={formatCurrency(dailySummary?.outstanding_balances ?? 0)} />
                </div>

                <div className="mt-5 grid gap-3">
                  <AlertRow
                    label="Completed jobs without full payment"
                    value={dailySummary?.anomalies?.completed_unpaid_jobs ?? 0}
                    danger={(dailySummary?.anomalies?.completed_unpaid_jobs ?? 0) > 0}
                  />
                  <AlertRow
                    label="Photocopy discrepancies"
                    value={dailySummary?.anomalies?.photocopy_discrepancies ?? 0}
                    danger={(dailySummary?.anomalies?.photocopy_discrepancies ?? 0) > 0}
                  />
                </div>
              </div>

              <div className="border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Customer Snapshot
                </p>
                <h2 className="mt-1 text-2xl font-extrabold text-navy">Retention View</h2>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <MiniValueCard label="Recurring" value={customerSegments.recurring} />
                  <MiniValueCard label="Premium" value={customerSegments.premium} />
                  <MiniValueCard label="Follow-up" value={customerSegments.followUp} />
                </div>

                <div className="mt-5 space-y-3">
                  {filteredCustomers.slice(0, 4).map((customer) => (
                    <div key={customer.id} className="border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-slate-900">{customer.full_name}</p>
                          <p className="mt-1 text-sm text-slate-500">
                            {customer.business_name || customer.phone || 'No extra contact info'}
                          </p>
                        </div>
                        <span className="border border-slate-300 bg-white px-2 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                          {titleCase(customer.customer_type)}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                        <span className="border border-slate-200 bg-white px-2 py-1">
                          Last job: {formatDate(customer.last_job_date)}
                        </span>
                        <span className="border border-slate-200 bg-white px-2 py-1">
                          Orders: {customer.ordersCount}
                        </span>
                        {customer.follow_up_flag ? (
                          <span className="border border-yellow/50 bg-yellow/10 px-2 py-1 text-yellow-800">
                            Follow-up flagged
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <section className="mt-8 border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Active Queue
                </p>
                <h2 className="mt-1 text-2xl font-extrabold text-navy">Jobs In Motion</h2>
              </div>
              {loading ? (
                <span className="text-sm text-slate-500">Loading queue...</span>
              ) : (
                <span className="border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-600">
                  {orders.length} active job{orders.length === 1 ? '' : 's'}
                </span>
              )}
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
              <label className="flex items-center gap-3 border border-slate-200 bg-slate-50 px-3 py-3">
                <Search size={16} className="text-slate-500" />
                <input
                  value={queueSearch}
                  onChange={(e) => setQueueSearch(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  placeholder="Search customer, phone, job type, or request details"
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-3">
                <MiniValueCard label="Attention" value={queueCounts.needsAttention} />
                <MiniValueCard label="In Progress" value={queueCounts.inProgress} />
                <MiniValueCard label="Ready" value={queueCounts.ready} />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {queueViewOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setQueueView(option.value)}
                  className={`border px-3 py-2 text-sm font-semibold transition ${
                    queueView === option.value
                      ? 'border-navy bg-navy text-white'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-navy hover:text-navy'
                  }`}
                >
                  {option.label}
                  <span className="ml-2 text-xs opacity-80">
                    {option.value === 'needs_attention'
                      ? queueCounts.needsAttention
                      : option.value === 'in_progress'
                        ? queueCounts.inProgress
                        : option.value === 'ready'
                          ? queueCounts.ready
                          : queueCounts.all}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-4">
              {visibleQueueOrders.length ? (
                visibleQueueOrders.map((order) => {
                  const queueDraft = queueEdits[order.id] || {
                    quantity: String(Math.max(1, Number(order.quantity || 1))),
                    unitPrice: String(Number(order.unitPrice || 0)),
                    amountPaid: String(Number(order.amountPaid || 0)),
                    deadline: toDateTimeLocalValue(order.deadline),
                  }
                  const draftTotal = Math.max(1, Number(queueDraft.quantity || 1)) * Number(queueDraft.unitPrice || 0)
                  const draftBalance = Math.max(0, draftTotal - Number(queueDraft.amountPaid || 0))
                  const isExpanded = expandedOrderId === order.id

                  return (
                    <article
                      key={order.id}
                      className={`border p-4 shadow-sm ${
                        order.isOverdue ? 'border-red-300 bg-red-50/50' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleOrderExpanded(order.id)}
                        className="flex w-full flex-col gap-4 text-left sm:flex-row sm:items-start sm:justify-between"
                        aria-expanded={isExpanded}
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                              Job #{order.id}
                            </p>
                            <span className="border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                              {titleCase(order.status)}
                            </span>
                            <span className="border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                              {titleCase(order.paymentStatus)}
                            </span>
                            {order.isOverdue ? (
                              <span className="border border-red-300 bg-red-100 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-red-700">
                                Overdue
                              </span>
                            ) : null}
                          </div>
                          <h3 className="mt-2 text-xl font-extrabold text-slate-900">
                            {titleCase(order.jobType)}
                          </h3>
                          <p className="mt-2 text-sm font-semibold text-slate-700">
                            {order.customerName || 'Walk-in'}
                          </p>
                          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
                            {order.description || 'No description added.'}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.12em]">
                            <span className="border border-slate-200 bg-slate-50 px-2 py-1 text-slate-600">
                              Qty {order.quantity || 1}
                            </span>
                            <span className="border border-slate-200 bg-slate-50 px-2 py-1 text-slate-600">
                              Total {formatCurrency(order.totalAmount)}
                            </span>
                            <span className="border border-slate-200 bg-slate-50 px-2 py-1 text-slate-600">
                              Balance {formatCurrency(order.balanceDue)}
                            </span>
                            <span className="border border-slate-200 bg-slate-50 px-2 py-1 text-slate-600">
                              {order.deadline ? formatDateTime(order.deadline) : 'No deadline'}
                            </span>
                            <span className="border border-slate-200 bg-slate-50 px-2 py-1 text-slate-600">
                              {order.createdByName ? `Created by ${order.createdByName}` : 'Website submission'}
                            </span>
                            {order.customerBusinessName ? (
                              <span className="border border-slate-200 bg-slate-50 px-2 py-1 text-slate-600">
                                {order.customerBusinessName}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-start">
                          <div className="text-right">
                            <p className="text-sm font-bold text-navy">{formatCurrency(order.totalAmount)}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">
                              {isExpanded ? 'Collapse' : 'Expand'}
                            </p>
                          </div>
                          <ChevronDown
                            size={18}
                            className={`mt-1 shrink-0 text-slate-500 transition ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </div>
                      </button>

                    {isExpanded ? (
                      <>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <MiniValueCard label="Quantity" value={order.quantity || 1} />
                      <MiniValueCard label="Unit Price" value={formatCurrency(order.unitPrice || 0)} />
                      <MiniValueCard label="Total" value={formatCurrency(order.totalAmount)} />
                      <MiniValueCard label="Balance" value={formatCurrency(order.balanceDue)} />
                    </div>

                    {order.customerPhone || order.customerEmail ? (
                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {order.customerPhone ? (
                          <div className="border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                            <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                              Phone
                            </span>
                            <span className="mt-1 block font-semibold text-slate-800">{order.customerPhone}</span>
                          </div>
                        ) : null}
                        {order.customerEmail ? (
                          <div className="border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                            <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                              Email
                            </span>
                            <span className="mt-1 block break-all font-semibold text-slate-800">{order.customerEmail}</span>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                        <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Deadline
                        </span>
                        <span className="mt-1 block font-semibold text-slate-800">
                          {formatDateTime(order.deadline)}
                        </span>
                      </div>

                      <div className="border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                        <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Balance Due
                        </span>
                        <span className="mt-1 block font-semibold text-slate-800">
                          {formatCurrency(order.balanceDue)}
                        </span>
                      </div>
                    </div>

                    {order.specialInstructions ? (
                      <div className="mt-4 border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
                        <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Submission Details
                        </span>
                        <p className="mt-2 whitespace-pre-line leading-6">{order.specialInstructions}</p>
                      </div>
                    ) : null}

                    {order.projectScopeNote ? (
                      <div className="mt-4 border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
                        <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Request Notes
                        </span>
                        <p className="mt-2 whitespace-pre-line leading-6">{order.projectScopeNote}</p>
                      </div>
                    ) : null}

                    <div className="mt-4 border border-slate-200 bg-slate-50 px-4 py-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                            Queue Management
                          </p>
                          <h4 className="mt-1 text-base font-extrabold text-slate-900">
                            Update quantity, pricing, payment, and deadline
                          </h4>
                        </div>
                        {!isOwner ? (
                          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                            Owner/admin can edit pricing and payment
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <label className="text-sm font-semibold text-slate-700">
                          Quantity
                          <input
                            type="number"
                            min="1"
                            value={queueDraft.quantity}
                            onChange={(e) => updateQueueEdit(order.id, 'quantity', e.target.value)}
                            disabled={!isOwner}
                            className="mt-2 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-navy disabled:cursor-not-allowed disabled:bg-slate-100"
                          />
                        </label>

                        <label className="text-sm font-semibold text-slate-700">
                          Unit price
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={queueDraft.unitPrice}
                            onChange={(e) => updateQueueEdit(order.id, 'unitPrice', e.target.value)}
                            disabled={!isOwner}
                            className="mt-2 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-navy disabled:cursor-not-allowed disabled:bg-slate-100"
                          />
                        </label>

                        <label className="text-sm font-semibold text-slate-700">
                          Amount paid now
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={queueDraft.amountPaid}
                            onChange={(e) => updateQueueEdit(order.id, 'amountPaid', e.target.value)}
                            disabled={!isOwner}
                            className="mt-2 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-navy disabled:cursor-not-allowed disabled:bg-slate-100"
                          />
                        </label>

                        <label className="text-sm font-semibold text-slate-700">
                          Deadline
                          <input
                            type="datetime-local"
                            value={queueDraft.deadline}
                            onChange={(e) => updateQueueEdit(order.id, 'deadline', e.target.value)}
                            className="mt-2 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-navy"
                          />
                        </label>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <MiniValueCard label="Edited Total" value={formatCurrency(draftTotal)} />
                        <MiniValueCard label="Edited Balance" value={formatCurrency(draftBalance)} />
                      </div>

                      <div className="mt-4 flex flex-col items-stretch gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-slate-600">
                          Project details stay visible here while you adjust quantity, payment, and due date.
                        </p>
                        <button
                          type="button"
                          onClick={() => handleSaveQueueDetails(order)}
                          disabled={savingOrderId === order.id}
                          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                        >
                          {savingOrderId === order.id ? 'Saving...' : 'Save Queue Details'}
                        </button>
                      </div>
                    </div>

                    {order.attachments?.length ? (
                      <div className="mt-4 border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
                        <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Uploaded Assets
                        </span>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {order.attachments.map((attachment) => (
                            <a
                              key={attachment.id}
                              href={attachment.downloadUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-navy transition hover:border-navy hover:bg-navy hover:text-white"
                            >
                              {attachment.originalName} ({formatFileSize(attachment.sizeBytes)})
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {order.isOverdue ? (
                      <div className="mt-4 border border-red-300 bg-red-100 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-red-700">
                        Overdue job
                      </div>
                    ) : null}

                    <div className="mt-4 flex flex-col items-stretch gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-sm font-semibold text-slate-600">
                        Status: <span className="text-slate-900">{titleCase(order.status)}</span>
                      </div>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="w-full border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none transition focus:border-navy sm:w-auto"
                      >
                        {orderStatusOptions.map((status) => (
                          <option key={status} value={status}>
                            {titleCase(status)}
                          </option>
                        ))}
                      </select>
                    </div>
                      </>
                    ) : null}
                    </article>
                  )
                })
              ) : (
                <div className="border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                  No queue jobs match your current search or filter.
                </div>
              )}
            </div>

            {filteredQueueOrders.length > visibleQueueCount ? (
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleQueueCount((current) => current + 6)}
                  className="border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-navy hover:text-navy"
                >
                  Show 6 More Jobs
                </button>
              </div>
            ) : null}
          </section>
        </section>
      </main>
      <Footer />
    </>
  )
}

function DeskStatCard({ label, value, tone = 'dark' }) {
  const toneClass =
    tone === 'accent'
      ? 'border-yellow bg-yellow text-slate-900'
      : tone === 'alert'
        ? 'border-red-300/40 bg-red-500/20 text-white'
        : 'border-white/15 bg-white/10 text-white'

  return (
    <div className={`border px-4 py-4 shadow-sm ${toneClass}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-90">{label}</p>
      <p className="mt-2 text-2xl font-extrabold">{value}</p>
    </div>
  )
}

function MiniValueCard({ label, value }) {
  return (
    <div className="border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-extrabold text-slate-900">{value}</p>
    </div>
  )
}

function AlertRow({ label, value, danger }) {
  return (
    <div
      className={`flex flex-col gap-2 border px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between ${
        danger
          ? 'border-red-300 bg-red-50 text-red-700'
          : 'border-emerald-200 bg-emerald-50 text-emerald-700'
      }`}
    >
      <span className="font-semibold">{label}</span>
      <span className="text-base font-extrabold">{value}</span>
    </div>
  )
}

export default TeamOrdersDashboard
