import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Typography from "@mui/joy/Typography";
import { usePhUserAuth } from "../../../contexts/PhUserAuthContext";
import { GetProductFullInfoForPhUser } from "../../../services/phProductsServices";
import { useAlert } from "../../../contexts/AlertContext";
import { UpdateProduct } from "../../../services/phProductsServices";
import ProductInfoForm from "./OrderInfoForm";
import { useUpdateProductInfo } from "../../../contexts/UpdateProductInfoContext";

export default function UpdatePhProductInfoDialog() {
  const { phAuthInfo } = usePhUserAuth();
  const { setAlert } = useAlert();
  const { updateProductInfo, setUpdateProductInfo } = useUpdateProductInfo();

  const [result, setResult] = useState(true);
  const [loading, setLoading] = useState(false);
  const [productInfo, setProductInfo] = useState({});

  async function fetchData() {
    setLoading(true);

    const response = await GetProductFullInfoForPhUser(
      updateProductInfo.productId
    );
    setLoading(false);

    if (!response.IsSuccess) {
      setResult(false);
      return;
    }

    setResult(true);
    setProductInfo(response.result);
  }

  async function UpdateProductInfo() {
    setLoading(true);

    const response = await UpdateProduct(
      phAuthInfo.userId,
      phAuthInfo.role,
      productInfo,
      updateProductInfo.productId
    );
    setLoading(false);

    if (!response.IsSuccess) {
      setAlert({
        type: "error",
        message: "فشل تحديث معلومات المنتج , الرجاء اعاجة المحاولة",
        open: true,
      });
      return;
    }

    setAlert({
      type: "success",
      message: "تم تحديث المعلومات بنجاح!",
      open: true,
    });
  }

  useEffect(() => {
    if (updateProductInfo.open) {
      fetchData();
    }
  }, [updateProductInfo.open]);

  return (
    <Dialog
      open={updateProductInfo.open}
      onClose={() => {
        setUpdateProductInfo({
          open: false,
          producId: "",
          handleCallBack: () => {},
        });
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      dir="rtl"
    >
      <DialogTitle id="alert-dialog-title">تحديث معلومات المنتج</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress size={40} />
        ) : !result ? (
          <Typography level="body-lg">
            فشل التحميل , الرجاء اعادة المحاولة
          </Typography>
        ) : (
          <ProductInfoForm
            productInfo={productInfo}
            setProductInfo={setProductInfo}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button
          disabled={loading}
          onClick={() => {
            UpdateProductInfo();
          }}
        >
          تحديث
        </Button>
      </DialogActions>
    </Dialog>
  );
}
