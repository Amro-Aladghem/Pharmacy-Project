import { createContext, useContext } from "react";
import { useState } from "react";

export const UpdateRequestStautsDialogContext = createContext(null);

export const UpdateRequestStatusProvider = ({ children }) => {
  const [updatedRequestStatus, setUpdateRequestStatus] = useState({
    open: false,
    requestId: "",
    statusId: -1,
    handleCallBack: () => {},
  });

  return (
    <UpdateRequestStautsDialogContext.Provider
      value={{ updatedRequestStatus, setUpdateRequestStatus }}
    >
      {children}
    </UpdateRequestStautsDialogContext.Provider>
  );
};

export const useUpdateRequestStatusDialog = () => {
  const openObj = useContext(UpdateRequestStautsDialogContext);

  return openObj;
};
