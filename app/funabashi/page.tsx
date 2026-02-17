'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Noto_Sans_JP } from 'next/font/google'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@supabase/supabase-js'
import ScheduleSection from '@/components/ScheduleSection'
import RankingSection from '@/components/RankingSection'
import PriceListIdol from '@/components/PriceListIdol'
import UpdateNotice from '@/components/UpdateNotice'
import CardPayment from '@/components/CardPayment'
import DiarySection from '@/components/DiarySection'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const baseFont = Noto_Sans_JP({
  weight: ['700', '900'],
  subsets: ['latin'],
  preload: false,
})

// チャットメッセージ型
type MessageType = 'bot' | 'user' | 'card' | 'menu' | 'course' | 'time' | 'phone' | 'confirm' | 'submit' | 'complete' | 'waiting' | 'proposal'
interface ChatMessage {
  id: number
  type: MessageType
  content: string
  data?: any
}

// ハートの紙吹雪コンポーネント
const HeartConfetti = () => {
  const hearts = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    size: 12 + Math.random() * 20,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-[300] overflow-hidden">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ y: -50, x: `${heart.left}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', opacity: [1, 1, 0], rotate: 360 }}
          transition={{ duration: heart.duration, delay: heart.delay, ease: 'linear' }}
          className="absolute text-pink-500"
          style={{ fontSize: heart.size }}
        >
          💕
        </motion.div>
      ))}
    </div>
  )
}

