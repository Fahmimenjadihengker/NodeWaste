function AdminTable({ columns, rows, emptyText }) {
  return (
    <div className="overflow-x-auto rounded-[1.35rem] border border-leaf-100 bg-white shadow-[0_18px_45px_rgba(37,70,43,0.08)]">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-leaf-50 text-xs font-black uppercase tracking-[0.14em] text-leaf-800/55">
          <tr>{columns.map((column) => <th key={column.key} className="whitespace-nowrap px-4 py-4">{column.label}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-leaf-100 font-semibold text-moss/72">
          {rows.length ? rows.map((row, index) => (
            <tr key={row.id || index} className="transition hover:bg-[#f8fbf4]">{columns.map((column) => <td key={column.key} className="px-4 py-4 align-middle">{column.render ? column.render(row) : row[column.key]}</td>)}</tr>
          )) : (
            <tr><td className="px-4 py-10 text-center text-moss/55" colSpan={columns.length}>{emptyText}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default AdminTable
