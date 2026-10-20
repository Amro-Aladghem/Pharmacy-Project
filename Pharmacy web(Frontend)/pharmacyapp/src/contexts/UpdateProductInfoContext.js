import { createContext, useContext } from "react";
import { useState } from "react";
import UpdatePhProductInfoDialog from "../components/Dialogs/UpdatePhProductInfoDialog/UpdatePhProductInfoDialog";

export const UpdateProductInfoContext = createContext(null);

export const UpdateProductInfoProvider = ({ children }) => {
  const [updateProductInfo, setUpdateProductInfo] = useState({
    open: false,
    productId: "",
    handleCallBack: () => {},
  });

  return (
    <UpdateProductInfoContext.Provider
      value={{ updateProductInfo, setUpdateProductInfo }}
    >
      {children}
      <UpdatePhProductInfoDialog />
    </UpdateProductInfoContext.Provider>
  );
};

export const useUpdateProductInfo = () => {
  const openObj = useContext(UpdateProductInfoContext);

  return openObj;
};
