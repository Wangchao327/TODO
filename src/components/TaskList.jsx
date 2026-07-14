import { useEffect, useRef } from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { Circle, CheckCheck, Trash2 } from 'lucide-react'
import TaskItem from './TaskItem'

const CATEGORIES = [
  { key: null, label: '全部' },
  { key: 'work', label: '工作' },
  { key: 'study', label: '学习' },
  { key: 'life', label: '生活' },
  { key: 'sport', label: '运动' },
]

export default function TaskList({
  tasks,
  onToggle,
  onUpdate,
  onDelete,
  onReorder,
  onClearCompleted,
  onCompleteAll,
  hasCompleted,
  hasIncomplete,
  categoryFilter,
  onCategoryFilter,
  onCelebrate,
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const filteredTasks = categoryFilter
    ? tasks.filter((t) => t.category === categoryFilter)
    : tasks

  const incompleteIds = filteredTasks.filter((t) => !t.completed).map((t) => t.id)
  const completedIds = filteredTasks.filter((t) => t.completed).map((t) => t.id)

  const prevIncompleteRef = useRef(incompleteIds.length)

  useEffect(() => {
    if (prevIncompleteRef.current > 0 && incompleteIds.length === 0 && filteredTasks.length > 0) {
      onCelebrate?.()
    }
    prevIncompleteRef.current = incompleteIds.length
  }, [incompleteIds.length, filteredTasks.length, onCelebrate])

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = tasks.findIndex((t) => t.id === active.id)
    const newIndex = tasks.findIndex((t) => t.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove([...tasks], oldIndex, newIndex)
    const updated = reordered.map((t, i) => ({ ...t, order: i }))
    onReorder(updated)
  }

  const showBatchBar = tasks.length > 1

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
    <div className="space-y-3">
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key ?? 'all'}
            onClick={() => onCategoryFilter(cat.key === categoryFilter ? null : cat.key)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              categoryFilter === cat.key
                ? 'bg-teal-500 text-white shadow-md'
                : 'bg-white text-gray-400 hover:text-gray-600 hover:bg-gray-50 shadow-sm'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {showBatchBar && (
        <div className="flex gap-2">
          {hasIncomplete && (
            <button
              onClick={onCompleteAll}
              className="flex-1 flex items-center justify-center gap-1.5 bg-white rounded-xl py-2 text-xs text-teal-600 font-medium hover:bg-teal-50 transition-colors shadow-sm cursor-pointer"
            >
              <CheckCheck size={14} />
              全部完成
            </button>
          )}
          {hasCompleted && (
            <button
              onClick={onClearCompleted}
              className="flex-1 flex items-center justify-center gap-1.5 bg-white rounded-xl py-2 text-xs text-gray-400 font-medium hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm cursor-pointer"
            >
              <Trash2 size={13} />
              清除已完成
            </button>
          )}
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={incompleteIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-2.5">
            {filteredTasks.length === 0 ? (
              <p className="text-center text-gray-300 text-sm py-8">该分类下暂无任务</p>
            ) : (
              incompleteIds.map((id) => {
                const task = filteredTasks.find((t) => t.id === id)
                if (!task) return null
                return (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                  />
                )
              })
            )}
          </div>
        </SortableContext>

        {completedIds.length > 0 && (
          <div className="mt-4 space-y-2.5">
            {incompleteIds.length > 0 && (
              <p className="text-xs text-gray-300 pl-1">已完成 ({completedIds.length})</p>
            )}
            {completedIds.map((id) => {
              const task = filteredTasks.find((t) => t.id === id)
              if (!task) return null
              return (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              )
            })}
          </div>
        )}
      </DndContext>
    </div>
  )
}
