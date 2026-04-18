import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
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

const Sidebar = () => {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          background: "linear-gradient(135deg,#8b5cf6,#7c3aed)",
          color: "white",
        },
      }}
    >
      <Toolbar />

      <div
        style={{
          fontSize: "30px",
          fontWeight: "bold",
          paddingLeft: "18px",
        }}
      >
        Paperchime
      </div>

      <List>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItem key={index} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  backgroundColor: isActive ? "#fff" : "transparent",
                  color: isActive ? "#7c3aed" : "white",
                  margin: "4px 8px",
                  borderRadius: "8px",
                  boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.25)" : "none",
                  "&:hover": {
                    backgroundColor: isActive
                      ? "#fff"
                      : "rgba(255,255,255,0.1)",
                      color: isActive ? "#7c3aed" : "white",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? "#7c3aed" : "white",
                    minWidth: "40px",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.text}
                  sx={{
                    "& .MuiTypography-root": {
                      fontSize: "14px",
                      fontWeight: isActive ? "bold" : "normal",
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
