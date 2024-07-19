import "./App.css";

// import { Container } from "@mui/material";
import TableComponent from "./components/TableComponent";
import { DataProvider } from "./context/DataContext";

const App = () => {
  return (
    <>
      <DataProvider>
        <TableComponent />
      </DataProvider>
    </>
  );
};

export default App;
