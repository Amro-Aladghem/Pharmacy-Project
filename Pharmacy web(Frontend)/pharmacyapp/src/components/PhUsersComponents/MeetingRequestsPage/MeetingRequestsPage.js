import LiveMeetingRequests from "./Components/LiveMeetingRequests";
import { Box } from "@mui/material";
import { UpdateRequestStatusProvider } from "../../../contexts/UpdateRequestStautsDialogContext";
import { StartMeetingDialogProvider } from "../../../contexts/StartMeetingDialogContext";

export default function MeetingRequestsPage() {
  return (
    <StartMeetingDialogProvider>
      <UpdateRequestStatusProvider>
        <Box
          sx={{
            marginTop: "90px",
          }}
        >
          <LiveMeetingRequests />
        </Box>
      </UpdateRequestStatusProvider>
    </StartMeetingDialogProvider>
  );
}
