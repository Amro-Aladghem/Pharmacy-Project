import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import AspectRatio from "@mui/joy/AspectRatio";
import Typography from "@mui/joy/Typography";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import "../../assets/Styles/Mainbtn.css";

export function CustomeCard({ image, body, page }) {
  const navigate = useNavigate();

  return (
    <Grid
      size={{ xs: 6, md: 4 }}
      sx={{ display: "flex", justifyContent: "center" }}
    >
      <Card
        variant="outlined"
        sx={{
          width: { xs: "150px", sm: "320px", md: "320px" },
          borderRadius: "var(--radius-lg)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow-sm)",
          overflow: "hidden",
          transition: "box-shadow 0.2s",
          "&:hover": { boxShadow: "var(--shadow-md)" },
          "& .MuiAspectRatio-root": { borderRadius: 0 },
        }}
      >
        <AspectRatio minHeight="120px" maxHeight="200px">
          <img src={image} alt="" />
        </AspectRatio>
        <CardContent orientation="vertical">
          <div>
            <Typography
              sx={{ fontSize: { xs: "md", md: "lg" }, fontWeight: "lg" }}
            >
              {body}
            </Typography>
          </div>
          <Button
            className="main-btn"
            size="md"
            sx={{
              ml: "auto",
              alignSelf: "center",
              fontWeight: 600,
              backgroundColor: "var(--teal)",
              color: "white",
              borderRadius: "var(--radius-md)",
            }}
            onClick={() => navigate(page)}
          >
            الذهاب
            <div className="arrow-wrapper">
              <div className="arrow"></div>
            </div>
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default CustomeCard;
