import { Box } from "@mui/material";
import { TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "../AddPhProductPage.css";
import Typography from "@mui/joy/Typography";
import { useAlert } from "../../../../contexts/AlertContext";
import SysProductsSearchDialog from "../../../Dialogs/SysProductsSearchDialog/SysProductsSearchDialog";
import { useState } from "react";

export default function ChooseSysProductSection({
  productInfo,
  setProductInfo,
}) {
  const { setAlert } = useAlert();
  const [open, setOpen] = useState(false);

  function hanldeUploadImage(file) {
    if (!file) {
      setProductInfo({ ...productInfo, Image: null });
      return;
    }

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

    setProductInfo({ ...productInfo, Image: file });
  }

  function handleAfterCheckProduct(isNew, sysproduct) {
    if (isNew) {
      setProductInfo({
        ...productInfo,
        IsChecked: true,
        IsNewProduct: true,
        sysProductId: null,
        SysProductId: "",
        SysDescription: "",
      });
      return;
    } else {
      setProductInfo({
        ...productInfo,
        IsChecked: true,
        IsNewProduct: false,
        SysProductId: sysproduct.sysProductId,
        SysDescription: sysproduct.description,
        PhDescription: sysproduct.description,
        Name: sysproduct.productName,
        Image: sysproduct.imageURL,
      });
    }
  }

  return (
    <>
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          direction: "rtl",
          gap: "15px",
          backgroundColor: "rgb(255, 86, 114)",
          border: "1px solid gray",
          height: "fit-content",
          borderRadius: "8px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <IconButton
            disabled={productInfo.Name == ""}
            sx={{ marginBottom: "15px" }}
            onClick={() => {
              setOpen(true);
            }}
          >
            <SearchIcon />
          </IconButton>
          <TextField
            value={productInfo.Name}
            id="price-input"
            label="اكتب اسم الدواء باللغة العربية"
            type="text"
            variant="outlined"
            sx={{
              width: "300px",
              input: {
                color: "white",
              },
              label: {
                color: "white",
              },
            }}
            size="small"
            margin="dense"
            onChange={(event) => {
              setProductInfo({ ...productInfo, Name: event.target.value });
            }}
            helperText="يجب ان تتحقق ان المنتج موجود أولا في النظام قبل الأضافة!"
            slotProps={{
              input: {
                min: 0,
                max: 1000,
                step: 0.1,
              },
            }}
          />
        </Box>

        {productInfo.IsChecked && productInfo.IsNewProduct ? (
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
              placeholder="حمل صورة الدواء"
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={(event) => {
                hanldeUploadImage(event.target.files[0]);
              }}
            />
            <Typography level="title-lg">حمل صورة الدواء هنا</Typography>
          </Box>
        ) : null}

        {productInfo.IsChecked && !productInfo.IsNewProduct ? (
          <img
            style={{ borderRadius: "8px" }}
            width={"170px"}
            height={"170px"}
            alt="product-image"
            src={productInfo.Image}
          />
        ) : null}
      </Grid>
      <SysProductsSearchDialog
        open={open}
        setOpen={setOpen}
        handleCallBack={handleAfterCheckProduct}
        searchText={productInfo.Name}
      />
    </>
  );
}
