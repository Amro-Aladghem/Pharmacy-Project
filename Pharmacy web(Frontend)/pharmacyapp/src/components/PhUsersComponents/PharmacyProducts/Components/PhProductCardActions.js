import { Box } from "@mui/material";
import { IconButton } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { useConfirm } from "../../../../contexts/ConfirmContext";
import { DeleteProduct } from "../../../../services/phProductsServices";
import { usePhUserAuth } from "../../../../contexts/PhUserAuthContext";
import { useAlert } from "../../../../contexts/AlertContext";

import { useUpdateProductInfo } from "../../../../contexts/UpdateProductInfoContext";

export function PhProductCardActions({ productId, handleChange }) {
  const confirm = useConfirm();
  const { phAuthInfo } = usePhUserAuth();
  const { setAlert } = useAlert();
  const { setUpdateProductInfo } = useUpdateProductInfo();

  const handleDeleteProduct = async () => {
    const IsContinue = await confirm(
      "هل أنت متأكد أنك تريد حذف هذا المنتج من صيدليتك؟"
    );

    if (!IsContinue) return;

    const response = await DeleteProduct(
      phAuthInfo.userId,
      phAuthInfo.role,
      productId
    );

    if (!response.IsSuccess) {
      setAlert({
        type: "error",
        message:
          "فشل حذف المنتج , الرجاء اعادة المحاولة اذا لم ينجح الأمر قد يكون المنتج مرتبط بطلب فعال",
        open: true,
      });
      return;
    }

    handleChange(productId, "delete");
    setAlert({ type: "success", message: "تم حذف المنتج بنجاح", open: true });
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          gap: "15px",
          width: "100%",
        }}
      >
        <IconButton
          onClick={() =>
            setUpdateProductInfo({
              open: true,
              productId: productId,
              handleCallBack: () => {},
            })
          }
        >
          <ModeEditIcon sx={{ color: "rgb(255, 86, 114)" }} />
        </IconButton>
        <IconButton onClick={() => handleDeleteProduct()}>
          <DeleteOutlineIcon sx={{ color: "rgb(255, 86, 114)" }} />
        </IconButton>
      </Box>
    </>
  );
}

export default PhProductCardActions;
