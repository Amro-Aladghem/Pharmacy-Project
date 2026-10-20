import { Menu, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { GetAllRegionsForTheGov } from "../../../../services/requestServices";
import { Governorates } from "../../../../Data/Governorates";
import { useState } from "react";
import Textarea from "@mui/joy/Textarea";

const GovernoratesOptions = Governorates.map((Gov) => {
  return (
    <MenuItem key={Gov.id} value={Gov.id}>
      {Gov.name}
    </MenuItem>
  );
});

export default function PharmacyLocation({ info, setInfo }) {
  const [regions, setRegions] = useState([]);

  async function GetRegions(GovId) {
    const response = await GetAllRegionsForTheGov(GovId);

    if (!response.IsSuccess) return;

    setRegions(response.result);
  }

  const regionsOptions = regions.map((region) => {
    return (
      <MenuItem key={region.regionID} value={region.regionID}>
        {region.regionName}
      </MenuItem>
    );
  });

  function handleGovClicked(event) {
    GetRegions(event.target.value);
    setInfo({ ...info, GovernateId: event.target.value });
  }

  return (
    <Grid
      container
      spacing={3}
      sx={{ display: "flex", alignItems: "center", direction: "rtl" }}
    >
      <Grid
        id="conutries"
        size={{ xs: 12, md: 6 }}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Select
          labelId="اختر الدولة"
          value={1}
          label=""
          sx={{ width: "300px" }}
        >
          <MenuItem value={1}>الأردن</MenuItem>
        </Select>
      </Grid>

      <Grid
        id="Governorates"
        size={{ xs: 12, md: 6 }}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Select
          labelId="اختر المحافظة"
          value={info.GovernateId}
          onChange={(event) => handleGovClicked(event)}
          sx={{ width: "300px" }}
        >
          {GovernoratesOptions}
        </Select>
      </Grid>

      <Grid
        id="Regions"
        size={{ xs: 12, md: 6 }}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Select
          labelId="اختر المنطقة"
          value={info.RegionId}
          onChange={(event) =>
            setInfo({ ...info, RegionId: event.target.value })
          }
          sx={{ width: "300px" }}
        >
          <MenuItem value={0}>اختر المنطقة</MenuItem>
          {regionsOptions}
        </Select>
      </Grid>

      <Grid
        id="About"
        size={{ xs: 12, md: 6 }}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Textarea
          name="Plain"
          placeholder="الوصف للصيدلية"
          variant="plain"
          value={info.About}
          onChange={(e) => {
            setInfo({ ...info, About: e.target.value });
          }}
          sx={{ width: "300px" }}
        />
      </Grid>
    </Grid>
  );
}
