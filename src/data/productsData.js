import rawProducts from '../../nukreationz_extract/products.json'

function normalizeUrl(url = '') {
  try {
    const parsed = new URL(url)
    parsed.hash = ''
    parsed.search = ''
    parsed.pathname = parsed.pathname.replace(/\/+$/, '')
    return parsed.toString()
  } catch {
    return url.trim()
  }
}

function slugify(value = '') {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getCategory(title = '', productUrl = '') {
  const text = `${title} ${productUrl}`.toLowerCase()

  if (['business card', 'cards'].some((key) => text.includes(key))) return 'BUSINESS CARDS'
  if (['banner', 'large format', 'sign', 'signage', 'roll up', 'roll-up', 'x-stand', 'standee', 'backdrop', 'a frames', 'a-frame'].some((key) => text.includes(key))) return 'BANNERS & LARGE FORMAT'
  if (['envelope', 'envelopes'].some((key) => text.includes(key))) return 'BRANDED ENVELOPES'
  if (['notepad', 'jotter', 'jotters', 'block pad', 'spiral'].some((key) => text.includes(key))) return 'BRANDED NOTEPADS & JOTTERS'
  if (['cap', 'caps', 'hat', 'hats', 'trucker'].some((key) => text.includes(key))) return 'CAPS & HATS'
  if (['gift', 'power bank', 'charger', 'keyring', 'flashdrive'].some((key) => text.includes(key))) return 'CORPORATE GIFTS'
  if (['mug', 'mugs'].some((key) => text.includes(key))) return 'CUSTOM MUGS'
  if (['t-shirt', 't shirts', 'shirt'].some((key) => text.includes(key))) return 'CUSTOM T-SHIRTS'
  if (['flyer', 'handbill', 'leaflet'].some((key) => text.includes(key))) return 'FLYER & HANDBILLS'
  if (['frame', 'frames', 'wall art', 'canvas'].some((key) => text.includes(key))) return 'FRAMES & WALL ARTS'
  if (['greeting card', 'christmas card', 'ramadan card', 'thank you card'].some((key) => text.includes(key))) return 'GREETING CARDS'
  if (['letterhead'].some((key) => text.includes(key))) return 'LETTERHEAD'
  if (['brochure', 'trifold', 'bi-fold', 'bifold'].some((key) => text.includes(key))) return 'MARKETING BROCHURE'
  if (['paper bag', 'bags'].some((key) => text.includes(key))) return 'PAPER BAGS'
  if (['phone case'].some((key) => text.includes(key))) return 'PHONE CASES'
  if (['identity card', 'id card', 'pvc'].some((key) => text.includes(key))) return 'PLASTIC IDENTITY CARDS'
  if (['poster', 'posters'].some((key) => text.includes(key))) return 'POSTERS'
  if (['presentation folder', 'folders'].some((key) => text.includes(key))) return 'PRESENTATION FOLDERS'
  if (['sticker', 'stickers', 'label', 'labels'].some((key) => text.includes(key))) return 'STICKERS'
  if (['tote bag', 'tote bags'].some((key) => text.includes(key))) return 'TOTE BAGS'
  if (['wedding', 'invitation', 'save the date'].some((key) => text.includes(key))) return 'WEDDING STATIONERY'
  return 'CORPORATE GIFTS'
}

const CATEGORY_ORDER = [
  'BUSINESS CARDS',
  'BANNERS & LARGE FORMAT',
  'BRANDED ENVELOPES',
  'BRANDED NOTEPADS & JOTTERS',
  'CAPS & HATS',
  'CORPORATE GIFTS',
  'CUSTOM MUGS',
  'CUSTOM T-SHIRTS',
  'FLYER & HANDBILLS',
  'FRAMES & WALL ARTS',
  'GREETING CARDS',
  'LETTERHEAD',
  'MARKETING BROCHURE',
  'PAPER BAGS',
  'PHONE CASES',
  'PLASTIC IDENTITY CARDS',
  'POSTERS',
  'PRESENTATION FOLDERS',
  'STICKERS',
  'TOTE BAGS',
  'WEDDING STATIONERY',
]

const seenUrls = new Set()
const seenSlugs = new Set()

export const products = rawProducts
  .filter((item) => {
    const title = (item.title || '').trim()
    if (!title || title.toLowerCase() === 'page not found') return false

    const normalized = normalizeUrl(item.product_url)
    if (!normalized || seenUrls.has(normalized.toLowerCase())) return false
    seenUrls.add(normalized.toLowerCase())
    return true
  })
  .map((item) => {
    const normalizedUrl = normalizeUrl(item.product_url)
    const pathSlug = normalizedUrl.split('/').filter(Boolean).at(-1) || item.title
    const baseSlug = slugify(pathSlug) || slugify(item.title) || 'product'

    let slug = baseSlug
    let count = 2
    while (seenSlugs.has(slug)) {
      slug = `${baseSlug}-${count}`
      count += 1
    }
    seenSlugs.add(slug)

    const title = (item.title || '').trim()
    const rawPrice = String(item.price || '').trim()
    const normalizedPrice = rawPrice && /^\d[\d,.]*$/.test(rawPrice) ? `₦${rawPrice}` : ''
    const localImage = item.image_file ? `/product-images/${item.image_file}` : ''

    return {
      slug,
      category: getCategory(title, normalizedUrl),
      title,
      description: `High-quality ${title} printing tailored for brands, events, and business use.`,
      details: `High-quality ${title} printing tailored for brands, events, and business use.`,
      image: localImage || item.image_url,
      price: normalizedPrice || 'Price on request',
    }
  })

export const filters = ['All Products', ...CATEGORY_ORDER]
