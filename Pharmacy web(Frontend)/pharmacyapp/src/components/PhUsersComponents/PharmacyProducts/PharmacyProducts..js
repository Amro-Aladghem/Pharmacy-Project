import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@mui/material/CircularProgress";
import { useState, useEffect } from "react";
import { GetPharmacyProducts } from "../../../services/phProductsServices";
import Grid from "@mui/material/Grid2";
import { usePhUserAuth } from "../../../contexts/PhUserAuthContext";
import PhProductCard from "./Components/PhProductCard";
import { Box } from "@mui/material";
import Typography from "@mui/joy/Typography";
import AddNewProduct from "./Components/AddNewProduct";
import { UpdateProductInfoProvider } from "../../../contexts/UpdateProductInfoContext";

export default function PharmacyProducts() {
  const { phAuthInfo } = usePhUserAuth();
  const [pharmacyId, setPharmacyId] = useState(0);

  const [products, setProducts] = useState([]);
  const [paginated, setPaginated] = useState({
    lastPhProductId: null,
    limit: 8,
    IsRowCountCalculated: false,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({
    IsSuccess: true,
    message: "لم يتم العثور على أية منتجات أخرى",
  });

  async function fetchData(isFirstTime = false, ParamPharmacyId) {
    const Paginated = {
      LastPhProductId: isFirstTime ? 0 : paginated.lastPhProductId,
      Limit: paginated.limit,
      IsRowsCountCalculated: paginated.IsRowCountCalculated,
      PharmacyId: isFirstTime ? ParamPharmacyId : pharmacyId,
    };

    setLoading(true);

    const response = await GetPharmacyProducts(Paginated);

    setLoading(false);

    if (!response.IsSuccess) {
      setResult({
        ...result,
        IsSuccess: false,
      });
      return;
    }

    if (!response.result) {
      setResult({
        ...result,
        IsSuccess: false,
      });
      return;
    }

    setProducts((prev) => [...prev, ...response.result.products]);

    setPaginated((prev) => {
      return {
        ...prev,
        lastPhProductId: response.result.lastPhProductId,
        ...(isFirstTime && {
          IsRowsCountCalculated: true,
        }),
      };
    });
  }

  const handleChange = (productId, changeType) => {
    let updatedProducts = null;

    if (changeType === "delete") {
      updatedProducts = products.filter((product) => {
        if (product.phProductId === productId) return false;
        return true;
      });
    }

    setProducts(updatedProducts);
  };

  const ProductCards = products.map((Product) => {
    return (
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <PhProductCard
          key={Product.phProductId}
          productId={Product.phProductId}
          image={Product.productImageURL}
          name={Product.name}
          price={Product.price}
          stoke={Product.quantity}
          handleChange={handleChange}
        />
      </Grid>
    );
  });

  useEffect(() => {
    const PharmacyId = JSON.parse(
      sessionStorage.getItem("pharmacy")
    ).pharmacyId;
    fetchData(true, PharmacyId);

    setPharmacyId(PharmacyId);
  }, []);

  return (
    <>
      <UpdateProductInfoProvider>
        <Typography
          level="h2"
          sx={{
            marginTop: { md: "90px", xs: "50px" },
            textAlign: "center",
          }}
        >
          منتجات صيدليتك المتوفرة
        </Typography>
        <Box
          sx={{
            marginLeft: { md: "63px", xs: "0px" },
          }}
        >
          <InfiniteScroll
            dataLength={products.length}
            next={fetchData}
            hasMore={result.IsSuccess}
          >
            <Grid
              container
              spacing={2}
              sx={{
                my: 4,
                direction: "rtl",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {ProductCards}
              {!result.IsSuccess ? <p>{result.message}</p> : null}

              {loading ? (
                <CircularProgress size={40} color="rgb(255, 86, 114)" />
              ) : null}
            </Grid>
          </InfiniteScroll>
        </Box>
        <AddNewProduct />
      </UpdateProductInfoProvider>
    </>
  );
}
