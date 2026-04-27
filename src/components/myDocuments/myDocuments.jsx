import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Typography,
  Box,
  TablePagination,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DownloadIcon from "@mui/icons-material/Download";
import { DocumentContext } from "../../context/DocumentContext";
import UploadPopup from "../dashboard/uploadDocument";
import documentService from "../../services/documentService";
import { useNotification } from "../../context/NotificationContext";
import ConfirmModal from "../ConfirmModal";
import "./myDocuments.css";

const MyDocuments = () => {
  const { documents, loading, error, fetchDocuments, refreshDocuments } =
    useContext(DocumentContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openUpload, setOpenUpload] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);
  const { addNotification } = useNotification();

  const handleEditDocument = (doc) => {
    setSelectedDoc(doc);
    setOpenUpload(true);
  };

  const handleCloseUpload = () => {
    setOpenUpload(false);
    setSelectedDoc(null);
  };

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleViewDocument = (doc) => {
    const baseUrl = "https://vigitechsolutions.com/test/";
    const filePath = doc.file_path || doc.doc_path || "";
    const fullUrl = baseUrl + filePath;
    console.log("Viewing document:", fullUrl);
    window.open(fullUrl, "_blank");
  };

  const handleDeleteDocument = (documentId) => {
    setDocToDelete(documentId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await documentService.deleteDocument(docToDelete);
      addNotification("Document deleted successfully", "success");
      refreshDocuments();
    } catch (err) {
      addNotification(err.message || "Failed to delete document", "error");
    } finally {
      setIsDeleteModalOpen(false);
      setDocToDelete(null);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate displayed rows
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayedDocuments = documents.slice(startIndex, endIndex);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" p={3}>
        <Typography color="error">{error}</Typography>
        <Button onClick={fetchDocuments} variant="outlined" sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  const formatDocType = (type) => {
    if (!type) return "N/A";
    return type.toLowerCase() === "permanent" ? "Permanent" : "Temporary";
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const formatExpiry = (doc) => {
    if (!doc.doc_type || doc.doc_type.toLowerCase() === "permanent") {
      return "N/A";
    }

    if (!doc.expiry_date || doc.expiry_date === "0000-00-00") {
      return "N/A";
    }

    return formatDate(doc.expiry_date);
  };

  const DocumentRow = ({ doc, onView, onEdit, onDelete }) => (
    <TableRow key={doc.id}>
      <TableCell>{doc.id}</TableCell>
      <TableCell>{doc.doc_name || "N/A"}</TableCell>
      <TableCell>{doc.category}</TableCell>
      <TableCell>{formatDocType(doc.doc_type)}</TableCell>
      <TableCell>{formatDate(doc.created_at)}</TableCell>
      <TableCell>{formatExpiry(doc)}</TableCell>
      <TableCell sx={{ display: "flex", gap: 0.5 }}>
        <Button
          onClick={() => onView(doc)}
          sx={{ minWidth: "auto", p: 0.5, color: "grey" }}
        >
          <VisibilityIcon />
        </Button>
        <Button
          onClick={() => onEdit(doc)}
          sx={{ minWidth: "auto", p: 0.5, color: "grey" }}
        >
          <EditIcon />
        </Button>
        <Button
          onClick={() => onDelete(doc.id)}
          color="error"
          sx={{ minWidth: "auto", p: 0.5 }}
        >
          <DeleteOutlineIcon />
        </Button>
      </TableCell>
    </TableRow>
  );

  const tableHeaders = [
    { label: "ID", key: "id" },
    { label: "Document Name", key: "doc_name" },
    { label: "Category", key: "category" },
    { label: "Type", key: "doc_type" },
    { label: "Uploaded Date", key: "created_at" },
    { label: "Expiry Date", key: "expiry_date" },
    { label: "Actions", key: "actions" },
  ];

  return (
    <div className="myDocumentsWrapper">
      <div className="myDocumentsScrollArea">
        <TableContainer component={Paper} className="myDocumentsTableContainer">
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {tableHeaders.map((header) => (
                  <TableCell
                    key={header.key}
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      backgroundColor: "#b57cff",
                    }}
                  >
                    {header.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {documents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography>
                      No documents found. Upload your first document!
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                displayedDocuments.map((doc) => (
                  <DocumentRow
                    key={doc.id}
                    doc={doc}
                    onView={handleViewDocument}
                    onEdit={handleEditDocument}
                    onDelete={handleDeleteDocument}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {documents.length > 0 && (
        <div className="paginationBar">
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={documents.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              width: "100%",
              backgroundColor: "#f5f5f5",
              "& .MuiTablePagination-toolbar": {
                color: "#8645db",
                fontWeight: "500",
              },
              "& .MuiIconButton-root": {
                color: "#8645db",
                "&:hover": {
                  backgroundColor: "rgba(134, 69, 219, 0.1)",
                },
              },
              "& .MuiSelect-select": {
                color: "#8645db",
              },
            }}
          />
        </div>
      )}

      <UploadPopup
        open={openUpload}
        onClose={handleCloseUpload}
        document={selectedDoc}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Document"
        message="Are you sure you want to delete this document?"
        confirmText="Delete"
      />
    </div>
  );
};

export default MyDocuments;
