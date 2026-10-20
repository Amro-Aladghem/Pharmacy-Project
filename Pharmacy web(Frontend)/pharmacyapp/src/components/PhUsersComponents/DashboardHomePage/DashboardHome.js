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
        gap: "50px",
        marginTop: "100px",
      }}
    >
      <Avatar
        src={pharmacyInfo.phImage}
        sx={{ width: "150px", height: "150px" }}
      />
      <Typography level="body-lg">صيدلية {pharmacyInfo.phName}</Typography>
      <Typography level="h1">مرحبا 👋 ,{phAuthInfo.name}</Typography>
    </Box>
  );
}

export default DashboardHome;
