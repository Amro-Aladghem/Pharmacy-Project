import Grid from "@mui/material/Grid2";
import PharmacyLocation from "./PharamcyLocation";
import PharmacyPrimaryInfo from "./PharmacyPrimaryInfo";
import PharmacyServicesSection from "./PharmacyServicesSection";

export default function AddPharmacyForm({ info, setInfo }) {
  return (
    <Grid spacing={3} container sx={{ display: "flex", alignItems: "center" }}>
      <PharmacyPrimaryInfo info={info} setInfo={setInfo} />
      <PharmacyLocation info={info} setInfo={setInfo} />
      <PharmacyServicesSection info={info} setInfo={setInfo} />
    </Grid>
  );
}
