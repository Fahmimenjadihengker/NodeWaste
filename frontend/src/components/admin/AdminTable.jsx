function AdminTable({ columns, rows, emptyText }) {
  return (
    <div className="overflow-x-auto rounded-[1.25rem] border border-leaf-900/10 bg-[#fffdf4]">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-[#edf5e4] text-xs font-black uppercase tracking-[0.14em] text-leaf-950/55">
          <tr>{columns.map((column) => <th key={column.key} className="whitespace-nowrap px-4 py-4">{column.label}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-leaf-900/10 font-semibold text-moss/72">
          {rows.length ? rows.map((row, index) => (
            <tr key={row.id || index} className="transition hover:bg-[#f5f1df]">{columns.map((column) => <td key={column.key} className="px-4 py-4 align-middle">{column.render ? column.render(row) : row[column.key]}</td>)}</tr>
          )) : (
            <tr><td className="px-4 py-10 text-center text-moss/55" colSpan={columns.length}>{emptyText}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default AdminTable
