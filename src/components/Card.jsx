"use client";

export function Card({ title, description, children, footer, className = "", variant = "default" }) {
  const variants = {
    default: "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700",
    bordered: "bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600",
    elevated: "bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-800",
  };

  return (
    <div className={`rounded-xl ${variants[variant]} ${className}`}>
      {(title || description) && (
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          {title && <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>}
          {description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-b-xl">
          {footer}
        </div>
      )}
    </div>
  );
}

export function CardGrid({ className = "", children, columns = 3 }) {
  return (
    <div className={`grid gap-4 ${className} sm:grid-cols-2 lg:grid-cols-${columns}`}>
      {children}
    </div>
  );
}

export function CardStat({ label, value, icon, trend, className = "", children }) {
  return (
    <Card className={className}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-1 font-display text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
          {trend !== undefined && trend !== null && trend !== 0 && (
            <p className={`mt-1 text-sm font-medium ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
            </p>
          )}
          {children && <div className="mt-2">{children}</div>}
        </div>
        {icon && <div className="text-3xl">{icon}</div>}
      </div>
    </Card>
  );
}