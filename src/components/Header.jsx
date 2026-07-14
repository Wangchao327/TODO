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
        <h1 className="text-xl font-semibold text-stone-800 tracking-tight">{today}</h1>
        <span className="text-[13px] text-stone-400">
          {completed}/{total} 完成
        </span>
      </div>
      <div className="mt-2 w-full bg-stone-100 rounded-full h-1.5 overflow-visible relative">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-600 transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
        {percent > 0 && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_7px_3px_rgba(20,184,166,0.35)] transition-all duration-500"
            style={{ left: `calc(${percent}% - 4px)` }}
          />
        )}
      </div>
      <p className="text-stone-400 text-[13px] mt-1.5 leading-relaxed">{motivation}</p>
    </div>
  )
}
