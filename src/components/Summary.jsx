import { useMemo } from 'react'
import { CheckCircle2 } from 'lucide-react'

export default function Summary({ total, completed }) {
  const message = useMemo(() => {
    if (total === 0) return '还没有任务，赶快添加一个吧'
    if (completed === 0) return '新的一天，从第一个完成开始'
    if (completed === total) return '全部完成，太棒了！明天继续加油'
    const left = total - completed
    return `已完成 ${completed}/${total} 项，还剩 ${left} 项，继续加油！`
  }, [total, completed])

  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl shadow-sm ring-1 ring-stone-100 px-5 py-4">
      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
        <CheckCircle2 size={16} className="text-teal-600" />
      </div>
      <p className="text-sm text-stone-500 leading-relaxed">{message}</p>
    </div>
  )
}
