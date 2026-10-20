import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/joy/Typography";
import { productsCategories } from "../../../Data/ProductsCategories";
import { ProductsTypes } from "../../../Data/ProductsTypes";

const productsCategoriesOptions = productsCategories.map((category) => {
  return (
    <option key={category.Id} value={category.Id}>
      {category.Name}
    </option>
  );
});

const productsTypesOptions = ProductsTypes.map((type) => {
  return (
    <option key={type.Id} value={type.Id}>
      {type.ArabicName}
    </option>
  );
});

export default function ProductInfoForm({
  productInfo,
  setProductInfo: handleInfoChange,
}) {
  return (
    <>
      <Grid
        container
        spacing={3}
        sx={{
          display: "felx",
          justifyContent: "center",
          alignItems: "center",
          width: { md: "550px", xs: "330px" },
          margin: "10px 10px",
        }}
      >
        <Grid size={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Typography level="h2">{productInfo.name}</Typography>
        </Grid>

        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <label htmlFor="ProducedDate">تاريخ الأنتاج</label>
          <input
            value={productInfo.producedDate}
            id="ProducedDate"
            type="datetime-local"
            onChange={(event) =>
              handleInfoChange({
                ...productInfo,
                producedDate: event.target.value,
              })
            }
          />
        </Grid>

        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <label htmlFor="EndDate">تاريخ الأنتهاء</label>
          <input
            value={productInfo.endDate}
            id="EndDate"
            type="datetime-local"
            onChange={(event) =>
              handleInfoChange({
                ...productInfo,
                endDate: event.target.value,
              })
            }
          />
        </Grid>

        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <label htmlFor="price">السعر</label>
          <input
            value={productInfo.price}
            id="price"
            type="number"
            step={0.1}
            width={"60px"}
            onChange={(event) =>
              handleInfoChange({
                ...productInfo,
                price: event.target.value,
              })
            }
          />
        </Grid>

        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <label htmlFor="stoke">الكمية</label>
          <input
            value={productInfo.stoke}
            id="stoke"
            type="number"
            width={"60px"}
            onChange={(event) =>
              handleInfoChange({
                ...productInfo,
                stoke: event.target.value,
              })
            }
          />
        </Grid>

        <Grid size={12} sx={{ display: "flex", justifyContent: "center" }}>
          <label htmlFor="medical-quantity">سعة المنتج</label>
          <input
            value={productInfo.medicalQuantity}
            id="medical-quantity"
            type="number"
            width={"120px"}
            onChange={(event) =>
              handleInfoChange({
                ...productInfo,
                medicalQuantity: event.target.value,
              })
            }
          />
        </Grid>

        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <label htmlFor="medical-categories">تصنيف الدواء </label>
          <select
            id="medical-categories"
            value={productInfo.categoryId}
            onChange={(event) =>
              handleInfoChange({
                ...productInfo,
                categoryId: event.target.value,
              })
            }
          >
            {productsCategoriesOptions}
          </select>
        </Grid>

        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <label htmlFor="medical-types">تصنيف الدواء </label>
          <select
            id="medical-types"
            value={productInfo.medicalTypeId}
            onChange={(event) =>
              handleInfoChange({
                ...productInfo,
                medicalTypeId: event.target.value,
              })
            }
          >
            {productsTypesOptions}
          </select>
        </Grid>
      </Grid>
    </>
  );
}
