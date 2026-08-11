import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import pg from 'pg';
import crypto from 'node:crypto';

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(express.json({ limit: '20kb' }));
app.use(cors({ origin: process.env.ALLOWED_ORIGIN, methods: ['GET', 'POST', 'DELETE'] }));

// Not: bilerek IP loglamıyoruz — access log formatı Nginx tarafında ayarlanır (bkz. DEPLOY.md).
app.use(rateLimit({ windowMs: 60_000, max: 60 }));

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function requireSessionId(req, res, next) {
  if (!UUID_RE.test(req.params.id)) return res.status(400).json({ error: 'invalid session id' });
  next();
}

// 1) Rıza kaydı — gameplayOptIn true ise session oluşturulur.
app.post('/api/consent', async (req, res) => {
  const { gameplayOptIn, demographicsOptIn } = req.body ?? {};
  if (typeof gameplayOptIn !== 'boolean' || typeof demographicsOptIn !== 'boolean') {
    return res.status(400).json({ error: 'gameplayOptIn and demographicsOptIn must be booleans' });
  }
  if (!gameplayOptIn) return res.json({ sessionId: null });

  const sessionId = crypto.randomUUID();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      'INSERT INTO consents (session_id, gameplay_opt_in, demographics_opt_in) VALUES ($1,$2,$3)',
      [sessionId, gameplayOptIn, demographicsOptIn]
    );
    await client.query('INSERT INTO sessions (session_id) VALUES ($1)', [sessionId]);
    await client.query('COMMIT');
    res.json({ sessionId });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    res.status(500).json({ error: 'could not create session' });
  } finally {
    client.release();
  }
});

// 2) Oyun başlangıcı — ada/zorluk/dil seçildiğinde.
app.post('/api/session/:id/start', requireSessionId, async (req, res) => {
  const { islandId, difficulty, locale, deviceType } = req.body ?? {};
  try {
    const r = await pool.query(
      `UPDATE sessions SET island_id=$1, difficulty=$2, locale=$3, device_type=$4
       WHERE session_id=$5`,
      [islandId ?? null, difficulty ?? null, locale ?? null, deviceType ?? null, req.params.id]
    );
    if (r.rowCount === 0) return res.status(404).json({ error: 'session not found' });
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'could not update session' });
  }
});

// 3) Her kriz kararı.
app.post('/api/session/:id/decision', requireSessionId, async (req, res) => {
  const { crisisId, optionIndex, decisionMs, deltas } = req.body ?? {};
  if (typeof crisisId !== 'string' || typeof optionIndex !== 'number') {
    return res.status(400).json({ error: 'crisisId and optionIndex are required' });
  }
  try {
    await pool.query(
      `INSERT INTO decisions (session_id, crisis_id, option_index, decision_ms, deltas)
       VALUES ($1,$2,$3,$4,$5)`,
      [req.params.id, crisisId, optionIndex, decisionMs ?? null, deltas ? JSON.stringify(deltas) : null]
    );
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'could not record decision' });
  }
});

// 4) Oyun bitişi.
app.post('/api/session/:id/finish', requireSessionId, async (req, res) => {
  const { finalScore, archetype, finalVector } = req.body ?? {};
  try {
    const r = await pool.query(
      `UPDATE sessions SET final_score=$1, archetype=$2, final_vector=$3, finished_at=now()
       WHERE session_id=$4`,
      [finalScore ?? null, archetype ?? null, finalVector ? JSON.stringify(finalVector) : null, req.params.id]
    );
    if (r.rowCount === 0) return res.status(404).json({ error: 'session not found' });
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'could not finish session' });
  }
});

// 5) Opsiyonel demografik veri — yalnızca demographics_opt_in=true ise kabul edilir.
app.post('/api/session/:id/demographics', requireSessionId, async (req, res) => {
  const { ageBracket, country, education, field, interestLvl } = req.body ?? {};
  try {
    const consent = await pool.query(
      'SELECT demographics_opt_in FROM consents WHERE session_id=$1',
      [req.params.id]
    );
    if (consent.rowCount === 0) return res.status(404).json({ error: 'session not found' });
    if (!consent.rows[0].demographics_opt_in) {
      return res.status(403).json({ error: 'demographics opt-in not given' });
    }
    await pool.query(
      `INSERT INTO demographics (session_id, age_bracket, country, education, field, interest_lvl)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (session_id) DO UPDATE SET
         age_bracket=EXCLUDED.age_bracket, country=EXCLUDED.country,
         education=EXCLUDED.education, field=EXCLUDED.field, interest_lvl=EXCLUDED.interest_lvl`,
      [req.params.id, ageBracket ?? null, country ?? null, education ?? null, field ?? null, interestLvl ?? null]
    );
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'could not save demographics' });
  }
});

// 6) GDPR Art.17 — kullanıcı kendi session_id'siyle tüm verisinin silinmesini talep edebilir.
app.delete('/api/session/:id', requireSessionId, async (req, res) => {
  try {
    const r = await pool.query('DELETE FROM consents WHERE session_id=$1', [req.params.id]);
    // ON DELETE CASCADE: sessions, decisions, demographics de birlikte silinir.
    if (r.rowCount === 0) return res.status(404).json({ error: 'session not found' });
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'could not delete session' });
  }
});

// 7) Opsiyonel, session'dan tamamen bağımsız iletişim e-postası.
// Bilerek session_id ile ilişkilendirilmez — oynanış verisi anonim kalır.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
app.post('/api/contact', async (req, res) => {
  const { email } = req.body ?? {};
  if (typeof email !== 'string' || !EMAIL_RE.test(email) || email.length > 254) {
    return res.status(400).json({ error: 'valid email required' });
  }
  try {
    await pool.query('INSERT INTO contacts (email) VALUES ($1)', [email]);
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'could not save contact' });
  }
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 3001;
app.listen(port, '127.0.0.1', () => console.log(`archipelago-api listening on ${port}`));
