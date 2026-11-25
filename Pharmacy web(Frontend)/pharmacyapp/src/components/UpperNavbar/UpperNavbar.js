import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/material";
import "./UpperNavbar.css";
import Badge from "@mui/material/Badge";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useContext } from "react";
import { ItemsCountContext } from "../../contexts/ItemsCountContext";
import { useAuth } from "../../contexts/AuthContext";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 12,
  backgroundColor: "#f3f6f7",
  border: "1px solid #e5eaec",
  "&:hover": {
    backgroundColor: "#edf2f3",
  },
  marginLeft: 0,
  width: "70%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
  direction: "ltr",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  direction: "rtl",
  color: "#20252b",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),

    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const menustyle = {
  display: "block",
  fontSize: "0.95rem",
  fontWeight: 600,
  mx: 0.25,
  px: 1.25,
  borderRadius: "10px",
  color: "#424b52",
  "&:hover": { backgroundColor: "rgba(8, 176, 176, 0.08)", color: "#087f7f" },
};

const pages = [
  { section: "الرئيسية", pagePath: "/" },
  { section: "الصيدليات", pagePath: "/pharmacies?Governorate=1" },
  { section: "استشارة", pagePath: "/pharmacies/have-meeting" },
];

export function UpperNavbar() {
  const { authInfo } = useAuth();
  const [searchtext, setSearchText] = useState("");

  const navigate = useNavigate();
  const { itemsCount } = useContext(ItemsCountContext);

  const pagesList = pages.map((page, index) => {
    return (
      <Button
        key={index}
        sx={menustyle}
        onClick={() => navigate(page.pagePath)}
      >
        {" "}
        {page.section}{" "}
      </Button>
    );
  });

  return (
    <Box id="Upper-nav-contnier" className="customer-header">
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "rgba(255,255,255,0.96)",
          width: "100%",
          color: "#20252b",
          boxShadow: "0 4px 18px rgba(27, 39, 51, 0.07)",
          backdropFilter: "blur(12px)",
          zIndex: 1100,
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: "auto", md: 78 },
            py: { xs: 1, md: 0 },
            px: { xs: 1.5, md: 4 },
            gap: { xs: 1, md: 2 },
            flexWrap: { xs: "wrap", md: "nowrap" },
            maxWidth: 1480,
            width: "100%",
            mx: "auto",
            boxSizing: "border-box",
          }}
        >
          <Box
            component="button"
            type="button"
            onClick={() => navigate("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              p: 0,
              border: 0,
              background: "transparent",
              flexShrink: 0,
              ml: { xs: "auto", md: 1 },
            }}
          >
            <img
              src="/MainLogo.png"
              alt="شعار الصيدلية"
              style={{ width: 54, height: 54, objectFit: "contain" }}
            />
            <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "right" }}>
              <Typography sx={{ color: "#222a30", fontWeight: 800, fontSize: 19, lineHeight: 1.35, direction: "ltr" }}>
                PharmaPal
              </Typography>
              <Typography sx={{ color: "#75818a", fontSize: 11, lineHeight: 1.3 }}>
                صحتك أولويتنا
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {pagesList}

            <IconButton
              onClick={() => navigate("/cart")}
              aria-label="سلة المشتريات"
              sx={{ mr: 1, color: "#087f7f" }}
            >
              <Badge badgeContent={itemsCount} color="secondary">
                <ShoppingBagIcon />
              </Badge>
            </IconButton>

            <Button
              onClick={() =>
                navigate(authInfo.loggedIn ? "/customer/profile" : "/signin")
              }
            >
              <AccountCircleOutlinedIcon sx={{ fontSize: 28, color: "#65717a" }} />
              <span style={{ color: "#424b52", fontWeight: 700 }}>
                {authInfo.loggedIn ? authInfo.userName : "تسجيل الدخول"}
              </span>
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              flexGrow: { xs: 1, md: 0 },
              order: { xs: 3, md: 0 },
              width: { xs: "100%", md: "auto" },
              minWidth: { md: 310 },
            }}
          >
            <Search sx={{ width: "100%", flexGrow: 1 }}>
              <SearchIconWrapper>
                <SearchIcon sx={{ color: "#73808a" }} />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="ابحث باسم دواء"
                inputProps={{ "aria-label": "search" }}
                value={searchtext}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Search>
            <IconButton
              disabled={searchtext == "" || searchtext == null}
              onClick={() => {
                navigate(`/search?searchtext=${searchtext}`);
              }}
              sx={{
                backgroundColor: "#08b0b0",
                color: "white",
                borderRadius: "10px",
                "&:hover": { backgroundColor: "#069696" },
                "&.Mui-disabled": { backgroundColor: "#d9e1e3", color: "#77848a" },
              }}
            >
              <ArrowBackIcon size="small" />
            </IconButton>
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 0.25, order: { xs: 2, md: 0 } }}>
            <IconButton onClick={() => navigate("/cart")} aria-label="سلة المشتريات" sx={{ color: "#087f7f" }}>
              <Badge badgeContent={itemsCount} color="secondary"><ShoppingBagIcon /></Badge>
            </IconButton>
            <IconButton
              onClick={() => navigate(authInfo.loggedIn ? "/customer/profile" : "/signin")}
              aria-label="حسابي"
              sx={{ color: "#424b52" }}
            >
              <AccountCircleOutlinedIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default UpperNavbar;
