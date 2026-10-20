import { Box } from "@mui/material";
import Typography from "@mui/joy/Typography";
import { useNavigate } from "react-router-dom";

export function NotActivePharmacy() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
        marginTop: "90px",
      }}
    >
      <img
        src="/NotActivePharmacy.png"
        alt="NotActivePharmacy "
        width={"150px"}
        height={"150px"}
      />
      <Typography level="h2" sx={{ textAlign: "center" }}>
        لم يتم تفعيل صيدليتك بعد , الرجاء الأنتظار سيتم تفعيلها في أسرع وقت ممكن
      </Typography>
    </Box>
  );
}

export default NotActivePharmacy;
