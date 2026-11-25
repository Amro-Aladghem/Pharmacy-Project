import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import "../../../assets/Styles/CustomerAuth.css";
import { useState, useEffect } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import { Login } from "../../../services/customerServices";
import MainLoader from "../../../components/MainLoader";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { GetCustomerCartIfExistsAtLoggedIn } from "../../../services/orderServices";
import { useAlert } from "../../../contexts/AlertContext";

export function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [IsLoading, setLoadingStatus] = useState(false);

  const { authInfo, handleAuthChange } = useAuth();
  const { setAlert } = useAlert();

  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  function handelEmailInputChange(value) {
    setEmail(value);
  }

  function handelPasswordInputChange(value) {
    setPassword(value);
  }

  async function handleGetCustomerCartIfExists(customerId) {
    const cart = localStorage.getItem("cart");
    if (cart) return;

    const response = await GetCustomerCartIfExistsAtLoggedIn(customerId);

    if (!response.IsSuccess || !response.result) {
      localStorage.removeItem("cart");
      return;
    }

    localStorage.setItem("cart", JSON.stringify(response.result));
  }

  async function handelSignInCliked() {
    if (!email || !password) {
      setAlert({ type: "error", message: "يجب ملئ جميع الحقول", open: true });
      return;
    }

    setLoadingStatus(true);
    const response = await Login(email, password);

    setLoadingStatus(false);

    if (!response.Success) {
      setAlert({
        type: "error",
        message: `${response.error || "حدث خطأ !"}`,
        open: true,
      });
      return;
    }

    sessionStorage.setItem("customer", JSON.stringify(response.data.customer));
    sessionStorage.setItem(
      "expiredTokenTime",
      JSON.stringify(response.data.expiredTokenTime)
    );

    handleAuthChange(
      true,
      response.data.customer.customerId,
      response.data.customer.person.userName,
      response.data.customer.person.profileImageLink,
      response.data.expiredTokenTime
    );

    handleGetCustomerCartIfExists(response.data.customer.customerId);

    window.location.href = "/";
  }

  useEffect(() => {
    if (authInfo.loggedIn) {
      navigate("/");
    }
  }, []);

  return (
    <main id="sign-in-container" className="customer-auth-layout signin-layout" dir="rtl">
      <aside className="customer-auth-intro">
        <img src="/MainLogo.png" alt="PharmaPal" />
        <span>مرحبًا بعودتك</span>
        <h2>صحتك أقرب مع PharmaPal</h2>
        <p>تابع طلباتك، واستكشف المنتجات والخدمات من الصيدليات بكل سهولة.</p>
        <div className="customer-auth-highlights">
          <span>منتجات صيدلانية متنوعة</span>
          <span>صيدليات وخدمات قريبة منك</span>
          <span>متابعة الطلبات والاستشارات</span>
        </div>
      </aside>

      <section id="sign-in-form" className="customer-auth-card">
        <div className="customer-auth-heading">
          <span className="customer-auth-icon"><MeetingRoomIcon /></span>
          <div>
            <span>حساب PharmaPal</span>
            <h1>تسجيل الدخول</h1>
            <p>أدخل بريدك الإلكتروني وكلمة المرور للمتابعة.</p>
          </div>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <TextField
            dir="rtl"
            value={email}
            id="email-input"
            label="البريد الإلكتروني"
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
            dir="rtl"
            value={password}
            label="كلمة المرور"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            size="small"
            margin="dense"
            slotProps={{
              input: {
                endAdornment: (
                    <InputAdornment position="start">
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
        <div id="more-info" className="customer-auth-links">
          <div className="customer-auth-support">
            <h6>هل نسيت كلمة السر؟</h6>
            <a href="/">الدعم الفني</a>
          </div>
          <div className="customer-auth-new-user">
            <span>مستخدم جديد أول مرة؟</span>
            <a href="/">تسجيل الدخول أول مرة</a>
          </div>
        </div>

        {IsLoading ? <MainLoader top="50%" left="40%" /> : null}
      </section>
    </main>
  );
}

export default SignInPage;
