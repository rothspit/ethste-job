-- 写メ日記テーブル
CREATE TABLE IF NOT EXISTS photo_diaries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  girl_id uuid NOT NULL REFERENCES girls(id) ON DELETE CASCADE,
  brand_id text NOT NULL,
  image_url text NOT NULL,
  comment text,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_photo_diaries_brand_published ON photo_diaries(brand_id, published_at DESC);
CREATE INDEX idx_photo_diaries_girl ON photo_diaries(girl_id);

ALTER TABLE photo_diaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "photo_diaries_all" ON photo_diaries FOR ALL USING (true) WITH CHECK (true);

-- Supabase Storage バケット（SQL Editorでは作れないのでダッシュボードから作成）
-- バケット名: mitsu-diary
-- Public: true
