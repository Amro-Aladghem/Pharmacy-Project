import UpperNavbar from "../UpperNavbar/UpperNavbar";
import BottemNavbar from "../BottemNavbar/BottemNavbar";
import { Outlet } from "react-router-dom";
import { ItemsCountProvider } from "../../contexts/ItemsCountContext";
import "./customer-modern.css";
import CustomerFooter from "./CustomerFooter";

export function Navbar()
{

    return (
    <div className="customer-app">
      <ItemsCountProvider>
          <UpperNavbar />
          <main className="customer-content">
            <Outlet />
          </main>
          <CustomerFooter />
          <BottemNavbar/>
       </ItemsCountProvider>
    </div>

    )

}



export default Navbar;
