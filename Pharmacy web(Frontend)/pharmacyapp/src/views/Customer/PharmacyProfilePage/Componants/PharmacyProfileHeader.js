import { CircularProgress } from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";
import PlaceIcon from "@mui/icons-material/Place";
import Typography from "@mui/joy/Typography";

export function PharmacyProfileHeader({ info, loading, result }) {
  function goToProductsSection() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }
  return (
    <section className="pharmacy-profile-hero" dir="rtl">
      <div className="pharmacy-profile-cover">
        <img src="/Background.png" alt="" />
      </div>

      {loading ? (
        <div className="pharmacy-profile-state">
          <CircularProgress size={36} />
          <span>جاري تحميل معلومات الصيدلية</span>
        </div>
      ) : !result ? (
        <div className="pharmacy-profile-state pharmacy-profile-error">
          <Typography>فشل تحميل البيانات</Typography>
        </div>
      ) : (
        <div className="pharmacy-profile-identity">
          <div className="pharmacy-profile-brand">
            <img
              className="pharmacy-profile-image"
              src={info.imageURL}
              alt={`صيدلية ${info.pharmacyName}`}
            />
            <div className="pharmacy-profile-copy">
              <span>ملف الصيدلية</span>
              <h1>
                <StoreIcon />
                صيدلية {info.pharmacyName}
              </h1>
              <p>
                <PlaceIcon />
                {info.governorate}
              </p>
            </div>
          </div>

          <button
            className="main-btn pharmacy-profile-products-button"
            onClick={() => goToProductsSection()}
          >
            عرض المنتجات
            <div className="arrow-wrapper">
              <div className="arrow"></div>
            </div>
          </button>
        </div>
      )}
    </section>
  );
}

export default PharmacyProfileHeader;
