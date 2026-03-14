-- プロフィール拡張カラム追加
-- MrVenrey/CityHeaven レベルの詳細プロフィール + オリジナルQ&A

-- 基本プロフィール
ALTER TABLE girls ADD COLUMN IF NOT EXISTS birthplace TEXT;        -- 出身地
ALTER TABLE girls ADD COLUMN IF NOT EXISTS zodiac TEXT;            -- 星座
ALTER TABLE girls ADD COLUMN IF NOT EXISTS blood_type TEXT;        -- 血液型
ALTER TABLE girls ADD COLUMN IF NOT EXISTS alcohol TEXT;           -- お酒
ALTER TABLE girls ADD COLUMN IF NOT EXISTS tobacco TEXT;           -- タバコ
ALTER TABLE girls ADD COLUMN IF NOT EXISTS charm_point TEXT;       -- チャームポイント
ALTER TABLE girls ADD COLUMN IF NOT EXISTS similar_celeb TEXT;     -- 似ている芸能人
ALTER TABLE girls ADD COLUMN IF NOT EXISTS prev_job TEXT;          -- 前職

-- 拡張Q&A（SEOオリジナルコンテンツ）
ALTER TABLE girls ADD COLUMN IF NOT EXISTS q_sensitive TEXT;       -- 感じやすいところは？
ALTER TABLE girls ADD COLUMN IF NOT EXISTS q_play TEXT;            -- 得意プレイは？
ALTER TABLE girls ADD COLUMN IF NOT EXISTS q_first_time TEXT;      -- 初めてのお客様に一言
ALTER TABLE girls ADD COLUMN IF NOT EXISTS q_off_day TEXT;         -- お休みの日は何してる？
ALTER TABLE girls ADD COLUMN IF NOT EXISTS q_dream TEXT;           -- 将来の夢は？
