// User Service
const API_BASE_URL = "http://localhost:5000/api";

class UserService {
  // Get authorization headers
  getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Authorization": `Bearer ${token}`,
    };
  }

  // Get user profile
  async getUserProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: "GET",
        headers: {
          ...this.getAuthHeaders(),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      return await response.json();
    } catch (error) {
      console.error("Get user profile error:", error);
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: "PUT",
        headers: {
          ...this.getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Update failed");
      }

      const result = await response.json();

      // Update stored user data
      localStorage.setItem("user", JSON.stringify(result.user));

      return result;
    } catch (error) {
      console.error("Update user profile error:", error);
      throw error;
    }
  }

  // Change password
  async changePassword(passwordData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/change-password`, {
        method: "POST",
        headers: {
          ...this.getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Password change failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  }

  // Delete user account
  async deleteAccount() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/delete-account`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Account deletion failed");
      }

      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return await response.json();
    } catch (error) {
      console.error("Delete account error:", error);
      throw error;
    }
  }

  // Get user statistics
  async getUserStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/stats`, {
        method: "GET",
        headers: {
          ...this.getAuthHeaders(),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user statistics");
      }

      return await response.json();
    } catch (error) {
      console.error("Get user stats error:", error);
      throw error;
    }
  }
}

export default new UserService();