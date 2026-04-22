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

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const initialState = {
  file: null,
  id: null,
  name: "",
  category: "Aadhar",
  type: "permanent",
  expiry: "",
  existingFile: "", // ✅ ADD
};

export default function UploadDocument({ open, onClose, document }) {
  const { refreshDocuments } = React.useContext(DocumentContext);
  const [state, setState] = React.useState(initialState);
  const [loading, setLoading] = React.useState(false);

  const isEditMode = Boolean(document);

  const updateState = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  // Populate form
  React.useEffect(() => {
    if (!open) return;

    if (document) {
      const isTemp = document.doc_type?.toLowerCase() === "temporary";

      setState({
        file: null,
        id: document.id,
        name: document.doc_name || "",
        category: document.category || "Aadhar",
        type: isTemp ? "temporary" : "permanent",
        expiry:
          isTemp && document.expiry_date !== "0000-00-00"
            ? document.expiry_date
            : "",
        existingFile: document.file_path || "", // ✅ ADD THIS
      });
    } else {
      setState(initialState);
    }
  }, [document, open]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    updateState("file", file);

    if (!state.name && file) {
      updateState("name", file.name.split(".")[0]);
    }
  };

  const resetForm = () => setState(initialState);

  const handleUpload = async () => {
    setLoading(true);

    try {
      if (isEditMode) {
        // ✅ UPDATE API (matches your PHP updateDocument.php)
        const formData = new FormData();
        formData.append("id", state.id);
        formData.append("doc_name", state.name);
        formData.append("category", state.category);
        formData.append("doc_type", state.type);
        if (state.file) {
          formData.append("document_file", state.file);
        }

        if (state.type === "temporary") {
          formData.append("expiry_date", state.expiry || null);
        } else {
          formData.append("expiry_date", null);
        }

        await documentService.updateDocument(formData);
      } else {
        // ✅ CREATE API (your existing upload API fields)
        const formData = new FormData();

        formData.append("file", state.file);
        formData.append("name", state.name);
        formData.append("category", state.category);
        formData.append("document_type", state.type);

        if (state.type === "temporary") {
          formData.append("expiry_date", state.expiry);
        }

        await documentService.uploadDocument(formData);
      }

      resetForm();
      refreshDocuments();
      onClose();
    } catch (err) {
      alert(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ bgcolor: "#8645db", color: "#fff" }}>
        {isEditMode ? "Edit Document" : "Upload Document"}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon sx={{ color: "#fff" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{paddingTop: "20px !important"}}>
        <TextField
          label="Document Name"
          fullWidth
          size="small"
          sx={{ mb: 2 }}
          value={state.name}
          onChange={(e) => updateState("name", e.target.value)}
        />

        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={state.category}
            label="Category"
            onChange={(e) => updateState("category", e.target.value)}
          >
            {documentService.getDocumentCategories().map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ mb: 2 }}>
          <FormLabel>Document Type</FormLabel>
          <RadioGroup
            row
            value={state.type}
            onChange={(e) => {
              const val = e.target.value;
              updateState("type", val);
              if (val === "permanent") updateState("expiry", "");
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

        {state.type === "temporary" && (
          <TextField
            type="date"
            fullWidth
            size="small"
            value={state.expiry}
            onChange={(e) => updateState("expiry", e.target.value)}
            sx={{ mb: 2 }}
          />
        )}

        <Box>
          <Button
            component="label"
            variant="outlined"
            startIcon={<UploadFileIcon />}
            fullWidth
          >
            {state.file ? state.file.name : "Upload File"}
            <input hidden type="file" onChange={handleFileChange} />
          </Button>

          {(state.file || state.existingFile) && (
            <Typography variant="caption">
              {state.file
                ? `New: ${state.file.name}`
                : state.existingFile
                  ? `Current: ${state.existingFile.split("/").pop()}`
                  : "No file selected"}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={
            loading ||
            !state.name ||
            (state.type === "temporary" && !state.expiry)
          }
        >
          {loading ? "Please wait..." : isEditMode ? "Update" : "Upload"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
