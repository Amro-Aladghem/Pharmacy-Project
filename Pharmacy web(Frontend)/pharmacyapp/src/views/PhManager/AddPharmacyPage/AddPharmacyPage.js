import { useState } from "react";
import MapComponent from "../../../components/MapComponent";
import AddPharmacyForm from "./Components/AddPharmacyForm";
import Grid from "@mui/material/Grid2";
import { usePhUserAuth } from "../../../contexts/PhUserAuthContext";
import { AddNewPharmacy } from "../../../services/pharmacyServices";
import { useAlert } from "../../../contexts/AlertContext";
import { useNavigate } from "react-router-dom";
import UnAuthorized from "../../../components/PhUsersComponents/UnAuthorized/UnAuthorized";

export default function AddPharmacyPage() {
  const { setAlert } = useAlert();
  const { phAuthInfo } = usePhUserAuth();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [info, setInfo] = useState({
    Name: "",
    About: "",
    CountryId: 1,
    GovernateId: 1,
    RegionId: 0,
    Phone: "",
    PhEmail: "",
    longitude: 0.0,
    latitude: 0.0,
    StreetName: "",
    VedioCallPrice: 0.0,
    IsHasDelivery: false,
    ImageURL: null,
    IsHasVideoCall: null,
  });

  async function AddPharmacy() {
    setLoading(true);
    const response = await AddNewPharmacy(phAuthInfo.userId, info);

    setLoading(false);

    if (!response.IsSuccess) {
      setAlert({
        type: "error",
        message: "فشل اضافة الصيدلية الرجاء اعادة المحاولة",
        open: true,
      });
      return;
    }

    setAlert({
      type: "success",
      message: "تم اضافة الصيدلية بنجاح",
      open: true,
    });

    const pharmacy = {
      pharmacyId: response.result.pharmacyId,
      phName: response.result.pharmacyName,
      phImage: response.result.imageURL,
      isActive: response.result.isActive,
    };

    sessionStorage.setItem("pharmacy", JSON.stringify(pharmacy));

    navigate("/manager/verify?isFirstTime=true");
  }

  return (
    <>
      {!phAuthInfo.loggedIn && phAuthInfo.role !== "manager" ? (
        <UnAuthorized />
      ) : (
        <Grid
          container
          spacing={3}
          sx={{
            display: "flex",
            alignItems: "center",
            direction: "rtl",
            marginTop: "15px",
          }}
        >
          <Grid
            id="Map"
            size={{ xs: 12, md: 5 }}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <MapComponent Info={info} handler={{ setInfo }} />
          </Grid>

          <Grid
            id="Form"
            size={{ xs: 12, md: 6 }}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <AddPharmacyForm info={info} setInfo={setInfo} />
          </Grid>

          <Grid
            id="btn"
            size={12}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button
              className="main-btn"
              style={{ width: "fit-content" }}
              onClick={() => AddPharmacy()}
              disabled={loading}
            >
              {loading ? "جاري اضافة الصيدلية ..." : "اضافة الصيدلية"}
              <div className="arrow-wrapper">
                <div className="arrow"></div>
              </div>
            </button>
          </Grid>
        </Grid>
      )}
    </>
  );
}
