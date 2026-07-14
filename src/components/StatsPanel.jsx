import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { getTodayString } from '../hooks/useTodo'

function dateStr(year, month, day) {
  return `${year}-${month}-${day}`
}

function parseDate(str) {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function StatCard({ label, value, unit }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 text-center">
      <p className="text-xl font-semibold text-gray-800">
        {value}
        <span className="text-xs text-gray-400 ml-0.5">{unit}</span>
      </p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
    </div>
  )
}

function CalendarHeatmap({ history, todayStr }) {
  const cells = useMemo(() => {
    const today = parseDate(todayStr)
    const result = []
    const start = new Date(today)
    start.setDate(today.getDate() - 76)

    for (let i = 0; i < 77; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      const key = dateStr(d.getFullYear(), d.getMonth() + 1, d.getDate())
      const stats = history[key]
      const rate = stats && stats.total > 0 ? stats.completed / stats.total : -1
      result.push({ key, rate, dayOfWeek: d.getDay() })
    }
    return result
  }, [history, todayStr])

  const getColor = (rate) => {
    if (rate < 0) return 'bg-gray-100'
    if (rate === 0) return 'bg-gray-200'
    if (rate <= 0.25) return 'bg-teal-100'
    if (rate <= 0.5) return 'bg-teal-200'
    if (rate <= 0.75) return 'bg-teal-300'
    return 'bg-teal-400'
  }

  const DAY_MAP = [6, 0, 1, 2, 3, 4, 5]
  const rows = 7
  const cols = 11
  const grid = Array.from({ length: rows }, () => Array(cols).fill(null))

  cells.forEach((cell) => {
    const col = Math.floor(cells.indexOf(cell) / 7)
    const row = DAY_MAP[cell.dayOfWeek]
    if (col < cols) grid[row][col] = cell
  })

  const WEEKDAYS = ['一', '', '三', '', '五', '', '日']

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex gap-0.5">
        <div className="flex flex-col gap-0.5 mr-1">
          {WEEKDAYS.map((label, i) => (
            <div
              key={i}
              className="w-5 h-3 text-[10px] text-gray-300 flex items-center justify-end pr-1"
            >
              {label}
            </div>
          ))}
        </div>
        <div
          className="grid gap-0.5"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
        >
          {grid.flat().map((cell, idx) => (
            <div
              key={idx}
              title={cell ? `${cell.key}: ${cell.rate >= 0 ? Math.round(cell.rate * 100) + '%' : '无数据'}` : ''}
              className={`w-3 h-3 rounded-sm ${cell ? getColor(cell.rate) : 'bg-transparent'}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function TrendChart({ history }) {
  const data = useMemo(() => {
    const today = parseDate(getTodayString())
    const result = []
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const key = dateStr(
        d.getFullYear(),
        d.getMonth() + 1,
        d.getDate(),
      )
      const stats = history[key]
      const rate = stats && stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
      result.push({
        date: `${d.getMonth() + 1}/${d.getDate()}`,
        rate,
        total: stats?.total || 0,
        completed: stats?.completed || 0,
      })
    }
    return result
  }, [history])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload
      return (
        <div className="bg-white rounded-lg shadow-md px-3 py-2 text-xs border border-gray-100">
          <p className="text-gray-500">{label}</p>
          <p className="text-teal-600 font-medium">{d.rate}% 完成率</p>
          <p className="text-gray-400">{d.completed}/{d.total} 项</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            interval={2}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
            unit="%"
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="rate"
            stroke="#14b8a6"
            strokeWidth={2}
            dot={{ r: 3, fill: '#14b8a6', strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#14b8a6', strokeWidth: 2, stroke: '#fff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function StatsPanel({ history }) {
  const stats = useMemo(() => {
    const entries = Object.entries(history)
    const todayStr = getTodayString()
    const todayStats = history[todayStr] || { total: 0, completed: 0 }

    let totalCompleted = 0
    let totalTasks = 0
    const dates = entries.map(([k]) => k).sort()

    entries.forEach(([, v]) => {
      totalCompleted += v.completed
      totalTasks += v.total
    })

    let streak = 0
    let bestStreak = 0
    let currentStreak = 0

    const sortedDates = [...dates].sort().reverse()
    for (const date of sortedDates) {
      const day = history[date]
      if (day && day.completed > 0) {
        currentStreak++
      } else {
        if (currentStreak > bestStreak) bestStreak = currentStreak
        currentStreak = 0
      }
    }
    if (currentStreak > bestStreak) bestStreak = currentStreak

    if (todayStats.completed > 0) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yKey = dateStr(yesterday.getFullYear(), yesterday.getMonth() + 1, yesterday.getDate())
      const yStats = history[yKey]
      if (yStats && yStats.completed > 0) {
        streak = 1
        for (const date of sortedDates) {
          const d = parseDate(date)
          const todayD = parseDate(todayStr)
          const diff = Math.floor((todayD - d) / (1000 * 60 * 60 * 24))
          if (diff <= 0) continue
          const dayStats = history[date]
          if (dayStats && dayStats.completed > 0 && diff === streak) {
            streak++
          } else if (diff > streak) {
            break
          }
        }
      } else {
        streak = 1
      }
    }

    if (bestStreak < streak) bestStreak = streak

    const overallRate =
      totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0

    return { totalTasks, totalCompleted, overallRate, streak, bestStreak }
  }, [history])

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
      <h2 className="text-lg font-semibold text-gray-800">数据统计</h2>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="连续打卡" value={stats.streak} unit="天" />
        <StatCard label="最长连续" value={stats.bestStreak} unit="天" />
        <StatCard label="累计任务" value={stats.totalTasks} unit="项" />
        <StatCard label="累计完成" value={stats.totalCompleted} unit="项" />
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3">打卡日历</h3>
        <CalendarHeatmap history={history} todayStr={getTodayString()} />
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3">近两周趋势</h3>
        <TrendChart history={history} />
      </div>
    </div>
  )
}
