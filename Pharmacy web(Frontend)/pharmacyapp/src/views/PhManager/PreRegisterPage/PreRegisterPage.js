import "./PreRegisterPage.css";
import { useState } from "react";
import { useAlert } from "../../../contexts/AlertContext";
import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/joy/Button";
import MainLoader from "../../../components/MainLoader";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { PreRegisterManagerAPI } from "../../../services/managerServices";
import { useNavigate } from "react-router-dom";

export default function PreRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [IsLoading, setLoadingStatus] = useState(false);
  const navigate = useNavigate();
  const { setAlert } = useAlert();

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  function handelEmailInputChange(value) {
    setEmail(value);
  }

  function handelPasswordInputChange(value) {
    setPassword(value);
  }

  function handelConfirmPasswrodChange(value) {
    setConfirmPassword(value);
  }

  async function handlePreRegisterClick() {
    if (!password || !email || !confirmPassword) {
      setAlert({ type: "error", message: "يرجى ملئ جميع الحقول", open: true });
      return;
    }

    setLoadingStatus(true);

    const response = await PreRegisterManagerAPI({
      Email: email,
      Password: password,
    });

    setLoadingStatus(false);

    if (!response.IsSuccess) {
      setAlert({
        type: "error",
        message: "فشل التسجيل , الرجاء اعادة المحاولة !",
        open: true,
      });
      return;
    }

    if (!response.IsPreRegisterDone) {
      setAlert({
        type: "error",
        message:
          "يبدو انه هنالك حساب موجود فعلا مرتبط بهذه المعلومات اذهب الى صفحة تسجيل الدخول",
        open: true,
      });
      return;
    }

    sessionStorage.setItem("Person", JSON.stringify(response.registerdPerson));
    navigate("/manager/register");
  }

  return (
    <>
      <div id="sign-up-container">
        <div id="sign-up-form">
          <h1>كن مدير حساب صيدلية</h1>
          <AssignmentIndIcon
            sx={{ color: "rgb(5, 197, 197)" }}
            fontSize="large"
          />
          <form
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <TextField
              value={email}
              id="email-input"
              label="Eamil"
              type="email"
              variant="outlined"
              fullWidth
              size="small"
              margin="dense"
              onChange={(event) => {
                handelEmailInputChange(event.target.value);
              }}
            />
            <TextField
              value={password}
              label="كلمة مرور "
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              size="small"
              margin="dense"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        sx={{ width: "fit-content" }}
                        onClick={handleTogglePassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              onChange={(event) => {
                handelPasswordInputChange(event.target.value);
              }}
            />
            <TextField
              value={confirmPassword}
              label="تأكيد كلمة المرور"
              type="password"
              variant="outlined"
              fullWidth
              size="small"
              margin="dense"
              onChange={(event) => {
                handelConfirmPasswrodChange(event.target.value);
              }}
            />
            <Button
              id="sign-up-btn"
              type="submit"
              variant="contained"
              color="success"
              sx={{ mt: 2, fontWeight: "bold" }}
              disabled={IsLoading}
              onClick={() => {
                handlePreRegisterClick();
              }}
            >
              استكمال المعلومات
              <div className="arrow-wrapper">
                <div className="arrow"></div>
              </div>
            </Button>
          </form>

          {IsLoading ? <MainLoader top="50%" left="50%" /> : null}
        </div>
      </div>
    </>
  );
}
