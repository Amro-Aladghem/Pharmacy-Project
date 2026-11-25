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
        flex: 1,
        minWidth: 0,
        display: "flex",
        alignItems: "center",
        gap: 1,
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

      <Typography
        level="title-lg"
        sx={{ fontSize: { xs: "sm", md: "md" }, color: "white" }}
      >
        {" "}
        أهلا, {phAuthInfo.name}
      </Typography>

      <Typography
        level="body-md"
        sx={{
          marginRight: { xs: "auto", md: "auto" },
          backgroundColor: "var(--surface)",
          color: "var(--teal)",
          width: "fit-content",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--teal)",
          padding: { xs: "5px 9px", md: "7px 12px" },
          fontWeight: "lg",
          fontSize: { xs: "0.72rem", sm: "0.85rem" },
          whiteSpace: "nowrap",
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
