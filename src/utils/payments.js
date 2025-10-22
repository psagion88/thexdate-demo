export const STORE_KEYS = {
  payments: 'thexdate.payments',
  preferred: 'thexdate.payments.preferredId',
  bank: 'thexdate.vendorBank',
  orders: 'thexdate.orders',
}

export function loadJSON(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key) || 'null'); return v ?? fallback } catch { return fallback }
}
export function saveJSON(key, value) { localStorage.setItem(key, JSON.stringify(value)) }

export function luhnCheck(num) {
  const s = String(num).replace(/\s|-/g,''); if (!/^\d+$/.test(s)) return false
  let sum = 0, flip = false
  for (let i = s.length - 1; i >= 0; i--) {
    let d = +s[i]; if (flip) { d *= 2; if (d > 9) d -= 9 } sum += d; flip = !flip
  }
  return sum % 10 === 0
}
export function detectBrand(num) {
  const s = String(num).replace(/\s|-/g,'')
  if (/^3[47]\d{13}$/.test(s)) return 'American Express'
  if (/^4\d{12}(\d{3})?(\d{3})?$/.test(s)) return 'Visa'
  if (/^5[1-5]\d{14}$/.test(s) || /^2(2[2-9]\d|[3-7]\d{2})\d{12}$/.test(s)) return 'Mastercard'
  if (/^6(?:011|5\d{2})\d{12}$/.test(s)) return 'Discover'
  return 'Card'
}
export function validateExpiry(mmYY) {
  if (!/^\d{2}\/\d{2}$/.test(mmYY)) return false
  const [mm, yy] = mmYY.split('/').map(Number)
  if (mm < 1 || mm > 12) return false
  const now = new Date(); const y = 2000 + yy
  const endOfMonth = new Date(y, mm, 0)
  return endOfMonth >= new Date(now.getFullYear(), now.getMonth(), 1)
}
export function validateCVC(cvc, brand) {
  if (!/^\d+$/.test(cvc)) return false
  if (brand === 'American Express') return cvc.length === 4
  return cvc.length === 3
}
export function maskCard(num) {
  const s = String(num).replace(/\s|-/g,''); const last4 = s.slice(-4)
  return `•••• •••• •••• ${last4}`
}

export function validateRouting(routing) {
  const s = String(routing).replace(/\D/g, '')
  if (s.length !== 9) return false
  const n = s.split('').map(Number)
  const checksum = 3*(n[0]+n[3]+n[6]) + 7*(n[1]+n[4]+n[7]) + (n[2]+n[5]+n[8])
  return checksum % 10 === 0
}
export function validateAccount(acct) {
  const s = String(acct).replace(/\D/g,'')
  return s.length >= 4 && s.length <= 17
}