// 電話番号入力コンポーネント
const PhoneInput = ({ onSubmit }: { onSubmit: (phone: string) => void }) => {
  const [phone, setPhone] = useState('')

  const formatPhone = (value: string) => {
    // 数字のみ抽出
    const numbers = value.replace(/\D/g, '')
    // 11桁まで
    const limited = numbers.slice(0, 11)
    // ハイフン付きフォーマット
    if (limited.length <= 3) return limited
    if (limited.length <= 7) return `${limited.slice(0, 3)}-${limited.slice(3)}`
    return `${limited.slice(0, 3)}-${limited.slice(3, 7)}-${limited.slice(7)}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value))
  }

  const handleSubmit = () => {
    if (phone.replace(/-/g, '').length >= 10) {
      onSubmit(phone)
    }
  }

  return (
    <div className="space-y-3">
      <input
        type="tel"
        value={phone}
        onChange={handleChange}
        placeholder="090-1234-5678"
        className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 font-rounded text-lg text-center text-slate-800 focus:outline-none focus:border-pink-400 transition"
        autoComplete="tel"
      />
      <button
        onClick={handleSubmit}
        disabled={phone.replace(/-/g, '').length < 10}
        className="w-full py-3 rounded-full font-rounded font-bold text-sm bg-gradient-to-r from-pink-500 to-pink-400 text-white shadow-lg transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        次へ進む →
      </button>
    </div>
  )
}

export default function FunabashiPage() {
  const [isVerified, setIsVerified] = useState(false)

  // チャットボット状態
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [selectedCast, setSelectedCast] = useState<any>(null)
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [usePoints, setUsePoints] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // 特別演出用
  const [isSpecialMode, setIsSpecialMode] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  // 実際のキャストデータ
  const [realCasts, setRealCasts] = useState<any[]>([])

  // 学級委員長（管理画面で設定）の設定
  interface LeaderConfig {
    castId: string
    castName: string
    dereMessage: string
    appointedAt: string
  }
  const [leaderConfig, setLeaderConfig] = useState<LeaderConfig | null>(null)
  const [leaderCastData, setLeaderCastData] = useState<any>(null)

  useEffect(() => {
    const checkVerified = localStorage.getItem('age_verified')
    if (checkVerified === 'true') {
      setIsVerified(true)
    }

    // 学級委員長の設定を読み込む
    const savedConfig = localStorage.getItem('leader_config')
    if (savedConfig) {
      const config = JSON.parse(savedConfig) as LeaderConfig
      setLeaderConfig(config)
    }

    // キャストデータを取得
    const fetchCasts = async () => {
      const { data } = await supabase
        .from('girls')
        .select('*')
        .eq('is_attending', true)
        .order('ranking_order', { ascending: true })
      if (data) {
        setRealCasts(data)
        // 学級委員長のキャストデータを特定
        const savedConfig = localStorage.getItem('leader_config')
        if (savedConfig) {
          const config = JSON.parse(savedConfig) as LeaderConfig
          const leader = data.find((g: any) => g.id === config.castId)
          if (leader) setLeaderCastData(leader)
        }
      }
    }
    fetchCasts()
  }, [])

  // チャット自動スクロール
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // チャット初期化
  const initChat = () => {
    setChatOpen(true)
    setMessages([])
    setSelectedCast(null)
    setSelectedCourse(null)
    setSelectedTime('')
    setPhoneNumber('')
    setUsePoints(false)
    setIsSubmitting(false)
    setIsSpecialMode(false)
    setShowConfetti(false)

    setTimeout(() => {
      addMessage('bot', 'ようこそ、転校生くん！💕\nわたしは学級委員長のさくらだよ！\n今日は何をしたい？')
      setTimeout(() => addMessage('menu', ''), 500)
    }, 300)
  }

  const addMessage = (type: MessageType, content: string, data?: any) => {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), type, content, data }])
  }

  // 画像URLを取得
  const getImageUrl = (girl: any) => {
    if (girl.images && girl.images[0]) return girl.images[0]
    if (girl.image1_url) return girl.image1_url
    return null
  }

  // ステータスを取得
  const getStatus = (timeStr: string) => {
    if (!timeStr) return { text: '時間未定', available: true }
    if (timeStr.includes('即')) return { text: '今すぐOK！', available: true, immediate: true }
    if (timeStr.includes('満')) return { text: '予約満了', available: false }
    return { text: `${timeStr}〜`, available: true }
  }

  // チャット用にキャストデータを整形
  const availableCasts = realCasts
    .filter(g => !g.today_hours?.includes('満'))
    .map(g => ({
      id: g.id,
      name: g.name,
      age: g.age,
      status: getStatus(g.today_hours).text,
      tag: g.catch_copy || '癒し系',
      available: true,
      immediate: g.today_hours?.includes('即'),
      image: getImageUrl(g),
    }))

  const courses = [
    { name: 'お試しコース', time: '60分', price: 15000 },
    { name: 'スタンダード', time: '90分', price: 22000, popular: true },
    { name: 'ロングコース', time: '120分', price: 30000 },
  ]

  const timeSlots = ['今すぐ', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']

  const handleMenuSelect = (choice: string) => {
    if (choice === 'today') {
      addMessage('user', '今日の登校メンバーを見たい！')
      setTimeout(() => {
        if (availableCasts.length > 0) {
          addMessage('bot', 'りょーかい！✨\n今日登校してる子たちを紹介するね！\nどの子と下校する？💕')
          setTimeout(() => addMessage('card', '', { casts: availableCasts }), 600)
        } else {
          addMessage('bot', 'ごめんね〜😢\n今日はまだ誰も登校してないみたい...\nまた後で確認してみてね！')
        }
      }, 500)
    } else if (choice === 'search') {
      addMessage('user', '好みの子を探したい！')
      setTimeout(() => {
        if (availableCasts.length > 0) {
          addMessage('bot', 'わかった！💖\nどんな子がタイプ？\nとりあえず今日いる子を見てみて！')
          setTimeout(() => addMessage('card', '', { casts: availableCasts }), 600)
        } else {
          addMessage('bot', 'ごめんね〜😢\n今日はまだ誰も登校してないみたい...\nまた後で確認してみてね！')
        }
      }, 500)
    }
  }

  const handleCastSelect = (cast: any) => {
    setSelectedCast(cast)

    // 学級委員長を選んだ場合の特別演出
    const isLeader = leaderConfig && cast.id === leaderConfig.castId
    if (isLeader) {
      setIsSpecialMode(true)
      setShowConfetti(true)
      // 紙吹雪を4秒後に消す
      setTimeout(() => setShowConfetti(false), 4000)

      // カスタムデレメッセージを分割して表示
      const dereMsg = leaderConfig.dereMessage || 'えっ…私！？\n他の子じゃなくて……いいの？\n\n……そっか。うん、\n放課後、特別室で待ってるからね❤️（//）'
      const dereParts = dereMsg.split('\n\n')

      addMessage('user', `${cast.name}ちゃんと下校したい！`)
      setTimeout(() => {
        addMessage('bot', 'えっ……')
      }, 600)
      setTimeout(() => {
        addMessage('bot', dereParts[0] || '私！？\n他の子じゃなくて……いいの？')
      }, 1500)
      setTimeout(() => {
        addMessage('bot', dereParts[1] || '……そっか。うん。\n放課後、特別室で待ってるからね❤️\n（//）')
      }, 2800)
      setTimeout(() => addMessage('course', '', { courses }), 3500)
    } else {
      // 通常の反応（他の子を選んだ場合）
      addMessage('user', `${cast.name}ちゃんと下校したい！`)
      setTimeout(() => {
        addMessage('bot', `${cast.name}ちゃんいい選択！✨\nめっちゃかわいいよね〜💕\nどのコースにする？`)
        setTimeout(() => addMessage('course', '', { courses }), 500)
      }, 500)
    }
  }

  const handleCourseSelect = (course: any) => {
    setSelectedCourse(course)
    addMessage('user', `${course.name}（${course.time}）で！`)
    setTimeout(() => {
      addMessage('bot', 'オッケー！👍\n何時から遊ぶ？')
      setTimeout(() => addMessage('time', '', { times: timeSlots }), 500)
    }, 500)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    addMessage('user', `${time}から！`)
    setTimeout(() => {
      addMessage('bot', `ばっちり！✨\n\n📍 場所は船橋・西船橋エリアに\n出張するよ！\n（ホテルやお部屋でOK！）\n\nあとは連絡先を教えてね📱`)
      setTimeout(() => addMessage('phone', ''), 800)
    }, 500)
  }

  const handlePhoneSubmit = (phone: string) => {
    if (!phone || phone.length < 10) {
      addMessage('bot', 'ごめんね、電話番号が短いみたい...\nもう一度入力してね📱')
      return
    }
    setPhoneNumber(phone)
    addMessage('user', `電話番号: ${phone}`)
    setTimeout(() => {
      addMessage('bot', 'ありがとう！💕\n最後に確認するね！')
      setTimeout(() => addMessage('confirm', '', { cast: selectedCast, course: selectedCourse, time: selectedTime, phone }), 600)
    }, 500)
  }

  const handleConfirm = (withPoints: boolean) => {
    setUsePoints(withPoints)
    addMessage('user', withPoints ? '会員ポイントを使う！' : 'そのまま申し込む')
    setTimeout(() => {
      addMessage('bot', 'OK！内容を確認してね👇')
      setTimeout(() => addMessage('submit', '', {
        cast: selectedCast,
        course: selectedCourse,
        time: selectedTime,
        phone: phoneNumber,
        usePoints: withPoints
      }), 500)
    }, 500)
  }

  // リアルタイム予約ステータス監視
  useEffect(() => {
    if (!currentBookingId) return

    const channel = supabase
      .channel(`booking-${currentBookingId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
          filter: `id=eq.${currentBookingId}`,
        },
        (payload) => {
          const booking = payload.new as any
          handleBookingStatusChange(booking)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentBookingId])

  // 予約ステータス変更ハンドラ
  const handleBookingStatusChange = (booking: any) => {
    if (booking.status === 'confirmed') {
      addMessage('bot', '🎉 ご予約が確定しました！🎉\n\nスタッフからまもなくご連絡いたします。\n楽しみにお待ちください💕')
      addMessage('complete', '')
    } else if (booking.status === 'negotiating' && booking.proposal_data) {
      const proposal = booking.proposal_data
      addMessage('bot', `📞 スタッフからのご連絡です\n\n${proposal.message || `${proposal.new_time}でしたらご案内可能です。`}\n\nいかがでしょうか？`)
      addMessage('proposal', '', {
        bookingId: booking.id,
        newTime: proposal.new_time,
        originalTime: proposal.original_time,
      })
    } else if (booking.status === 'rejected') {
      addMessage('bot', '申し訳ございません😢\n\nただいま満席のため、ご予約をお受けすることができませんでした。\n\nまたのご利用をお待ちしております。')
    }
  }

  // 提案への返答
  const handleProposalResponse = async (bookingId: string, accept: boolean) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: accept ? 'confirmed' : 'cancelled',
        }),
      })

      if (response.ok) {
        if (accept) {
          addMessage('user', '了承します！')
          addMessage('bot', '🎉 ありがとうございます！\n\nご予約が確定しました。\nスタッフからまもなくご連絡いたします💕')
          addMessage('complete', '')
        } else {
          addMessage('user', '今回は見送ります')
          addMessage('bot', '承知いたしました。\nまたのご利用をお待ちしております🙏')
        }
      }
    } catch (e) {
      addMessage('bot', 'エラーが発生しました。もう一度お試しください。')
    }
  }

  const handleFinalSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    addMessage('user', 'この内容で申し込む！')
    addMessage('bot', '送信中...📨')

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cast: { id: selectedCast.id, name: selectedCast.name },
          course: selectedCourse,
          startTime: selectedTime,
          phone: phoneNumber,
          usePoints: usePoints,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        // 予約IDを保存してリアルタイム監視開始
        setCurrentBookingId(result.bookingId)

        const price = selectedCourse.price - (usePoints ? 2000 : 0)
        if (isSpecialMode) {
          addMessage('bot', `💕 約束、できたよ 💕\n\n👧 ${selectedCast.name}ちゃん\n📋 ${selectedCourse.name}（${selectedCourse.time}）\n🕐 ${selectedTime}〜\n💰 ¥${price.toLocaleString()}\n\n……ちゃんと来てね？\n待ってるから❤️（//）\n\n⏳ スタッフが確認中...\n少々お待ちください`)
        } else {
          addMessage('bot', `🎉 予約リクエスト送信完了！ 🎉\n\n👧 ${selectedCast.name}ちゃん\n📋 ${selectedCourse.name}（${selectedCourse.time}）\n🕐 ${selectedTime}〜\n💰 ¥${price.toLocaleString()}\n\n⏳ スタッフが確認中...\nこのまましばらくお待ちください💕`)
        }
        addMessage('waiting', '')
      } else {
        addMessage('bot', `ごめんね、エラーが発生しちゃった...😢\n${result.error || 'もう一度試してみてね！'}`)
        setIsSubmitting(false)
      }
    } catch (error) {
      addMessage('bot', 'ごめんね、通信エラーが発生しちゃった...😢\nもう一度試してみてね！')
      setIsSubmitting(false)
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EntertainmentBusiness",
        "name": "アイドル学園 船橋",
        "image": "https://idolgakuen.jp/idol_top.jpg",
        "description": "船橋エリアのデリバリーヘルス「アイドル学園」。最短30分で到着。明朗会計。",
        "telephone": "050-1745-9665",
        "address": { "@type": "PostalAddress", "addressLocality": "Funabashi", "addressRegion": "Chiba", "addressCountry": "JP" },
        "priceRange": "¥10000-",
        "openingHoursSpecification": { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], "opens": "10:00", "closes": "04:00" }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "船橋のアイドル学園は初心者でも利用できますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい、初心者の方でも安心してご利用いただけるよう、丁寧なご案内を心がけております。" } },
          { "@type": "Question", "name": "クレジットカードは使えますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい、各種クレジットカードをご利用いただけます。" } }
        ]
      }
    ]
  }

  const handleVerify = () => {
    localStorage.setItem('age_verified', 'true')
    setIsVerified(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="bg-slate-50 min-h-screen pb-32 relative">
      {/* フォント&アニメーション */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;800&display=swap');

        .font-rounded { font-family: 'M PLUS Rounded 1c', sans-serif; }

        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        .wiggle { animation: wiggle 0.5s ease-in-out infinite; }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }

        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        .sparkle { animation: sparkle 1.5s ease-in-out infinite; }

        @keyframes rainbow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .rainbow-bg {
          background: linear-gradient(90deg, #FF69B4, #87CEEB, #FFD700, #FF69B4);
          background-size: 300% 300%;
          animation: rainbow 3s ease infinite;
        }
      `}</style>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 年齢確認モーダル */}
      {!isVerified && (
        <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/idol_top.jpg')] bg-cover bg-center opacity-20 blur-sm"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/60"></div>
          </div>

          <div className="relative z-10 w-full max-w-md bg-black/80 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-2xl text-center space-y-6">
            <div>
              <h1 className={`${baseFont.className} text-3xl font-black text-white tracking-widest mb-1`}>
                IDOL <span className="text-pink-500">GAKUEN</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Funabashi Delivery Health</p>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-2">年齢確認</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                当サイトは風俗営業法に基づき運営されています。<br/>
                <span className="text-pink-500 font-bold underline">18歳未満の方</span>のご利用は固くお断りします。
              </p>
            </div>

            <div className="space-y-3">
              <button onClick={handleVerify} className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black py-4 rounded-full shadow-lg hover:scale-[1.02] transition-transform text-lg flex items-center justify-center gap-2">
                <span>ENTER</span>
                <span className="text-xs bg-black/20 px-2 py-0.5 rounded font-normal">18歳以上です</span>
              </button>
              <a href="https://www.google.com" className="block text-xs text-slate-500 hover:text-slate-300 underline">いいえ (退室する)</a>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 text-left">
              船橋・西船橋・津田沼エリアのデリバリーヘルス「アイドル学園」。厳選された美女セラピストが最短30分で出張いたします。
            </div>
          </div>
        </div>
      )}

      {/* ヘッダー */}
      <div className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur text-white shadow-lg border-b border-slate-700">
        <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/funabashi" className={`${baseFont.className} text-xl font-black tracking-wider hover:opacity-80 transition-opacity`}>
            アイドル<span className="text-pink-500">学園</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/recruit" className="bg-yellow-500 text-slate-900 text-[10px] font-black px-2 py-2 rounded shadow hover:bg-yellow-400">求人</Link>
            <Link href="/login" className="bg-slate-700 text-white text-[10px] font-bold px-3 py-2 rounded-full shadow hover:bg-slate-600">ログイン</Link>
          </div>
        </div>
      </div>

      <UpdateNotice />

      {/* 出勤スケジュール */}
      <div className="pt-4">
        <ScheduleSection />
      </div>

      <DiarySection />

      {/* 在籍一覧ボタン */}
      <div className="max-w-2xl mx-auto px-4 mb-6">
        <Link href="/girls" className="block w-full bg-white border-2 border-slate-200 text-slate-600 font-bold py-3 rounded-xl text-center shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
          <span>👥</span> 在籍キャスト一覧を見る
          <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full text-slate-500">全員</span>
        </Link>
      </div>

      {/* ========== 生徒手帳（会員ポイント）カード ========== */}
      <div className="max-w-2xl mx-auto px-4 my-8">
        <div className="relative overflow-hidden rounded-2xl shadow-xl" style={{
          background: 'linear-gradient(135deg, #FF69B4 0%, #FF85C1 50%, #87CEEB 100%)',
        }}>
          {/* キラキラエフェクト */}
          <div className="absolute top-2 right-4 text-2xl sparkle">✨</div>
          <div className="absolute top-8 right-12 text-lg sparkle" style={{ animationDelay: '0.5s' }}>⭐</div>
          <div className="absolute bottom-4 left-4 text-xl sparkle" style={{ animationDelay: '1s' }}>💖</div>

          <div className="relative z-10 p-5">
            {/* ヘッダー部分 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🎒</span>
                </div>
                <div>
                  <p className="font-rounded font-bold text-slate-800 text-xs tracking-wider" style={{ textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}>IDOL GAKUEN</p>
                  <p className="font-rounded font-extrabold text-slate-900 text-lg" style={{ textShadow: '0 1px 3px rgba(255,255,255,0.9)' }}>生徒手帳</p>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-lg px-3 py-1 shadow">
                <p className="text-[10px] text-slate-700 font-bold">STUDENT ID</p>
              </div>
            </div>

            {/* メインコンテンツ */}
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <div className="text-center">
                <p className="font-rounded text-pink-600 text-xs font-bold mb-1">🎉 新入生応援キャンペーン 🎉</p>
                <p className="font-rounded text-slate-800 text-sm font-bold mb-2">今なら入学祝いとして</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="font-rounded text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                    2,000
                  </span>
                  <span className="font-rounded text-xl font-bold text-pink-500">pt</span>
                </div>
                <p className="font-rounded text-slate-600 text-xs mt-1">プレゼント！（2,000円相当）</p>
              </div>

              {/* 特典リスト */}
              <div className="mt-4 space-y-2">
                {[
                  '初登校ですぐ使える！',
                  '1pt = 1円で利用OK！',
                  '誕生日には2倍ptプレゼント🎂',
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-700 text-xs font-rounded font-bold">
                    <span className="text-pink-500">♡</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              {/* CTAボタン */}
              <button
                onClick={initChat}
                className="w-full mt-4 py-3 rounded-full font-rounded font-extrabold text-white shadow-lg transition-all active:scale-95"
                style={{
                  background: 'linear-gradient(90deg, #EC4899, #8B5CF6, #EC4899)',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                🏫 今すぐ入学して予約する！
              </button>
            </div>
          </div>
        </div>
      </div>

      <RankingSection />
      <PriceListIdol />
      <CardPayment />

      {/* SEOエリア */}
      <div className="max-w-2xl mx-auto px-4 py-8 bg-white border-t border-slate-100">
        <h2 className="text-lg font-black text-slate-800 mb-4">船橋で人気のデリヘルなら「アイドル学園」</h2>
        <div className="text-sm text-slate-600 space-y-4 leading-relaxed">
          <p>船橋・西船橋エリアを中心に展開する「アイドル学園」は、ルックス重視の厳選採用を行ったデリバリーヘルス店です。津田沼、市川、本八幡エリアのホテルやご自宅へも出張可能です。</p>
          <p><strong>【初心者の方へ】</strong><br/>当店は明朗会計を徹底しております。パネル指名料や消費税などの不明瞭な追加料金は一切ございません。初めての方でも安心して遊んでいただけるよう、スタッフが丁寧にご案内いたします。</p>
          <h3 className="font-bold text-slate-800 mt-4 mb-2">❓ よくある質問 (FAQ)</h3>
          <dl className="space-y-3">
            <div className="border-b border-slate-100 pb-2">
              <dt className="font-bold text-pink-600 text-xs">Q. すぐに来てもらえますか？</dt>
              <dd className="mt-1 text-xs">A. 船橋駅周辺であれば、最短30分程度で到着可能です。混雑状況はチャットやお電話にてリアルタイムにご確認いただけます。</dd>
            </div>
            <div className="border-b border-slate-100 pb-2">
              <dt className="font-bold text-pink-600 text-xs">Q. 領収書は発行できますか？</dt>
              <dd className="mt-1 text-xs">A. はい、可能です。店名が分からない形での発行も対応しておりますので、お気軽にお申し付けください。</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* フッター */}
      <div className="mt-8 bg-slate-800 text-white text-center py-8 px-4 mb-20">
        <h3 className="font-bold mb-2">キャスト・スタッフ募集中</h3>
        <p className="text-xs text-slate-400 mb-4">アイドル学園で一緒に働きませんか？</p>
        <Link href="/recruit" className="inline-block border border-white px-6 py-2 rounded-full hover:bg-white hover:text-slate-800 transition-colors">採用情報を見る</Link>
      </div>

      {/* 追尾フッター */}
      <div className="fixed bottom-0 left-0 w-full z-40 pointer-events-none">
        <div className="absolute inset-0 bg-white/70 backdrop-blur-md border-t border-white/40 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] pb-safe"></div>
        <div className="max-w-2xl mx-auto relative pointer-events-auto px-3 py-2 pb-safe flex gap-3 items-end">
          <a href="tel:05017459665" className="flex-1 group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-rose-300 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative bg-gradient-to-br from-white/90 to-white/60 backdrop-blur rounded-2xl p-[1px] shadow-sm overflow-hidden transform transition-all duration-300 hover:-translate-y-1 active:scale-98 ring-1 ring-pink-200/50">
              <div className="rounded-2xl flex flex-col items-center justify-center py-2.5 h-full transition-colors group-hover:bg-white/50">
                <span className="text-2xl mb-0.5 drop-shadow-sm text-pink-500">📞</span>
                <span className="text-[10px] font-black text-pink-600 tracking-widest">電話予約</span>
              </div>
            </div>
          </a>
          <Link href="/chat" className="flex-1 group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-400 rounded-2xl shadow-md overflow-hidden transform transition-all duration-300 hover:-translate-y-1 active:scale-98 ring-1 ring-blue-300/50">
              <div className="flex flex-col items-center justify-center py-2.5 h-full text-white transition-opacity group-hover:opacity-90 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/30 pointer-events-none"></div>
                <span className="text-2xl mb-0.5 drop-shadow">💬</span>
                <span className="text-[10px] font-black tracking-widest">直通チャット</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* ========== FAB（ラブレターボタン）========== */}
      <button
        onClick={initChat}
        className="fixed bottom-24 right-4 w-16 h-16 rounded-full shadow-xl flex items-center justify-center z-50 transition active:scale-95 wiggle"
        style={{
          background: 'linear-gradient(135deg, #FF69B4 0%, #FF85C1 50%, #FFB6C1 100%)',
          boxShadow: '0 4px 20px rgba(255, 105, 180, 0.5)',
        }}
      >
        <span className="text-3xl">💌</span>
      </button>

      {/* ========== ハートの紙吹雪 ========== */}
      <AnimatePresence>
        {showConfetti && <HeartConfetti />}
      </AnimatePresence>

      {/* ========== チャットモーダル ========== */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/50 flex items-end justify-center"
            onClick={() => setChatOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`w-full max-w-md h-[85vh] rounded-t-3xl overflow-hidden flex flex-col transition-all duration-700 ${isSpecialMode ? 'ring-4 ring-rose-400/50' : ''}`}
              style={{ background: isSpecialMode ? 'linear-gradient(180deg, #FFF0F5 0%, #FFD6E0 100%)' : 'linear-gradient(180deg, #FFF0F5 0%, #FFE4EC 100%)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* チャットヘッダー */}
              <div className={`px-4 py-3 flex items-center justify-between shadow-md transition-all duration-500 ${isSpecialMode ? 'bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600' : 'bg-gradient-to-r from-pink-500 to-pink-400'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full overflow-hidden shadow-lg border-2 transition-all duration-500 ${isSpecialMode ? 'border-yellow-300 ring-2 ring-yellow-400/50' : 'border-pink-300'}`}>
                    <img src="/sakura-senpai.jpg" alt="さくら先輩" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-rounded font-bold text-white text-sm drop-shadow">放課後コンシェルジュ</p>
                    <p className="text-[10px] text-pink-100 flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full animate-pulse ${isSpecialMode ? 'bg-yellow-400' : 'bg-green-400'}`}></span>
                      {isSpecialMode ? 'さくら先輩がドキドキ中…❤️' : 'さくら先輩がお相手中♪'}
                    </p>
                  </div>
                </div>
                <button onClick={() => setChatOpen(false)} className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white bg-white/20 rounded-full">
                  ✕
                </button>
              </div>

              {/* チャットメッセージエリア */}
              <div className={`flex-1 overflow-y-auto p-4 space-y-3 transition-all duration-700 ${isSpecialMode ? 'bg-gradient-to-b from-rose-50/50 to-pink-100/70' : ''}`}>
                <AnimatePresence mode="popLayout">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    >
                      {/* ボットメッセージ */}
                      {msg.type === 'bot' && (
                        <div className="flex gap-2">
                          <div className={`w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 transition-all ${isSpecialMode ? 'border-rose-400' : 'border-pink-300'}`}>
                            <img src="/sakura-senpai.jpg" alt="さくら先輩" className="w-full h-full object-cover" />
                          </div>
                          <div className={`rounded-2xl rounded-tl-sm px-4 py-3 max-w-[75%] shadow-sm border transition-all ${isSpecialMode ? 'bg-gradient-to-br from-pink-50 to-rose-100 border-rose-200' : 'bg-white border-pink-100'}`}>
                            <p className="font-rounded text-sm text-slate-700 whitespace-pre-line">{msg.content}</p>
                          </div>
                        </div>
                      )}

                      {/* ユーザーメッセージ */}
                      {msg.type === 'user' && (
                        <div className="flex justify-end">
                          <div className="bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[75%] shadow-md">
                            <p className="font-rounded text-sm">{msg.content}</p>
                          </div>
                        </div>
                      )}

                      {/* メニュー */}
                      {msg.type === 'menu' && (
                        <div className="flex flex-col gap-2 pl-12">
                          <button onClick={() => handleMenuSelect('today')} className="bg-white border-2 border-pink-300 text-pink-500 rounded-full px-4 py-3 font-rounded font-bold text-sm shadow-sm hover:bg-pink-50 transition flex items-center justify-center gap-2">
                            <span className="text-lg">📅</span> 今日の登校メンバーを見る
                          </button>
                          <button onClick={() => handleMenuSelect('search')} className="bg-white border-2 border-sky-300 text-sky-500 rounded-full px-4 py-3 font-rounded font-bold text-sm shadow-sm hover:bg-sky-50 transition flex items-center justify-center gap-2">
                            <span className="text-lg">🔍</span> 好みの子を探す
                          </button>
                        </div>
                      )}

                      {/* キャストカード（トレカ風・横スクロール） */}
                      {msg.type === 'card' && msg.data?.casts && (
                        <div className="pl-12 -mr-4">
                          <div className="flex gap-3 overflow-x-auto pb-2 pr-4">
                            {msg.data.casts.map((cast: any, idx: number) => (
                              <motion.div
                                key={cast.id}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex-shrink-0 w-36"
                              >
                                {(() => {
                                  const isLeaderCast = leaderConfig && cast.id === leaderConfig.castId
                                  return (
                                    <div className={`bg-white rounded-xl overflow-hidden shadow-lg border-2 relative ${isLeaderCast ? 'border-rose-400 ring-2 ring-rose-300/50' : 'border-pink-200'}`}>
                                      {/* トレカ風ヘッダー */}
                                      <div className={`px-2 py-1 flex items-center justify-between ${isLeaderCast ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500' : 'bg-gradient-to-r from-pink-400 to-pink-300'}`}>
                                        <span className="text-[8px] text-white font-bold">{isLeaderCast ? '👑 学級委員長' : 'IDOL CARD'}</span>
                                        <span className="text-[8px] text-white">{isLeaderCast ? '★★★★★' : '★★★'}</span>
                                      </div>

                                      {/* 写真エリア */}
                                      <div className="aspect-[3/4] bg-gradient-to-b from-pink-50 to-pink-100 flex items-center justify-center relative overflow-hidden">
                                        {cast.image ? (
                                          <img src={cast.image} alt={cast.name} className="w-full h-full object-cover" />
                                        ) : (
                                          <span className="text-5xl">👧</span>
                                        )}
                                        {/* ステータスバッジ */}
                                        {cast.immediate && (
                                          <div className="absolute top-2 right-2 bg-green-500 text-white text-[8px] font-bold px-2 py-1 rounded-full animate-pulse">
                                            今すぐOK！
                                          </div>
                                        )}
                                      </div>

                                      {/* 情報 */}
                                      <div className="p-2 bg-white">
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="font-rounded font-bold text-slate-800">{cast.name}</span>
                                          <span className="text-[10px] text-slate-400">{cast.age}歳</span>
                                        </div>
                                        <span className="inline-block bg-pink-100 text-pink-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                          {cast.tag}
                                        </span>
                                      </div>

                                      {/* 指名ボタン */}
                                      <button
                                        onClick={() => handleCastSelect(cast)}
                                        className={`w-full text-white font-rounded font-bold text-xs py-2 hover:opacity-90 transition ${
                                          isLeaderCast
                                            ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 animate-pulse'
                                            : 'bg-gradient-to-r from-pink-500 to-pink-400'
                                        }`}
                                      >
                                        {isLeaderCast ? `${cast.name}と下校する❤️` : 'この子と下校する💕'}
                                      </button>
                                    </div>
                                  )
                                })()}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* コース選択 */}
                      {msg.type === 'course' && msg.data?.courses && (
                        <div className="pl-12 space-y-2">
                          {msg.data.courses.map((course: any) => (
                            <button
                              key={course.name}
                              onClick={() => handleCourseSelect(course)}
                              className={`w-full bg-white rounded-xl p-3 flex items-center justify-between shadow-sm hover:shadow-md transition text-left border-2 ${course.popular ? 'border-pink-400' : 'border-gray-200'}`}
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  {course.popular && <span className="bg-pink-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">人気</span>}
                                  <span className="font-rounded font-bold text-sm text-slate-800">{course.name}</span>
                                </div>
                                <span className="text-[10px] text-slate-400">{course.time}</span>
                              </div>
                              <span className="font-rounded font-bold text-pink-500">¥{course.price.toLocaleString()}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* 時間選択 */}
                      {msg.type === 'time' && msg.data?.times && (
                        <div className="pl-12 flex flex-wrap gap-2">
                          {msg.data.times.map((time: string) => (
                            <button
                              key={time}
                              onClick={() => handleTimeSelect(time)}
                              className="bg-white border-2 border-pink-200 rounded-full px-4 py-2 font-rounded text-sm font-bold text-slate-700 hover:bg-pink-50 hover:border-pink-400 transition"
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* 電話番号入力 */}
                      {msg.type === 'phone' && (
                        <div className="pl-12">
                          <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-pink-200">
                            <p className="font-rounded font-bold text-slate-800 mb-3 flex items-center gap-2">
                              <span>📱</span> 電話番号を入力してね
                            </p>
                            <p className="text-[10px] text-slate-500 mb-3">
                              確認のため折り返しご連絡します
                            </p>
                            <PhoneInput onSubmit={handlePhoneSubmit} />
                          </div>
                        </div>
                      )}

                      {/* 確認画面（ポイント選択） */}
                      {msg.type === 'confirm' && msg.data && (
                        <div className="pl-12">
                          <div className={`rounded-xl p-4 shadow-lg border-2 ${isSpecialMode ? 'bg-gradient-to-br from-white to-rose-50 border-rose-300' : 'bg-white border-pink-200'}`}>
                            <p className="font-rounded font-bold text-center text-slate-800 mb-3 flex items-center justify-center gap-2">
                              <span>{isSpecialMode ? '💕' : '📋'}</span> {isSpecialMode ? '特別な予約' : '予約内容の確認'}
                            </p>
                            <div className="space-y-2 text-sm border-b border-pink-100 pb-3 mb-3">
                              <div className="flex justify-between">
                                <span className="text-slate-500 font-rounded">キャスト</span>
                                <span className="font-rounded font-bold text-slate-800">{msg.data.cast.name}ちゃん</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500 font-rounded">コース</span>
                                <span className="font-rounded font-bold text-slate-800">{msg.data.course.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500 font-rounded">時間</span>
                                <span className="font-rounded font-bold text-slate-800">{msg.data.time}〜</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500 font-rounded">電話番号</span>
                                <span className="font-rounded font-bold text-slate-800">{msg.data.phone}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500 font-rounded">エリア</span>
                                <span className="font-rounded font-bold text-slate-800">船橋・西船橋</span>
                              </div>
                            </div>

                            {/* ポイント利用オプション */}
                            <div className="bg-gradient-to-r from-pink-50 to-sky-50 rounded-lg p-3 mb-3 border border-pink-200">
                              <p className="font-rounded text-xs font-bold text-pink-600 mb-1 flex items-center gap-1">
                                <span>🎁</span> 新入生特典！
                              </p>
                              <p className="font-rounded text-[10px] text-slate-600">今なら2,000ptを使ってお得に遊べるよ！</p>
                            </div>

                            <div className="space-y-2">
                              <button
                                onClick={() => handleConfirm(true)}
                                className="w-full py-3 rounded-full font-rounded font-bold text-sm transition active:scale-95 text-white shadow-lg"
                                style={{
                                  background: 'linear-gradient(90deg, #EC4899, #8B5CF6, #EC4899)',
                                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                                }}
                              >
                                🎓 入学して2,000pt使う！
                              </button>
                              <button
                                onClick={() => handleConfirm(false)}
                                className="w-full py-3 rounded-full font-rounded font-bold text-sm border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                              >
                                ポイントを使わない
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 最終送信確認 */}
                      {msg.type === 'submit' && msg.data && (
                        <div className="pl-12">
                          <div className={`rounded-xl p-4 shadow-lg border-2 ${isSpecialMode ? 'bg-gradient-to-br from-rose-50 to-pink-100 border-rose-400' : 'bg-gradient-to-br from-pink-50 to-white border-pink-300'}`}>
                            <p className="font-rounded font-bold text-center text-slate-800 mb-3 flex items-center justify-center gap-2">
                              <span>✨</span> 最終確認
                            </p>
                            <div className="space-y-2 text-sm bg-white/80 rounded-lg p-3 mb-4">
                              <div className="flex justify-between">
                                <span className="text-slate-500 font-rounded">キャスト</span>
                                <span className="font-rounded font-bold text-pink-600">{msg.data.cast.name}ちゃん</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500 font-rounded">コース</span>
                                <span className="font-rounded font-bold text-slate-800">{msg.data.course.name}（{msg.data.course.time}）</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500 font-rounded">開始時間</span>
                                <span className="font-rounded font-bold text-slate-800">{msg.data.time}〜</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500 font-rounded">連絡先</span>
                                <span className="font-rounded font-bold text-slate-800">{msg.data.phone}</span>
                              </div>
                              <div className="flex justify-between border-t border-pink-100 pt-2 mt-2">
                                <span className="text-slate-500 font-rounded">お支払い</span>
                                <span className="font-rounded font-bold text-lg text-pink-600">
                                  ¥{(msg.data.course.price - (msg.data.usePoints ? 2000 : 0)).toLocaleString()}
                                  {msg.data.usePoints && <span className="text-[10px] text-green-600 ml-1">(-2,000pt)</span>}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={handleFinalSubmit}
                              disabled={isSubmitting}
                              className="w-full py-4 rounded-full font-rounded font-bold text-base transition active:scale-95 text-white shadow-xl disabled:opacity-50"
                              style={{
                                background: isSubmitting
                                  ? '#9CA3AF'
                                  : 'linear-gradient(90deg, #EC4899, #F43F5E, #EC4899)',
                                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                              }}
                            >
                              {isSubmitting ? '送信中...' : '🎀 この内容で申し込む！'}
                            </button>
                            <p className="text-[10px] text-slate-400 text-center mt-2">
                              送信後、スタッフから折り返しご連絡します
                            </p>
                          </div>
                        </div>
                      )}

                      {/* 待機中画面 */}
                      {msg.type === 'waiting' && (
                        <div className="pl-12">
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4 shadow-lg border-2 border-blue-300">
                            <div className="text-center">
                              <div className="flex justify-center mb-3">
                                <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
                              </div>
                              <p className="font-rounded font-bold text-blue-700">確認中...</p>
                              <p className="text-xs text-blue-600 mt-1">
                                スタッフが確認しています。<br/>このままお待ちください。
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 提案画面（時間調整） */}
                      {msg.type === 'proposal' && msg.data && (
                        <div className="pl-12">
                          <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-xl p-4 shadow-lg border-2 border-amber-300">
                            <div className="text-center mb-3">
                              <p className="text-2xl mb-1">🕐</p>
                              <p className="font-rounded font-bold text-amber-800">時間変更のご提案</p>
                            </div>
                            <div className="bg-white/70 rounded-lg p-3 mb-4 text-center">
                              <p className="text-sm text-gray-500 line-through">{msg.data.originalTime}</p>
                              <p className="text-xl font-bold text-amber-700">↓</p>
                              <p className="text-2xl font-bold text-amber-800">{msg.data.newTime}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleProposalResponse(msg.data.bookingId, true)}
                                className="flex-1 py-3 bg-green-500 text-white font-rounded font-bold rounded-full hover:bg-green-600 transition active:scale-95"
                              >
                                ✅ 了承する
                              </button>
                              <button
                                onClick={() => handleProposalResponse(msg.data.bookingId, false)}
                                className="flex-1 py-3 bg-gray-400 text-white font-rounded font-bold rounded-full hover:bg-gray-500 transition active:scale-95"
                              >
                                ❌ 見送る
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 完了画面 */}
                      {msg.type === 'complete' && (
                        <div className="pl-12">
                          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-4 shadow-lg border-2 border-green-300">
                            <div className="text-center">
                              <p className="text-4xl mb-2">🎉</p>
                              <p className="font-rounded font-bold text-green-700">予約確定！</p>
                              <p className="text-xs text-green-600 mt-1">
                                まもなくスタッフからご連絡します
                              </p>
                            </div>
                            <button
                              onClick={() => setChatOpen(false)}
                              className="w-full mt-4 py-2 rounded-full font-rounded font-bold text-sm bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition"
                            >
                              閉じる
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={chatEndRef}></div>
              </div>

              {/* 入力欄（デモ用） */}
              <div className="bg-white border-t border-pink-100 p-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="メニューから選んでね💕"
                    disabled
                    className="flex-1 bg-pink-50 rounded-full px-4 py-2 text-sm text-slate-400 font-rounded"
                  />
                  <button disabled className="w-10 h-10 bg-pink-200 rounded-full flex items-center justify-center text-pink-400">
                    ➤
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
