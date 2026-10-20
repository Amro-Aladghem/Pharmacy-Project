import { createContext, useContext } from "react";
import { useState } from "react";

const StartMeetingDialogContext = createContext(null);

export const StartMeetingDialogProvider = ({ children }) => {
  const [startMeeting, setStartMeeting] = useState({
    open: false,
    requestId: "",
    handleCallBack: () => {},
  });

  return (
    <StartMeetingDialogContext.Provider
      value={{ startMeeting, setStartMeeting }}
    >
      {children}
    </StartMeetingDialogContext.Provider>
  );
};

export const useStartMeetingDialog = () => {
  const openObj = useContext(StartMeetingDialogContext);

  return openObj;
};
