import { Outlet, useLocation } from "react-router";
import TopBar from "../components/TopBar";
import NavBar from "../components/Navbar";

export default function Layout() {
  const location = useLocation();

  const hideOnRoutes = ["/", "/signup", "/onboarding"];
  const shouldHideUI = hideOnRoutes.includes(location.pathname);

  return (
    <main className="main-content">
      {!shouldHideUI && <TopBar />}
      {!shouldHideUI && <NavBar />}

      <div className={shouldHideUI ? "" : "mt-[60px]"}>
        <Outlet />
      </div>
    </main>
  );
}
