import { Outlet } from "react-router";

import TopBar from "../components/TopBar";

export default function Layout() {
  const hideTopBarOn = ["/", "/signup", "/onboarding"];
  const shouldHideTopBar = hideTopBarOn.includes(location.pathname);

  return (
    <main className="main-content">
      {!shouldHideTopBar && <TopBar />}
      <div className={shouldHideTopBar ? "" : "mt-[60px]"}>
        <Outlet />
      </div>
    </main>
  );
}
