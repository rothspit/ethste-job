-- =============================================
-- Bookings Table for Reservation System
-- =============================================

-- テーブル作成
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_name TEXT NOT NULL,           -- 指名キャスト名
    course_minutes INT NOT NULL,        -- コース時間（分）
    course_name TEXT,                   -- コース名
    course_price INT,                   -- コース料金
    requested_time TEXT NOT NULL,       -- 希望時間（例: "19:00"）
    phone_number TEXT NOT NULL,         -- 電話番号
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'negotiating', 'rejected', 'cancelled')),
    proposal_data JSONB,                -- 提案内容（時間調整時）
    use_points BOOLEAN DEFAULT FALSE,   -- ポイント利用
    cast_id TEXT,                       -- キャストID（参照用）
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
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON bookings(phone_number);

-- RLS設定（開発用：全開放）
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 全アクセス許可ポリシー（開発用）
CREATE POLICY "Allow all access to bookings" ON bookings
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Realtime有効化
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;

-- コメント
COMMENT ON TABLE bookings IS '予約管理テーブル';
COMMENT ON COLUMN bookings.status IS 'pending: 保留, confirmed: 確定, negotiating: 調整中, rejected: お断り, cancelled: キャンセル';
COMMENT ON COLUMN bookings.proposal_data IS '時間調整提案データ（JSON形式）例: {"new_time": "19:20", "message": "19:20でしたら空いております"}';
