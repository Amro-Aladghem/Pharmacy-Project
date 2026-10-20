import { Box } from "@mui/material";
import Typography from "@mui/joy/Typography";
import { useNavigate } from "react-router-dom";

export function NotHavePharmacy() {
  const navigate = useNavigate();

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
        src="/NotHavePharmacy.png"
        alt="NotHavePharmacy "
        width={"150px"}
        height={"150px"}
      />
      <Typography level="h2" sx={{ textAlign: "center" }}>
        يبدو أنك لم تكمل انشاء الصيدلية
      </Typography>
      <button
        className="main-btn"
        style={{ width: "fit-content" }}
        onClick={() => navigate("/manager/ph/add")}
      >
        الذهاب لاستكمال اضافة الصيدلية
        <div className="arrow-wrapper">
          <div className="arrow"></div>
        </div>
      </button>
    </Box>
  );
}

export default NotHavePharmacy;
