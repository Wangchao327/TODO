import { useState, useRef, useEffect } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckCircle2, Circle, Trash2, GripVertical } from 'lucide-react'

const CATEGORY_DOT = {
  work: 'bg-blue-400',
  study: 'bg-amber-400',
  life: 'bg-teal-400',
  sport: 'bg-rose-400',
}

const PRIORITY_BADGE = {
  high: 'bg-red-50 text-red-500 border-red-200',
  medium: 'bg-amber-50 text-amber-500 border-amber-200',
  low: 'bg-gray-50 text-gray-400 border-gray-200',
}

export default function TaskItem({ task, onToggle, onUpdate, onDelete, isDragging, isDeleting, isCompleting }) {
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(task.text)
  const inputRef = useRef(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id, disabled: task.completed || isDeleting })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: transform ? 10 : undefined,
  }

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  const handleDoubleClick = () => {
    if (!task.completed) {
      setEditText(task.text)
      setEditing(true)
    }
  }

  const handleSaveEdit = () => {
    const trimmed = editText.trim()
    if (trimmed && trimmed !== task.text) {
      onUpdate(task.id, { text: trimmed })
    }
    setEditing(false)
  }

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') handleSaveEdit()
    if (e.key === 'Escape') setEditing(false)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`bg-white rounded-2xl px-3 py-3.5 shadow-sm flex items-center gap-3 group transition-shadow hover:shadow-md animate-task-enter ${isDeleting ? 'animate-task-exit pointer-events-none' : ''}`}
    >
      <button
        {...listeners}
        className={`flex-shrink-0 text-gray-300 hover:text-gray-400 cursor-grab active:cursor-grabbing transition-opacity p-0.5 touch-none ${
          task.completed || isDeleting ? 'opacity-0 pointer-events-none' : 'opacity-30 group-hover:opacity-100'
        }`}
        tabIndex={-1}
      >
        <GripVertical size={14} />
      </button>

      <button
        onClick={() => onToggle(task.id)}
        className="flex-shrink-0 cursor-pointer"
        disabled={isDeleting}
      >
        {task.completed ? (
          <CheckCircle2 size={20} className={`text-teal-500 ${isCompleting ? 'animate-bounce-in' : ''}`} />
        ) : (
          <Circle size={20} className="text-gray-300 hover:text-teal-400 transition-colors" />
        )}
      </button>

      {task.category && (
        <span className={`flex-shrink-0 w-2 h-2 rounded-full ${CATEGORY_DOT[task.category]}`} />
      )}

      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={handleEditKeyDown}
            className="w-full text-sm text-gray-700 outline-none bg-transparent border-b border-teal-400 pb-0.5"
          />
        ) : (
          <span
            onDoubleClick={handleDoubleClick}
            className={`block text-sm select-none transition-all duration-300 truncate ${
              task.completed ? 'text-gray-400 line-through cursor-default' : 'text-gray-700 cursor-text'
            }`}
          >
            {task.text}
          </span>
        )}
      </div>

      {task.priority && (
        <span
          className={`flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded-md border font-medium ${PRIORITY_BADGE[task.priority]}`}
        >
          {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
        </span>
      )}

      <button
        onClick={() => onDelete(task.id)}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-400 p-1 cursor-pointer"
        disabled={isDeleting}
      >
        <Trash2 size={15} />
      </button>
    </div>
  )
}
