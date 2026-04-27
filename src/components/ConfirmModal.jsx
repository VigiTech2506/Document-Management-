import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Slide,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      TransitionComponent={Transition}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle sx={{ bgcolor: "#8645db", color: "#fff" }}>
        {title || 'Confirm Action'}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon sx={{ color: "#fff" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ paddingTop: "20px !important" }}>
        <DialogContentText>
          {message || 'Are you sure you want to proceed?'}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ padding: "16px 24px" }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ color: "#8645db", borderColor: "#8645db" }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;
