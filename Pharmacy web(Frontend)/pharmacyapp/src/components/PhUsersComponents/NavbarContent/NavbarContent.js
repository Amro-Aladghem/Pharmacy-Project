import { Box } from "@mui/material";
import Typography from "@mui/joy/Typography";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import { usePhUserAuth } from "../../../contexts/PhUserAuthContext";
import { useState, useEffect } from "react";
import { GetPharmacyCurrentBalance } from "../../../services/pharmacyServices";
import { CircularProgress } from "@mui/material";

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.background.paper}`,
}));
export function NavbarContent() {
  const [pharmacyInfo, setPharmacyInfo] = useState({
    phName: "",
    phImage: "",
  });

  const [currentBalance, setCurrentBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const { phAuthInfo } = usePhUserAuth();

  async function fetchData() {
    const response = await GetPharmacyCurrentBalance(
      phAuthInfo.userId,
      phAuthInfo.role
    );
    setLoading(false);
    if (!response.IsSuccess) return;

    setCurrentBalance(response.result);
  }

  useEffect(() => {
    const pharamcy = JSON.parse(sessionStorage.getItem("pharmacy"));

    setPharmacyInfo({
      ...pharmacyInfo,
      phName: pharamcy.phName,
      phImage: pharamcy.phImage,
    });

    fetchData();
  }, []);

  return (
    <Box
      sx={{
        direction: "rtl",
        width: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Link to="/manager/dashboard/home">
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            <SmallAvatar
              sx={{ direction: "rtl" }}
              alt="Remy Sharp"
              src={phAuthInfo.userImage}
            />
          }
          sx={{
            cursor: "pointer",
          }}
        >
          <Avatar alt="Travis Howard" src={pharmacyInfo.phImage} />
        </Badge>
      </Link>

      <Typography level="title-lg" sx={{ fontSize: { xs: "sm", md: "md" } }}>
        {" "}
        أهلا, {phAuthInfo.name}
      </Typography>

      <Typography
        level="body-md"
        sx={{
          marginRight: { xs: "6px", md: "70px" },
          backgroundColor: "white",
          width: "fit-content",
          borderRadius: "8px",
          border: "2px solid aqua",
          padding: { xs: "3px 3px", md: "6px 6px" },
          fontWeight: "lg",
        }}
      >
        {loading ? (
          <CircularProgress size={20} />
        ) : (
          `الرصيد الحالي: ${currentBalance} jd`
        )}
      </Typography>
    </Box>
  );
}

export default NavbarContent;
