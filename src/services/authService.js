// Authentication Service
const API_BASE_URL = "http://localhost:5000/api";

class AuthService {
  // Send OTP for login
  async sendOTP(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseBody = await response.text();
      let parsedBody;

      try {
        parsedBody = JSON.parse(responseBody);
      } catch {
        parsedBody = null;
      }

      if (!response.ok) {
        const message = parsedBody?.message || response.statusText || "Failed to send OTP";
        throw new Error(message);
      }

      return parsedBody || { success: true };
    } catch (error) {
      console.error("Send OTP error:", error);
      throw error;
    }
  }

  // Verify OTP and login
  async verifyOTP(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseBody = await response.text();
      let parsedBody;

      try {
        parsedBody = JSON.parse(responseBody);
      } catch {
        parsedBody = null;
      }

      if (!response.ok) {
        const message = parsedBody?.message || response.statusText || "Invalid OTP";
        throw new Error(message);
      }

      const result = parsedBody || {};

      // Store user data and token
      if (result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      return result;
    } catch (error) {
      console.error("Verify OTP error:", error);
      throw error;
    }
  }

  // Logout user
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  // Get auth token
  getToken() {
    return localStorage.getItem("token");
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();