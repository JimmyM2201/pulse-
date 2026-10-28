import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../../../lib/queryKeys'
import { updateUser } from '../services/userService'

export function useUpdateUser(options = {}) {
  const queryClient = useQueryClient()
  const { onSuccess, ...restOptions } = options

  return useMutation({
    mutationFn: updateUser,
    ...restOptions,
    onSuccess: async (data, variables, context) => {
      // Optimistically update cache if new user details are returned
      if (data?.data && typeof data.data === 'object') {
        queryClient.setQueryData(queryKeys.user.details(), (prev) => ({
          ...prev,
          ...data.data,
        }))
      }
      // Invalidate query to trigger exactly one refetch of get-user API
      await queryClient.invalidateQueries({ queryKey: queryKeys.user.details() })

      onSuccess?.(data, variables, context)
    },
  })
}
