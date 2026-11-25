import { Box } from "@mui/material";
import Typography from "@mui/joy/Typography";
import { Avatar } from "@mui/material";
import { usePhUserAuth } from "../../../contexts/PhUserAuthContext";
import { useEffect, useState } from "react";

export function DashboardHome() {
  const { phAuthInfo } = usePhUserAuth();
  const [pharmacyInfo, setPharmacyInfo] = useState({
    phName: "",
    phImage: "",
  });

  useEffect(() => {
    const pharamcy = JSON.parse(sessionStorage.getItem("pharmacy"));

    setPharmacyInfo({
      ...pharmacyInfo,
      phName: pharamcy.phName,
      phImage: pharamcy.phImage,
    });
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        gap: "24px",
        marginTop: "48px",
        mx: "auto",
        maxWidth: "520px",
        width: "calc(100% - 32px)",
        padding: "40px 24px",
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <Avatar
        src={pharmacyInfo.phImage}
        sx={{ width: "128px", height: "128px", border: "4px solid var(--brand-soft)" }}
      />
      <Typography level="body-lg">صيدلية {pharmacyInfo.phName}</Typography>
      <Typography level="h1">مرحبا 👋 ,{phAuthInfo.name}</Typography>
    </Box>
  );
}

export default DashboardHome;
