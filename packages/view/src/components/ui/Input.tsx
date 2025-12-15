import React from "react"
import {
  type FieldValues,
  useController,
  type UseControllerProps,
} from "react-hook-form"

type InputProps<T extends FieldValues> = UseControllerProps<T> & {
  label?: string
  placeholder?: string
  type?: React.HTMLInputTypeAttribute
}

export const Input = <T extends FieldValues>({ ...props }: InputProps<T>) => {
  const { field, fieldState } = useController(props)
  const { label, placeholder, type } = props

  return (
    <div>
      {label && (
        <label
          htmlFor={field.name}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      <input
        {...field}
        type={type}
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {fieldState.error && (
        <div className="text-red-500">{fieldState.error.message}</div>
      )}
    </div>
  )
}
