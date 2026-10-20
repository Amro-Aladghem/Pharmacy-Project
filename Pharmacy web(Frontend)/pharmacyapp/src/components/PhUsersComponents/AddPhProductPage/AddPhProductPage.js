import ChooseSysProductSection from "./Components/ChooseSysPoroductSection";
import PhProductInfoSection from "./Components/PhProductInfoSection";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import { usePhUserAuth } from "../../../contexts/PhUserAuthContext";
import { useAlert } from "../../../contexts/AlertContext";
import { AddNewPhProductAPI } from "../../../services/phProductsServices";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import UnAuthorized from "../UnAuthorized/UnAuthorized";

export function AddPhProductPage() {
  const { phAuthInfo } = usePhUserAuth();
  const { setAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [productInfo, setPorductInfo] = useState({
    PharmacyId: -1,
    Name: "",
    PhDescription: "",
    Price: 1,
    Stoke: 0,
    ProducedDate: null,
    EndDate: null,
    MedicalTypeId: 1,
    MedicalQuantity: 1,
    CategoryId: 1,
    SysProductId: null,
    Image: null,
    SysDescription: "",
    IsNewProduct: true,
    IsChecked: false,
  });

  function CheckInputs() {
    if (
      !productInfo.Name ||
      !productInfo.PhDescription ||
      !productInfo.ProducedDate ||
      !productInfo.EndDate ||
      !productInfo.CategoryId
    ) {
      setAlert({
        type: "error",
        message: "يرجى ملئ حميع الحقول , يوجد حقول مفقودة!",
        open: true,
      });
      return false;
    }

    if (!productInfo.Image) {
      setAlert({
        type: "error",
        message:
          "يرجى رفع صورة المنتج , اذاتم رفعها فعليك تغييرها لانها لا تصلح في النظام",
        open: true,
      });
      return false;
    }

    return true;
  }

  async function handleAddNewProduct() {
    if (!CheckInputs()) return;

    const response = await AddNewPhProductAPI(
      productInfo,
      phAuthInfo.userId,
      phAuthInfo.role
    );

    if (!response.IsSuccess) {
      setAlert({
        type: "error",
        message:
          " فشل اضافة المنتج الرجاء اعادة المحاولة !  اذا لم ينجح فتأكد من المعلومات المخلة كتاريخ الأنتهاء والكمية المتوفرة يجب ان تكون امبر من صفر ",
        open: true,
      });
      setLoading(false);
      return;
    }

    setAlert({
      type: "success",
      message: "تم اضافة المنتج للصيدلية بنجاح",
      open: true,
    });

    navigate("/manager/dashboard/home");
  }

  return (
    <>
      {!phAuthInfo.loggedIn ? (
        <UnAuthorized />
      ) : (
        <>
          <Grid
            container
            spacing={{ xs: 5, md: 10 }}
            sx={{
              display: "flex",
              marginTop: "90px",
              marginLeft: { xs: "0px", md: "63px" },
              justifyContent: "center",
              direction: { xs: "ltr", md: "rtl" },
            }}
          >
            <ChooseSysProductSection
              productInfo={productInfo}
              setProductInfo={setPorductInfo}
            />
            <PhProductInfoSection
              productInfo={productInfo}
              setProductInfo={setPorductInfo}
            />
          </Grid>

          <button
            className="main-btn"
            style={{
              width: "fit-content",
              position: "absolute",
              top: "90%",
              left: "50%",
            }}
            disabled={loading}
            onClick={() => {
              handleAddNewProduct();
            }}
          >
            اضافة المنتج
            <div className="arrow-wrapper">
              <div className="arrow"></div>
            </div>
          </button>
        </>
      )}
    </>
  );
}

export default AddPhProductPage;
