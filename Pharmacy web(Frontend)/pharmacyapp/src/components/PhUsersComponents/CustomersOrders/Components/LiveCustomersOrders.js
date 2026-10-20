import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow, { tableRowClasses } from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { GetActiveOrdersForThePharmacy } from "../../../../services/orderServices";
import { usePhUserAuth } from "../../../../contexts/PhUserAuthContext";
import { Box } from "@mui/material";
import { useCustomerContactInfo } from "../../../../contexts/CustomerContactInfoContext";
import CustomerContactInfoDialog from "../../../Dialogs/CustomerContactInfoDialog";
import { useOrderItemsDilaog } from "../../../../contexts/OrderItemsContext";
import OrderItemsDialog from "../../../Dialogs/OrderItemsDialog";
import UpdateOrderStatusDialog from "../../../Dialogs/UpdateOrderStatusDialog";
import { useUpdateOrderStatusDialog } from "../../../../contexts/UpdateOrderStatusDialogContext";

const columns = [
  { id: "orderId", label: "رقم الطلب", minWidth: 70 },
  {
    id: "ChangeOrderStatus",
    label: "تغيير حالة الطلب",
    minWidth: 70,
    align: "left",
    text: "تعديل الحالة",
  },
  {
    id: "orderStatus",
    label: "حالة الطلب",
    minWidth: 100,
    align: "left",
  },
  {
    id: "CustomerInfo",
    label: "معلومات العميل",
    minWidth: 70,
    align: "left",
    text: "معلومات العميل ",
  },
  {
    id: "orderItems",
    label: "عناصر الطلب",
    minWidth: 70,
    align: "left",
    text: "عناصر الطلب",
  },
  {
    id: "DateAndTime",
    label: "وقت انشاء الطلب",
    minWidth: 70,
    align: "left",
  },
  {
    id: "totalPrice",
    label: "قيمة الطلب",
    minWidth: 70,
    align: "left",
  },
];

export default function LiveCustomersOrders() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { phAuthInfo } = usePhUserAuth();
  const { setCustomerContact } = useCustomerContactInfo();
  const { setOrderInfo } = useOrderItemsDilaog();
  const { setUpdatedOrderStatus } = useUpdateOrderStatusDialog();

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [result, setResult] = useState(false);

  const handleShowDialog = (
    type,
    orderId,
    customerId = null,
    currentStatusId = -1
  ) => {
    if (type === "CustomerInfo") {
      setCustomerContact({
        open: true,
        customerId: customerId,
        orderId: orderId,
      });
    } else if (type === "orderItems") {
      setOrderInfo({ orderId: orderId, open: true });
    } else {
      setUpdatedOrderStatus({
        orderId: orderId,
        statusId: currentStatusId,
        handleCallBack: handleChangeOrdersAfterUpdated,
        open: true,
      });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangeOrdersAfterUpdated = (updatedOrder) => {
    let updatedOrders = [];

    if (updatedOrder.status.id > 4) {
      updatedOrders = orders.filter((order) => {
        if (order.orderId == updatedOrder.orderId) {
          return false;
        } else {
          return true;
        }
      });
    } else {
      updatedOrders = orders.map((order) => {
        if (order.orderId == updatedOrder.orderId) {
          return updatedOrder;
        } else {
          return order;
        }
      });
    }

    setOrders(updatedOrders);
  };

  async function fetchData() {
    const response = await GetActiveOrdersForThePharmacy(
      phAuthInfo.userId,
      phAuthInfo.role
    );
    setLoading(false);

    if (!response.IsSuccess) {
      setResult(true);
      return;
    }

    setOrders(response.result.orders);
  }

  const rows = orders.map((row) => {
    return {
      orderId: row.orderId,
      orderStatus: row.status.arabicName,
      DateAndTime: row.dateOfOrder,
      customerId: row.customerId,
      statusId: row.status.id,
      totalPrice: row.totalPrice + " jd",
    };
  });

  useEffect(() => {
    fetchData();

    setInterval(() => {
      fetchData();
    }, [300000]); //5 minutes
  }, []);

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
                          column.id === "ChangeOrderStatus" ||
                          column.id === "CustomerInfo" ||
                          column.id === "orderItems"
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
                                    row.orderId,
                                    row.customerId,
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

      <CustomerContactInfoDialog />
      <OrderItemsDialog />
      <UpdateOrderStatusDialog />
    </>
  );
}
