import { apiClient } from "../../../lib/apiClient"

async function getUser() {
  const payload = await apiClient.get("/user/get-user")
  const user = payload?.data

  if (!user) {
    throw new Error(payload?.message || "Failed to fetch user details.")
  }

  return user
}

async function updateUser(data) {
  return apiClient.post("/user/profile/update-profile", data)
}

async function changePassword(data) {
  return apiClient.post("/user/profile/change-password", data)
}

const userService = {
  getUser,
  updateUser,
  changePassword,
}

export { getUser, updateUser, changePassword }
export default userService

