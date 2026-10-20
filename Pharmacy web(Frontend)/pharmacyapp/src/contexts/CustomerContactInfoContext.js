import { createContext, useContext } from "react";
import { useState } from "react";

export const CustomerContactInfoContext = createContext(null);

export const CustomerContactInfoProvider = ({ children }) => {
  const [customerContact, setCustomerContact] = useState({
    open: false,
    customerId: "",
    orderId: "",
  });

  return (
    <CustomerContactInfoContext.Provider
      value={{ customerContact, setCustomerContact }}
    >
      {children}
    </CustomerContactInfoContext.Provider>
  );
};

export const useCustomerContactInfo = () => {
  const openObj = useContext(CustomerContactInfoContext);

  return openObj;
};
