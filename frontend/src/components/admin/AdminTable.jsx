function AdminTable({ columns, rows, emptyText }) {
  return (
    <div className="overflow-x-auto rounded-[1.25rem] border border-moss/10 bg-white/65">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-[#f8f4e6] text-xs font-black uppercase tracking-[0.14em] text-moss/45">
          <tr>{columns.map((column) => <th key={column.key} className="px-4 py-3">{column.label}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-moss/10 font-semibold text-moss/70">
          {rows.length ? rows.map((row, index) => (
            <tr key={row.id || index}>{columns.map((column) => <td key={column.key} className="px-4 py-3">{column.render ? column.render(row) : row[column.key]}</td>)}</tr>
          )) : (
            <tr><td className="px-4 py-6 text-center text-moss/55" colSpan={columns.length}>{emptyText}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default AdminTable
