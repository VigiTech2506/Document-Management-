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
  TablePagination
} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DownloadIcon from '@mui/icons-material/Download';
import { DocumentContext } from "../../context/DocumentContext";
import UploadPopup from "../dashboard/uploadDocument";
import "./myDocuments.css";

const MyDocuments = () => {
  const { documents, loading, error, fetchDocuments, refreshDocuments } = useContext(DocumentContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openUpload, setOpenUpload] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

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
    if (!window.confirm("Are you sure you want to delete this document?")) {
      return;
    }

    console.log("Deleting document:", documentId);
    refreshDocuments(); // Refresh the list
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
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


  return (
    <div className="myDocumentsWrapper">
      <div className="myDocumentsScrollArea">
        <TableContainer component={Paper} className="myDocumentsTableContainer">
          <Table stickyHeader>
<TableHead>
          <TableRow>
            <TableCell sx={{ color: "white", fontWeight: "bold", backgroundColor: "#b57cff" }}>ID</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold", backgroundColor: "#b57cff" }}>Document Name</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold", backgroundColor: "#b57cff" }}>Category</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold", backgroundColor: "#b57cff" }}>Type</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold", backgroundColor: "#b57cff" }}>Uploaded Date</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold", backgroundColor: "#b57cff" }}>Expiry Date</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold", backgroundColor: "#b57cff" }}>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {documents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography>No documents found. Upload your first document!</Typography>
              </TableCell>
            </TableRow>
          ) : (
            displayedDocuments.map((doc, index) => (
              <TableRow key={doc.id || index}>
                <TableCell>{doc.id}</TableCell>
                <TableCell>{doc.doc_name || 'N/A'}</TableCell>
                <TableCell>{doc.category}</TableCell>
                <TableCell>
                  {doc.doc_type ? 
                    (doc.doc_type === "Permanent" || doc.doc_type === "permanent" ? "Permanent" : "Temporary") : 
                    "N/A"
                  }
                </TableCell>
                <TableCell>{new Date(doc.created_at ).toLocaleDateString()}</TableCell>
                <TableCell>
                  {(doc.doc_type === "permanent" || doc.doc_type === "Permanent") 
                    ? "N/A"
                    : (!doc.expiry_date || doc.expiry_date === "0000-00-00" || doc.expiry_date === null)
                      ? "N/A"
                      : new Date(doc.expiry_date).toLocaleDateString()
                  }
                </TableCell>
                <TableCell sx={{ display: 'flex', gap: 0.5 }}>
                  <Button
                    size="small"
                    onClick={() => handleViewDocument(doc)}
                    sx={{ minWidth: 'auto', p: 0.5, color: 'grey' }}
                  >
                    <VisibilityIcon />
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleEditDocument(doc)}
                    sx={{ minWidth: 'auto', p: 0.5, color: 'grey' }}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDeleteDocument(doc.id)}
                    sx={{ minWidth: 'auto', p: 0.5 }}
                  >
                    <DeleteOutlineIcon />
                  </Button>
                </TableCell>
              </TableRow>
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
                fontWeight: "500"
              },
              "& .MuiIconButton-root": {
                color: "#8645db",
                "&:hover": {
                  backgroundColor: "rgba(134, 69, 219, 0.1)"
                }
              },
              "& .MuiSelect-select": {
                color: "#8645db"
              }
            }}
          />
        </div>
      )}

      <UploadPopup
        open={openUpload}
        onClose={handleCloseUpload}
        document={selectedDoc}
      />
    </div>
  );
};

export default MyDocuments;