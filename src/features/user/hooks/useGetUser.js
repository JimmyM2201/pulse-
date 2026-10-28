import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../../contexts/AuthContext'
import { queryKeys } from '../../../lib/queryKeys'
import { getUser } from '../services/userService'

export function useGetUser(options = {}) {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: queryKeys.user.details(),
    queryFn: getUser,
    enabled: isAuthenticated,
    ...options,
  })
}
