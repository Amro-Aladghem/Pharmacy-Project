import { Box } from "@mui/material";
import Typography from "@mui/joy/Typography";

export function UnAuthorized() {
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
        src="/unauthorized.png"
        alt="unAuthorized "
        width={"150px"}
        height={"150%"}
      />
      <Typography level="h1">غير مصرح لك بالدخول </Typography>
    </Box>
  );
}

export default UnAuthorized;
