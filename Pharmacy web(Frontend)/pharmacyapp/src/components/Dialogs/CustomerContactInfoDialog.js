import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useCustomerContactInfo } from "../../contexts/CustomerContactInfoContext";
import Typography from "@mui/joy/Typography";
import Link from "@mui/joy/Link";
import { usePhUserAuth } from "../../contexts/PhUserAuthContext";
import { GetCustomerContactInfo } from "../../services/customerServices";

export function CustomerContactInfoDialog() {
  const { customerContact, setCustomerContact } = useCustomerContactInfo();
  const { phAuthInfo } = usePhUserAuth();

  const [isShowed, setIsShowed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(true);
  const [customerInfo, setCustomerInfo] = useState({
    customerId: -1,
    name: "",
    phoneNumber: "",
    location: "",
  });

  async function fetchData() {
    if (isShowed) return;

    setLoading(true);

    const response = await GetCustomerContactInfo(
      customerContact.customerId,
      customerContact.orderId,
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
    setCustomerInfo(response.result);
  }

  return (
    <Dialog
      open={customerContact.open}
      onClose={() => {
        setCustomerContact({
          ...customerContact,
          open: false,
          customerId: "",
          orderId: "",
        });

        setIsShowed(false);
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      dir="rtl"
    >
      <DialogTitle id="alert-dialog-title">
        {"معلومات التواصل مع العميل"}
      </DialogTitle>
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
            <Typography level="title-md">
              معرف العميل: {customerInfo.customerId}
            </Typography>
            <Typography level="title-md">
              اسم العميل : {customerInfo.name}
            </Typography>
            <Typography level="title-md">
              رقم الهاتف : {customerInfo.phoneNumber}
            </Typography>
            <a
              href={customerInfo.location}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "black" }}
            >
              {"موقع العميل: \n" + customerInfo.location}
            </a>
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

export default CustomerContactInfoDialog;
