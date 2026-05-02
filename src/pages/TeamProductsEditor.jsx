import { useEffect, useMemo, useState } from 'react'
import TeamNavbar from '../components/TeamNavbar'
import Footer from '../components/Footer'
import { filters as defaultFilters, products as defaultProducts } from '../data/productsData'
import { clearTeamProductsStorage, getProductsData, saveTeamProducts } from '../services/productsService'

const blankProduct = {
  slug: '',
  category: '',
  title: '',
  description: '',
  details: '',
  enableDesignUpload: false,
  image: '',
  images: [],
  price: '',
}

function buildImages(primaryImage, extraImages = []) {
  const normalized = [primaryImage, ...extraImages]
    .map((item) => String(item || '').trim())
    .filter(Boolean)
  return [...new Set(normalized)]
}

function TeamProductsEditor() {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newProduct, setNewProduct] = useState(blankProduct)
  const [newProductStatus, setNewProductStatus] = useState('')
  const [editingIndex, setEditingIndex] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [productPendingDelete, setProductPendingDelete] = useState(null)

  useEffect(() => {
    let isMounted = true
    async function loadEditorData() {
      const data = await getProductsData()
      if (!isMounted) return
      setProducts(data.products?.length ? data.products : defaultProducts)
    }
    loadEditorData()
    return () => {
      isMounted = false
    }
  }, [])

  const categoryOptions = useMemo(() => {
    const productCategories = products.map((item) => item.category).filter(Boolean)
    const officialCategories = defaultFilters.filter((category) => category !== 'All Products')
    const categories = [...new Set([...officialCategories, ...productCategories])]
    return ['All', ...categories]
  }, [products])

  const visibleProducts = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products
      .map((product, index) => ({ product, index }))
      .filter(({ product }) => activeCategory === 'All' || product.category === activeCategory)
      .filter(({ product }) => {
        if (!q) return true
        return (
          String(product.title || '').toLowerCase().includes(q) ||
          String(product.slug || '').toLowerCase().includes(q)
        )
      })
  }, [activeCategory, products, query])

  function handleReset() {
    clearTeamProductsStorage()
    setProducts(defaultProducts)
    setStatus('Team override cleared. App will use CMS/local source again.')
  }

  async function handleSaveAll() {
    setIsSaving(true)
    const { ok, source } = await saveTeamProducts(products)
    setIsSaving(false)
    if (!ok) {
      setStatus('Save failed. Ensure products contain slug/title/category/image and backend is reachable.')
      return
    }
    setStatus(source === 'django' ? 'Saved to Django API successfully.' : 'Saved locally successfully.')
  }

  function openEditModal(index) {
    setEditingIndex(index)
    setEditingProduct({ ...products[index], images: products[index].images || [] })
  }

  function closeEditModal() {
    setEditingIndex(null)
    setEditingProduct(null)
  }

  function updateEditingProduct(key, value) {
    setEditingProduct((current) => {
      if (!current) return current
      if (key === 'image') {
        const extras = Array.isArray(current.images) ? current.images.slice(1) : []
        const images = buildImages(value, extras)
        return { ...current, image: images[0] || '', images }
      }
      return { ...current, [key]: value }
    })
  }

  function updateEditingExtraImages(text) {
    setEditingProduct((current) => {
      if (!current) return current
      const extras = text
        .split('\n')
        .map((entry) => entry.trim())
        .filter(Boolean)
      const images = buildImages(current.image, extras)
      return { ...current, image: images[0] || '', images }
    })
  }

  async function saveEditedProduct() {
    if (editingIndex === null || !editingProduct) return
    const next = products.map((item, i) => (i === editingIndex ? editingProduct : item))
    setIsSaving(true)
    const { ok, source } = await saveTeamProducts(next)
    setIsSaving(false)
    if (!ok) {
      setStatus('Could not save edited product.')
      return
    }
    setProducts(next)
    setStatus(source === 'django' ? 'Product updated in Django API.' : 'Product updated locally.')
    closeEditModal()
  }

  function askRemoveProduct(index) {
    const target = products[index]
    if (!target) return
    setProductPendingDelete({ index, title: target.title || target.slug || 'this product' })
  }

  async function removeProduct(index) {
    const updatedProducts = products.filter((_, i) => i !== index)
    setIsSaving(true)
    const { ok, source } = await saveTeamProducts(updatedProducts)
    setIsSaving(false)
    if (!ok) {
      setStatus('Delete failed. Could not remove product from backend.')
      return
    }
    setProducts(updatedProducts)
    setStatus(source === 'django' ? 'Product removed from Django API successfully.' : 'Product removed locally successfully.')
  }

  function openAddModal() {
    setNewProduct({ ...blankProduct, slug: `new-product-${products.length + 1}` })
    setNewProductStatus('')
    setIsAddModalOpen(true)
  }

  function updateNewProduct(key, value) {
    setNewProduct((current) => {
      if (key === 'image') {
        const extras = Array.isArray(current.images) ? current.images.slice(1) : []
        const images = buildImages(value, extras)
        return { ...current, image: images[0] || '', images }
      }
      return { ...current, [key]: value }
    })
  }

  function updateNewProductExtraImages(text) {
    setNewProduct((current) => {
      const extras = text
        .split('\n')
        .map((entry) => entry.trim())
        .filter(Boolean)
      const images = buildImages(current.image, extras)
      return { ...current, image: images[0] || '', images }
    })
  }

  async function createProductFromModal() {
    setNewProductStatus('')
    if (!newProduct.slug || !newProduct.title || !newProduct.category || !newProduct.image) {
      setNewProductStatus('Please provide slug, title, category, and image before adding a new product.')
      return
    }
    if (products.some((item) => item.slug === newProduct.slug)) {
      setNewProductStatus('Slug already exists. Please use a unique slug for this new product.')
      return
    }
    const updatedProducts = [...products, { ...newProduct }]
    setIsSaving(true)
    const { ok, source } = await saveTeamProducts(updatedProducts)
    setIsSaving(false)
    if (!ok) {
      setNewProductStatus('Could not save new product to backend.')
      return
    }
    setProducts(updatedProducts)
    setStatus(source === 'django' ? 'New product added and saved to Django API successfully.' : 'New product added and saved locally successfully.')
    setIsAddModalOpen(false)
  }

  const inputClass = 'mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/15'

  return (
    <>
      <TeamNavbar />
      <main>
        <section className="container-shell py-12 md:py-14">
          <p className="inline-flex items-center rounded-full border border-navy/20 bg-navy/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-navy">Team CMS</p>
          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">Products Editor</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">Manage products in a compact list with quick actions.</p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Products</p>
              <p className="mt-1 text-2xl font-extrabold text-navy">{products.length}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Visible</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">{visibleProducts.length}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Active category</p>
              <p className="mt-1 truncate text-base font-bold text-slate-900">{activeCategory}</p>
            </div>
          </div>
        </section>

        <section className="bg-[#F4F8FC] py-8 md:py-10">
          <div className="container-shell space-y-6">
            <div className="sticky top-2 z-40 rounded-lg border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur md:top-[72px] md:p-5">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
                <label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Search (title/slug)
                  <input value={query} onChange={(e) => setQuery(e.target.value)} className={inputClass} placeholder="Search products..." />
                </label>
                <label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Filter category
                  <select value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)} className={inputClass}>
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </label>
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <button onClick={openAddModal} className="btn-primary rounded-md">Add Product</button>
                  <button onClick={handleSaveAll} disabled={isSaving} className="rounded-md border border-navy px-4 py-2.5 text-sm font-semibold text-navy transition hover:bg-navy hover:text-white disabled:cursor-not-allowed disabled:opacity-60">{isSaving ? 'Saving...' : 'Save All'}</button>
                  <button onClick={handleReset} className="rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Reset</button>
                </div>
              </div>
            </div>

            {status ? <div className="rounded-md border border-navy/20 bg-navy/5 px-4 py-3 text-sm text-slate-700">{status}</div> : null}

            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase tracking-[0.12em] text-slate-600">
                  <tr>
                    <th className="px-3 py-3">S/N</th>
                    <th className="px-3 py-3">Title</th>
                    <th className="px-3 py-3">Slug</th>
                    <th className="px-3 py-3">Category</th>
                    <th className="px-3 py-3">Price</th>
                    <th className="px-3 py-3">Upload?</th>
                    <th className="px-3 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleProducts.length ? (
                    visibleProducts.map(({ product, index }) => (
                      <tr key={`${product.slug}-${index}`} className="border-t border-slate-100">
                        <td className="px-3 py-3 font-semibold text-slate-700">{index + 1}</td>
                        <td className="px-3 py-3 font-semibold text-slate-900">{product.title || '-'}</td>
                        <td className="px-3 py-3 text-slate-600">{product.slug || '-'}</td>
                        <td className="px-3 py-3">{product.category || '-'}</td>
                        <td className="px-3 py-3">{product.price || '-'}</td>
                        <td className="px-3 py-3">{product.enableDesignUpload ? 'Yes' : 'No'}</td>
                        <td className="px-3 py-3">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => openEditModal(index)} className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Edit</button>
                            <button onClick={() => askRemoveProduct(index)} className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-3 py-4 text-slate-600" colSpan={7}>No products match your current filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {editingProduct ? (
              <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
                <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-5 shadow-2xl md:p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-extrabold text-navy">Edit Product</h2>
                    <button onClick={closeEditModal} className="rounded-md border border-slate-300 px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-50">Close</button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="text-sm font-semibold text-slate-700">Slug<input value={editingProduct.slug || ''} onChange={(e) => updateEditingProduct('slug', e.target.value)} className={inputClass} /></label>
                    <label className="text-sm font-semibold text-slate-700">Category<input value={editingProduct.category || ''} onChange={(e) => updateEditingProduct('category', e.target.value)} className={inputClass} /></label>
                    <label className="text-sm font-semibold text-slate-700 md:col-span-2">Title<input value={editingProduct.title || ''} onChange={(e) => updateEditingProduct('title', e.target.value)} className={inputClass} /></label>
                    <label className="text-sm font-semibold text-slate-700">Price<input value={editingProduct.price || ''} onChange={(e) => updateEditingProduct('price', e.target.value)} className={inputClass} /></label>
                    <label className="md:col-span-2 mt-1 flex items-start gap-3 rounded-md border border-navy/30 bg-navy/5 p-3 text-sm font-semibold text-slate-800">
                      <input type="checkbox" checked={Boolean(editingProduct.enableDesignUpload)} onChange={(e) => updateEditingProduct('enableDesignUpload', e.target.checked)} className="mt-0.5 h-5 w-5 accent-navy" />
                      <span>
                        <span className="block font-extrabold text-navy">Allow upload?</span>
                        <span className="text-xs font-medium text-slate-600">Shows the upload CTA on this product page.</span>
                      </span>
                    </label>
                    <label className="text-sm font-semibold text-slate-700 md:col-span-2">Description<textarea value={editingProduct.description || ''} onChange={(e) => updateEditingProduct('description', e.target.value)} className={`${inputClass} min-h-20`} /></label>
                    <label className="text-sm font-semibold text-slate-700 md:col-span-2">Details<textarea value={editingProduct.details || ''} onChange={(e) => updateEditingProduct('details', e.target.value)} className={`${inputClass} min-h-24`} /></label>
                    <label className="text-sm font-semibold text-slate-700 md:col-span-2">Image URL<input value={editingProduct.image || ''} onChange={(e) => updateEditingProduct('image', e.target.value)} className={inputClass} /></label>
                    <label className="text-sm font-semibold text-slate-700 md:col-span-2">Additional image URLs (one per line)<textarea value={(editingProduct.images || []).slice(1).join('\n')} onChange={(e) => updateEditingExtraImages(e.target.value)} className={`${inputClass} min-h-20`} /></label>
                  </div>
                  <div className="mt-6 flex justify-end gap-2">
                    <button onClick={closeEditModal} className="rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
                    <button onClick={saveEditedProduct} disabled={isSaving} className="rounded-md border border-navy bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0a2347] disabled:opacity-60">{isSaving ? 'Saving...' : 'Save Product'}</button>
                  </div>
                </div>
              </div>
            ) : null}

            {isAddModalOpen ? (
              <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
                <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-5 shadow-2xl md:p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-extrabold text-navy">Add New Product</h2>
                    <button onClick={() => setIsAddModalOpen(false)} className="rounded-md border border-slate-300 px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-50">Close</button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="text-sm font-semibold text-slate-700">Slug<input value={newProduct.slug} onChange={(e) => updateNewProduct('slug', e.target.value)} className={inputClass} /></label>
                    <label className="text-sm font-semibold text-slate-700">Category<input value={newProduct.category} onChange={(e) => updateNewProduct('category', e.target.value)} className={inputClass} /></label>
                    <label className="text-sm font-semibold text-slate-700 md:col-span-2">Title<input value={newProduct.title} onChange={(e) => updateNewProduct('title', e.target.value)} className={inputClass} /></label>
                    <label className="text-sm font-semibold text-slate-700">Price<input value={newProduct.price} onChange={(e) => updateNewProduct('price', e.target.value)} className={inputClass} /></label>
                    <label className="text-sm font-semibold text-slate-700 md:col-span-2">Description<textarea value={newProduct.description} onChange={(e) => updateNewProduct('description', e.target.value)} className={`${inputClass} min-h-20`} /></label>
                    <label className="text-sm font-semibold text-slate-700 md:col-span-2">Details<textarea value={newProduct.details} onChange={(e) => updateNewProduct('details', e.target.value)} className={`${inputClass} min-h-24`} /></label>
                    <label className="text-sm font-semibold text-slate-700 md:col-span-2">Image URL<input value={newProduct.image} onChange={(e) => updateNewProduct('image', e.target.value)} className={inputClass} /></label>
                    <label className="text-sm font-semibold text-slate-700 md:col-span-2">Additional image URLs (one per line)<textarea value={(newProduct.images || []).slice(1).join('\n')} onChange={(e) => updateNewProductExtraImages(e.target.value)} className={`${inputClass} min-h-20`} /></label>
                  </div>
                  <div className="mt-6 flex justify-end gap-2">
                    <button onClick={() => setIsAddModalOpen(false)} className="rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
                    <button onClick={createProductFromModal} disabled={isSaving} className="rounded-md border border-navy bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0a2347] disabled:opacity-60">{isSaving ? 'Adding...' : 'Add Product'}</button>
                  </div>
                  {newProductStatus ? <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{newProductStatus}</p> : null}
                </div>
              </div>
            ) : null}

            {productPendingDelete ? (
              <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
                <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-2xl md:p-6">
                  <h3 className="text-lg font-extrabold text-navy">Delete Product</h3>
                  <p className="mt-2 text-sm text-slate-700">You are about to permanently delete <span className="font-semibold">“{productPendingDelete.title}”</span>. This action cannot be undone.</p>
                  <div className="mt-5 flex justify-end gap-2">
                    <button onClick={() => setProductPendingDelete(null)} className="rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
                    <button
                      onClick={async () => {
                        const { index } = productPendingDelete
                        setProductPendingDelete(null)
                        await removeProduct(index)
                      }}
                      disabled={isSaving}
                      className="rounded-md border border-red-600 bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                    >
                      {isSaving ? 'Deleting...' : 'Delete Product'}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default TeamProductsEditor
