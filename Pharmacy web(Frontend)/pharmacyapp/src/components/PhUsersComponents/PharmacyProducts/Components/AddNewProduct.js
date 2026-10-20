import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

export default function AddNewProduct() {
  const navigate = useNavigate();

  return (
    <Fab
      aria-label="add"
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        backgroundColor: "rgb(255, 86, 114)",
      }}
      onClick={() => {
        navigate("/manager/dashboard/ph/product/add");
      }}
    >
      <AddIcon />
    </Fab>
  );
}
