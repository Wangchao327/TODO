import { useState, useCallback } from 'react'
import confetti from 'canvas-confetti'
import Header from './components/Header'
import TaskInput from './components/TaskInput'
import TaskList from './components/TaskList'
import StatsPanel from './components/StatsPanel'
import Toast from './components/Toast'
import useTodo from './hooks/useTodo'

export default function App() {
  const {
    sortedTasks,
    addTask,
    toggleTask,
    updateTask,
    deleteTask,
    undoDelete,
    undoTask,
    reorderTasks,
    clearCompleted,
    completeAll,
    hasCompleted,
    hasIncomplete,
    motivation,
    history,
  } = useTodo()

  const [categoryFilter, setCategoryFilter] = useState(null)
  const completed = sortedTasks.filter((t) => t.completed).length
  const total = sortedTasks.length

  const handleCelebrate = useCallback(() => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#14b8a6', '#2dd4bf', '#0d9488', '#f59e0b', '#f43f5e'],
    })
    setTimeout(() => {
      confetti({
        particleCount: 30,
        spread: 90,
        origin: { y: 0.7, x: 0.2 },
        colors: ['#14b8a6', '#2dd4bf', '#0d9488'],
      })
    }, 200)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-20 bg-gray-50/80 backdrop-blur-md px-4 pt-5 pb-2">
        <div className="max-w-md mx-auto">
          <Header total={total} completed={completed} motivation={motivation} />
        </div>
      </div>

      <div className="px-4 pb-8 pt-3">
        <div className="max-w-md mx-auto space-y-5">
          <TaskInput onAdd={addTask} />
          <TaskList
            tasks={sortedTasks}
            onToggle={toggleTask}
            onUpdate={updateTask}
            onDelete={deleteTask}
            onReorder={reorderTasks}
            onClearCompleted={clearCompleted}
            onCompleteAll={completeAll}
            hasCompleted={hasCompleted}
            hasIncomplete={hasIncomplete}
            categoryFilter={categoryFilter}
            onCategoryFilter={setCategoryFilter}
            onCelebrate={handleCelebrate}
          />
          <StatsPanel history={history} />
        </div>
      </div>

      <Toast
        message={`已删除「${undoTask?.text || ''}」`}
        action="撤销"
        onAction={undoDelete}
        visible={!!undoTask}
      />
    </div>
  )
}
