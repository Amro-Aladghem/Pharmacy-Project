import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { Box } from "@mui/material";
import { GetActiveMeetingRequests } from "../../../../services/requestServices";
import { usePhUserAuth } from "../../../../contexts/PhUserAuthContext";
import UpdateRequestStatusDialog from "../../../Dialogs/MeetingRequestsDialogs/UpdateRequestStatusDialog";
import { useUpdateRequestStatusDialog } from "../../../../contexts/UpdateRequestStautsDialogContext";
import { useConfirm } from "../../../../contexts/ConfirmContext";
import { HandleEndMeetingProcess } from "../../../../services/requestServices";
import { useAlert } from "../../../../contexts/AlertContext";
import StartMeetingDialog from "../../../Dialogs/StartMeetingDialog";
import { useStartMeetingDialog } from "../../../../contexts/StartMeetingDialogContext";

const columns = [
  { id: "requestId", label: "رقم الأستشارة ", minWidth: 70 },
  {
    id: "changeRequestStatus",
    label: "تغيير حالة الطلب",
    minWidth: 70,
    align: "left",
    text: "تعديل الحالة",
  },
  {
    id: "requestStatus",
    label: "حالة الأستشارة",
    minWidth: 100,
    align: "left",
  },
  {
    id: "customerId",
    label: "معرف العميل",
    minWidth: 70,
    align: "left",
  },
  {
    id: "startMeeting",
    label: "بدء الأستشارة",
    minWidth: 70,
    align: "left",
    text: "بدء الأستشارة",
  },
  {
    id: "dateAndTime",
    label: "وقت انشاء الطلب",
    minWidth: 70,
    align: "left",
  },
  {
    id: "endMeeting",
    label: "انهاء الأستشارة",
    minWidth: 70,
    align: "left",
    text: "انهاء الأستشارة",
  },
];

export default function LiveMeetingRequests() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(true);
  const [requests, setRequests] = useState([]);

  const { setUpdateRequestStatus } = useUpdateRequestStatusDialog();
  const confirm = useConfirm();
  const { setAlert } = useAlert();
  const { setStartMeeting } = useStartMeetingDialog();

  const { phAuthInfo } = usePhUserAuth();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleShowDialog = async (type, requestId, statusId) => {
    if (type == "changeRequestStatus") {
      setUpdateRequestStatus({
        open: true,
        requestId: requestId,
        statusId: statusId,
        handleCallBack: handleChangeRequestAfterUpdated,
      });
    } else if (type === "endMeeting") {
      const result = await confirm("هل انت متأكد أنك تريد انهاء هذا الأجتماع!");

      if (!result) return;

      const responseResult = await HandleEndMeetingProcess({
        RequestId: requestId,
        UserId: phAuthInfo.userId,
        role: phAuthInfo.role,
      });

      if (!responseResult) {
        setAlert({
          type: "error",
          message:
            "فشل انهاء الأستشارة يبدو انها لم تبدأ , اذا بدأتها جرب مرة اخرى رجاء ",
          open: true,
        });
        return;
      }

      hanldeDeleteRequest(requestId);
      setAlert({ type: "success", message: "تم التحديث بنجاح", open: true });
    } else {
      setStartMeeting({
        open: true,
        requestId: requestId,
        handleCallBack: handleChangeRequestAfterUpdated,
      });
    }
  };

  const handleChangeRequestAfterUpdated = (updatedRequest) => {
    let updatedRequests = [];

    if (updatedRequest.status.id >= 4) {
      updatedRequests = requests.filter((request) => {
        if (request.requestId === updatedRequest.requestId) {
          return false;
        } else {
          return true;
        }
      });
    } else {
      updatedRequests = requests.map((request) => {
        if (request.requestId === updatedRequest.requestId) {
          return updatedRequest;
        } else {
          return request;
        }
      });
    }

    setRequests(updatedRequests);
  };

  const hanldeDeleteRequest = (requestId) => {
    const updatedRequests = requests.filter((request) => {
      if (request.requestId === requestId) {
        return false;
      } else {
        return true;
      }
    });

    setRequests(updatedRequests);
  };

  const fetchData = async () => {
    setLoading(true);

    const response = await GetActiveMeetingRequests(
      phAuthInfo.userId,
      phAuthInfo.role
    );

    setLoading(false);

    if (!response.IsSuccess || !response.result) {
      setResult(false);
      return;
    }

    setResult(true);

    setRequests(response.result);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const rows = requests.map((row) => {
    return {
      requestId: row.requestId,
      requestStatus: row.status.arabicName,
      customerId: row.customerId,
      dateAndTime: row.dateOfRequest,
      statusId: row.status.id,
    };
  });

  return (
    <>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginLeft: { xs: "0px", md: "63px" },
          }}
        >
          <CircularProgress size={90} />
        </Box>
      ) : !result ? (
        <p>لم يتم العثور على ايو طلبات استشارة فعالة حاليا</p>
      ) : (
        <Paper
          sx={{ overflow: "hidden", marginLeft: { xs: "0px", md: "70px" } }}
        >
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        if (
                          column.id === "changeRequestStatus" ||
                          column.id === "startMeeting" ||
                          column.id === "endMeeting"
                        ) {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <Button
                                variant="contained"
                                size="small"
                                sx={{ backgroundColor: "rgb(255, 86, 114)" }}
                                onClick={() => {
                                  handleShowDialog(
                                    column.id,
                                    row.requestId,
                                    row.statusId
                                  );
                                }}
                              >
                                {column.text}
                              </Button>
                            </TableCell>
                          );
                        }

                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
      <UpdateRequestStatusDialog />
      <StartMeetingDialog />
    </>
  );
}
