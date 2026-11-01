export default function DataTable({ columns, rows, empty }) {
  const align = (c) => (c.align === "right" ? "text-right" : "text-left");

  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-white">
      <table className="w-full text-sm">
        <thead className="border-b border-line bg-field/70 text-slate-500">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={`px-4 py-3 font-medium ${align(c)}`}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-500">
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="hover:bg-field/60">
                {columns.map((c) => (
                  <td key={c.key} className={`px-4 py-3 tabular-nums ${align(c)}`}>
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export function ErrorBox({ message }) {
  return (
    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
      <p className="font-medium">No se pudieron cargar los datos</p>
      <p className="mt-1">
        {message}. Revisa NEXT_PUBLIC_API_URL y que el endpoint exista en la API.
      </p>
    </div>
  );
}

