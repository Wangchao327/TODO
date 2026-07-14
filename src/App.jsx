import { useState } from 'react'
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

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-md mx-auto space-y-4">
        <Header total={total} completed={completed} motivation={motivation} />
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
        />
        <StatsPanel history={history} />
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
