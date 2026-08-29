// ─────────────────────────────────────────────────────────────
// Seed data — teams, members, headlines (demo dataset)
// Avatars are hotlinked from randomuser.me portrait CDN.
// ─────────────────────────────────────────────────────────────

export const TEAM_COLORS = {
  crimson: '#FF003C',
  cyan: '#00E5FF',
  gold: '#FFCC00',
  purple: '#8338EC',
  green: '#00FF88',
  orange: '#FF8800',
  pink: '#FF006E',
  blue: '#3A86FF',
}

export const DEVELOPER_EMAILS = ['adhambadraan@gmail.com', 'adhambadraan@icloud.com']

const port = (seed) => `https://randomuser.me/api/portraits/${seed % 2 === 0 ? 'men' : 'women'}/${(seed % 99) + 1}.jpg`

export const TEAMS = [
  { teamId: 't1', teamName: 'STRIKERS A', color: 'crimson', supervisorEmail: 'omar.hassan@bcflights.com', agentCount: 8 },
  { teamId: 't2', teamName: 'STRIKERS B', color: 'cyan', supervisorEmail: 'nour.ali@bcflights.com', agentCount: 8 },
  { teamId: 't3', teamName: 'STRIKERS C', color: 'gold', supervisorEmail: 'youssef.ibrahim@bcflights.com', agentCount: 8 },
  { teamId: 't4', teamName: 'STRIKERS D', color: 'purple', supervisorEmail: 'malak.said@bcflights.com', agentCount: 8 },
]

const makeAgent = (name, teamId, seed, opts = {}) => ({
  name,
  email: name.toLowerCase().replace(/[^a-z]+/g, '.') + '@bcflights.com',
  teamId,
  role: 'agent',
  avatar: port(seed),
  personalMotto: opts.motto || 'Gravity is just a suggestion.',
  powerEmoji: opts.emoji || '⚡',
  podTheme: opts.theme || 'default',
  status: opts.status || 'available', // available | onbreak | blocked
  breakType: null,
  breakStartedAt: null,
  breakSlot: 0,
  totalBreakTime: opts.total || 0, // minutes used this shift
  slotsUsed: opts.slots || 0,
  wcTime: opts.wc || 0, // minutes today
  warnings: opts.warnings || [],
  bonusGranted: opts.bonus || false,
  bonusUsed: false,
  dailyGoal: opts.goal || 80,
  goalProgress: opts.goalProg || 40,
  birthday: opts.birthday || false,
  isOnline: true,
  lateToday: opts.late || false,
  ...opts.extra,
})

export const MEMBERS = [
  // Developer
  { name: 'Adham Badran', email: 'adhambadraan@gmail.com', role: 'developer', teamId: null, avatar: 'https://randomuser.me/api/portraits/men/32.jpg', personalMotto: 'Build. Break. Repeat.', powerEmoji: '⚡' },
  // Admins
  { name: 'Karim El-Sayed', email: 'karim.elsayed@bcflights.com', role: 'admin', teamId: null, avatar: 'https://randomuser.me/api/portraits/men/11.jpg', personalMotto: 'Firm but funny.', powerEmoji: '🛡️' },
  { name: 'Dina Mansour', email: 'dina.mansour@bcflights.com', role: 'admin', teamId: null, avatar: 'https://randomuser.me/api/portraits/women/44.jpg', personalMotto: 'Order in the chaos.', powerEmoji: '🎯' },
  // Supervisors
  { name: 'Omar Hassan', email: 'omar.hassan@bcflights.com', role: 'supervisor', teamId: 't1', avatar: 'https://randomuser.me/api/portraits/men/45.jpg', personalMotto: 'Team A never sleeps.', powerEmoji: '🔥' },
  { name: 'Nour Ali', email: 'nour.ali@bcflights.com', role: 'supervisor', teamId: 't2', avatar: 'https://randomuser.me/api/portraits/women/65.jpg', personalMotto: 'Quietly effective.', powerEmoji: '🌙' },
  { name: 'Youssef Ibrahim', email: 'youssef.ibrahim@bcflights.com', role: 'supervisor', teamId: 't3', avatar: 'https://randomuser.me/api/portraits/men/68.jpg', personalMotto: 'Gold standard.', powerEmoji: '👑' },
  { name: 'Malak Said', email: 'malak.said@bcflights.com', role: 'supervisor', teamId: 't4', avatar: 'https://randomuser.me/api/portraits/women/28.jpg', personalMotto: 'Speed, then grace.', powerEmoji: '💜' },
]

