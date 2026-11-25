import Carousel from "../../../components/Carousel";
import CustomeCard from "../../../components/Card/CustomeCard";
import Typography from "@mui/joy/Typography";
import Grid from "@mui/material/Grid2";
import HorizontalCard from "../../../components/Card/Horizontal/HorizontalCard";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import "./Main.css";
import PopularProduct from "./PopularProduct/PopularProduct";
import RandomPharmacies from "./RandomPharmacies/RandomPharmacies";
import { useNavigate } from "react-router-dom";
import AiChatWidget from "../../../components/AiChatWidget/AiChatWidget";

const cards = [
  {
    Image: "pharmacyImage.jpg",
    body: "تعرف على الصيدليات ومنتجاتها",
    page: "/pharmacies",
  },
  {
    Image: "medicalsImage.jpg",
    body: "ابحث عن الأدوية او منتجات",
    page: "products",
  },
  {
    Image: "vediocallImage.jpg",
    body: "احجز جلسة أونلاين ",
    page: "/pharmacies/have-meeting",
  },
];

const cardsList = cards.map((card, index) => {
  return (
    <CustomeCard
      key={index}
      page={card.page}
      image={card.Image}
      body={card.body}
    />
  );
});

export function Main() {
  const navigate = useNavigate();

  return (
    <div className="customer-home" style={{ direction: "rtl" }}>
      <section className="home-banner">
        <Carousel />
      </section>

      <header className="home-intro">
        <span className="home-eyebrow">رعاية صحية أقرب إليك</span>
        <Typography level="h1">عالم الصيدليات بين يديك</Typography>
        <Typography level="body-lg" className="home-intro-copy">
          اكتشف الصيدليات والمنتجات والخدمات المتاحة من مكان واحد.
        </Typography>
      </header>

      <section className="home-section home-services">
        <div className="home-section-heading">
          <span className="home-eyebrow">ابدأ من هنا</span>
          <Typography level="h2">الخدمات المتاحة لك</Typography>
        </div>
        <Grid container spacing={{ xs: 1.5, md: 2.5 }}>
          {cardsList}
        </Grid>
      </section>

      <section className="home-activity-grid">
        <HorizontalCard Type="Order" title="طلباتك النشطة" />
        <HorizontalCard Type="Request" title="موعد مكالمة نشط" />
      </section>

      <section className="home-nearest-section">
        <div className="home-section-heading">
          <span className="home-eyebrow">قريب منك</span>
          <Typography level="h2" alignSelf={"center"}>
            ابحث عن أقرب صيدلية لموقعك
          </Typography>
          <PersonPinIcon />
        </div>

        <div id="Nearer-Ph-section-container">
          <div id="Nearer-Ph-section">
            <img id="Nearer-section-img" src="/pharmacylocation.png" alt="" />

            <div id="Nearer-section-body">
              <Typography level="h4" sx={{ mb: "12px", color: "#20252b" }}>
                صيدليات قريبة وتوصيل سريع
              </Typography>

              <button
                className="main-btn"
                onClick={() => {
                  navigate("/pharmacies/nearest");
                }}
              >
                الذهاب
                <div className="arrow-wrapper">
                  <div className="arrow"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-heading">
          <span className="home-eyebrow">اختيارات متاحة</span>
          <Typography level="h2">الأدوية والمنتجات الأكثر شيوعًا</Typography>
        </div>
        <PopularProduct />
      </section>

      <section className="home-section">
        <div className="home-section-heading">
          <span className="home-eyebrow">اكتشف من حولك</span>
          <Typography level="h2">اكتشف الصيدليات ومنتجاتها</Typography>
        </div>
        <RandomPharmacies />
      </section>

      <AiChatWidget />
    </div>
  );
}

export default Main;
