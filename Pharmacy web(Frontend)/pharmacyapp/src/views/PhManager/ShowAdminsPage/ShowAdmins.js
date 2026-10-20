import "./ShowAdmins.css";
import AdminCardsContainer from "./Componants/AdminCardsContainer";
import AddNewAdminBar from "./Componants/AddNewAmdinBar";

export function ShowAdmins() {
  return (
    <>
      <AddNewAdminBar />
      <AdminCardsContainer />
    </>
  );
}

export default ShowAdmins;
