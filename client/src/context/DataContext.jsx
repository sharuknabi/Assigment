import React, { createContext, useState, useEffect } from "react";
import { CircularProgress, Box } from "@mui/material";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchData(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]);

  const fetchData = async (page, limit) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/data/paginate?page=${page + 1}&limit=${limit}`
      );
      const result = await response.json();
      setData(result.data);
      setTotalPages(result.totalPages); // Assuming the API returns totalPages
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const search = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/data/search?q=${query}`
      );
      const result = await response.json();
      setData(result);
      setTotalPages(1); // Reset pagination for search results
    } catch (error) {
      console.error("Error searching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        data,
        loading,
        search,
        currentPage,
        totalPages,
        setCurrentPage,
        rowsPerPage,
        setRowsPerPage,
      }}
    >
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress />
        </Box>
      ) : (
        children
      )}
    </DataContext.Provider>
  );
};
