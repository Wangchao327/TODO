import { useState, useRef } from 'react'
import { Plus } from 'lucide-react'

const CATEGORIES = [
  { key: 'work', label: '工作', active: 'bg-blue-500 text-white', inactive: 'bg-gray-100 text-gray-400 hover:bg-gray-200' },
  { key: 'study', label: '学习', active: 'bg-amber-500 text-white', inactive: 'bg-gray-100 text-gray-400 hover:bg-gray-200' },
  { key: 'life', label: '生活', active: 'bg-teal-500 text-white', inactive: 'bg-gray-100 text-gray-400 hover:bg-gray-200' },
  { key: 'sport', label: '运动', active: 'bg-rose-500 text-white', inactive: 'bg-gray-100 text-gray-400 hover:bg-gray-200' },
]

const PRIORITIES = [
  { key: 'high', label: '高', active: 'bg-red-500 text-white', inactive: 'bg-gray-100 text-gray-400 hover:bg-gray-200' },
  { key: 'medium', label: '中', active: 'bg-amber-500 text-white', inactive: 'bg-gray-100 text-gray-400 hover:bg-gray-200' },
  { key: 'low', label: '低', active: 'bg-gray-500 text-white', inactive: 'bg-gray-100 text-gray-400 hover:bg-gray-200' },
]

export default function TaskInput({ onAdd }) {
  const [text, setText] = useState('')
  const [category, setCategory] = useState(null)
  const [priority, setPriority] = useState(null)
  const inputRef = useRef(null)

  const handleSubmit = () => {
    if (text.trim()) {
      onAdd(text, category, priority)
      setText('')
      setCategory(null)
      setPriority(null)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="今天你想完成什么？"
          className="flex-1 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 outline-none focus:ring-2 focus:ring-teal-400/50 transition-all"
        />
        <button
          onClick={handleSubmit}
          className="bg-teal-500 hover:bg-teal-600 active:scale-95 text-white rounded-xl px-4 py-3 shadow-sm transition-all flex items-center justify-center cursor-pointer flex-shrink-0"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <div className="flex gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setCategory(category === cat.key ? null : cat.key)}
              className={`text-[11px] px-2 py-1 rounded-md font-medium transition-all cursor-pointer ${
                category === cat.key ? cat.active + ' shadow-sm' : cat.inactive
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="w-px h-5 bg-gray-200" />
        <div className="flex gap-1">
          {PRIORITIES.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPriority(priority === p.key ? null : p.key)}
              className={`text-[11px] px-2 py-1 rounded-md font-medium transition-all cursor-pointer ${
                priority === p.key ? p.active + ' shadow-sm' : p.inactive
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