// 32 agents across 4 teams
export const AGENTS = [
  // Team A — crimson
  makeAgent('Solomon', 't1', 3, { status: 'onbreak', breakType: 'regular', breakStartedAt: Date.now() - 8 * 60000 - 47000, breakSlot: 2, slots: 2, total: 27, motto: 'Punch in, punch out, repeat.', emoji: '🦁', wc: 6, warnings: [{ level: 1, reason: 'Slot overrun 2 min', issuedAt: Date.now() - 3600e3 }] }),
  makeAgent('Zayn', 't1', 7, { status: 'onbreak', breakType: 'wc', breakStartedAt: Date.now() - 3 * 60000 - 12000, breakSlot: 1, slots: 1, total: 4, motto: 'Five more minutes.', emoji: '😎', wc: 9 }),
  makeAgent('Fabiola', 't1', 5, { status: 'available', total: 45, slots: 4, wc: 12, bonus: true, motto: 'Leads first, snacks later.', emoji: '👑', goal: 100, goalProg: 100, birthday: true }),
  makeAgent('Leo', 't1', 21, { status: 'blocked', total: 62, slots: 5, wc: 22, warnings: [{ level: 2, reason: 'Total > 60 min budget', issuedAt: Date.now() - 7200e3 }, { level: 1, reason: 'WC limit exceeded', issuedAt: Date.now() - 5400e3 }], motto: 'The math is hard.', emoji: '🐺', late: true }),
  makeAgent('Maya', 't1', 12, { status: 'available', total: 12, slots: 1, wc: 3, motto: 'Hydration is a personality.', emoji: '💧' }),
  makeAgent('Tarek', 't1', 17, { status: 'available', total: 33, slots: 3, wc: 0, motto: 'Caffeine is my supervisor.', emoji: '☕' }),
  makeAgent('Hana', 't1', 9, { status: 'onbreak', breakType: 'meal', breakStartedAt: Date.now() - 11 * 60000, breakSlot: 3, slots: 3, total: 30, wc: 2, motto: 'Hungry & humble.', emoji: '🍜' }),
  makeAgent('Adam K.', 't1', 24, { status: 'available', total: 0, slots: 0, motto: 'Fresh shift, fresh me.', emoji: '🌅' }),
  // Team B — cyan
  makeAgent('Lina', 't2', 2, { status: 'onbreak', breakType: 'regular', breakStartedAt: Date.now() - 5 * 60000, breakSlot: 1, slots: 1, total: 8, motto: 'Slow is smooth.', emoji: '🦋', wc: 1 }),
  makeAgent('Karim S.', 't2', 33, { status: 'available', total: 18, slots: 2, motto: 'Numbers never panic.', emoji: '📊' }),
  makeAgent('Salma', 't2', 15, { status: 'available', total: 51, slots: 4, wc: 4, warnings: [{ level: 1, reason: 'WC 18m reminder', issuedAt: Date.now() - 10800e3 }], motto: 'Almost there.', emoji: '🎀' }),
  makeAgent('Mo', 't2', 27, { status: 'onbreak', breakType: 'personal', breakStartedAt: Date.now() - 9 * 60000, breakSlot: 2, slots: 2, total: 22, motto: 'Family first.', emoji: '📞' }),
  makeAgent('Rania', 't2', 6, { status: 'available', total: 6, slots: 1, motto: 'Perfume is a strategy.', emoji: '🌸', bonus: true }),
  makeAgent('Yousef A.', 't2', 38, { status: 'available', total: 26, slots: 3, motto: 'Two cups deep.', emoji: '☕' }),
  makeAgent('Farah', 't2', 19, { status: 'onbreak', breakType: 'regular', breakStartedAt: Date.now() - 14 * 60000, breakSlot: 3, slots: 3, total: 38, motto: 'Lo-fi beats to sell to.', emoji: '🎧' }),
  makeAgent('Hassan', 't2', 41, { status: 'available', total: 0, slots: 0, motto: 'Rookie season.', emoji: '🐣' }),
  // Team C — gold
  makeAgent('Nadia', 't3', 4, { status: 'onbreak', breakType: 'bonus', breakStartedAt: Date.now() - 2 * 60000, breakSlot: 4, slots: 3, total: 36, bonus: true, bonusUsed: true, motto: '10 BQ leads. Done. Now snacks.', emoji: '🏆' }),
  makeAgent('Sherif', 't3', 25, { status: 'available', total: 41, slots: 4, motto: 'Championship mindset.', emoji: '🥇', goal: 90, goalProg: 75 }),
  makeAgent('Doaa', 't3', 13, { status: 'onbreak', breakType: 'regular', breakStartedAt: Date.now() - 6 * 60000, breakSlot: 1, slots: 1, total: 9, motto: 'Night owl, star seller.', emoji: '🦉' }),
  makeAgent('Fady', 't3', 48, { status: 'available', total: 15, slots: 2, wc: 3, motto: 'One more deal.', emoji: '🤝' }),
  makeAgent('Reem', 't3', 8, { status: 'available', total: 28, slots: 3, warnings: [{ level: 1, reason: '3 restricted-hour attempts', issuedAt: Date.now() - 14400e3 }], motto: 'I meant to do that.', emoji: '😇' }),
  makeAgent('Bishoy', 't3', 34, { status: 'blocked', total: 55, slots: 5, motto: '…', emoji: '🤐' }),
  makeAgent('Aya', 't3', 22, { status: 'onbreak', breakType: 'wc', breakStartedAt: Date.now() - 4 * 60000, breakSlot: 2, slots: 2, total: 17, wc: 15, motto: 'Hydrate or die-drate.', emoji: '🚻' }),
  makeAgent('Mostafa', 't3', 49, { status: 'available', total: 7, slots: 1, motto: 'Third shift of the week.', emoji: '🛌' }),
  // Team D — purple
  makeAgent('Ganna', 't4', 10, { status: 'onbreak', breakType: 'regular', breakStartedAt: Date.now() - 7 * 60000, breakSlot: 2, slots: 2, total: 20, motto: 'Persistent. Like a cat.', emoji: '🐈', wc: 5 }),
  makeAgent('Seif', 't4', 29, { status: 'available', total: 30, slots: 3, motto: 'Silent but deadly.', emoji: '🗡️' }),
  makeAgent('Habiba', 't4', 16, { status: 'available', total: 13, slots: 1, motto: 'Sunrise is overrated.', emoji: '🌙', bonus: true }),
  makeAgent('Omar B.', 't4', 43, { status: 'onbreak', breakType: 'personal', breakStartedAt: Date.now() - 10 * 60000, breakSlot: 2, slots: 2, total: 24, motto: 'Family calls at 2 AM.', emoji: '📱' }),
  makeAgent('Menna', 't4', 14, { status: 'available', total: 44, slots: 4, wc: 8, motto: 'Almost done. Not done.', emoji: '🎨' }),
  makeAgent('Ahmed R.', 't4', 37, { status: 'available', total: 5, slots: 1, motto: 'The night is young.', emoji: '🌃' }),
  makeAgent('Sara', 't4', 20, { status: 'blocked', total: 48, slots: 5, wc: 11, warnings: [{ level: 3, reason: 'Repeated overruns', issuedAt: Date.now() - 3600e3 }], motto: 'We do not talk about it.', emoji: '🙈' }),
  makeAgent('Khaled', 't4', 46, { status: 'available', total: 2, slots: 1, motto: 'Strongest opener in the room.', emoji: '💪' }),
]

