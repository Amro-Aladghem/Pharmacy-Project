import { Link } from "react-router-dom";

const footerLinks = [
  { label: "الرئيسية", to: "/" },
  { label: "الأدوية والمنتجات", to: "/products?category=1" },
  { label: "الصيدليات", to: "/pharmacies" },
  { label: "الصيدليات القريبة", to: "/pharmacies/nearest" },
  { label: "سلة المشتريات", to: "/cart" },
];

export function CustomerFooter() {
  return (
    <footer className="customer-footer" dir="rtl">
      <div className="customer-footer-inner">
        <div className="customer-footer-brand">
          <img src="/MainLogo.png" alt="PharmaPal" />
          <div>
            <strong dir="ltr">PharmaPal</strong>
            <p>الصيدليات والخدمات الصحية أقرب إليك.</p>
          </div>
        </div>

        <nav className="customer-footer-links" aria-label="روابط الموقع">
          <h2>روابط سريعة</h2>
          <div>
            {footerLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="customer-footer-note">
          <h2>نهتم بصحتك</h2>
          <p>تصفّح المنتجات والخدمات المتاحة من الصيدليات عبر PharmaPal.</p>
        </div>
      </div>

      <div className="customer-footer-bottom" dir="ltr">
        <span>© 2026 PharmaPal</span>
        <span>All rights reserved</span>
      </div>
    </footer>
  );
}

export default CustomerFooter;
