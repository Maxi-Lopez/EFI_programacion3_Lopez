export default function Stats({ items }) {
  return (
    <dl className="mb-6 grid grid-cols-3 divide-x divide-line rounded-xl border border-line bg-white">
      {items.map((i, key) => (
        <div key={key} className="px-4 py-4 sm:px-5">
          <dt className="text-sm text-slate-500">{i.label}</dt>
          <dd className="mt-1 font-display text-xl font-semibold tabular-nums text-ink sm:text-2xl">
            {i.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
