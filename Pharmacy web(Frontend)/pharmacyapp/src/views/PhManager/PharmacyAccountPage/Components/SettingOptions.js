import OptionCard from "../../../../components/Card/Horizontal/OptionCard/OptionCard";
import Grid from "@mui/material/Grid2";

//{ optionName, page, type, buttonName }

const Options = [
  {
    id: 1,
    optionName: "مستخدمو النظام",
    type: "users",
    buttonName: "عرض المستخدمين",
    page: "/manager/dashboard/admins/show",
  },
  {
    id: 2,
    optionName: "طلبات العملاء",
    type: "orderHistory",
    buttonName: "عرض الطلبات",
    page: "/manager/dashboard/live-orders",
  },
  {
    id: 3,
    optionName: "طلبات الاستشارات",
    type: "appointment",
    buttonName: "عرض الاستشارات",
    page: "/manager/dashboard/live-meeting-requests",
  },
  {
    id: 4,
    optionName: "منتجات الصيدلية",
    type: "inventory",
    buttonName: "إدارة المنتجات",
    page: "/manager/dashboard/products",
  },
  {
    id: 5,
    optionName: "إضافة منتج جديد",
    type: "addProduct",
    buttonName: "إضافة منتج",
    page: "/manager/dashboard/ph/product/add",
  },
  {
    id: 6,
    optionName: "لوحة التحكم",
    type: "dashboard",
    buttonName: "العودة للرئيسية",
    page: "/manager/dashboard/home",
  },
];

const OptionsCards = Options.map((option) => {
  return (
    <Grid
      key={option.id}
      size={{ xs: 12, md: 6 }}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <OptionCard
        optionName={option.optionName}
        type={option.type}
        buttonName={option.buttonName}
        page={option.page}
      />
    </Grid>
  );
});

export default function SettingOptions() {
  return (
    <section className="manager-account-actions">
      <header>
        <span>إدارة الصيدلية</span>
        <h2>اختصارات سريعة</h2>
      </header>
      <Grid
        container
        className="manager-account-actions-grid"
        spacing={5}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        marginTop: "15px",
        maxWidth: 1080,
        width: "100%",
        marginInline: "auto",
          direction: "rtl",
        }}
      >
        {OptionsCards}
      </Grid>
    </section>
  );
}
