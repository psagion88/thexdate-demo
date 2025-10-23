export function trackPageview() {
  try { window.va && window.va('pageview') } catch {}
}

export function trackEvent(name, props = {}) {
  try { window.va && window.va('event', name, props) } catch {}
}
