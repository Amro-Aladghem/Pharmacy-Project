import LiveCustomersOrders from "./Components/LiveCustomersOrders";
import { Box } from "@mui/material";
import { CustomerContactInfoProvider } from "../../../contexts/CustomerContactInfoContext";
import { OrderItemsProvider } from "../../../contexts/OrderItemsContext";
import { UpdateOrderStatusProvider } from "../../../contexts/UpdateOrderStatusDialogContext";
import Typography from "@mui/joy/Typography";

// Displays all customer orders with context providers for order management
export function CustomersOrders() {
  return (
    <UpdateOrderStatusProvider>
      <OrderItemsProvider>
        <CustomerContactInfoProvider>
          <Box sx={{ marginTop: "100px" }}>
            <Typography level="title-md" sx={{ direction: "rtl" }}>
              *ملاحظة :قيمة الطلب شاملة سعر التوصيل
            </Typography>
            <LiveCustomersOrders />
          </Box>
        </CustomerContactInfoProvider>
      </OrderItemsProvider>
    </UpdateOrderStatusProvider>
  );
}

export default CustomersOrders;
