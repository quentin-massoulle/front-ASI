import {
  type FieldValues,
  useController,
  type UseControllerProps,
} from "react-hook-form"

type Option = {
  value: string
  label: string
}

type InputSelectProps<T extends FieldValues> = UseControllerProps<T> & {
  label: string
  options: Option[]
}

export const InputSelect = <T extends FieldValues>({
  label,
  options,
  ...props
}: InputSelectProps<T>) => {
  const { field, fieldState } = useController(props)
  return (
    <div>
      <label
        htmlFor={field.name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <select
          {...field}
          className="w-full appearance-none p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>
      {fieldState.error && (
        <div className="text-red-500">{fieldState.error.message}</div>
      )}
    </div>
  )
}
