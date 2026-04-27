import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  Dashboard as DashboardIcon,
  FileCopy as FileCopyIcon,
  Upload as UploadIcon,
  Category as CategoryIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

import { Link, useLocation } from "react-router-dom";

const drawerWidth = 210;

const menuItems = [
  { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  {
    text: "My Documents",
    path: "/dashboard/myDocuments",
    icon: <FileCopyIcon />,
  },
  { text: "Settings", path: "/dashboard/settings", icon: <SettingsIcon /> },
  { text: "Logout", path: "/", icon: <LogoutIcon /> },
];

const Sidebar = ({ open, onClose }) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? open : true}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        width: isMobile ? 0 : drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          background: "linear-gradient(135deg,#8b5cf6,#7c3aed)",
          color: "white",
          border: "none"
        },
      }}
    >
      <Toolbar sx={{ minHeight: "60px !important" }} />

      <div
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          paddingLeft: "20px",
          marginBottom: "20px"
        }}
      >
        Paperchime
      </div>

      <List>
        {menuItems.map((item, index) => {
          const isActive = item.path === "/dashboard" 
            ? location.pathname === "/dashboard" 
            : item.path !== "/" && location.pathname.startsWith(item.path);

          return (
            <ListItem key={index} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={() => isMobile && onClose()}
                sx={{
                  backgroundColor: isActive ? "#fff" : "transparent",
                  color: isActive ? "#7c3aed" : "white",
                  margin: "4px 12px",
                  borderRadius: "10px",
                  boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: isActive
                      ? "#fff"
                      : "rgba(255,255,255,0.15)",
                      color: isActive ? "#7c3aed" : "white",
                      transform: "translateX(4px)"
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? "#7c3aed" : "white",
                    minWidth: "36px",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.text}
                  sx={{
                    "& .MuiTypography-root": {
                      fontSize: "14px",
                      fontWeight: isActive ? "600" : "500",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
