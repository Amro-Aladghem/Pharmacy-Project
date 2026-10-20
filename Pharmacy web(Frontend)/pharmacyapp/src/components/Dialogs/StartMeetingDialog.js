import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { usePhUserAuth } from "../../contexts/PhUserAuthContext";
import { useAlert } from "../../contexts/AlertContext";
import { useStartMeetingDialog } from "../../contexts/StartMeetingDialogContext";
import { TextField } from "@mui/material";
import { StartRequestMeeting } from "../../services/requestServices";

export function StartMeetingDialog() {
  const { phAuthInfo } = usePhUserAuth();
  const { startMeeting, setStartMeeting } = useStartMeetingDialog();

  const { setAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [meetingURL, setMeetingURL] = useState("");

  async function StartMeeting() {
    if (!meetingURL) return;

    setLoading(true);
    const response = await StartRequestMeeting(
      phAuthInfo.userId,
      phAuthInfo.role,
      { RequestId: startMeeting.requestId, MeetingURL: meetingURL }
    );

    setLoading(false);

    if (!response.IsSuccess) {
      setAlert({
        type: "error",
        message: "فشل بدء الأستشارة الرجاء اعادة الأرسال!",
        open: true,
      });
      return;
    }

    startMeeting.handleCallBack(response.result);
    setAlert({
      type: "success",
      message:
        "تم بدء الأستشارة بنجاح يمكنك العودة للتطبيق وانتظار العميل الأن",
      open: true,
    });
  }

  useEffect(() => {
    setMeetingURL("");
  }, [startMeeting.open]);

  return (
    <Dialog
      open={startMeeting.open}
      onClose={() => {
        setStartMeeting({
          open: false,
          requestId: -1,
          handleCallBack: null,
        });
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      dir="rtl"
    >
      <DialogTitle id="alert-dialog-title">{"بدء الأستشارة"}</DialogTitle>
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
            <TextField
              value={meetingURL}
              onChange={(e) => setMeetingURL(e.target.value)}
              label="رابط الأجتماع"
              type="url"
              variant="outlined"
              size="small"
              margin="dense"
              sx={{ width: 250 }}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            StartMeeting();
          }}
        >
          بدء الأستشارة
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default StartMeetingDialog;
