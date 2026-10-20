import { createContext, useContext } from "react";
import { useState } from "react";

export const UpdateOrderStatusDialogContext = createContext(null);

export const UpdateOrderStatusProvider = ({ children }) => {
  const [updatedOrderStatus, setUpdatedOrderStatus] = useState({
    open: false,
    orderId: "",
    statusId: -1,
    handleCallBack: () => {},
  });

  return (
    <UpdateOrderStatusDialogContext.Provider
      value={{ updatedOrderStatus, setUpdatedOrderStatus }}
    >
      {children}
    </UpdateOrderStatusDialogContext.Provider>
  );
};

export const useUpdateOrderStatusDialog = () => {
  const openObj = useContext(UpdateOrderStatusDialogContext);

  return openObj;
};
