import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
  useLocation,
} from "react-router-dom";

import TableComponent from "./components/Data-Table";
import DataForm from "./components/DataForm";
import { DataProvider } from "./context/DataContext";
import About from "./components/About";
import DataList from "./admin-page/DataList";
import Login from "./admin-page/Login";
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
    </div>
  );
};

const App = () => (
  <DataProvider>
    <AppContent />
  </DataProvider>
);

export default App;

// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import { DataProvider } from "./context/DataContext";

// import TableComponent from "./components/Data-Table";
// import DataForm from "./components/Data-Table";
// import About from "./components/About";
// // import DataList from "./admin-page/DataList";
// // import Login from "./admin-page/Login";
// import PublicRoute from "./components/auth/Public-Route";
// // import PrivateRoute from "./components/auth/Private-Route";
// import PublicLayout from "./components/auth/Public-Route";
// // import AdminLayout from "./components/auth/AdminLayout";

// const App = () => (
//   <DataProvider>
//     <Router>
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<PublicLayout />}>
//           <Route index element={<PublicRoute element={<TableComponent />} />} />
//           <Route path="form" element={<PublicRoute element={<DataForm />} />} />
//           <Route path="about" element={<PublicRoute element={<About />} />} />
//           {/* <Route
//             path="list"
//             element={<PrivateRoute element={<DataList />} />}
//           /> */}
//         </Route>

//         {/* Admin Routes */}
//         {/* <Route path="/admin" element={<AdminLayout />}>
//           <Route path="login" element={<Login />} />
//           <Route
//             path="list"
//             element={<PrivateRoute element={<DataList />} />}
//           />
//         </Route> */}
//       </Routes>
//     </Router>
//   </DataProvider>
// );

// export default App;
