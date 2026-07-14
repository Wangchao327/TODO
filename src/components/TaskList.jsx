import { CheckCircle2, Circle, Trash2 } from 'lucide-react'

export default function TaskList({ tasks, onToggle, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <Circle size={28} className="text-gray-300" />
        </div>
        <p className="text-gray-300">还没有任务</p>
        <p className="text-gray-300 text-sm mt-1">添加第一个待办开始吧</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white rounded-2xl px-5 py-3.5 shadow-sm flex items-center gap-3.5 group transition-all"
        >
          <button
            onClick={() => onToggle(task.id)}
            className="flex-shrink-0 transition-transform duration-200 hover:scale-110"
          >
            {task.completed ? (
              <CheckCircle2 size={22} className="text-teal-500" />
            ) : (
              <Circle size={22} className="text-gray-300 hover:text-teal-400 transition-colors" />
            )}
          </button>
          <span
            className={`flex-1 text-sm select-none transition-all duration-300 ${
              task.completed ? 'text-gray-400 line-through' : 'text-gray-700'
            }`}
          >
            {task.text}
          </span>
          <button
            onClick={() => onDelete(task.id)}
            className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-400 p-1 cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
