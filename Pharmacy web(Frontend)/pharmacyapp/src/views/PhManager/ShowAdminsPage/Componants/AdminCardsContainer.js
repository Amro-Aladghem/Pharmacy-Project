import Grid from "@mui/material/Grid2";
import PhAdminCard from "./PhAdminCard";
import { useState, useEffect } from "react";
import { ShowAdminsList } from "../../../../services/managerServices";
import { CircularProgress } from "@mui/material";
import { usePhUserAuth } from "../../../../contexts/PhUserAuthContext";
import UnAuthorized from "../../../../components/PhUsersComponents/UnAuthorized/UnAuthorized";
import Typography from "@mui/joy/Typography";
import { Box } from "@mui/material";

export function AdminCardsContainer() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(true);
  const [IsAuthorize, setAuthorize] = useState(true);

  const [admins, setAdmins] = useState([]);
  const { phAuthInfo } = usePhUserAuth();

  async function fetchData() {
    const response = await ShowAdminsList(phAuthInfo.userId);

    setLoading(false);

    if (!response.IsSuccess) {
      setResult(false);
      return;
    }

    const phAdmins = response.result == null ? [] : response.result;

    setAdmins(phAdmins);
  }

  const adminsCards = admins.map((admin) => {
    return (
      <PhAdminCard
        adminId={admin.adminId}
        userName={admin.adminName}
        userImage={admin.image}
        activeStatus={admin.isActive}
        lastDate={admin.lastLoggedInTime.split(" ")[0]}
        lastTime={admin.lastLoggedInTime.split(" ")[1]}
        admins={admins}
        setAdmins={setAdmins}
      />
    );
  });

  useEffect(() => {
    if (phAuthInfo.role == "admin") {
      setAuthorize(false);
      return;
    }

    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={70} />
        </Box>
      ) : !IsAuthorize ? (
        <UnAuthorized />
      ) : !result ? (
        <Typography
          level="h3"
          sx={{ marginLeft: { xs: "0px", md: "64px" }, textAlign: "center" }}
        >
          فشل تحميل البيانات!
        </Typography>
      ) : admins.length == 0 ? (
        <Typography
          level="h3"
          sx={{ marginLeft: { xs: "0px", md: "64px" }, textAlign: "center" }}
        >
          ليس لديك أي مستخدمين لهذا النظام غيرك حاليا
        </Typography>
      ) : (
        <Grid
          container
          spacing={{ xs: 4, md: 10 }}
          sx={{
            display: "flex",
            justifyContent: "center",
            direction: "rtl",
            alignItems: "end",
            marginTop: "30px",
            marginLeft: { xs: "0px", md: "63px" },
          }}
        >
          {adminsCards}
        </Grid>
      )}
    </>
  );
}

export default AdminCardsContainer;
