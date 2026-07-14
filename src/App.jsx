import { useState, useEffect, useCallback, useMemo } from 'react'
import confetti from 'canvas-confetti'
import Header from './components/Header'
import TaskInput from './components/TaskInput'
import TaskList from './components/TaskList'
import StatsPanel from './components/StatsPanel'
import Summary from './components/Summary'
import Toast from './components/Toast'
import AppLoading from './components/AppLoading'
import useTodo from './hooks/useTodo'

const GREETINGS = [
  { start: 6, end: 12, text: '早上好', sub: '开始规划今天吧' },
  { start: 12, end: 18, text: '下午好', sub: '继续加油完成目标' },
  { start: 18, end: 24, text: '晚上好', sub: '回顾今天的收获' },
  { start: 0, end: 6, text: '夜深了', sub: '注意休息，明天见' },
]

function getGreeting() {
  const hour = new Date().getHours()
  return GREETINGS.find((g) => hour >= g.start && hour < g.end) || GREETINGS[1]
}

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

  const greeting = useMemo(() => getGreeting(), [])

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
      className="min-h-screen relative"
      style={{
        backgroundColor: '#fafaf9',
        backgroundImage: 'radial-gradient(#d6d3d1 0.5px, transparent 0.5px)',
        backgroundSize: '18px 18px',
      }}
    >
      <div className="blob-teal" />
      <div className="blob-amber" />

      <div
        className="sticky top-0 z-20 px-4 pt-5 pb-2"
        style={{ backgroundColor: 'rgba(250,250,249,0.8)', backdropFilter: 'blur(12px)' }}
      >
        <div className="max-w-lg mx-auto">
          <Header total={total} completed={completed} motivation={motivation} />
        </div>
      </div>

      <div className="relative z-10 px-4 pb-8 pt-3">
        <div className="max-w-lg mx-auto space-y-5">
          <p className="text-stone-400 text-sm">
            {greeting.text}，{greeting.sub}
          </p>
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
          <Summary total={total} completed={completed} />
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
