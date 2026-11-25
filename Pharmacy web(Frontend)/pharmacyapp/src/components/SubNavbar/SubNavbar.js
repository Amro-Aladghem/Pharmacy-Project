import './SubNavbar.css';
import { Link, Outlet, useLocation } from 'react-router-dom';

export function SubNavbar()
{
    const location = useLocation();
    const isCustomerAuth = !location.pathname.startsWith('/manager');

    return (
        <>
            <div id="SubNav-container" className={isCustomerAuth ? 'customer-auth-subnav' : 'manager-auth-subnav'}>
                <Link className="auth-brand" to="/">
                    <img id="Sub-img" src="/MainLogo.png" alt="PharmaPal" />
                    <span>PharmaPal</span>
                </Link>
            </div>
            <Outlet />
        </>
    )
}


export default SubNavbar;
