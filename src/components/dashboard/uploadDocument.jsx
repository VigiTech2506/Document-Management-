import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import documentService from "../../services/documentService";
import { DocumentContext } from "../../context/DocumentContext";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function UploadDocument({ open, onClose, document }) {
  const { refreshDocuments } = React.useContext(DocumentContext);
  const [file, setFile] = React.useState(null);
  const [documentId, setDocumentId] = React.useState(null);
  const [documentName, setDocumentName] = React.useState("");
  const [category, setCategory] = React.useState("Aadhar");
  const [type, setType] = React.useState("permanent");
  const [expiryDate, setExpiryDate] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    // Auto-fill document name if empty
    if (!documentName && selectedFile) {
      setDocumentName(selectedFile.name.split(".")[0]);
    }
  };

  React.useEffect(() => {
    if (document && open) {
      setDocumentId(document.id);
      setDocumentName(document.doc_name || "");
      setCategory(document.category || "Aadhar");
      const normalizedType = document.doc_type ? document.doc_type.toLowerCase() : "permanent";
      setType(normalizedType === "temporary" ? "temporary" : "permanent");
      setExpiryDate(
        normalizedType === "temporary" && document.expiry_date && document.expiry_date !== "0000-00-00"
          ? document.expiry_date
          : ""
      );
      setIsEditMode(true);
      setFile(null);
    } else if (!document) {
      setDocumentId(null);
      setDocumentName("");
      setCategory("Aadhar");
      setType("permanent");
      setExpiryDate("");
      setIsEditMode(false);
      setFile(null);
    }
  }, [document, open]);

  const handleUpload = async () => {
    if (!documentName.trim()) return alert("Please enter a document name");
    setLoading(true);

    try {
      if (isEditMode && !file) {
        const updateData = {
          name: documentName.trim(),
          category,
          document_type: type,
          expiry_date: type === "temporary" ? expiryDate : null,
        };
        await documentService.updateDocument(documentId, updateData);
      } else {
        if (!file) return alert("Please select a file");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", documentName.trim());
        formData.append("category", category);
        formData.append("document_type", type);
        if (type === "temporary") {
          formData.append("expiry_date", expiryDate);
        }
        if (isEditMode && documentId) {
          formData.append("document_id", documentId);
        }
        await documentService.uploadDocument(formData);
      }

      setFile(null);
      setDocumentName("");
      setExpiryDate("");
      setCategory("Aadhar");
      setType("permanent");
      setDocumentId(null);
      setIsEditMode(false);

      refreshDocuments();
      onClose();
    } catch (error) {
      console.error("Upload failed:", error);
      alert(error.message || "Failed to upload document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ background: "#8645db", color: "#fff", p: 1 }}>
        {isEditMode ? "Edit Document" : "Upload Document"}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon sx={{ color: "#fff" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Document Name */}
        <TextField
          label="Name Of The Document"
          fullWidth
          size="small"
          sx={{ mb: 2 }}
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          required
        />

        {/* Category */}
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value="Aadhar">Aadhar</MenuItem>
            <MenuItem value="Insurance">Insurance</MenuItem>
            <MenuItem value="Driving License">Driving License</MenuItem>
            <MenuItem value="Passport">Passport</MenuItem>
            <MenuItem value="PAN Card">PAN Card</MenuItem>
            <MenuItem value="Bank Statement">Bank Statement</MenuItem>
            <MenuItem value="Utility Bill">Utility Bill</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>

        {/* Document Type */}
        <FormControl component="fieldset" sx={{ mb: 1 }}>
          <FormLabel component="legend">Document Type</FormLabel>
          <RadioGroup
            row
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              // Clear expiry date when switching to permanent
              if (e.target.value === "permanent") {
                setExpiryDate("");
              }
            }}
          >
            <FormControlLabel
              value="permanent"
              control={<Radio />}
              label="Permanent"
            />
            <FormControlLabel
              value="temporary"
              control={<Radio />}
              label="Temporary"
            />
          </RadioGroup>
        </FormControl>

        {/* Expiry Date - Only show for temporary documents */}
        {type === "temporary" && (
          <div>
            <FormControl sx={{ mb: 1, width: "100%" }}>
              <FormLabel component="legend" sx={{ mb: 1 }}>
                Expiry Date
              </FormLabel>
              <TextField
                type="date"
                fullWidth
                size="small"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                inputProps={{
                  min: new Date().toISOString().split("T")[0],
                }}
                sx={{ mb: 2 }}
                required
              />
            </FormControl>
          </div>
        )}

        {/* ✅ Custom Upload Button */}
        <Box>
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
            fullWidth
            sx={{ py: 1.5 }}
            disabled={loading}
          >
            {file ? file.name : "Upload Document"}
            <input
              type="file"
              hidden
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
          </Button>

          {/* Show selected file */}
          {file && (
            <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </Typography>
          )}

          {isEditMode && !file && (
            <Typography variant="caption" sx={{ mt: 1, display: "block", color: "rgba(0,0,0,0.6)" }}>
              Existing document file will be kept unless you choose a new file.
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleUpload}
          variant="contained"
          sx={{ background: "#8645db" }}
          disabled={
            loading ||
            !documentName.trim() ||
            (type === "temporary" && !expiryDate)
          }
        >
          {loading
            ? isEditMode
              ? "Updating..."
              : "Uploading..."
            : isEditMode
            ? "Update"
            : "Upload"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
