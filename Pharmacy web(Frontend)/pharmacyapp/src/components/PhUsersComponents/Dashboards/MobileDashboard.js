import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import NavbarContent from "../NavbarContent/NavbarContent";
import { MenuItems } from "./MenuItems";
import { useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 240;

const menuItems = MenuItems;

function MobileDashboard(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((Item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              selected={Boolean(Item.to) && location.pathname.endsWith(Item.to)}
              disabled={!Item.to}
              sx={{
                mx: 1,
                my: 0.25,
                borderRadius: "var(--radius-md)",
                "&.Mui-selected": {
                  backgroundColor: "var(--brand-soft)",
                  color: "var(--brand)",
                  fontWeight: 700,
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "var(--brand-soft)",
                },
              }}
              onClick={() => {
                if (!Item.to) return;
                navigate(`/manager/dashboard/${Item.to}`);
                handleDrawerClose();
              }}
            >
              <ListItemIcon>{Item.icon}</ListItemIcon>
              <ListItemText primary={Item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  // Remove this const when copying and pasting into your project.
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: "100%",
          backgroundColor: "var(--brand)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <Toolbar sx={{ minHeight: "68px !important", px: 2, gap: 1.5 }}>
          <IconButton
            color="inherit"
            aria-label={mobileOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={mobileOpen}
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              width: 44,
              height: 44,
              flex: "0 0 44px",
              borderRadius: "12px",
              backgroundColor: "rgba(255,255,255,0.14)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.24)" },
            }}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>

          <NavbarContent />
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: "auto", flexShrink: 0 }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: "block",
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: "1px solid var(--border)",
            },
          }}
          slotProps={{
            root: {
              keepMounted: true, // Better open performance on mobile.
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

export default MobileDashboard;
