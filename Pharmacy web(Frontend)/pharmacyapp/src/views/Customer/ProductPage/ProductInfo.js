import "./ProductPage.css";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import { Box } from "@mui/material";
import { useState } from "react";
import { ItemsCountContext } from "../../../contexts/ItemsCountContext";
import { useContext } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import Typography from "@mui/joy/Typography";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import { useConfirm } from "../../../contexts/ConfirmContext";
import { HandleAddItemToCart } from "../../../services/orderServices";
import { useAlert } from "../../../contexts/AlertContext";

export function ProductInfo({ info, pharmacyId }) {
  const [counter, setCounter] = useState(1);
  const { authInfo } = useAuth();
  const { setAlert } = useAlert();
  const confirm = useConfirm();

  const { setItemsCount, itemsCount } = useContext(ItemsCountContext);

  async function handelAddToCartClicked() {
    if (!authInfo.loggedIn) {
      setAlert({ type: "error", message: "يجب تسجيل الدخول أولا", open: true });
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart"));

    const newCartItem = {
      PhProductId: info.productId,
      PharmacyId: pharmacyId,
      Quantity: counter,
    };

    let IsPharmacyChanged = false;

    if (cart) {
      if (cart.pharmacyId != undefined) {
        IsPharmacyChanged = cart.pharmacyId != pharmacyId;

        if (IsPharmacyChanged) {
          const result = await confirm(
            "هذا الدواء من صيدلية اخرى غير التي  في سلة مشترياتك , هل تريد تغيير الصيدلية ؟"
          );

          if (!result) return;
        }
      }
    }

    const numberOfItems = await HandleAddItemToCart(
      newCartItem,
      authInfo.customerId,
      cart,
      IsPharmacyChanged
    );

    setItemsCount(numberOfItems, !cart);
  }

  return (
    <section className="product-overview-card" dir="rtl">
      <div className="product-photo-frame">
        <span className="product-photo-tag">منتج صيدلاني</span>
        <img id="product-img" alt={info.Name || "صورة المنتج"} src={info.ImageURL} />
      </div>

      <div className="product-details-panel">
        <div className="product-title-group">
          <span className="product-eyebrow">تفاصيل المنتج</span>
          <Typography level="h1">{info.Name}</Typography>
        </div>

        {itemsCount == 0 ? (
          <Box className="product-delivery-hint" id="check-ph-alarm">
            <ProductionQuantityLimitsIcon />
            <Typography level="body-sm">
              اسحب للأسفل للتحقق من رسوم التوصيل أو توفر الخدمة
            </Typography>
          </Box>
        ) : null}

        <div className="product-price-row">
          <span>السعر</span>
          <strong dir="ltr">
            {info.Price} <small>د.أ</small>
          </strong>
        </div>

        <div className="product-purchase-row" id="btns-container">
          <button
            className="add-tocart-btn"
            onClick={() => handelAddToCartClicked()}
          >
            <LocalMallIcon />
            أضف للسلة
          </button>

          <div className="product-quantity-control">
            <span>الكمية</span>
            <div id="add-sub-btn" className="card__counter" aria-label="تحديد الكمية">
              <button
                className="card__btn"
                aria-label="تقليل الكمية"
                onClick={() => {
                  setCounter((prev) => {
                    if (prev == 0) return 0;

                    return prev - 1;
                  });
                }}
              >
                −
              </button>

              <div className="card__counter-score">{counter}</div>

              <button
                className="card__btn card__btn-plus"
                aria-label="زيادة الكمية"
                onClick={() => {
                  setCounter((prev) => {
                    if (prev == info.Stoke) return prev;

                    return prev + 1;
                  });
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="product-spec-grid">
          <div className="product-spec-item">
            <span>شكل المنتج</span>
            <strong>{info.TypeName}</strong>
          </div>
          <div className="product-spec-item">
            <span>سعة الدواء</span>
            <strong>{info.Qauntity}</strong>
          </div>
          <div className="product-spec-item">
            <span>تاريخ الإنتاج</span>
            <strong dir="ltr">{info.ProducedDate.split("T")[0]}</strong>
          </div>
          <div className="product-spec-item">
            <span>تاريخ الانتهاء</span>
            <strong dir="ltr">{info.EndDate.split("T")[0]}</strong>
          </div>
          <div className="product-spec-item product-stock-item">
            <span>المتوفر بالمخزون</span>
            <strong>{info.Stoke} علبة</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductInfo;
