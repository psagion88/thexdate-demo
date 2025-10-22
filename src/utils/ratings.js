const KEY = 'thexdate.vendorRatings'

// { [vendor]: { sum, count } }
function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null') || {} } catch { return {} }
}
function save(obj) { localStorage.setItem(KEY, JSON.stringify(obj)) }

export function rateVendor(vendor, stars) {
  const db = load()
  const cur = db[vendor] || { sum:0, count:0 }
  cur.sum += stars
  cur.count += 1
  db[vendor] = cur
  save(db)
}
export function getVendorRating(vendor) {
  const cur = load()[vendor]
  if (!cur) return { avg: 0, count: 0 }
  return { avg: cur.sum / cur.count, count: cur.count }
}
