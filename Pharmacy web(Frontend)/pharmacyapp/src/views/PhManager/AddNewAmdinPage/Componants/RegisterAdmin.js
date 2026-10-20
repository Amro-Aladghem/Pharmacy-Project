import { useState } from "react";
import { useAlert } from "../../../../contexts/AlertContext";
import { usePhUserAuth } from "../../../../contexts/PhUserAuthContext";
import { Box } from "@mui/system";
import Typography from "@mui/joy/Typography";
import MainLoader from "../../../../components/MainLoader";
import { TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import InputAdornment from "@mui/material/InputAdornment";
import { useNavigate } from "react-router-dom";
import { RegisterAmdinAPI } from "../../../../services/managerServices";

export function RegisterAdmin({ personId }) {
  const { setAlert } = useAlert();
  const { phAuthInfo } = usePhUserAuth();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [info, setInfo] = useState({ firstName: "", lastName: "", phone: "" });

  async function handleRegisterAdmin() {
    if (!info.firstName || !info.lastName || !info.phone) {
      setAlert({
        type: "error",
        message: "يجب تبعئة جميع الحقول!",
        open: true,
      });
      return;
    }

    if (info.phone.startsWith(0)) {
      setAlert({
        type: "error",
        message: "لا يجب ان يبدأ الرقم ب صفر الرجاء ازالته",
        open: true,
      });
      return;
    }

    setLoading(true);
    const response = await RegisterAmdinAPI(
      {
        firstName: info.firstName,
        lastName: info.lastName,
        phone: info.phone,
        personId: personId,
      },
      phAuthInfo.userId
    );
    setLoading(false);

    if (!response.IsSuccess) {
      setAlert({
        type: "error",
        message: "فشل اضافة المستخدم",
        open: true,
      });
      return;
    }

    navigate("/manager/dashboard/admins/show");
    setAlert({
      type: "success",
      message: "تم اضافة المستخدم بنجاح",
      open: true,
    });
  }

  return (
    <Box
      sx={{
        marginLeft: { xs: "0xp", md: "63px" },
        marginTop: "90px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography level="h1" sx={{ textAlign: "center" }}>
        استكمال المعلومات الشخصية
      </Typography>

      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
          marginBottom: "10px",
        }}
      >
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <TextField
            value={info.firstName}
            id="First-input"
            label="الاسم الأول  "
            type="text"
            variant="outlined"
            sx={{ width: "270px" }}
            size="small"
            margin="dense"
            required
            onChange={(event) => {
              setInfo({ ...info, firstName: event.target.value });
            }}
          />
        </Grid>

        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <TextField
            value={info.lastName}
            id="last-input"
            label="اسم العائلة  "
            type="text"
            variant="outlined"
            sx={{ width: "270px" }}
            size="small"
            margin="dense"
            required
            onChange={(event) => {
              setInfo({ ...info, lastName: event.target.value });
            }}
          />
        </Grid>

        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <TextField
            value={info.phone}
            id="Phone-input"
            label="رقم  الهاتف"
            type="text"
            variant="outlined"
            sx={{ width: "270px" }}
            size="small"
            margin="dense"
            required
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">0</InputAdornment>
                ),
                pattern: "[1-9]*",
                inputMode: "numeric",
              },
            }}
            onChange={(event) => {
              setInfo({ ...info, phone: event.target.value });
            }}
          />
        </Grid>
      </Grid>

      <button
        className="main-btn"
        style={{ width: "fit-content" }}
        disabled={loading}
        onClick={() => handleRegisterAdmin()}
      >
        اضافة المستخدم
        <div className="arrow-wrapper">
          <div className="arrow"></div>
        </div>
      </button>

      {loading ? <MainLoader top={"45%"} left={"50%"} /> : null}

      <Typography level="title-md" mt="4px">
        *الرجاء عدم اعادة تحميل الصفحة ستفقد المعلومات
      </Typography>
    </Box>
  );
}

export default RegisterAdmin;
