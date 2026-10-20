import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import SettingOptions from "./Components/SettingOptions";
import { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { usePhUserAuth } from "../../../contexts/PhUserAuthContext";
import UnAuthorized from "../../../components/PhUsersComponents/UnAuthorized/UnAuthorized";
import { Box } from "@mui/material";
import { GetPharmacySummeryInfo } from "../../../services/pharmacyServices";

export default function PharmacyAccountPage() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(true);
  const { phAuthInfo } = usePhUserAuth();

  const [info, setInfo] = useState({
    pharmacyId: -1,
    name: "",
    imageURL: "",
    isHasDelivery: false,
  });

  const fetchData = async () => {
    const response = await GetPharmacySummeryInfo(phAuthInfo.userId);
    setLoading(false);

    if (!response.IsSuccess) {
      setResult(false);
      return;
    }

    setInfo(response.result);
  };

  useEffect(() => {
    if (phAuthInfo.role === "manager") {
      fetchData();
    }
  }, []);

  return (
    <Box
      sx={{
        marginLeft: { xs: "0px", md: "63px" },
        marginTop: { xs: "70px", md: "100px" },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {phAuthInfo.role !== "manager" ? (
        <UnAuthorized />
      ) : loading ? (
        <CircularProgress size={50} />
      ) : !result ? (
        <p>فشل تحميل المعولمات الرجاء اعادة تحميل الصفحة!</p>
      ) : (
        <>
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
              <img src={info.imageURL} loading="lazy" alt="" />
            </AspectRatio>

            <CardContent>
              <Typography level="h1" id="card-description">
                صيدلية {info.name}
              </Typography>
            </CardContent>
          </Card>

          <SettingOptions />
        </>
      )}
    </Box>
  );
}
