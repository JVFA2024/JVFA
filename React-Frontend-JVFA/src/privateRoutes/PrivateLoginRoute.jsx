import { Navigate, Outlet } from "react-router-dom";

const PrivateLoginRoute = () => {
  const user = localStorage.getItem("user");

  return user ? <Navigate to={"/"} /> : <Outlet />;
};

export default PrivateLoginRoute;
