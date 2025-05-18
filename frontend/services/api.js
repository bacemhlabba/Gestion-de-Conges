import toast from "react-hot-toast"

const getAuthHeaders = () => {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  }
}

// Error handler
const handleApiError = (error) => {
  console.error("API Error:", error)
  const message = error.message || "Une erreur s'est produite"
  toast.error(message)
  throw error
}

// Auth API
export const getUserProfile = async () => {
  try {
    const response = await fetch("/api/auth/profile", {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || "Failed to fetch user profile")
    }

    return response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const updateUserProfile = async (profileData) => {
  try {
    const response = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || "Failed to update user profile")
    }

    return response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

// Leave Requests API
export const getLeaveRequests = async (status) => {
  try {
    const url = status ? `/api/leave-requests?status=${status}` : "/api/leave-requests"
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || "Failed to fetch leave requests")
    }

    return response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const getLeaveRequestById = async (id) => {
  try {
    const response = await fetch(`/api/leave-requests/${id}`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || "Failed to fetch leave request")
    }

    return response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const createLeaveRequest = async (requestData) => {
  try {
    const response = await fetch("/api/leave-requests", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(requestData),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || "Failed to create leave request")
    }

    return response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const updateLeaveRequest = async (id, requestData) => {
  try {
    const response = await fetch(`/api/leave-requests/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(requestData),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || "Failed to update leave request")
    }

    return response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const deleteLeaveRequest = async (id) => {
  try {
    const response = await fetch(`/api/leave-requests/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || "Failed to delete leave request")
    }

    return response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const getLeaveStatistics = async () => {
  try {
    const response = await fetch("/api/leave-requests?stats=true", {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || "Failed to fetch leave statistics")
    }

    return response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

// Leave Balances API
export const getLeaveBalances = async (userId) => {
  try {
    const url = userId ? `/api/leave-balances?userId=${userId}` : "/api/leave-balances"
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || "Failed to fetch leave balances")
    }

    return response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const updateLeaveBalance = async (userId, leaveTypeId, balance) => {
  try {
    const response = await fetch("/api/leave-balances", {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId, leaveTypeId, balance }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || "Failed to update leave balance")
    }

    return response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

// Leave Types API
export const getLeaveTypes = async () => {
  try {
    const response = await fetch("/api/leave-types", {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || "Failed to fetch leave types")
    }

    return response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const createLeaveType = async (typeData) => {
  try {
    const response = await fetch("/api/leave-types", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(typeData),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || "Failed to create leave type")
    }

    return response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const updateLeaveType = async (id, typeData) => {
  try {
    const response = await fetch(`/api/leave-types/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(typeData),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || "Failed to update leave type")
    }

    return response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const deleteLeaveType = async (id) => {
  try {
    const response = await fetch(`/api/leave-types/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || "Failed to delete leave type")
    }

    return response.json()
  } catch (error) {
    return handleApiError(error)
  }
}
