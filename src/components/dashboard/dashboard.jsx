import React, { useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Navbar from "../Navbar";

const drawerWidth = 210;

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar onMenuClick={toggleSidebar} />
      
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: { xs: 1.5, md: 3 },
            width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
            transition: "width 0.3s ease",
            overflowX: "hidden"
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;