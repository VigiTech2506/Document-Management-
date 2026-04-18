import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button
} from "@mui/material";

export default function Settings() {
  return (
    <Box sx={{}}>
      {/* Header */}
      <Typography variant="h5" fontWeight={600} color="#000" gutterBottom>
        Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Manage your application preferences
      </Typography>

      {/* Card */}
      <Card sx={{ maxWidth: 800 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Profile Settings
          </Typography>

          {/* Full Name */}
          <Box mb={2}>
            <Typography variant="body2" mb={0.5}>
              Full Name
            </Typography>
            <TextField
              fullWidth
              placeholder="John Doe"
              variant="outlined"
              size="small"
            />
          </Box>

          {/* Email */}
          <Box mb={2}>
            <Typography variant="body2" mb={0.5}>
              Email Address
            </Typography>
            <TextField
              fullWidth
              placeholder="john@example.com"
              variant="outlined"
              size="small"
            />
          </Box>

          {/* Job Title */}
          <Box mb={3}>
            <Typography variant="body2" mb={0.5}>
              Phone Number
            </Typography>
            <TextField
              fullWidth
              placeholder="Sales Manager"
              variant="outlined"
              size="small"
              value="9898989898"
              type="number"
            />
          </Box>

          {/* Button */}
          <Button
            variant="contained"
            color="success"
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}