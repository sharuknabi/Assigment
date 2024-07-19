import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { useTable, useBlockLayout, useResizeColumns } from "react-table";
import {
  Table,
  TableBody,
  TableCell,
  Select,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  InputAdornment,
  Grid,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  ArrowDownward,
  ArrowUpward,
  MoreVert,
  Search,
} from "@mui/icons-material";
import "./style.css";
import { DataContext } from "../context/DataContext";

const TableComponent = () => {
  const { data, loading } = useContext(DataContext);
  const [openRow, setOpenRow] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterConfig, setFilterConfig] = useState({ key: null, value: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const handleRowClick = (rowIndex) => {
    setOpenRow(openRow === rowIndex ? null : rowIndex);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleFilterClick = (event, key) => {
    setAnchorEl(event.currentTarget);
    setFilterConfig({ ...filterConfig, key });
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (event) => {
    setFilterConfig({ ...filterConfig, value: event.target.value });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = data.filter((item) => {
    if (!filterConfig.key || !filterConfig.value) return true;
    return item[filterConfig.key]
      .toString()
      .toLowerCase()
      .includes(filterConfig.value.toLowerCase());
  });

  const searchedData = filteredData.filter((item) => {
    return Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const sortedData = [...searchedData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key])
      return sortConfig.direction === "asc" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key])
      return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        minWidth: 100,
      },
      {
        Header: "Username",
        accessor: "username",
        minWidth: 100,
      },
      {
        Header: "Time Order Preserved",
        accessor: "Time Order Preserved",
        minWidth: 100,
      },
      {
        Header: "Ground Truth Source",
        accessor: "Ground Truth Source",
        minWidth: 100,
      },
      {
        Header: "Negative Assesed",
        accessor: "Negative Assesed",
        minWidth: 100,
      },
      {
        Header: "Label",
        accessor: "Label",
        minWidth: 100,
      },
      {
        Header: "manually curated",
        accessor: "manually curated",
        minWidth: 100,
      },
      {
        Header: "Source Data Nature",
        accessor: "Source Data Nature",
        minWidth: 100,
      },
      {
        Header: "Entity Granulaty",
        accessor: "Entity Granulaty",
        minWidth: 100,
      },
      {
        Header: "Action",
        accessor: "Action",
        minWidth: 100,
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: sortedData,
      },
      useBlockLayout,
      useResizeColumns
    );

  if (loading) {
    return <div>Loading...</div>; // Display loading indicator or a message
  }

  return (
    <>
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
      {/* table starts from here */}
      <TableContainer component={Paper} style={{ maxHeight: "100%" }}>
        <Table {...getTableProps()} stickyHeader>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow
                {...headerGroup.getHeaderGroupProps()}
                key={headerGroup.id}
              >
                {headerGroup.headers.map((column, cellIndex) => (
                  <TableCell
                    key={column.id}
                    {...column.getHeaderProps()}
                    // className={`resizable-header ${
                    //   columnIndex === 0
                    //     ? "sticky-header sticky-name-header"
                    //     : ""
                    // } ${
                    //   columnIndex === headerGroup.headers.length - 1
                    //     ? "sticky-header sticky-action-header"
                    //     : ""
                    // }`}
                    style={{
                      borderRight: "1px solid #ccc",
                      minWidth: column.minWidth,
                      ...column.getHeaderProps().style,
                    }}
                  >
                    <div
                      className={`header-content ${
                        cellIndex === 0
                          ? "sticky-header sticky-name-header"
                          : ""
                      } ${
                        cellIndex === headerGroup.headers.length - 1
                          ? "sticky-header sticky-action-header"
                          : ""
                      }`}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleSort(column.id)}
                      >
                        {column.render("Header")}
                        {sortConfig.key === column.id &&
                          (sortConfig.direction === "asc" ? (
                            <ArrowUpward />
                          ) : (
                            <ArrowDownward />
                          ))}
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(event) => handleFilterClick(event, column.id)}
                      >
                        <MoreVert />
                      </IconButton>
                      {column.canResize && (
                        <div
                          {...column.getResizerProps()}
                          className={`resize-handle ${
                            column.isResizing ? "isResizing" : ""
                          }`}
                        />
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {rows.map((row, index) => {
              prepareRow(row);
              return (
                <React.Fragment key={index}>
                  <TableRow onClick={() => handleRowClick(index)}>
                    {row.cells.map((cell, cellIndex) => (
                      <TableCell
                        key={cellIndex}
                        {...cell.getCellProps()}
                        className={`${
                          cellIndex === 0
                            ? "sticky-column sticky-name-column"
                            : ""
                        }${
                          cellIndex === row.cells.length - 1
                            ? "sticky-column sticky-action-column"
                            : ""
                        }`}
                        style={{
                          ...cell.getCellProps().style,
                        }}
                      >
                        {cellIndex === 0 ? (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleRowClick(index)}
                            >
                              {openRow === index ? (
                                <KeyboardArrowUp />
                              ) : (
                                <KeyboardArrowDown />
                              )}
                            </IconButton>
                            {cell.render("Cell")}
                          </div>
                        ) : (
                          cell.render("Cell")
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableCell
                    style={{
                      paddingBottom: 0,
                      paddingTop: 0,
                      borderRight: "1px solid #ccc",
                    }}
                    colSpan={columns.length + 1}
                  >
                    <Collapse
                      in={openRow === index}
                      timeout="auto"
                      unmountOnExit
                    >
                      <div>{row.cells[0].value}</div>
                    </Collapse>
                  </TableCell>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleFilterClose}
        >
          <MenuItem>
            <FormControl variant="outlined" size="small">
              <InputLabel htmlFor="filter-select">Filter</InputLabel>
              <Select
                label="Filter"
                value={filterConfig.value}
                onChange={handleFilterChange}
                inputProps={{
                  name: "filter",
                  id: "filter-select",
                }}
              >
                {data.map((item, index) => (
                  <MenuItem key={index} value={item[filterConfig.key]}>
                    {item[filterConfig.key]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </MenuItem>
        </Menu>
      </TableContainer>
    </>
  );
};

TableComponent.propTypes = {
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};
export default TableComponent;
