import { TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { InputAdornment } from "@mui/material";

export default function PharmacyPrimaryInfo({ info, setInfo }) {
  return (
    <Grid
      container
      spacing={3}
      sx={{
        display: "flex",
        alignItems: "center",
        direction: "rtl",
      }}
    >
      <Grid
        id="Ph-Name"
        size={{ xs: 12, md: 6 }}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <TextField
          value={info.Name}
          id="PhName-input"
          label="اسم الصيدلية باللغة العربية"
          type="text"
          variant="outlined"
          sx={{ width: "300px" }}
          size="small"
          margin="dense"
          required
          onChange={(event) => {
            setInfo({ ...info, Name: event.target.value });
          }}
        />
      </Grid>

      <Grid
        id="Ph-Email"
        size={{ xs: 12, md: 6 }}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <TextField
          value={info.PhEmail}
          id="PhEmail-input"
          label="البريد الألكتروني للصيدلية"
          type="email"
          variant="outlined"
          sx={{ width: "300px" }}
          size="small"
          margin="dense"
          required
          onChange={(event) => {
            setInfo({ ...info, PhEmail: event.target.value });
          }}
        />
      </Grid>

      <Grid
        id="Ph-Phone"
        size={{ xs: 12, md: 6 }}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <TextField
          value={info.Phone}
          id="Phone-input"
          label="رقم هاتف الصيدلية"
          type="text"
          variant="outlined"
          sx={{ width: "300px", direction: "ltr" }}
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
            setInfo({ ...info, Phone: event.target.value });
          }}
        />
      </Grid>

      <Grid
        id="Ph-Street"
        size={{ xs: 12, md: 6 }}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <TextField
          value={info.StreetName}
          id="PhStreet-input"
          label="اسم الشارع"
          type="text"
          variant="outlined"
          sx={{ width: "300px" }}
          size="small"
          margin="dense"
          required
          onChange={(event) => {
            setInfo({ ...info, StreetName: event.target.value });
          }}
        />
      </Grid>
    </Grid>
  );
}
