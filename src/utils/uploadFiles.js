const MAX_IMAGE_DIMENSION = 1600
const JPEG_QUALITY = 0.72
const PNG_QUALITY = 0.82
const MAX_FILES_PER_SUBMISSION = 6
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024
const MAX_TOTAL_SIZE_BYTES = 20 * 1024 * 1024

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error(`Could not read image file: ${file.name}`))
    }
    image.src = objectUrl
  })
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Could not compress the selected image.'))
        return
      }
      resolve(blob)
    }, type, quality)
  })
}

async function compressImageFile(file) {
  if (!file.type.startsWith('image/')) {
    return file
  }

  const image = await loadImageFromFile(file)
  const largestSide = Math.max(image.width, image.height)

  if (largestSide <= MAX_IMAGE_DIMENSION && file.size <= 1.5 * 1024 * 1024) {
    return file
  }

  const scale = Math.min(1, MAX_IMAGE_DIMENSION / largestSide)
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(image.width * scale))
  canvas.height = Math.max(1, Math.round(image.height * scale))

  const context = canvas.getContext('2d')
  if (!context) {
    return file
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height)

  const isPng = file.type === 'image/png'
  const outputType = isPng ? 'image/png' : 'image/jpeg'
  const outputQuality = isPng ? PNG_QUALITY : JPEG_QUALITY
  const blob = await canvasToBlob(canvas, outputType, outputQuality)

  if (blob.size >= file.size) {
    return file
  }

  const nextName =
    outputType === 'image/jpeg'
      ? file.name.replace(/\.[^.]+$/, '') + '.jpg'
      : file.name

  return new File([blob], nextName, {
    type: outputType,
    lastModified: Date.now(),
  })
}

function normalizeUploadEntry(file, originalFile) {
  return {
    file,
    name: file.name,
    size: file.size,
    type: file.type,
    originalSize: originalFile.size,
    wasCompressed: file.size < originalFile.size,
  }
}

function validatePreparedEntries(entries) {
  if (entries.length > MAX_FILES_PER_SUBMISSION) {
    throw new Error(`You can upload up to ${MAX_FILES_PER_SUBMISSION} files at a time.`)
  }

  const totalSize = entries.reduce((sum, item) => sum + item.size, 0)
  if (totalSize > MAX_TOTAL_SIZE_BYTES) {
    throw new Error('Your selected files are too large together. Please reduce them and try again.')
  }

  for (const item of entries) {
    if (item.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(`${item.name} is too large. Please keep each file under 8 MB.`)
    }
  }
}

export async function prepareUploadEntries(fileList) {
  const files = [...(fileList || [])]
  if (!files.length) {
    return []
  }

  const entries = []
  for (const originalFile of files) {
    const preparedFile = await compressImageFile(originalFile)
    entries.push(normalizeUploadEntry(preparedFile, originalFile))
  }

  validatePreparedEntries(entries)
  return entries
}

export function formatFileSize(sizeBytes) {
  const size = Number(sizeBytes || 0)
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`
  }
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}
