import { useMemo } from 'react'

const DAYS = ['日', '一', '二', '三', '四', '五', '六']

export default function Header({ total, completed, motivation }) {
  const today = useMemo(() => {
    const d = new Date()
    return `${d.getMonth() + 1}月${d.getDate()}日 周${DAYS[d.getDay()]}`
  }, [])

  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <div className="flex-shrink-0">
      <div className="flex items-end justify-between">
        <h1 className="text-lg font-semibold text-gray-800">{today}</h1>
        <span className="text-xs text-gray-400">
          {completed}/{total} 完成
        </span>
      </div>
      <div className="mt-1.5 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-600 transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-gray-400 text-xs mt-1.5">{motivation}</p>
    </div>
  )
}
