/**
 * Form error handling utility
 * Clears all errors and sets only the first error according to fieldOrder priority.
 */
export function handleFirstError(formErrors, fieldOrder, setError, clearErrors) {
  const firstField = fieldOrder.find((name) => formErrors[name])
  clearErrors()
  if (firstField && formErrors[firstField]) {
    setError(firstField, {
      type: formErrors[firstField].type,
      message: formErrors[firstField].message,
    })
  }
}
