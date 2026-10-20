import { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { IconButton } from "@mui/material";
import { Button } from "@mui/material";
import "./SignIn.css";
import MainLoader from "../../../components/MainLoader";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAlert } from "../../../contexts/AlertContext";
import { Login } from "../../../services/managerServices";
import { usePhUserAuth } from "../../../contexts/PhUserAuthContext";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/joy/Typography";

export function SignIn() {
  const { setAlert } = useAlert();
  const [showPassword, setShowPassword] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
    pinCode: "",
  });
  const [IsLoading, setLoadingStatus] = useState(false);
  const { handlPhAuthChange } = usePhUserAuth();
  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSetUserInfo = (manager, expiredTimeToken) => {
    const phUser = {
      userId: manager.managerDTO.managerId,
      role: "manager",
      name: manager.managerDTO.person.userName,
      userImage: manager.managerDTO.person.profileImageLink,
    };

    sessionStorage.setItem("phUser", JSON.stringify(phUser));
    sessionStorage.setItem(
      "expiredTokenTime",
      JSON.stringify(expiredTimeToken)
    );

    handlPhAuthChange(
      phUser.userId,
      true,
      phUser.role,
      phUser.name,
      phUser.userImage,
      expiredTimeToken
    );

    if (!manager.managerDTO.isHasPharmacy) return;

    const managerPharmacy = manager.managerDTO.pharmacy;

    const pharmacy = {
      pharmacyId: managerPharmacy.pharmacyId,
      phName: managerPharmacy.arabicName,
      phImage: managerPharmacy.imageURL,
      isActive: managerPharmacy.isActive,
    };

    sessionStorage.setItem("pharmacy", JSON.stringify(pharmacy));
  };

  const handelSignInCliked = async () => {
    if (!loginInfo.email || !loginInfo.password) {
      setAlert({
        type: "error",
        message: "يجب تعبئة جميع الحقول!",
        open: true,
      });
      return;
    }

    setLoadingStatus(true);
    const response = await Login(loginInfo);
    setLoadingStatus(false);

    if (!response.IsSuccess) {
      setAlert({
        type: "error",
        message: response.error,
        open: true,
      });
      return;
    }

    const manager = response.result;

    handleSetUserInfo(manager, response.expiredTime);

    navigate("/manager/verify?isFirstTime=true");
  };

  return (
    <div id="sign-in-container">
      <div id="sign-in-form">
        <Typography level="h3">
          تسجيل الدخول <br></br>كمدير للصيدلية
        </Typography>
        <AccountCircleIcon
          sx={{ color: "rgb(5, 197, 197)" }}
          fontSize="large"
        />
        <form
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <TextField
            value={loginInfo.pinCode}
            id="pin-input"
            label="الرمز السري للصيدلية"
            type="text"
            variant="outlined"
            fullWidth
            size="small"
            margin="dense"
            onChange={(event) => {
              setLoginInfo({ ...loginInfo, pinCode: event.target.value });
            }}
          />
          <TextField
            value={loginInfo.email}
            id="email-input"
            label="الأيميل الألكتروني"
            type="email"
            variant="outlined"
            fullWidth
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
              setLoginInfo({
                ...loginInfo,
                password: event.target.value,
              });
            }}
          />
          <Button
            id="sign-in-btn"
            type="submit"
            variant="contained"
            color="success"
            sx={{ mt: 2 }}
            disabled={IsLoading}
            onClick={() => {
              handelSignInCliked();
            }}
          >
            تسجيل الدخول
            <div className="arrow-wrapper">
              <div className="arrow"></div>
            </div>
          </Button>
        </form>
        <div id="more-info">
          <h6 style={{ display: "inline" }}>هل نسيت كلمة السر؟</h6>
          <a href="/">الدعم الفني</a>
          <h6 style={{ marginTop: "6px", marginBottom: "1px" }}>
            مستخدم جديد أول مرة؟
          </h6>
          <a href="/manager/pre-register">لم تنشئ صيدليتك بعد؟</a>
          <Typography level="title-sm" mt={"5px"}>
            يمكنك ترك رمز الصيدلية فارغ اذا لم تستلمه بعد أو انك لم تكمل انشائها
          </Typography>
        </div>

        {IsLoading ? <MainLoader top="50%" left="40%" /> : null}
      </div>
    </div>
  );
}

export default SignIn;
