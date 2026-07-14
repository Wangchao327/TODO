export default function Toast({ message, action, onAction, visible }) {
  if (!visible) return null

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
      <div className="bg-gray-800 text-white rounded-xl px-4 py-2.5 shadow-lg flex items-center gap-3 text-sm whitespace-nowrap">
        <span>{message}</span>
        {action && (
          <button
            onClick={onAction}
            className="text-teal-400 font-medium hover:text-teal-300 transition-colors cursor-pointer"
          >
            {action}
          </button>
        )}
      </div>
    </div>
  )
}
