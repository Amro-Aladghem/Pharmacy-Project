import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import PhProductCardActions from "./PhProductCardActions";

export function PhProductCard({
  productId,
  name,
  price,
  stoke,
  image,
  handleChange,
}) {
  return (
    <Card
      variant="outlined"
      orientation="horizontal"
      sx={{
        width: { md: "540px", xs: "330px" },
        "&:hover": {
          boxShadow: "md",
          borderColor: "neutral.outlinedHoverBorder",
        },
        direction: "rtl",
      }}
    >
      <AspectRatio ratio="1" sx={{ width: 90 }}>
        <img src={image} loading="lazy" alt="" />
      </AspectRatio>
      <CardContent>
        <Typography level="title-lg" id="card-description">
          {name}
        </Typography>
        <Typography
          level="body-sm"
          aria-describedby="card-description"
          sx={{ mb: 1 }}
        >
          السعر الحالي: {price}jd , الكمية: {stoke}
        </Typography>
        <PhProductCardActions
          productId={productId}
          handleChange={handleChange}
        />
      </CardContent>
    </Card>
  );
}

export default PhProductCard;
