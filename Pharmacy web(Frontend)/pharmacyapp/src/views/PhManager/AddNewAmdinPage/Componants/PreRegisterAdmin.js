import { PreRegisterAdminAPI } from "../../../../services/managerServices";
import { useState } from "react";
import { useAlert } from "../../../../contexts/AlertContext";
import { usePhUserAuth } from "../../../../contexts/PhUserAuthContext";
import { Box } from "@mui/system";
import Typography from "@mui/joy/Typography";
import MainLoader from "../../../../components/MainLoader";
import { TextField } from "@mui/material";

export function PreRegisterAdmin({ handleNextStep }) {
  const [loading, setLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const [isPasswordValied, setIsPasswordValied] = useState(false);

  const { setAlert } = useAlert();
  const { phAuthInfo } = usePhUserAuth();

  function isPasswordStrong(password) {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length > 8;

    if (hasUpper && hasLower && hasNumber && hasSymbol && isLongEnough) {
      setIsPasswordValied(true);
    } else {
      setIsPasswordValied(false);
    }
  }

  async function handlePreRegister() {
    if (!loginInfo.email || !loginInfo.password) {
      setAlert({ type: "error", message: "يجب تعبئة جميع الحقول", open: true });
      return;
    }

    setLoading(true);
    const response = await PreRegisterAdminAPI(
      { email: loginInfo.email, password: loginInfo.password },
      phAuthInfo.userId
    );
    setLoading(false);

    if (!response.IsSuccess) {
      const message =
        response.statusCode == 409
          ? "هذا الأيميل موجود سابقا لا يمكن استخدامه"
          : "فشل اضافة المستخدم , الرجاء اعادة المحاولة";

      setAlert({
        type: "error",
        message: message,
        open: true,
      });
      return;
    }

    handleNextStep({ isNext: true, personId: response.result.personId });
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
        اضافة مستخدم جديد
      </Typography>
      <Typography level="title-md">اضافة معلومات تسجيل الدخول</Typography>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
          marginBottom: "10px",
        }}
      >
        <TextField
          value={loginInfo.email}
          id="email-input"
          label="البريد الألكتروني للمستخدم الجديد"
          type="email"
          variant="outlined"
          sx={{ width: "270px" }}
          size="small"
          margin="dense"
          onChange={(event) => {
            setLoginInfo({
              ...loginInfo,
              email: event.target.value,
            });
          }}
        />
        <TextField
          value={loginInfo.password}
          label="كلمة السر"
          type={"text"}
          variant="outlined"
          sx={{ width: "270px" }}
          size="small"
          margin="dense"
          slotProps={{
            input: {},
          }}
          helperText={
            !isPasswordValied
              ? "كلمة السر يجب ان تكون من 8 خانات و تحتوي على رموز مثل #$ وعلى الأقل حرف كبير ورقم"
              : ""
          }
          onChange={(event) => {
            setLoginInfo({
              ...loginInfo,
              password: event.target.value,
            });
            isPasswordStrong(event.target.value);
          }}
        />
      </Box>

      <button
        className="main-btn"
        style={{ width: "fit-content" }}
        disabled={!isPasswordValied || loading}
        onClick={() => handlePreRegister()}
      >
        استكمال الخطوة التالية
        <div className="arrow-wrapper">
          <div className="arrow"></div>
        </div>
      </button>

      {loading ? <MainLoader top={"45%"} left={"45%"} /> : null}
    </Box>
  );
}

export default PreRegisterAdmin;
