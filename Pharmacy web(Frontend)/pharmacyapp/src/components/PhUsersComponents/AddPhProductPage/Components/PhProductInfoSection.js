import { Box, FormControl, InputLabel } from "@mui/material";
import { TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import "../AddPhProductPage.css";
import { productsCategories } from "../../../../Data/ProductsCategories";
import { ProductsTypes } from "../../../../Data/ProductsTypes";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import Typography from "@mui/joy/Typography";
import CheckSysProductAlert from "./CheckSysPorductAlert";

const ProductsCategories = productsCategories.map((category) => {
  return (
    <MenuItem key={category.Id} value={category.Id}>
      {category.Name}
    </MenuItem>
  );
});

const ProductsTypesList = ProductsTypes.map((type) => {
  return (
    <MenuItem key={type.Id} value={type.Id}>
      {type.ArabicName}
    </MenuItem>
  );
});

export function PhProductInfoSection({ productInfo, setProductInfo }) {
  return (
    <Grid
      size={{ xs: 12, md: 6 }}
      container
      spacing={4}
      sx={{
        display: "flex",
        alignItems: "center",
        direction: "rtl",
        width: { xs: "100%", md: "500px" },
        height: "fit-content",
        backgroundColor: "rgba(206, 204, 201, 0.196)",
        borderRadius: "8px",
        padding: "6px 6px",
        position: "relative",
      }}
    >
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <TextField
          value={productInfo.Price}
          onChange={(e) =>
            setProductInfo({ ...productInfo, Price: e.target.value })
          }
          label="سعر المنتج"
          type="number"
          variant="outlined"
          size="small"
          margin="dense"
          sx={{ width: 250 }}
          slotProps={{
            htmlInput: {
              min: 0.1,
              max: 1000,
              step: 0.1,
            },
          }}
        />
      </Grid>

      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <TextField
          value={productInfo.Stoke}
          id="Stoke-input"
          label="عدد علب الأدوية في الصيدلية للمنتج"
          type="number"
          variant="outlined"
          sx={{
            width: "250px",
          }}
          size="small"
          margin="dense"
          onChange={(event) => {
            setProductInfo({ ...productInfo, Stoke: event.target.value });
          }}
          htmlInput={{
            input: {
              min: 0,
              max: 1000,
              step: 1,
            },
          }}
        />
      </Grid>

      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{ display: "flex", alignItems: "center" }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "10px",
          }}
        >
          <label htmlFor="Produced-date">تاريخ الأنتاج</label>
          <input
            className="Porduct-Date"
            id="Produced-date"
            type="datetime-local"
            value={productInfo.ProducedDate}
            onChange={(event) => {
              setProductInfo({
                ...productInfo,
                ProducedDate: event.target.value,
              });
            }}
          />
        </Box>
      </Grid>

      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{ display: "flex", alignItems: "center" }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "10px",
          }}
        >
          <label htmlFor="Expired-date">تاريخ الأنتهاء</label>
          <input
            className="Product-Date"
            id="Expired-date"
            type="datetime-local"
            value={productInfo.EndDate}
            onChange={(event) => {
              setProductInfo({ ...productInfo, EndDate: event.target.value });
            }}
          />
        </Box>
      </Grid>

      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <FormControl fullWidth size="small" margin="dense">
          <InputLabel id="medical-category">تصنيف الدواء</InputLabel>
          <Select
            labelId="medical-category"
            id="medical-category"
            value={productInfo.CategoryId}
            label="تصنيف الدواء"
            onChange={(event) => {
              setProductInfo({
                ...productInfo,
                CategoryId: event.target.value,
              });
            }}
          >
            {ProductsCategories}
          </Select>
        </FormControl>
      </Grid>

      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <FormControl fullWidth size="small" margin="dense">
          <InputLabel id="medical-types">شكل الدواء</InputLabel>
          <Select
            labelId="medical-types"
            id=""
            value={productInfo.MedicalTypeId}
            label="شكل الدواء"
            onChange={(event) => {
              setProductInfo({
                ...productInfo,
                MedicalTypeId: event.target.value,
              });
            }}
          >
            {ProductsTypesList}
          </Select>
        </FormControl>
      </Grid>

      <Grid
        size={12}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <TextField
          value={productInfo.MedicalQuantity}
          id="qauntity-input"
          label="سعة الدواء, مثل 12 حبة او 150 مل فقط اكتب الرقم"
          type="number"
          variant="outlined"
          sx={{
            width: "320px",
          }}
          size="small"
          margin="dense"
          onChange={(event) => {
            setProductInfo({
              ...productInfo,
              MedicalQuantity: event.target.value,
            });
          }}
          slotProps={{
            htmlInput: {
              min: 0,
              max: 1000,
              step: 1,
            },
          }}
        />
      </Grid>

      <Grid
        size={12}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <textarea
          value={productInfo.PhDescription}
          id="textarea-product"
          placeholder="وصف المنتج , مثل  استخدامته أو الأعراض الجانبية "
          onChange={(event) => {
            setProductInfo({
              ...productInfo,
              PhDescription: event.target.value,
            });
          }}
        />
      </Grid>

      {!productInfo.IsChecked ? <CheckSysProductAlert /> : null}
    </Grid>
  );
}

export default PhProductInfoSection;
