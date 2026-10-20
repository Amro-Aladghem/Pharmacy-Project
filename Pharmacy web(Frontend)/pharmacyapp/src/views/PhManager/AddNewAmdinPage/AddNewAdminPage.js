import { useState } from "react";
import { usePhUserAuth } from "../../../contexts/PhUserAuthContext";
import UnAuthorized from "../../../components/PhUsersComponents/UnAuthorized/UnAuthorized";
import PreRegisterAdmin from "./Componants/PreRegisterAdmin";
import RegisterAdmin from "./Componants/RegisterAdmin";

export function AddNewAdminPage() {
  const { phAuthInfo } = usePhUserAuth();
  const [nextPage, setNextPage] = useState({ isNext: false, personId: null });

  return (
    <>
      {phAuthInfo.role == "admin" ? (
        <UnAuthorized />
      ) : !nextPage.isNext ? (
        <PreRegisterAdmin handleNextStep={setNextPage} />
      ) : (
        <RegisterAdmin personId={nextPage.personId} />
      )}
    </>
  );
}

export default AddNewAdminPage;
