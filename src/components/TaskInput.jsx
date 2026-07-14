import { useState } from 'react'
import { Plus } from 'lucide-react'

export default function TaskInput({ onAdd }) {
  const [text, setText] = useState('')

  const handleSubmit = () => {
    if (text.trim()) {
      onAdd(text)
      setText('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="flex gap-3">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="今天你想完成什么？"
        className="flex-1 bg-white rounded-2xl px-5 py-3.5 text-gray-700 placeholder-gray-300 outline-none shadow-sm focus:ring-2 focus:ring-teal-400/50 transition-all"
      />
      <button
        onClick={handleSubmit}
        className="bg-teal-500 hover:bg-teal-600 active:scale-95 text-white rounded-2xl px-5 py-3.5 shadow-sm transition-all flex items-center justify-center"
      >
        <Plus size={20} />
      </button>
    </div>
  )
}
