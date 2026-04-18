import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";

const Dashboard = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      
      <Box component="main" sx={{ flexGrow: 1, p: 1.5 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;