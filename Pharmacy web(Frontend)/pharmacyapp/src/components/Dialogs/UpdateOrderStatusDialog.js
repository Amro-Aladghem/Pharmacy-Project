import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Typography from "@mui/joy/Typography";
import { usePhUserAuth } from "../../contexts/PhUserAuthContext";
import { useUpdateOrderStatusDialog } from "../../contexts/UpdateOrderStatusDialogContext";
import { UpdateOrderStatus } from "../../services/orderServices";
import { useAlert } from "../../contexts/AlertContext";

const OrderStatus = {
  1: "تم الإرسال بنجاح",
  2: "انتظار",
  3: "يتم التحضير",
  4: "توصيل",
  5: "تم الغاءه",
  6: "مرفوض",
  7: "منتهي",
};

const Options = (
  <>
    <option value={2}>انتظار</option>
    <option value={3}> يتم التحضير</option>
    <option value={4}> في التوصيل</option>
    <option value={6}> رفض الطلب </option>
    <option value={7}> منتهي</option>
  </>
);

export function UpdateOrderStatusDialog() {
  const { phAuthInfo } = usePhUserAuth();
  const { updatedOrderStatus, setUpdatedOrderStatus } =
    useUpdateOrderStatusDialog();

  const { setAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [statusChoosed, setStatusChoosed] = useState(-1);

  async function Update() {
    setLoading(true);

    const response = await UpdateOrderStatus(
      statusChoosed,
      updatedOrderStatus.orderId,
      phAuthInfo.userId,
      phAuthInfo.role
    );

    setLoading(false);

    if (!response.IsSuccess || !response.result) {
      setAlert({ type: "error", message: "فشل تحديث الحالة", open: true });
      return;
    }

    updatedOrderStatus.handleCallBack(response.result);

    setAlert({ type: "success", message: "تم تحديث الحالة بنجاح", open: true });
  }

  useEffect(() => {
    if (updatedOrderStatus.orderId != "") {
      setStatusChoosed(updatedOrderStatus.statusId);
    }
  }, [updatedOrderStatus.orderId]);

  return (
    <Dialog
      open={updatedOrderStatus.open}
      onClose={() => {
        setUpdatedOrderStatus({
          ...updatedOrderStatus,
          open: false,
          orderId: "",
          statusId: -1,
        });
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      dir="rtl"
    >
      <DialogTitle id="alert-dialog-title">{"تغيير حالة الطلب "}</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress size={40} />
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <Typography level="title-md">
              {OrderStatus[statusChoosed]}
            </Typography>
            <select
              value={statusChoosed}
              style={{
                padding: "6px 6px",
                width: "150px",
                borderRadius: "8px",
              }}
              onChange={(event) => setStatusChoosed(event.target.value)}
            >
              {Options}
            </select>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            Update();
          }}
        >
          تغيير
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UpdateOrderStatusDialog;
