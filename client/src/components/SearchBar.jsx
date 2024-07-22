import React, { useState, useContext, useEffect, useRef } from "react";
import { TextField, Grid, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import { DataContext } from "../context/DataContext";
// import _ from "lodash";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { search } = useContext(DataContext);
  const debounceTimeout = useRef(null);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      search(query);
    }, 1000); // Adjust the debounce delay as needed (e.g., 500ms)
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  return (
    <Grid
      container
      spacing={2}
      alignItems="center"
      justifyContent="flex-end"
      style={{ marginBottom: "16px" }}
    >
      <Grid item xs={12} sm={3}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          fullWidth
        />
      </Grid>
    </Grid>
  );
};

export default SearchBar;
