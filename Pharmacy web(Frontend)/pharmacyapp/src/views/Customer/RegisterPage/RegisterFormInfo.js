import { TextField } from "@mui/material";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";
import { InputAdornment } from "@mui/material";
import Button from "@mui/material";

export function RegisterFormInfo({ Info, handlers }) {
  function handelFirstNameChange(value) {
    handlers.setInfo({ ...Info, FirstName: value });
  }

  function handelLastNameChange(value) {
    handlers.setInfo({ ...Info, LastName: value });
  }

  function handelPhoneChange(value) {
    handlers.setInfo({ ...Info, Phone: value });
  }

  return (
    <section id="sign-up-form-register" className="customer-auth-card customer-register-form">
      <div className="customer-auth-heading">
        <span className="customer-auth-icon"><ContactEmergencyIcon /></span>
        <div>
          <span>معلومات الحساب</span>
          <h1>بياناتك الشخصية</h1>
          <p>أكمل معلومات التواصل المطلوبة للتسجيل.</p>
        </div>
      </div>
      <form
        className="customer-register-fields"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <TextField
          dir="rtl"
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
          dir="rtl"
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
        <TextField
          dir="rtl"
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
          dir="rtl"
          value={Info.Email}
          id="Eamil-Input"
          label="البريد الإلكتروني"
          type="Email"
          variant="outlined"
          fullWidth
          size="small"
          margin="dense"
          required
          disabled={true}
        />
      </form>
    </section>
  );
}

export default RegisterFormInfo;
