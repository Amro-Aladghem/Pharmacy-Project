import { createContext, useContext } from "react";
import { useState } from "react";

export const OrderItemsContext = createContext(null);

export const OrderItemsProvider = ({ children }) => {
  const [orderInfo, setOrderInfo] = useState({
    open: false,
    orderId: "",
  });

  return (
    <OrderItemsContext.Provider value={{ orderInfo, setOrderInfo }}>
      {children}
    </OrderItemsContext.Provider>
  );
};

export const useOrderItemsDilaog = () => {
  const openObj = useContext(OrderItemsContext);

  return openObj;
};
