// Brand-specific, never-broken placeholders as inline SVG data URLs.
// We use emoji + color per type so it looks on-brand without external hosts.

const TYPE_STYLE = {
  Bakery:  { emoji: '🥖', bg: '#FDE68A', fg: '#3E2C00' },
  Produce: { emoji: '🥬', bg: '#D1FAE5', fg: '#064E3B' },
  Deli:    { emoji: '🥪', bg: '#FECACA', fg: '#7F1D1D' },
  Salad:   { emoji: '🥗', bg: '#BBF7D0', fg: '#065F46' },
  Italian: { emoji: '🍝', bg: '#FFE4E6', fg: '#881337' },
  Bowl:    { emoji: '🍚', bg: '#E0E7FF', fg: '#1E3A8A' },
  Sushi:   { emoji: '🍣', bg: '#FFE4B5', fg: '#7C2D12' },
  Other:   { emoji: '🍽️', bg: '#E5E7EB', fg: '#111827' }
}

function svgDataUrl(type = 'Other', title = '') {
  const s = TYPE_STYLE[type] || TYPE_STYLE.Other
  const label = type
  const subtitle = title ? title.slice(0, 18) : ''

  const svg =
`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${s.bg}"/>
      <stop offset="100%" stop-color="#ffffff"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" font-size="72">${s.emoji}</text>
  <text x="50%" y="75%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="18" font-weight="700" fill="${s.fg}">${escapeXml(label)}</text>
  <text x="50%" y="88%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="12" fill="${s.fg}" opacity="0.7">${escapeXml(subtitle)}</text>
</svg>`;

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function escapeXml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
                  .replace(/"/g,'&quot;').replace(/'/g,'&apos;')
}

export function placeholderForItem(item = {}) {
  const type = item.type || 'Other'
  const title = item.title || ''
  return svgDataUrl(type, title)
}
