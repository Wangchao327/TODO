import Header from './components/Header'
import TaskInput from './components/TaskInput'
import TaskList from './components/TaskList'
import StatsPanel from './components/StatsPanel'
import useTodo from './hooks/useTodo'

export default function App() {
  const { tasks, addTask, toggleTask, deleteTask, motivation, history } = useTodo()
  const completed = tasks.filter((t) => t.completed).length
  const total = tasks.length

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-md mx-auto space-y-4">
        <Header total={total} completed={completed} motivation={motivation} />
        <TaskInput onAdd={addTask} />
        <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
        <StatsPanel history={history} />
      </div>
    </div>
  )
}
