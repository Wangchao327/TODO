import { useMemo } from 'react'

const DAYS = ['日', '一', '二', '三', '四', '五', '六']

export default function Header({ total, completed, motivation }) {
  const today = useMemo(() => {
    const d = new Date()
    return `${d.getMonth() + 1}月${d.getDate()}日 星期${DAYS[d.getDay()]}`
  }, [])

  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h1 className="text-2xl font-semibold text-gray-800">{today}</h1>
      <p className="text-gray-400 text-sm mt-1">{motivation}</p>

      <div className="mt-5">
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>完成进度</span>
          <span>
            {completed}/{total}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-teal-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
