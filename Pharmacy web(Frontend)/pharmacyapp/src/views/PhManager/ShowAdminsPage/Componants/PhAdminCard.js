import { Box } from "@mui/material";
import { Avatar } from "@mui/material";
import Typography from "@mui/joy/Typography";
import Grid from "@mui/material/Grid2";
import PhAdminCardActions from "./PhAdminCardActions";

export function PhAdminCard({
  userImage,
  userName,
  activeStatus,
  lastDate,
  lastTime,
  adminId,
  admins,
  setAdmins,
}) {
  return (
    <Grid
      size={{ xs: 12, md: 4 }}
      sx={{ display: "flex", justifyContent: "center" }}
    >
      <Box
        sx={{
          backgroundColor: "rgba(179, 175, 175, 0.03)",
          padding: "6px 6px ",
          borderRadius: "12px",
          border: "1px solid black",
          width: "270px",
          display: "flex",
          flexDirection: "column",
          direction: "rtl",
        }}
      >
        <Box sx={{ display: "flex", width: "100%", justifyContent: "center" }}>
          <Avatar
            src={userImage}
            sx={{ width: "130px", height: "130px", margin: "6px 0px" }}
          />
        </Box>

        <Typography level="title-lg" mb={"6px"}>
          {userName}
        </Typography>
        <Typography level="body-md">
          حالة الحساب :{activeStatus ? "فعال" : "غير فعال"}
        </Typography>
        <Typography level="body-sm">
          أخر تاريخ لتسجيل الدخول:{lastDate}
        </Typography>
        <Typography level="body-sm">
          أخر وقت لتسجيل الدخول:{lastTime}
        </Typography>

        <PhAdminCardActions
          adminId={adminId}
          admins={admins}
          setAdmins={setAdmins}
        />
      </Box>
    </Grid>
  );
}

export default PhAdminCard;
