import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PhotoCameraFrontIcon from "@mui/icons-material/PhotoCameraFront";
import StorefrontIcon from "@mui/icons-material/Storefront";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import Person2Icon from "@mui/icons-material/Person2";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

export const MenuItems = [
  {
    icon: <ShoppingCartIcon sx={{ color: "rgb(255, 86, 114)" }} />,
    text: "الطلبات",
    to: "live-orders",
  },
  {
    icon: <PhotoCameraFrontIcon sx={{ color: "rgb(255, 86, 114)" }} />,
    text: "الأستشارات",
    to: "live-meeting-requests",
  },
  {
    icon: <StorefrontIcon sx={{ color: "rgb(255, 86, 114)" }} />,
    text: "الصيدلية",
    to: "ph/account",
  },
  {
    icon: <VaccinesIcon sx={{ color: "rgb(255, 86, 114)" }} />,
    text: "الأدوية والمنجات",
    to: "products",
  },
  {
    icon: <Diversity3Icon sx={{ color: "rgb(255, 86, 114)" }} />,
    text: "مستخدمي النظام",
    to: "admins/show",
  },
  {
    icon: <Person2Icon sx={{ color: "rgb(255, 86, 114)" }} />,
    text: "حسابك",
  },
  {
    icon: <SupportAgentIcon sx={{ color: "rgb(255, 86, 114)" }} />,
    text: "الدعم الفني",
  },
];
