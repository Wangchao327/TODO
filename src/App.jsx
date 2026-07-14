import { useState, useEffect, useCallback } from 'react'
import confetti from 'canvas-confetti'
import Header from './components/Header'
import TaskInput from './components/TaskInput'
import TaskList from './components/TaskList'
import StatsPanel from './components/StatsPanel'
import Toast from './components/Toast'
import AppLoading from './components/AppLoading'
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
    deletingIds,
    completingIds,
  } = useTodo()

  const [categoryFilter, setCategoryFilter] = useState(null)
  const [loading, setLoading] = useState(() => !sessionStorage.getItem('app-loaded'))
  const completed = sortedTasks.filter((t) => t.completed).length
  const total = sortedTasks.length

  useEffect(() => {
    if (loading) {
      const t = setTimeout(() => {
        setLoading(false)
        sessionStorage.setItem('app-loaded', '1')
      }, 500)
      return () => clearTimeout(t)
    }
  }, [loading])

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

  if (loading) return <AppLoading />

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: '#fafaf9',
        backgroundImage: 'radial-gradient(#d6d3d1 0.5px, transparent 0.5px)',
        backgroundSize: '18px 18px',
      }}
    >
      <div className="sticky top-0 z-20 px-4 pt-5 pb-2" style={{ backgroundColor: 'rgba(250,250,249,0.8)', backdropFilter: 'blur(12px)' }}>
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
            deletingIds={deletingIds}
            completingIds={completingIds}
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
