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

function readFilesAsDataUrls(fileList = []) {
  return Promise.all(
    [...fileList].map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(String(reader.result || ''))
          reader.onerror = () => reject(new Error('Image upload failed'))
          reader.readAsDataURL(file)
        }),
    ),
  )
}

function TeamProductsEditor() {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newProduct, setNewProduct] = useState(blankProduct)
  const [newProductStatus, setNewProductStatus] = useState('')
  const [productPendingDelete, setProductPendingDelete] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')

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

  function updateProduct(index, key, value) {
    setProducts((current) => current.map((item, i) => (i === index ? { ...item, [key]: value } : item)))
  }

  function updatePrimaryImage(index, value) {
    setProducts((current) =>
      current.map((item, i) => {
        if (i !== index) return item
        const extras = Array.isArray(item.images) ? item.images.slice(1) : []
        const images = buildImages(value, extras)
        return { ...item, image: images[0] || '', images }
      }),
    )
  }

  function updateExtraImages(index, text) {
    setProducts((current) =>
      current.map((item, i) => {
        if (i !== index) return item
        const extras = text
          .split('\n')
          .map((entry) => entry.trim())
          .filter(Boolean)
        const images = buildImages(item.image, extras)
        return { ...item, image: images[0] || '', images }
      }),
    )
  }

  async function handleImageUpload(index, files) {
    if (!files?.length) return

    try {
      const uploadedImages = await readFilesAsDataUrls(files)
      setProducts((current) =>
        current.map((item, i) => {
          if (i !== index) return item
          const existing = Array.isArray(item.images) && item.images.length ? item.images : [item.image]
          const images = buildImages(existing[0], [...existing.slice(1), ...uploadedImages])
          return { ...item, image: images[0] || '', images }
        }),
      )
      setStatus(`${uploadedImages.length} image(s) uploaded for product ${index + 1}. Remember to click "Save".`)
    } catch {
      setStatus('Image upload failed. Please try another file.')
    }
  }

  function openAddModal() {
    setNewProduct({ ...blankProduct, slug: `new-product-${products.length + 1}` })
    setNewProductStatus('')
    setIsAddModalOpen(true)
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
      setNewProductStatus('Could not save new product to backend. Check slug/image URL and ensure backend is running.')
      return
    }

    setProducts(updatedProducts)
    setActiveCategory('All')
    setIsAddModalOpen(false)
    setStatus(
      source === 'django'
        ? 'New product added and saved to Django API successfully.'
        : 'New product added and saved locally successfully.',
    )
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

  async function handleNewProductImageUpload(files) {
    if (!files?.length) return

    try {
      const uploadedImages = await readFilesAsDataUrls(files)
      setNewProduct((current) => {
        const existing = Array.isArray(current.images) && current.images.length ? current.images : [current.image]
        const images = buildImages(existing[0], [...existing.slice(1), ...uploadedImages])
        return { ...current, image: images[0] || '', images }
      })
      setStatus(`${uploadedImages.length} image(s) uploaded for new product. Click Add Product to insert it.`)
    } catch {
      setStatus('Image upload failed. Please try another file.')
    }
  }

  function askRemoveProduct(index) {
    const target = products[index]
    if (!target) return
    setProductPendingDelete({
      index,
      title: target.title || target.slug || 'this product',
    })
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
    setStatus(
      source === 'django'
        ? 'Product removed from Django API successfully.'
        : 'Product removed locally successfully.',
    )
  }

  async function handleSave() {
    setIsSaving(true)
    const { ok, source } = await saveTeamProducts(products)
    setIsSaving(false)

    if (!ok) {
      setStatus('Save failed. Ensure products contain slug/title/category/image and backend is reachable.')
      return
    }

    setStatus(
      source === 'django'
        ? 'Saved to Django API successfully.'
        : 'Saved locally. Refresh Shop page to see changes.',
    )
  }

  function handleReset() {
    clearTeamProductsStorage()
    setProducts(defaultProducts)
    setStatus('Team override cleared. App will use CMS/local source again.')
  }

  const categoryOptions = useMemo(() => {
    const productCategories = products.map((item) => item.category).filter(Boolean)
    const officialCategories = defaultFilters.filter((category) => category !== 'All Products')
    const categories = [...new Set([...officialCategories, ...productCategories])]
    return ['All', ...categories]
  }, [products])

  const visibleProducts = useMemo(() => {
    return products
      .map((product, index) => ({ product, index }))
      .filter(({ product }) => activeCategory === 'All' || product.category === activeCategory)
  }, [activeCategory, products])

  const inputClass =
    'mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/15'
  const textareaClass =
    'mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/15'

  return (
    <>
      <TeamNavbar />
      <main>
        <section className="container-shell py-12 md:py-14">
          <p className="inline-flex items-center rounded-full border border-navy/20 bg-navy/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-navy">
            Team CMS
          </p>
          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">Products Editor</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Manage product content, pricing, images, and detail-page options from one structured admin view.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Products</p>
              <p className="mt-1 text-2xl font-extrabold text-navy">{products.length}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Visible</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">{visibleProducts.length}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm sm:col-span-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Active category</p>
              <p className="mt-1 truncate text-base font-bold text-slate-900">{activeCategory}</p>
            </div>
          </div>
        </section>

        <section className="bg-[#F4F8FC] py-8 md:py-10">
          <div className="container-shell space-y-6">
            <div className="sticky top-2 z-40 rounded-lg border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur md:top-[72px] md:p-5">
              <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Filter category</label>
                  <select
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                    className={inputClass}
                  >
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end lg:col-start-2">
                  <button onClick={openAddModal} className="btn-primary rounded-md">Add Product</button>
                  <button onClick={handleSave} disabled={isSaving} className="rounded-md border border-navy px-4 py-2.5 text-sm font-semibold text-navy transition hover:bg-navy hover:text-white disabled:cursor-not-allowed disabled:opacity-60">{isSaving ? 'Saving...' : 'Save'}</button>
                  <button onClick={handleReset} className="rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Reset</button>
                </div>
              </div>
            </div>

            {status && (
              <div className="rounded-md border border-navy/20 bg-navy/5 px-4 py-3 text-sm text-slate-700">
                {status}
              </div>
            )}

            <div className="space-y-5">
              {visibleProducts.map(({ product, index }) => (
                <article key={`${product.slug}-${index}`} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md md:p-6">
                  <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Product {index + 1}</p>
                      <h2 className="mt-1 text-lg font-bold text-navy">{product.title || 'Untitled product'}</h2>
                    </div>
                    <button onClick={() => askRemoveProduct(index)} className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50">Remove</button>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Slug (used in product URL)
                      <input value={product.slug} onChange={(e) => updateProduct(index, 'slug', e.target.value)} className={inputClass} placeholder="one-sided-business-cards" />
                    </label>

                    <label className="block text-sm font-semibold text-slate-700">
                      Category (used for filters)
                      <input value={product.category} onChange={(e) => updateProduct(index, 'category', e.target.value)} className={inputClass} placeholder="BUSINESS CARDS" />
                    </label>

                    <label className="block text-sm font-semibold text-slate-700">
                      Product title
                      <input value={product.title} onChange={(e) => updateProduct(index, 'title', e.target.value)} className={inputClass} placeholder="One-sided Business Cards" />
                    </label>

                    <label className="block text-sm font-semibold text-slate-700">
                      Price (shown on shop cards)
                      <input
                        value={product.price || ''}
                        onChange={(e) => updateProduct(index, 'price', e.target.value)}
                        className={inputClass}
                        placeholder="₦12,000 or Price on request"
                      />
                    </label>

                    <label className="md:col-span-2 mt-1 flex items-start gap-3 rounded-md border border-navy/30 bg-navy/5 p-3 text-sm font-semibold text-slate-800">
                      <input
                        type="checkbox"
                        checked={Boolean(product.enableDesignUpload)}
                        onChange={(e) => updateProduct(index, 'enableDesignUpload', e.target.checked)}
                        className="mt-0.5 h-5 w-5 accent-navy"
                      />
                      <span>
                        <span className="block font-extrabold text-navy">Allow upload?</span>
                        <span className="text-xs font-medium text-slate-600">Shows the “Start and Upload Design” button on this product page.</span>
                      </span>
                    </label>
                  </div>

                  <label className="mt-3 block text-sm font-semibold text-slate-700">
                    Description (shown on Shop cards)
                    <textarea value={product.description || ''} onChange={(e) => updateProduct(index, 'description', e.target.value)} className={textareaClass} placeholder="Short product description" rows={3} />
                  </label>

                  <label className="mt-3 block text-sm font-semibold text-slate-700">
                    Product details (shown on Product Details page)
                    <textarea
                      value={product.details || ''}
                      onChange={(e) => updateProduct(index, 'details', e.target.value)}
                      className={textareaClass}
                      placeholder="Full product details for users who open this product"
                      rows={4}
                    />
                  </label>

                  <label className="mt-3 block text-sm font-semibold text-slate-700">
                    Image URL (optional if uploading image below)
                    <input value={product.image || ''} onChange={(e) => updatePrimaryImage(index, e.target.value)} className={inputClass} placeholder="https://..." />
                  </label>

                  <label className="mt-3 block text-sm font-semibold text-slate-700">
                    Additional image URLs (one per line)
                    <textarea
                      value={(product.images || []).slice(1).join('\n')}
                      onChange={(e) => updateExtraImages(index, e.target.value)}
                      className={textareaClass}
                      placeholder="https://..."
                      rows={3}
                    />
                  </label>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <label className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                      Upload image(s)
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleImageUpload(index, e.target.files)}
                      />
                    </label>
                    <span className="text-sm text-slate-500">You can paste image URLs, upload one image, or upload multiple images.</span>
                  </div>

                  {(product.images || [product.image]).filter(Boolean).length ? (
                    <div className="mt-4 rounded-md border border-slate-200 bg-slate-50/70 p-3">
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Image previews</p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {(product.images || [product.image]).filter(Boolean).map((image, imageIndex) => (
                          <div key={`${product.slug}-${imageIndex}`} className="overflow-hidden rounded-md border border-slate-200 bg-white">
                            <img
                              src={image}
                              alt={`${product.title || `Product ${index + 1}`} preview ${imageIndex + 1}`}
                              className="aspect-[4/3] w-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>

            {isAddModalOpen ? (
              <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
                <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-5 shadow-2xl md:p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-extrabold text-navy">Add New Product</h2>
                    <button
                      onClick={() => setIsAddModalOpen(false)}
                      className="rounded-md border border-slate-300 px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Close
                    </button>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Slug
                      <input value={newProduct.slug} onChange={(e) => updateNewProduct('slug', e.target.value)} className={inputClass} placeholder="one-sided-business-cards" />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">
                      Category
                      <select
                        value={newProduct.category}
                        onChange={(e) => updateNewProduct('category', e.target.value)}
                        className={inputClass}
                      >
                        <option value="">Select category</option>
                        {categoryOptions
                          .filter((category) => category !== 'All')
                          .map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                      </select>
                    </label>
                    <label className="block text-sm font-semibold text-slate-700 md:col-span-2">
                      Product title
                      <input value={newProduct.title} onChange={(e) => updateNewProduct('title', e.target.value)} className={inputClass} placeholder="One-sided Business Cards" />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">
                      Price
                      <input value={newProduct.price || ''} onChange={(e) => updateNewProduct('price', e.target.value)} className={inputClass} placeholder="₦12,000" />
                    </label>
                    <label className="md:col-span-2 mt-1 flex items-start gap-3 rounded-md border border-navy/30 bg-navy/5 p-3 text-sm font-semibold text-slate-800">
                      <input
                        type="checkbox"
                        checked={Boolean(newProduct.enableDesignUpload)}
                        onChange={(e) => updateNewProduct('enableDesignUpload', e.target.checked)}
                        className="mt-0.5 h-5 w-5 accent-navy"
                      />
                      <span>
                        <span className="block font-extrabold text-navy">Allow upload?</span>
                        <span className="text-xs font-medium text-slate-600">Shows the “Start and Upload Design” button on this product page.</span>
                      </span>
                    </label>
                    <label className="block text-sm font-semibold text-slate-700 md:col-span-2">
                      Description
                      <textarea value={newProduct.description || ''} onChange={(e) => updateNewProduct('description', e.target.value)} className={textareaClass} rows={3} placeholder="Short product description" />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700 md:col-span-2">
                      Product details
                      <textarea
                        value={newProduct.details || ''}
                        onChange={(e) => updateNewProduct('details', e.target.value)}
                        className={textareaClass}
                        rows={4}
                        placeholder="Full product details for product details page"
                      />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700 md:col-span-2">
                      Image URL (optional if uploading below)
                      <input value={newProduct.image || ''} onChange={(e) => updateNewProduct('image', e.target.value)} className={inputClass} placeholder="https://..." />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700 md:col-span-2">
                      Additional image URLs (one per line)
                      <textarea
                        value={(newProduct.images || []).slice(1).join('\n')}
                        onChange={(e) => updateNewProductExtraImages(e.target.value)}
                        className={textareaClass}
                        rows={3}
                        placeholder="https://..."
                      />
                    </label>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <label className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                      Upload image(s)
                      <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleNewProductImageUpload(e.target.files)} />
                    </label>
                    <span className="text-sm text-slate-500">You can paste image URLs, upload one image, or upload multiple images.</span>
                  </div>

                  {(newProduct.images || [newProduct.image]).filter(Boolean).length ? (
                    <div className="mt-4 rounded-md border border-slate-200 bg-slate-50/70 p-3">
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Image previews</p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {(newProduct.images || [newProduct.image]).filter(Boolean).map((image, imageIndex) => (
                          <div key={`new-product-preview-${imageIndex}`} className="overflow-hidden rounded-md border border-slate-200 bg-white">
                            <img
                              src={image}
                              alt={`${newProduct.title || 'New product'} preview ${imageIndex + 1}`}
                              className="aspect-[4/3] w-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-6 flex justify-end gap-2">
                    <button onClick={() => setIsAddModalOpen(false)} className="rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
                    <button onClick={createProductFromModal} disabled={isSaving} className="rounded-md border border-navy bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0a2347] disabled:opacity-60 disabled:cursor-not-allowed">{isSaving ? 'Adding...' : 'Add Product'}</button>
                  </div>
                  {newProductStatus ? (
                    <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{newProductStatus}</p>
                  ) : null}
                </div>
              </div>
            ) : null}

            {productPendingDelete ? (
              <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
                <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-2xl md:p-6">
                  <h3 className="text-lg font-extrabold text-navy">Delete Product</h3>
                  <p className="mt-2 text-sm text-slate-700">
                    You are about to permanently delete{' '}
                    <span className="font-semibold">“{productPendingDelete.title}”</span>. This action cannot be undone.
                  </p>
                  <div className="mt-5 flex justify-end gap-2">
                    <button
                      onClick={() => setProductPendingDelete(null)}
                      className="rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        const { index } = productPendingDelete
                        setProductPendingDelete(null)
                        await removeProduct(index)
                      }}
                      disabled={isSaving}
                      className="rounded-md border border-red-600 bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
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