export const ALL_MEMBERS = [...MEMBERS, ...AGENTS]

export const FUNNY_FILLERS = [
  '🌯 Local: Shawarma prices in Cairo remain stable',
  '☕ Investigation: Who drank the last coffee? Suspects: everyone',
  '🐈 Cairo stray cat spotted near office. No comment',
  '🧠 Blinking is important. You have been staring at this ticker too long',
  '🕐 It is late. No, you cannot go home yet',
  '💡 Fun fact: You are doing better than you think',
  '🔥 Motivation levels remain critically high',
  '🎯 Reminder: The competition is sleeping. You are not',
  '🌙 The moon is out. So is your commission',
  '💎 You are the diamond. Breaks are the polishing',
]

export const INITIAL_HEADLINES = [
  { id: 'h1', text: 'SOLOMON started break (Regular) — Slot 2/5', category: 'breaks', priority: 'normal', agent: 'Solomon', teamId: 't1', time: Date.now() - 47000 },
  { id: 'h2', text: 'ZAYN is on WC break (3m 12s elapsed) — 16m 48s remaining', category: 'breaks', priority: 'normal', agent: 'Zayn', teamId: 't1', time: Date.now() - 132000 },
  { id: 'h3', text: 'FABIOLA earned a bonus break — 10 BQ leads worked!', category: 'bonus', priority: 'normal', agent: 'Fabiola', teamId: 't1', time: Date.now() - 210000 },
  { id: 'h4', text: 'LEO exceeded WC limit (22m/20m) — auto Level 1 warning', category: 'warnings', priority: 'urgent', agent: 'Leo', teamId: 't1', time: Date.now() - 300000 },
  { id: 'h5', text: 'NADIA is on a bonus break (+10m, does not count!) 🎁', category: 'bonus', priority: 'normal', agent: 'Nadia', teamId: 't3', time: Date.now() - 120000 },
  { id: 'h6', text: 'Ganna reached 45m total — watch the ceiling, legend', category: 'breaks', priority: 'normal', agent: 'Ganna', teamId: 't4', time: Date.now() - 380000 },
  { id: 'h7', text: '🎂 Happy Birthday FABIOLA! Confetti protocol engaged', category: 'birthday', priority: 'normal', agent: 'Fabiola', teamId: 't1', time: Date.now() - 600000 },
  { id: 'h8', text: 'Team B is 2/5 on break — capacity green', category: 'fun', priority: 'normal', teamId: 't2', time: Date.now() - 700000 },
]

