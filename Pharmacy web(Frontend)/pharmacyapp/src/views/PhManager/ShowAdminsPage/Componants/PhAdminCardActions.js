import { IconButton } from "@mui/material";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import { Box } from "@mui/material";
import { ChangeActivateStatusForAdmin } from "../../../../services/managerServices";
import { DeleteAdmin } from "../../../../services/managerServices";
import { useConfirm } from "../../../../contexts/ConfirmContext";
import { usePhUserAuth } from "../../../../contexts/PhUserAuthContext";
import { useAlert } from "../../../../contexts/AlertContext";

export function PhAdminCardActions({ admins, setAdmins, adminId }) {
  const confirm = useConfirm();
  const { phAuthInfo } = usePhUserAuth();
  const { setAlert } = useAlert();

  async function handleChangeActivateClick() {
    const result = await confirm(
      "هل أنت متأكد من تغيير حالة فعالية الحساب سيمكنك اعادة تغيريها"
    );

    if (!result) return;

    const response = await ChangeActivateStatusForAdmin(
      { userId: adminId, isActive: true },
      phAuthInfo.userId
    );

    if (!response.IsSuccess) {
      setAlert({
        type: "error",
        message: "فشل تحديث الحالة للحساب , الرجاء اعادة المحاولة!",
        open: true,
      });
      return;
    }

    const updatedAdmins = admins.map((admin) =>
      admin.adminId == adminId ? { ...admin, isActive: !admin.isActive } : admin
    );

    setAdmins(updatedAdmins);
  }

  async function handleDeleteAdminClick() {
    const result = await confirm(
      "هل أنت متأكد انك تريد حذف هذا الحساب من النظام , لن تستطيع ارجاعه, اذا اردت ابقائه يمكنك ذلك من خلال زر الغاء التفعيل"
    );

    if (!result) return;

    const response = await DeleteAdmin(phAuthInfo.userId, adminId);

    if (!response.IsSuccess) {
      setAlert({
        type: "error",
        message:
          "فشل عملية الحذف للحساب , الرجاء اعادة المحاولة اذا لم ينجح الأمر قد يكون المنتجموجود في طلب نشط",
        open: true,
      });
      return;
    }

    const updatedAdmins = admins.filter((admin) => {
      if (admin.adminId == adminId) return false;
      return true;
    });

    setAdmins(updatedAdmins);
  }

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        marginTop: "5px",
      }}
    >
      <IconButton onClick={() => handleChangeActivateClick()}>
        <FlipCameraAndroidIcon sx={{ color: "rgb(255, 86, 114)" }} />
      </IconButton>
      <IconButton onClick={() => handleDeleteAdminClick()}>
        <RestoreFromTrashIcon sx={{ color: "rgb(255, 86, 114)" }} />
      </IconButton>
    </Box>
  );
}

export default PhAdminCardActions;
