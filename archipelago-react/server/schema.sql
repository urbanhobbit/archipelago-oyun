-- Archipelago araştırma verisi şeması.
-- Kişisel/tanımlayıcı veri (isim, email, IP) hiçbir tabloda tutulmaz.
-- session_id: sunucuda üretilen rastgele UUID, hiçbir kimlikle eşlenmez.

CREATE TABLE IF NOT EXISTS consents (
  session_id           UUID PRIMARY KEY,
  gameplay_opt_in      BOOLEAN NOT NULL,
  demographics_opt_in  BOOLEAN NOT NULL,
  consented_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
  session_id   UUID PRIMARY KEY REFERENCES consents(session_id) ON DELETE CASCADE,
  island_id    TEXT,
  difficulty   INT,
  locale       TEXT,
  device_type  TEXT,          -- 'mobile' | 'desktop' | 'tablet'
  final_score  INT,
  archetype    TEXT,
  final_vector JSONB,         -- {"CR":6,"CSR":4,"LEG":7,"COH":2,"JUS":3,"RES":6}
  started_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at  TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS decisions (
  id           SERIAL PRIMARY KEY,
  session_id   UUID NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
  crisis_id    TEXT NOT NULL,
  option_index INT NOT NULL,
  decision_ms  INT,
  deltas       JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ayrı rızayla, opsiyonel demografik veri.
CREATE TABLE IF NOT EXISTS demographics (
  session_id   UUID PRIMARY KEY REFERENCES sessions(session_id) ON DELETE CASCADE,
  age_bracket  TEXT,
  country      TEXT,
  education    TEXT,
  field        TEXT,
  interest_lvl INT
);

CREATE INDEX IF NOT EXISTS idx_decisions_session ON decisions(session_id);
