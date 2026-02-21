-- =============================================
-- Areas & Schedules Tables for h-mitsu Schedule Management
-- =============================================

-- ========== areas テーブル ==========
CREATE TABLE IF NOT EXISTS areas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    brand_id TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- areas seed（人妻の蜜）
INSERT INTO areas (name, brand_id, sort_order) VALUES
    ('西船橋', 'hitomitsu', 1),
    ('葛西',   'hitomitsu', 2),
    ('錦糸町', 'hitomitsu', 3);

-- areas RLS
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to areas" ON areas
    FOR ALL USING (true) WITH CHECK (true);

-- ========== schedules テーブル（DROP → 再作成） ==========
-- 既存テーブルはスキーマ不一致（brand_id カラム不足等）かつデータ空のため再作成
DROP TABLE IF EXISTS schedules CASCADE;

CREATE TABLE schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    girl_id UUID NOT NULL REFERENCES girls(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    status TEXT DEFAULT 'unset' CHECK (status IN ('working', 'off', 'unset')),
    comment TEXT,
    area_id UUID REFERENCES areas(id) ON DELETE SET NULL,
    brand_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(girl_id, date)
);

-- updated_at 自動更新トリガー（既存関数を再利用）
CREATE TRIGGER update_schedules_updated_at
    BEFORE UPDATE ON schedules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- インデックス
CREATE INDEX idx_schedules_brand_date ON schedules(brand_id, date);
CREATE INDEX idx_schedules_girl_date ON schedules(girl_id, date);

-- RLS設定（開発用：全開放）
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to schedules" ON schedules
    FOR ALL USING (true) WITH CHECK (true);

-- Realtime有効化
ALTER PUBLICATION supabase_realtime ADD TABLE schedules;

-- コメント
COMMENT ON TABLE areas IS 'エリアマスタ（西船橋/葛西/錦糸町など）';
COMMENT ON TABLE schedules IS '出勤スケジュール管理テーブル';
COMMENT ON COLUMN schedules.status IS 'working: 出勤, off: 休み, unset: 未設定';
COMMENT ON COLUMN schedules.date IS '出勤日（YYYY-MM-DD）';
