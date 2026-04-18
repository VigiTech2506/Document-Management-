import React, { createContext, useState, useCallback } from "react";
import documentService from "../services/documentService";

export const DocumentContext = createContext();

export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);
  const [totalDocsCount, setTotalDocsCount] = useState(0);
  const [expiringDocsCount, setExpiringDocsCount] = useState(0);
  const [permanentDocsCount, setPermanentDocsCount] = useState(0);
  const [temporaryDocsCount, setTemporaryDocsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate expiring documents (within 15 days)
  const calculateExpiringDocs = (docs) => {
    const today = new Date();
    const fifteenDaysLater = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000);

    return docs.filter((doc) => {
      // Skip permanent documents
      if (doc.doc_type === "permanent" || doc.doc_type === "Permanent") {
        return false;
      }

      // Skip documents with invalid expiry dates
      if (
        !doc.expiry_date ||
        doc.expiry_date === "0000-00-00" ||
        doc.expiry_date === null
      ) {
        return false;
      }

      const expiryDate = new Date(doc.expiry_date);

      // Check if expiry date is within 15 days and not in the past
      return expiryDate <= fifteenDaysLater && expiryDate >= today;
    }).length;
  };

  // Calculate permanent documents
  const calculatePermanentDocs = (docs) => {
    return docs.filter((doc) => doc.doc_type === "permanent" || doc.doc_type === "Permanent").length;
  };

  // Calculate temporary documents
  const calculateTemporaryDocs = (docs) => {
    return docs.filter((doc) => doc.doc_type === "temporary" || doc.doc_type === "Temporary").length;
  };

  // Fetch all documents
  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await documentService.getUserDocuments();
      const docs = data.documents || data || [];

      setDocuments(docs);
      setTotalDocsCount(docs.length);
      setExpiringDocsCount(calculateExpiringDocs(docs));
      setPermanentDocsCount(calculatePermanentDocs(docs));
      setTemporaryDocsCount(calculateTemporaryDocs(docs));
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError("Failed to load documents");
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new document to state
  const addDocument = (newDoc) => {
    const updatedDocs = [...documents, newDoc];
    setDocuments(updatedDocs);
    setTotalDocsCount(updatedDocs.length);
    setExpiringDocsCount(calculateExpiringDocs(updatedDocs));
    setPermanentDocsCount(calculatePermanentDocs(updatedDocs));
    setTemporaryDocsCount(calculateTemporaryDocs(updatedDocs));
  };

  // Remove document from state
  const removeDocument = (documentId) => {
    const updatedDocs = documents.filter((doc) => doc.id !== documentId);
    setDocuments(updatedDocs);
    setTotalDocsCount(updatedDocs.length);
    setExpiringDocsCount(calculateExpiringDocs(updatedDocs));
    setPermanentDocsCount(calculatePermanentDocs(updatedDocs));
    setTemporaryDocsCount(calculateTemporaryDocs(updatedDocs));
  };

  // Refresh documents
  const refreshDocuments = useCallback(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const value = {
    documents,
    totalDocsCount,
    expiringDocsCount,
    permanentDocsCount,
    temporaryDocsCount,
    loading,
    error,
    fetchDocuments,
    addDocument,
    removeDocument,
    refreshDocuments,
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

export default DocumentContext;
