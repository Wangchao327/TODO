import { useState, useRef, useEffect } from 'react'
import { Plus, Check } from 'lucide-react'

const CATEGORIES = [
  { key: 'work', label: '工作', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { key: 'study', label: '学习', color: 'bg-amber-100 text-amber-700 border-amber-300' },
  { key: 'life', label: '生活', color: 'bg-teal-100 text-teal-700 border-teal-300' },
  { key: 'sport', label: '运动', color: 'bg-rose-100 text-rose-700 border-rose-300' },
]

const PRIORITIES = [
  { key: 'high', label: '高', color: 'bg-red-100 text-red-600' },
  { key: 'medium', label: '中', color: 'bg-amber-100 text-amber-600' },
  { key: 'low', label: '低', color: 'bg-gray-100 text-gray-500' },
]

export default function TaskInput({ onAdd }) {
  const [text, setText] = useState('')
  const [category, setCategory] = useState(null)
  const [priority, setPriority] = useState(null)
  const [showCategory, setShowCategory] = useState(false)
  const [showPriority, setShowPriority] = useState(false)
  const inputRef = useRef(null)
  const categoryRef = useRef(null)
  const priorityRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setShowCategory(false)
      }
      if (priorityRef.current && !priorityRef.current.contains(e.target)) {
        setShowPriority(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSubmit = () => {
    if (text.trim()) {
      onAdd(text, category, priority)
      setText('')
      setCategory(null)
      setPriority(null)
      setShowCategory(false)
      setShowPriority(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  const activeCategory = CATEGORIES.find((c) => c.key === category)
  const activePriority = PRIORITIES.find((p) => p.key === priority)

  return (
    <div>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="今天你想完成什么？"
            className="w-full bg-white rounded-2xl px-4 py-3 text-gray-700 placeholder-gray-300 outline-none shadow-sm focus:ring-2 focus:ring-teal-400/50 transition-all text-sm"
          />
          {(activeCategory || activePriority) && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none" />
          )}
        </div>
        <div className="flex gap-1.5 flex-shrink-0">
          <div className="relative" ref={categoryRef}>
            <button
              type="button"
              onClick={() => {
                setShowCategory(!showCategory)
                setShowPriority(false)
              }}
              className={`h-full px-2.5 rounded-2xl text-xs font-medium border transition-all cursor-pointer ${
                activeCategory
                  ? activeCategory.color + ' border'
                  : 'bg-white text-gray-400 border-gray-100 shadow-sm hover:border-gray-200'
              }`}
            >
              {activeCategory ? activeCategory.label : '分类'}
            </button>
            {showCategory && (
              <div className="absolute top-full mt-1 left-0 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-20 min-w-[80px]">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => {
                      setCategory(category === cat.key ? null : cat.key)
                      setShowCategory(false)
                    }}
                    className={`w-full px-3 py-1.5 text-xs text-left flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer ${
                      category === cat.key ? 'text-gray-800 font-medium' : 'text-gray-500'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {category === cat.key && <Check size={12} />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative" ref={priorityRef}>
            <button
              type="button"
              onClick={() => {
                setShowPriority(!showPriority)
                setShowCategory(false)
              }}
              className={`h-full px-2.5 rounded-2xl text-xs font-medium border transition-all cursor-pointer ${
                activePriority
                  ? activePriority.color + ' border'
                  : 'bg-white text-gray-400 border-gray-100 shadow-sm hover:border-gray-200'
              }`}
            >
              {activePriority ? '!!'.slice(0, priority === 'high' ? 2 : 1) + activePriority.label : '优先级'}
            </button>
            {showPriority && (
              <div className="absolute top-full mt-1 right-0 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-20 min-w-[80px]">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => {
                      setPriority(priority === p.key ? null : p.key)
                      setShowPriority(false)
                    }}
                    className={`w-full px-3 py-1.5 text-xs text-left flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer ${
                      priority === p.key ? 'text-gray-800 font-medium' : 'text-gray-500'
                    }`}
                  >
                    <span>{p.label}优先级</span>
                    {priority === p.key && <Check size={12} />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleSubmit}
            className="bg-teal-500 hover:bg-teal-600 active:scale-95 text-white rounded-2xl px-4 py-3 shadow-sm transition-all flex items-center justify-center cursor-pointer"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
