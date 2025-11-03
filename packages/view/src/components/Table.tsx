import { type ReactNode } from "react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props<TData extends Record<string, any>> = {
  data?: TData[]
  columns: {
    key: keyof TData
    label: string
    render?: (data: TData) => ReactNode
  }[]
  onRowClick?: (row: TData) => void
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Table = <T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
}: Props<T>) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data?.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-gray-100 cursor-pointer"
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className="px-6 py-4 whitespace-nowrap"
                >
                  {column.render
                    ? column.render(row)
                    : (row[column.key] as ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
