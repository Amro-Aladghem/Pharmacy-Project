import "./RegisterPage.css";
import { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MainLoader from "../../../components/MainLoader";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { RegisterManagerAPI } from "../../../services/managerServices";
import { useAlert } from "../../../contexts/AlertContext";
import { usePhUserAuth } from "../../../contexts/PhUserAuthContext";

export default function RegisterPage() {
  const [Info, setInfo] = useState({
    FirstName: "",
    LastName: "",
    Phone: "",
    Email: "",
    PersonId: -1,
    Image: null,
  });
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sendDataLoading, setSendDataLoading] = useState(false);
  const { setAlert } = useAlert();

  const { handlPhAuthChange } = usePhUserAuth();
  const navigate = useNavigate();

  function handelFirstNameChange(value) {
    setInfo({ ...Info, FirstName: value });
  }

  function handelLastNameChange(value) {
    setInfo({ ...Info, LastName: value });
  }

  function handelPhoneChange(value) {
    setInfo({ ...Info, Phone: value });
  }

  function IsValuesCorrect() {
    if (!Info.FirstName || !Info.LastName || !Info.Phone) {
      setAlert({ type: "error", message: "يجب ملئ جميع الحقول!", open: true });
      return false;
    }

    if (Info.Phone.startsWith(0)) {
      setAlert({
        type: "error",
        message: "الرجاء حذف الصفر في بداية الرقم",
        open: true,
      });
      return false;
    }

    return true;
  }

  useEffect(() => {
    const person = JSON.parse(sessionStorage.getItem("Person"));

    if (person) {
      setHasAccess(true);
      setInfo({ ...Info, PersonId: person.personId, Email: person.email });
    }

    setLoading(false);
  }, []);

  async function handleRegisterClick() {
    if (!IsValuesCorrect()) return;

    setSendDataLoading(true);

    const response = await RegisterManagerAPI(Info);

    setSendDataLoading(false);

    if (!response.IsSuccess) {
      setAlert({
        type: "error",
        message: "فشل تسجيل الدخول الرجاء المحاولة مرة اخرى!",
        open: true,
      });
      return;
    }

    const manager = response.result;
    const phUser = {
      userId: manager.managerDTO.managerId,
      role: "manager",
      name: manager.managerDTO.person.userName,
      userImage: manager.managerDTO.person.profileImageLink,
    };

    sessionStorage.setItem("phUser", JSON.stringify(phUser));
    sessionStorage.setItem(
      "expiredTokenTime",
      JSON.stringify(response.result.expiredTime)
    );

    handlPhAuthChange(
      phUser.userId,
      true,
      phUser.role,
      phUser.name,
      phUser.userImage,
      response.expiredTime
    );

    navigate("/manager/ph/add");
  }

  return (
    <>
      {loading ? (
        <CircularProgress size={40} />
      ) : !hasAccess ? (
        <p>لا يمكن دخول هذه الصفحة!</p>
      ) : (
        <div id="sign-up-container">
          <div id="sign-up-form">
            <h1>معلومات عنك</h1>
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
                value={Info.FirstName}
                id="FirstName-input"
                label="اسمك الأول"
                type="text"
                variant="outlined"
                fullWidth
                size="small"
                margin="dense"
                required
                onChange={(event) => {
                  handelFirstNameChange(event.target.value);
                }}
              />
              <TextField
                value={Info.LastName}
                id="LastName-input"
                label="اسم العائلة"
                type="text"
                variant="outlined"
                fullWidth
                size="small"
                margin="dense"
                required
                onChange={(event) => {
                  handelLastNameChange(event.target.value);
                }}
              />
              <input
                type="file"
                onChange={(e) => setInfo({ ...Info, Image: e.target.files[0] })}
              />
              <TextField
                value={Info.Phone}
                id="Phone-input"
                label="رقم هاتفك للتواصل"
                type="text"
                variant="outlined"
                fullWidth
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
                  handelPhoneChange(event.target.value);
                }}
              />
              <TextField
                value={Info.Email}
                id="Eamil-Input"
                label="Email"
                type="Email"
                variant="outlined"
                fullWidth
                size="small"
                margin="dense"
                required
                disabled={true}
              />
              <Button
                id="sign-up-btn"
                type="submit"
                variant="contained"
                color="success"
                sx={{ mt: 2, fontWeight: "bold" }}
                disabled={sendDataLoading}
                onClick={() => {
                  handleRegisterClick();
                }}
              >
                استكمال المعلومات
                <div className="arrow-wrapper">
                  <div className="arrow"></div>
                </div>
              </Button>
            </form>

            {sendDataLoading ? <MainLoader top="50%" left="50%" /> : null}
          </div>
        </div>
      )}
    </>
  );
}
