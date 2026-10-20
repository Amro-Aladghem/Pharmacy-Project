import { useEffect, useState } from "react";
import MainLoader from "../../MainLoader";
import Typography from "@mui/joy/Typography";
import { Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckLoginStatus } from "../../../services/managerServices";
import { CircularProgress } from "@mui/material";
import UnAuthorized from "../UnAuthorized/UnAuthorized";
import NotActivePharmacy from "../NotActivePharmacy/NotActivePharmacy";
import NotHavePharmacy from "../NotHavePharmacy/NotHavePharmacy";

export function VerfiyPhUserAuth() {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState({
    IsSuccess: false,
    IsUnAuthorized: false,
    IsPhNotActive: false,
    IsUserNotHavePh: false,
  });

  function checkPharmacy() {
    const pharmacy = JSON.parse(sessionStorage.getItem("pharmacy"));
    if (!pharmacy) {
      setResult({ ...result, IsSuccess: false, IsUserNotHavePh: true });
      setLoading(false);
      return false;
    }

    if (!pharmacy.isActive) {
      setResult({ ...result, IsSuccess: false, IsPhNotActive: true });
      setLoading(false);
      return false;
    }

    return true;
  }

  async function checkAuth(userId) {
    setLoading(true);
    const response = await CheckLoginStatus(userId);
    setLoading(false);

    if (!response.IsSuccess) {
      const IsUnAuthorized = response.statusCode == 401;

      setResult({ ...result, IsUnAuthorized: IsUnAuthorized });
      return;
    }

    setResult({ ...result, IsSuccess: true });

    const params = new URLSearchParams(location.search);
    const isFirstTime = Boolean(params.get("isFirstTime"));

    const page = isFirstTime ? "/manager/dashboard/home" : -1;
    navigate("/manager/dashboard/home");
  }

  useEffect(() => {
    const phUser = JSON.parse(sessionStorage.getItem("phUser"));

    if (!phUser) {
      setResult({ ...result, IsUnAuthorized: true });
      setLoading(false);
      return;
    }

    if (checkPharmacy()) {
      checkAuth(phUser.userId);
    }
  }, []);

  return (
    <>
      {loading ? (
        <>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              flexDirection: "column",
              gap: "20px",
              marginTop: { xs: "20%", md: "10%" },
            }}
          >
            <CircularProgress size={70} sx={{ color: "aqua" }} />
            <Typography level="title-lg">جار التحقق ...</Typography>
          </Box>
        </>
      ) : !result.IsSuccess && result.IsUnAuthorized ? (
        <UnAuthorized />
      ) : !result.IsSuccess && result.IsPhNotActive ? (
        <NotActivePharmacy />
      ) : !result.IsSuccess && result.IsUserNotHavePh ? (
        <NotHavePharmacy />
      ) : !result.IsSuccess ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            alignItems: "center",
            height: "100%",
            flexDirection: "column",
          }}
        >
          <Typography level="title-lg">
            فشل التحقق الرجاء اعادة تحميل الصفحة !
          </Typography>
        </Box>
      ) : null}
    </>
  );
}

export default VerfiyPhUserAuth;
