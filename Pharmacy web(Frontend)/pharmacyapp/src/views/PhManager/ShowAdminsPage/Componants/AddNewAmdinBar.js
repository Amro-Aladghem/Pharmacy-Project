import Typography from "@mui/joy/Typography";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export function AddNewAdminBar() {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        marginLeft: { xs: "0px", md: "64px" },
        direction: "rtl",
        display: "flex",
        backgroundColor: "rgba(179, 175, 175, 0.03)",
        borderRadius: "3px",
        marginBottom: "10px",
        marginTop: "90px",
        padding: "6px 6px ",
      }}
    >
      <Typography level="title-lg">اضف مستخدم جديد للنظام</Typography>
      <button
        className="main-btn"
        style={{ width: "fit-content", marginRight: "auto" }}
        onClick={() => navigate("/manager/dashboard/admins/add")}
      >
        اضف مستخدم
        <div className="arrow-wrapper">
          <div className="arrow"></div>
        </div>
      </button>
    </Box>
  );
}

export default AddNewAdminBar;
