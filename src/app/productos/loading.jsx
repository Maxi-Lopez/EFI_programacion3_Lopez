export default function ProductosLoading() {
  return (
    <div className="space-y-4">
      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse w-1/3" />
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="h-12 bg-slate-100 dark:bg-slate-800 animate-pulse" />
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 animate-pulse">
              <div className="grid grid-cols-7 gap-4 px-4 py-3">
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg w-3/4" />
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}