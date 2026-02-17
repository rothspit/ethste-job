-- =============================================
-- THE TIARA Bookings Table
-- =============================================

-- テーブル作成
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    therapist_name TEXT NOT NULL,       -- セラピスト名
    course_minutes INT NOT NULL,        -- コース時間（分）
    course_name TEXT,                   -- コース名
    course_price INT,                   -- コース料金
    requested_time TEXT NOT NULL,       -- 希望時間
    phone_number TEXT NOT NULL,         -- 電話番号
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'negotiating', 'rejected', 'cancelled')),
    proposal_data JSONB,                -- 提案内容
    notes TEXT,                         -- 備考
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- updated_at 自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- インデックス
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

-- RLS設定（開発用：全開放）
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to bookings" ON bookings
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Realtime有効化
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;

COMMENT ON TABLE bookings IS 'THE TIARA 予約管理テーブル';
