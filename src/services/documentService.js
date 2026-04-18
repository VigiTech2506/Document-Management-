// Document Service
const API_BASE_URL = "http://localhost:5000/api";

class DocumentService {
  // Get authorization headers
  getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Authorization": `Bearer ${token}`,
    };
  }

  // Upload document
  async uploadDocument(formData) {
    try {
      const response = await fetch(`https://vigitechsolutions.com/test/API/upload.php`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Upload failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Upload document error:", error);
      throw error;
    }
  }
  // Get all user documents
  async getUserDocuments() {
    try {
      // Use proxy in development, direct API in production
      const apiUrl = import.meta.env.DEV 
        ? '/api/external/getDocuments.php' 
        : 'https://vigitechsolutions.com/test/API/getDocuments.php';

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: import.meta.env.DEV ? {
          ...this.getAuthHeaders(),
          "Content-Type": "application/json",
        } : {
          // No auth headers needed for external API
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }

      return await response.json();
    } catch (error) {
      console.error("Get documents error:", error);
      throw error;
    }
  }

  // Get document by ID
  async getDocumentById(documentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch document");
      }

      return await response.json();
    } catch (error) {
      console.error("Get document error:", error);
      throw error;
    }
  }

  // Update document
  async updateDocument(documentId, updateData) {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
        method: "PUT",
        headers: {
          ...this.getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Update failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Update document error:", error);
      throw error;
    }
  }

  // Delete document
  async deleteDocument(documentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Delete failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Delete document error:", error);
      throw error;
    }
  }

  // Download document
  async downloadDocument(documentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${documentId}/download`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to download document");
      }

      return response.blob();
    } catch (error) {
      console.error("Download document error:", error);
      throw error;
    }
  }

  // Get document categories
  getDocumentCategories() {
    return [
      "Aadhar",
      "Insurance",
      "Driving License",
      "Passport",
      "PAN Card",
      "Bank Statement",
      "Utility Bill",
      "Other"
    ];
  }

  // Validate file type
  validateFileType(file) {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    return allowedTypes.includes(file.type);
  }

  // Validate file size (max 10MB)
  validateFileSize(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    return file.size <= maxSize;
  }
}

export default new DocumentService();