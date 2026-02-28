-- サイト設定テーブル（スケジュールページの有効/無効など）
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to site_settings" ON site_settings
  FOR ALL USING (true) WITH CHECK (true);

-- スケジュールページはデフォルト停止
INSERT INTO site_settings (key, value) VALUES ('schedule_page', '{"active": false}')
ON CONFLICT (key) DO NOTHING;
