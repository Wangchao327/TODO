export default function AppLoading() {
  return (
    <div className="min-h-screen px-4 py-8" style={{ backgroundColor: '#fafaf9', backgroundImage: 'radial-gradient(#d6d3d1 0.5px, transparent 0.5px)', backgroundSize: '18px 18px' }}>
      <div className="max-w-md mx-auto space-y-5">
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-end justify-between">
            <div className="h-5 bg-stone-100 rounded w-32 animate-pulse" />
            <div className="h-4 bg-stone-100 rounded w-16 animate-pulse" />
          </div>
          <div className="mt-2 h-1.5 bg-stone-100 rounded-full animate-pulse" />
          <div className="mt-2 h-3 bg-stone-100 rounded w-2/3 animate-pulse" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex gap-2">
            <div className="flex-1 h-10 bg-stone-100 rounded-xl animate-pulse" />
            <div className="w-12 h-10 bg-stone-100 rounded-xl animate-pulse flex-shrink-0" />
          </div>
          <div className="flex gap-1.5 mt-3">
            <div className="h-6 w-10 bg-stone-100 rounded-md animate-pulse" />
            <div className="h-6 w-10 bg-stone-100 rounded-md animate-pulse" />
            <div className="h-6 w-10 bg-stone-100 rounded-md animate-pulse" />
            <div className="h-6 w-10 bg-stone-100 rounded-md animate-pulse" />
          </div>
        </div>

        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl px-4 py-4 shadow-sm flex items-center gap-3">
            <div className="w-4 h-4 bg-stone-100 rounded animate-pulse" />
            <div className="flex-1 h-4 bg-stone-100 rounded animate-pulse" />
            <div className="w-4 h-4 bg-stone-100 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
