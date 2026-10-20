import { TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { alpha, styled } from "@mui/material/styles";
import { pink } from "@mui/material/colors";
import Switch from "@mui/material/Switch";
import { Box } from "@mui/material";
import Typography from "@mui/joy/Typography";
import { useAlert } from "../../../../contexts/AlertContext";

export default function PharmacyServicesSection({ info, setInfo }) {
  const { setAlert } = useAlert();

  const PinkSwitch = styled(Switch)(({ theme }) => ({
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: pink[600],
      "&:hover": {
        backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity),
      },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: pink[600],
    },
  }));

  function hanldeUploadImage(file) {
    const valiedExtentions = ["jpeg", "png", "jpg", "svg"];
    const fileExtention = file.name.split(".").pop().toLowerCase();

    if (!valiedExtentions.includes(fileExtention)) {
      setAlert({
        type: "error",
        message: "يجب ان يكون الملف عبارة عن صور بامتداد :png,jpeg,jpg,svg",
        open: true,
      });
      return;
    }

    setInfo({ ...info, ImageURL: file });
  }

  return (
    <Grid container spacing={3} sx={{ display: "flex", direction: "rtl" }}>
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <TextField
            value={info.VedioCallPrice}
            id="VedioCallPrice-input"
            label="سعر الأستشارة"
            type="number"
            variant="outlined"
            disabled={!info.IsHasVideoCall}
            sx={{
              width: "210px",
            }}
            size="small"
            margin="dense"
            onChange={(event) => {
              setInfo({ ...info, VedioCallPrice: event.target.value });
            }}
            helperText="فعل الزر لكتابة السعر"
            htmlInput={{
              input: {
                min: 0,
                max: 1000,
                step: 1,
              },
            }}
          />
          <PinkSwitch
            checked={info.IsHasVideoCall}
            onChange={(e) =>
              setInfo({ ...info, IsHasVideoCall: e.target.checked })
            }
          />
        </Box>
      </Grid>

      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Typography level="title-md">خدمة التوصيل</Typography>
          <PinkSwitch
            checked={info.IsHasDelivery}
            onChange={(e) =>
              setInfo({ ...info, IsHasDelivery: e.target.checked })
            }
          />
        </Box>
      </Grid>

      <Grid
        size={12}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            width: "300px",
            height: "50px",
            backgroundColor: "aqua",
            display: "flex",
            alignItems: "center",
            direction: "ltr",
            padding: "6px 6px",
            borderRadius: "8px",
            flexDirection: "column",
          }}
        >
          <input
            placeholder="حمل صورة للصيدلية"
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={(event) => {
              hanldeUploadImage(event.target.files[0]);
            }}
          />
          <Typography level="title-lg">حمل صورة للصيدلية هنا</Typography>
        </Box>
      </Grid>
    </Grid>
  );
}
