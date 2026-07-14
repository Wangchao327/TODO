import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import useLocalStorage from './useLocalStorage'

const MOTIVATIONS = [
  '每一天都是新的开始，加油！',
  '完成小事，成就大事。',
  '坚持打卡，遇见更好的自己。',
  '慢慢来，比较快。',
  '今日事，今日毕。',
]

export function getTodayString() {
  const now = new Date()
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
}

function migrateTask(task) {
  return {
    id: task.id,
    text: task.text,
    completed: task.completed || false,
    createdAt: task.createdAt || Date.now(),
    category: task.category || null,
    priority: task.priority || null,
    order: task.order ?? task.createdAt ?? Date.now(),
  }
}

let orderCounter = Date.now()

export default function useTodo() {
  const [tasks, setTasks] = useLocalStorage('todo-tasks', [])
  const [lastDate, setLastDate] = useLocalStorage('todo-date', getTodayString())
  const [history, setHistory] = useLocalStorage('todo-history', {})
  const [motivation] = useState(() =>
    MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)],
  )
  const [undoTask, setUndoTask] = useState(null)
  const [deletingIds, setDeletingIds] = useState(new Set())
  const [completingIds, setCompletingIds] = useState(new Set())
  const undoTimer = useRef(null)
  const deleteTimers = useRef({})

  useEffect(() => {
    const today = getTodayString()
    if (lastDate !== today) {
      setHistory((prev) => ({
        ...prev,
        [lastDate]: {
          total: tasks.length,
          completed: tasks.filter((t) => t.completed).length,
        },
      }))
      setTasks((prev) => prev.map((t) => migrateTask({ ...t, completed: false })))
      setLastDate(today)
    }
  }, []) // eslint-disable-line

  useEffect(() => {
    const today = getTodayString()
    setHistory((prev) => ({
      ...prev,
      [today]: {
        total: tasks.length,
        completed: tasks.filter((t) => t.completed).length,
      },
    }))
  }, [tasks, setHistory])

  useEffect(() => {
    if (tasks.length > 0 && tasks[0].order === undefined) {
      setTasks((prev) => prev.map(migrateTask))
    }
  }, []) // eslint-disable-line

  const addTask = useCallback(
    (text, category = null, priority = null) => {
      orderCounter += 1
      const newTask = {
        id: Date.now().toString(),
        text: text.trim(),
        completed: false,
        createdAt: Date.now(),
        category,
        priority,
        order: orderCounter,
      }
      setTasks((prev) => [newTask, ...prev])
    },
    [setTasks],
  )

  const toggleTask = useCallback(
    (id) => {
      setTasks((prev) => {
        const task = prev.find((t) => t.id === id)
        if (task && !task.completed) {
          setCompletingIds((s) => new Set([...s, id]))
          setTimeout(() => setCompletingIds((s) => {
            const n = new Set(s)
            n.delete(id)
            return n
          }), 400)
        }
        return prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      })
    },
    [setTasks],
  )

  const updateTask = useCallback(
    (id, updates) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      )
    },
    [setTasks],
  )

  const deleteTask = useCallback(
    (id) => {
      const target = tasks.find((t) => t.id === id)
      if (!target) return

      setUndoTask(target)
      setDeletingIds((d) => new Set([...d, id]))

      if (undoTimer.current) clearTimeout(undoTimer.current)

      const tid = setTimeout(() => {
        setTasks((p) => p.filter((t) => t.id !== id))
        setDeletingIds((d) => {
          const next = new Set(d)
          next.delete(id)
          return next
        })
        delete deleteTimers.current[id]
      }, 250)
      deleteTimers.current[id] = tid

      undoTimer.current = setTimeout(() => setUndoTask(null), 3250)
    },
    [tasks, setTasks],
  )

  const undoDelete = useCallback(() => {
    if (!undoTask) return
    const id = undoTask.id

    if (deleteTimers.current[id]) {
      clearTimeout(deleteTimers.current[id])
      delete deleteTimers.current[id]
    }

    setDeletingIds((d) => {
      const next = new Set(d)
      next.delete(id)
      return next
    })

    setTasks((p) => {
      if (p.find((t) => t.id === id)) return p
      return [...p, undoTask]
    })
    setUndoTask(null)
    if (undoTimer.current) clearTimeout(undoTimer.current)
  }, [undoTask, setTasks])

  const reorderTasks = useCallback(
    (reordered) => {
      setTasks(reordered)
    },
    [setTasks],
  )

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.completed))
  }, [setTasks])

  const completeAll = useCallback(() => {
    setTasks((prev) => prev.map((t) => ({ ...t, completed: true })))
  }, [setTasks])

  const hasCompleted = useMemo(() => tasks.some((t) => t.completed), [tasks])
  const hasIncomplete = useMemo(() => tasks.some((t) => !t.completed), [tasks])

  const sortedTasks = useMemo(() => {
    const priorityRank = { high: 0, medium: 1, low: 2 }
    return [...tasks].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1
      const pA = priorityRank[a.priority] ?? 3
      const pB = priorityRank[b.priority] ?? 3
      if (pA !== pB) return pA - pB
      return (a.order ?? 0) - (b.order ?? 0)
    })
  }, [tasks])

  return {
    tasks,
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
  }
}
