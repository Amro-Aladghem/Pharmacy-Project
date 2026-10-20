import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { CircularProgress } from "@mui/material";
import { useState, useEffect, use } from "react";
import { Box } from "@mui/material";
import Typography from "@mui/joy/Typography";
import { GetMatchSysProductsByName } from "../../../services/phProductsServices";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";

export default function SysProductsSearchDialog({
  open,
  setOpen,
  handleCallBack,
  searchText,
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(true);
  const [products, setProducts] = useState([]);

  async function fetchData() {
    setLoading(true);

    const response = await GetMatchSysProductsByName(searchText);

    setLoading(false);

    if (!response.IsSuccess) {
      setResult(false);
      return;
    }

    setResult(true);
    setProducts(response.result);
  }

  function handleUserChoice(type, sysPorductId) {
    if (type === "newProduct") {
      handleCallBack(true, null);
    } else {
      const product = products.find((p) => p.sysProductId == sysPorductId);

      handleCallBack(false, product);
    }

    setOpen(false);
  }

  useEffect(() => {
    if (open) fetchData();
  }, [open]);

  const ProductsCards = products.map((product) => {
    return (
      <div
        onClick={() => {
          handleUserChoice("existProduct", product.sysProductId);
        }}
      >
        <Card
          id="pharmacy-card"
          variant="outlined"
          orientation="horizontal"
          sx={{
            width: "95%",
            margin: "14px 0px",
            "&:hover": {
              boxShadow: "md",
              borderColor: "neutral.outlinedHoverBorder",
            },
            alignItems: "center",
            direction: "rtl",
          }}
        >
          <AspectRatio ratio="1" sx={{ width: 90 }}>
            <img src={product.imageURL} loading="lazy" alt="" />
          </AspectRatio>

          <CardContent>
            <Typography level="h3" id="card-description">
              {product.productName}
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  });

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(!open);
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      dir="rtl"
    >
      <DialogTitle id="alert-dialog-title">{"نتائج البحث"}</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress size={40} />
        ) : !result || !products ? (
          <p>لم يتم العثور على اي منتجات!</p>
        ) : (
          <Box>
            <Box sx={{ display: "flex" }}>
              <Typography level="title-lg">
                اذا لم تجد ما تبحث عنه اضغط هذا الزر
              </Typography>
              <Button
                onClick={() => {
                  handleUserChoice("newProduct", null);
                }}
                sx={{ marginRight: "auto" }}
              >
                الأستمرار
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              {ProductsCards}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
}
