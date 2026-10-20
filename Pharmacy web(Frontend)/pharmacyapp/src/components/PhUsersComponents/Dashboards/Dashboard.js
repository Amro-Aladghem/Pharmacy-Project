import React, { useEffect } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import MobileDashboard from "./MobileDashboard";
import DesktopDashboard from "./DesktopDashboard";
import { Box } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { usePhUserAuth } from "../../../contexts/PhUserAuthContext";

export default function Dashboard() {
  const theme = useTheme();
  const { phAuthInfo } = usePhUserAuth();
  const navigate = useNavigate();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (!phAuthInfo.loggedIn) {
      navigate("/manager/verify");
    }
  }, []);

  if (!phAuthInfo.loggedIn) {
    return <></>;
  }

  return isMobile ? (
    <Box>
      <MobileDashboard />
      <Outlet />
    </Box>
  ) : (
    <Box>
      <DesktopDashboard />
      <Outlet />
    </Box>
  );
}
