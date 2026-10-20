import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import Typography from "@mui/joy/Typography";
import { Box } from "@mui/material";

export default function CheckSysProductAlert() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "absolute",
        backgroundColor: "rgba(206, 204, 201, 0.1)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        zIndex: "10",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <DoNotDisturbIcon
          sx={{
            width: "100px",
            height: "100px",
            color: "rgb(255, 86, 114",
          }}
        />
        <Typography level="title-lg">
          يجب التحقق أولا من وجود المنتج قبل اضافة المعلومات
        </Typography>
      </Box>
    </Box>
  );
}
