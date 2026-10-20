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
import { UpdateMeetingRequestStatus } from "../../../services/requestServices";
import { useAlert } from "../../../contexts/AlertContext";
import { useUpdateRequestStatusDialog } from "../../../contexts/UpdateRequestStautsDialogContext";

const RequestStatus = {
  1: "تم الإرسال بنجاح",
  2: "انتظار",
  3: "مقبولة",
  4: "مرفوض",
  5: "تم الغاءه",
  6: "منتهي",
};

const Options = (
  <>
    <option value={2}>انتظار</option>
    <option value={4}> رفض الأستشارة </option>
  </>
);

export function UpdateRequestStatusDialog() {
  const { phAuthInfo } = usePhUserAuth();
  const { updatedRequestStatus, setUpdateRequestStatus } =
    useUpdateRequestStatusDialog();

  const { setAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [statusChoosed, setStatusChoosed] = useState(-1);

  async function Update() {
    setLoading(true);

    const response = await UpdateMeetingRequestStatus(
      phAuthInfo.userId,
      phAuthInfo.role,
      {
        RequestId: updatedRequestStatus.requestId,
        StatusId: statusChoosed,
      }
    );

    setLoading(false);

    if (!response.IsSuccess || !response.result) {
      setAlert({ type: "error", message: "فشل تحديث الحالة", open: true });
      return;
    }

    updatedRequestStatus.handleCallBack(response.result);

    setAlert({ type: "success", message: "تم تحديث الحالة بنجاح", open: true });
    setUpdateRequestStatus({
      ...updatedRequestStatus,
      open: false,
      requestId: "",
      statusId: -1,
    });
  }

  useEffect(() => {
    if (updatedRequestStatus.open) {
      setStatusChoosed(updatedRequestStatus.statusId);
    }
  }, [updatedRequestStatus.open]);

  return (
    <Dialog
      open={updatedRequestStatus.open}
      onClose={() => {
        if (updatedRequestStatus.open)
          setUpdateRequestStatus({
            ...updatedRequestStatus,
            open: false,
            requestId: "",
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
              {RequestStatus[statusChoosed]}
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

export default UpdateRequestStatusDialog;
