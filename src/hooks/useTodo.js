import { useState, useEffect, useCallback, useMemo } from 'react'
import useLocalStorage from './useLocalStorage'

const MOTIVATIONS = [
  '每一天都是新的开始，加油！',
  '完成小事，成就大事。',
  '坚持打卡，遇见更好的自己。',
  '慢慢来，比较快。',
  '今日事，今日毕。',
]

function getTodayString() {
  const now = new Date()
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
}

export default function useTodo() {
  const [tasks, setTasks] = useLocalStorage('todo-tasks', [])
  const [lastDate, setLastDate] = useLocalStorage('todo-date', getTodayString())
  const [motivation] = useState(() =>
    MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)],
  )

  useEffect(() => {
    const today = getTodayString()
    if (lastDate !== today) {
      setTasks((prev) => prev.map((t) => ({ ...t, completed: false })))
      setLastDate(today)
    }
  }, [lastDate, setTasks, setLastDate])

  const addTask = useCallback(
    (text) => {
      const newTask = {
        id: Date.now().toString(),
        text: text.trim(),
        completed: false,
        createdAt: Date.now(),
      }
      setTasks((prev) => [newTask, ...prev])
    },
    [setTasks],
  )

  const toggleTask = useCallback(
    (id) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
      )
    },
    [setTasks],
  )

  const deleteTask = useCallback(
    (id) => {
      setTasks((prev) => prev.filter((t) => t.id !== id))
    },
    [setTasks],
  )

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.completed === b.completed) return 0
      return a.completed ? 1 : -1
    })
  }, [tasks])

  return { tasks: sortedTasks, addTask, toggleTask, deleteTask, motivation }
}
