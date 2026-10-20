import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Typography from "@mui/joy/Typography";
import { usePhUserAuth } from "../../contexts/PhUserAuthContext";
import { useOrderItemsDilaog } from "../../contexts/OrderItemsContext";
import { GetOrderItems } from "../../services/orderServices";

const itemsTableHeader = (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      borderBottom: "1px solid black",
      gap: "15px",
    }}
  >
    <Typography sx={{ width: "90px" }} level="title-md">
      اسم المنتج
    </Typography>
    <Typography sx={{ width: "90px", textAlign: "center" }} level="title-md">
      الكمية
    </Typography>
    <Typography level="title-md">السعر</Typography>
  </Box>
);

export function OrderItemsDialog() {
  const { orderInfo, setOrderInfo } = useOrderItemsDilaog();
  const { phAuthInfo } = usePhUserAuth();

  const [isShowed, setIsShowed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(true);
  const [items, setItems] = useState([]);

  async function fetchData() {
    if (isShowed) return;

    setLoading(true);

    const response = await GetOrderItems(
      orderInfo.orderId,
      phAuthInfo.userId,
      phAuthInfo.role
    );

    setLoading(false);

    if (!response.IsSuccess) {
      setResult(false);
      return;
    }

    setResult(true);
    setIsShowed(true);
    setItems(response.result);
  }

  const itemsRows = items.map((item) => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px solid black",
        }}
      >
        <Typography
          sx={{ width: "90px", textAlign: "center" }}
          level="title-md"
        >
          {item.name}
        </Typography>
        <Typography
          sx={{ width: "90px", textAlign: "center" }}
          level="title-md"
        >
          {item.quantity}
        </Typography>
        <Typography level="title-md">{item.price} jd</Typography>
      </Box>
    );
  });

  return (
    <Dialog
      open={orderInfo.open}
      onClose={() => {
        setOrderInfo({
          ...orderInfo,
          open: false,
          orderId: "",
        });

        setIsShowed(false);
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      dir="rtl"
    >
      <DialogTitle id="alert-dialog-title">{"عناصر الطلب"}</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress size={40} />
        ) : !result ? (
          <Typography level="body-lg">
            فشل التحميل , الرجاء اعادة المحاولة
          </Typography>
        ) : !isShowed ? null : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            {itemsTableHeader}
            {itemsRows}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            fetchData();
          }}
        >
          عرض
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OrderItemsDialog;
