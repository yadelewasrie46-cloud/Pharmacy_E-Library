import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

 function Layout({ username }) {
  return (
    <>
      <Header username={username} />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;