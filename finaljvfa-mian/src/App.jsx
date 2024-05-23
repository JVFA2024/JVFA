import Home from "./pages/Home";
import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import PrivateHomeRoute from "./privateRoutes/PrivateHomeRoute";
import PrivateLoginRoute from "./privateRoutes/PrivateLoginRoute";

AOS.init();
function App() {
  return (
    <div>
      <Routes>
        <Route element={<PrivateHomeRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route element={<PrivateLoginRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
