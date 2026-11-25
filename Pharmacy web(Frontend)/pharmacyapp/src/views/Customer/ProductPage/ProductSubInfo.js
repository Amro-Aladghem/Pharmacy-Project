import "./ProductPage.css";
import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import { useState } from "react";
import ProductCard from "../../../components/Card/ProductCard/ProductCard";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useContext, useEffect } from "react";
import { DeliveryContext } from "../../../contexts/DeliveryContext";
import { CircularProgress } from "@mui/material";
import ProductDescription from "./ProductDescription";
import { GetPharmacyProducts } from "../../../services/phProductsServices";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export function ProductSubInfo({ info }) {
  const { setOpen } = useContext(DeliveryContext);
  const location = useLocation();
  const navigate = useNavigate();

  const { authInfo } = useAuth();
  const [phProducts, setPhProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(true);

  function handelCheckDelivery() {
    if (!authInfo.loggedIn) {
      alert("يجب تسجيل  الدخول أولا !");
      return;
    }

    setOpen(true);
  }

  async function fetchPhProductsData(pharmacyId) {
    setLoading(true);

    const Paginated = {
      PharmacyId: pharmacyId,
      LastPhProductId: 0,
      Limit: 8,
      IsRowsCountCalculated: false,
    };

    const response = await GetPharmacyProducts(Paginated);

    setLoading(false);

    if (!response.IsSuccess) {
      setResult(false);
      return;
    }

    setPhProducts((prev) => [...prev, ...response.result.products]);
  }

  const ProductsCards = phProducts.map((Product) => {
    return (
      <ProductCard
        key={Product.phProductId}
        Id={Product.phProductId}
        Image={Product.productImageURL}
        Name={Product.name}
        PharmacyName={Product.phName}
        Price={Product.price}
        PharmacyId={Product.pharmacyId}
      />
    );
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const pharmacyId = params.get("pharmacy");

    fetchPhProductsData(pharmacyId);
  }, []);

  return (
    <>
      <section className="product-pharmacy-section">
      <Link className="product-pharmacy-link" to={`/pharmacies/${info.pharmacyId}`}>
        <Card
          id="pharmacy-card"
          className="product-pharmacy-card"
          variant="outlined"
          orientation="horizontal"
          sx={{
            width: "95%",
            margin: "14px 0px",
            "&:hover": {
              boxShadow: "md",
              borderColor: "neutral.outlinedHoverBorder",
            },
          }}
        >
          <AspectRatio ratio="1" sx={{ width: 84, borderRadius: "14px", overflow: "hidden" }}>
            <img src={info.Image} loading="lazy" alt="" />
          </AspectRatio>

          <CardContent>
            <Typography level="title-lg" id="card-description">
              صيدلية {info.Name}
            </Typography>
            <Typography
              level="body-sm"
              aria-describedby="card-description"
              sx={{ mb: 0.1 }}
            >
              {info.IsHasDelivery
                ? "يتوفر خدمة التوصيل في هذه الصيدلية"
                : "لا تتوفر خدمة التوصيل في هذه الصيدلية"}
            </Typography>
          </CardContent>
        </Card>
      </Link>

      <div id="check-delivery-container" className="product-delivery-check">
        <Typography level="title-lg" id="card-description">
          <DeliveryDiningIcon />
          تحقق من رسوم التوصيل لمنطقتك
        </Typography>

        <button
          className="main-btn"
          style={{ width: "fit-content", marginRight: "auto", flexShrink: "0" }}
          onClick={() => {
            handelCheckDelivery();
          }}
          disabled={!info.IsHasDelivery}
        >
          تحقق
          <div className="arrow-wrapper">
            <div className="arrow"></div>
          </div>
        </button>
      </div>
      </section>

      <section className="product-description-section">
        <ProductDescription />
      </section>

      <section className="product-recommendations-section">
      <div className="product-recommendations-heading">
        <span>من نفس الصيدلية</span>
        <h2>منتجات أخرى قد تهمك</h2>
      </div>

      <div id="ph-products-container" className="product-recommendations-list">
        {loading ? (
          <CircularProgress size={40} />
        ) : !result ? (
          <p>فشل تحميل المنجات</p>
        ) : (
          <>
            {ProductsCards}

            <IconButton
              onClick={() => {
                navigate(`/pharmacies/${info.pharmacyId}`);
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </>
        )}
      </div>
      </section>
    </>
  );
}

export default ProductSubInfo;
