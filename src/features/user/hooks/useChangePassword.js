import { useMutation } from '@tanstack/react-query'
import { changePassword } from '../services/userService'

export function useChangePassword(options = {}) {
  return useMutation({
    mutationFn: changePassword,
    ...options,
  })
}

export default useChangePassword
