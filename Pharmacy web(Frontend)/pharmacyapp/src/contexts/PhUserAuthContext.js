import { createContext, useContext, useState, useEffect } from "react";

const PhUserAuthContext = createContext();

export const PhUserAuthProvider = ({ children }) => {
  const [phAuthInfo, setPhAuthInfo] = useState({
    userId: -1,
    role: "admin",
    name: "",
    phImage: "",
    userImage: "",
    loggedIn: false,
    phName: "",
  });

  function handlPhAuthChange(
    userId,
    loggedIn,
    role,
    name,
    userImage,
    expiredTimeToken
  ) {
    setPhAuthInfo({
      ...phAuthInfo,
      userId: userId,
      loggedIn: loggedIn,
      role: role,
      name: name,
      userImage: userImage,
    });
  }

  useEffect(() => {
    const phuser = JSON.parse(sessionStorage.getItem("phUser"));

    if (!phuser) return;

    setPhAuthInfo({
      ...phAuthInfo,
      loggedIn: true,
      role: phuser.role,
      name: phuser.name,
      userId: phuser.userId,
      userImage: phuser.userImage,
    });
  }, []);

  return (
    <PhUserAuthContext.Provider value={{ phAuthInfo, handlPhAuthChange }}>
      {children}
    </PhUserAuthContext.Provider>
  );
};

export const usePhUserAuth = () => {
  const phAuth = useContext(PhUserAuthContext);
  return phAuth;
};
