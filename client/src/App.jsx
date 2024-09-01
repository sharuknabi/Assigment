import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
  useLocation,
} from "react-router-dom";

const TableComponent = lazy(() => import("./components/Data-Table"));
const DataForm = lazy(() => import("./components/DataForm"));
const About = lazy(() => import("./components/About"));
const DataList = lazy(() => import("./admin-page/DataList"));
const Login = lazy(() => import("./admin-page/Login"));
import { DataProvider } from "./context/DataContext";
import ProtectedRoute from "./components/auth/Protected-Route";

const AppContent = () => {
  const location = useLocation();
  const noHeaderPaths = ["/login", "/dataList"];

  return (
    <div>
      {!noHeaderPaths.includes(location.pathname) && (
        <nav className="header">
          <div
            style={{
              width: "50px",
              height: "50px",
              display: "flex",
              justifyContent: "flex-start",
              marginLeft: "20px",
              paddingTop: "4px",
            }}
          >
            <img src="/logo/shield.png" alt="logo" />
          </div>

          <ul className="nav-links">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/form"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Data Form
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                About
              </NavLink>
            </li>
          </ul>
        </nav>
      )}

      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<TableComponent />} />
          <Route path="/form" element={<DataForm />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />

          {/* Private Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dataList" element={<DataList />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
};

const App = () => (
  <DataProvider>
    <AppContent />
  </DataProvider>
);

export default App;
