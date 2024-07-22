import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from "react-router-dom";
// import "./App.css";
import TableComponent from "./components/TableComponent";
import DataForm from "./components/DataForm";
import { DataProvider } from "./context/DataContext";
import About from "./components/About";

const App = () => {
  return (
    <DataProvider>
      <Router>
        <div>
          <nav className="header">
            <div
              style={{
                width: "50px",
                height: "50px",
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <img src="/logo/kU_logo.png" alt="logo" />
            </div>

            <ul className="nav-links">
              <li>
                <NavLink exact to="/" activeclassname="active-link">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/form" activeclassname="active-link">
                  Data Form
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" activeclassname="active-link">
                  About
                </NavLink>
              </li>
            </ul>
          </nav>
          <Routes>
            <Route path="/" element={<TableComponent />} />
            <Route path="/form" element={<DataForm />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </Router>
    </DataProvider>
  );
};

export default App;