export const BREAK_TYPES = {
  regular: { label: 'Regular Break', icon: '☕', color: '#00E5FF', budget: true, max: 15, desc: 'Counts toward your 60-min budget' },
  wc: { label: 'WC Break', icon: '🚻', color: '#3A86FF', budget: false, max: 15, desc: '20-min daily limit · does not count' },
  meal: { label: 'Meal Break', icon: '🍽️', color: '#FF8800', budget: true, max: 15, desc: 'Counts toward budget' },
  personal: { label: 'Personal Call', icon: '📞', color: '#8338EC', budget: true, max: 15, desc: 'Counts toward budget' },
  bonus: { label: 'Bonus Break', icon: '🎁', color: '#FFCC00', budget: false, max: 10, desc: 'Free 10m — does not count!' },
}

export const MESSAGES_SEED = [
  { id: 'm1', from: 'Omar Hassan', to: 'Solomon', text: 'Nice pacing tonight, Solomon. Keep slots under 12 min and you are golden.', time: Date.now() - 900000, read: true },
  { id: 'm2', from: 'Solomon', to: 'Omar Hassan', text: 'Copy that, boss. Back on the floor in 4.', time: Date.now() - 800000, read: true },
  { id: 'm3', from: 'Adham Badran', to: 'Solomon', text: 'BTW the new ticker engine ships tomorrow. No more glitching on your laptop 😄', time: Date.now() - 360000, read: false },
]
