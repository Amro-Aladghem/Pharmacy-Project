import OptionCard from "../../../../components/Card/Horizontal/OptionCard/OptionCard";
import Grid from "@mui/material/Grid2";

//{ optionName, page, type, buttonName }

const Options = [
  { id: 1, optionName: "عرض مستخدمي النظام", type: "users", buttonName: "عرض" },
  {
    id: 2,
    optionName: "عرض سجل الطلبات السابقة",
    type: "appointment",
    buttonName: "عرض",
  },
  {
    id: 3,
    optionName: "عرض  سجل الأستشارات السابقة",
    type: "appointment",
    buttonName: "عرض",
  },
  {
    id: 4,
    optionName: "تحديث معلومات الملف الشخصي للصيدلية",
    type: "info",
    buttonName: "تحديث",
  },
  {
    id: 5,
    optionName: "تحديث معلومات الصيدلية العامة  ",
    type: "info",
    buttonName: "تحديث",
  },
  {
    id: 6,
    optionName: "تحديث معلومات التوصيل والأماكن",
    type: "info",
    buttonName: "تحديث",
  },
];

const OptionsCards = Options.map((option) => {
  return (
    <Grid
      size={{ xs: 12, md: 6 }}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <OptionCard
        key={option.Id}
        optionName={option.optionName}
        type={option.type}
        buttonName={option.buttonName}
      />
    </Grid>
  );
});

export default function SettingOptions() {
  return (
    <>
      <Grid
        container
        spacing={5}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "15px",
          direction: "rtl",
        }}
      >
        {OptionsCards}
      </Grid>
    </>
  );
}
