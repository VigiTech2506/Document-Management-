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

  // Update document
  async updateDocument(updateData) {
          const apiUrl = import.meta.env.DEV 
        ? '/api/external/updateDocument.php' 
        : 'https://vigitechsolutions.com/test/API/updateDocument.php';

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: updateData,
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
  const apiUrl = import.meta.env.DEV 
        ? '/api/external/deleteDocument.php' 
        : 'https://vigitechsolutions.com/test/API/deleteDocument.php';

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        ...this.getAuthHeaders(),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ id: documentId }),
    });

    const data = await response.json();

    if (!response.ok || data.status !== "success") {
      throw new Error(data.message || "Delete failed");
    }

    return data;
  } catch (error) {
    console.error("Delete document error:", error);
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