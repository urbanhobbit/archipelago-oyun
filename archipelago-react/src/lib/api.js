// İsteğe bağlı, GDPR kapsamlı oynanış verisi kaydı.
// Her çağrı fire-and-forget'tir: ağ hatası olsa bile oyun akışını bloklamaz/bozmaz.
const BASE = '/api';

async function post(path, body) {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`${path} -> ${res.status}`);
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch (e) {
    if (import.meta.env?.DEV) console.warn('[archipelago-api]', path, e);
    return null;
  }
}

export const postConsent = (gameplayOptIn, demographicsOptIn) =>
  post('/consent', { gameplayOptIn, demographicsOptIn });

export const postSessionStart = (sessionId, data) =>
  post(`/session/${sessionId}/start`, data);

export const postDecision = (sessionId, data) =>
  post(`/session/${sessionId}/decision`, data);

export const postFinish = (sessionId, data) =>
  post(`/session/${sessionId}/finish`, data);

export const postDemographics = (sessionId, data) =>
  post(`/session/${sessionId}/demographics`, data);

// Session'dan bağımsız, ayrı iletişim e-postası (bkz. server/schema.sql yorumu).
export const postContact = (email) =>
  post('/contact', { email });
