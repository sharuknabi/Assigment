import * as React from "react";
import TablePagination from "@mui/material/TablePagination";
import SmartButtonIcon from "@mui/icons-material/SmartButton";
import {
  Table,
  TableBody,
  TableCell,
  Select,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { ArrowDownward, ArrowUpward, MoreVert } from "@mui/icons-material";
import { useTable, useBlockLayout, useResizeColumns } from "react-table";
import { DataContext } from "../context/DataContext";
import "./style.css";
import SearchBar from "./SearchBar";

const TableComponent = () => {
  const {
    data,
    loading,
    currentPage,
    setCurrentPage,
    totalPages,
    rowsPerPage,
    setRowsPerPage,
  } = React.useContext(DataContext);
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: "asc",
  });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [filterConfig, setFilterConfig] = React.useState({
    key: null,
    value: "",
  });

  const [expandedCells, setExpandedCells] = React.useState({});

  const handleCellClick = (rowIndex, cellIndex) => {
    setExpandedCells((prev) => ({
      ...prev,
      [`${rowIndex}-${cellIndex}`]: !prev[`${rowIndex}-${cellIndex}`],
    }));
  };

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
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

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      if (!filterConfig.key || !filterConfig.value) return true;
      return item[filterConfig.key]
        .toString()
        .toLowerCase()
        .includes(filterConfig.value.toLowerCase());
    });
  }, [data, filterConfig]);

  const sortedData = React.useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const columns = React.useMemo(
    () => [
      { Header: "Name", accessor: "name", minWidth: 50 },
      { Header: "Username", accessor: "username", minWidth: 50 },
      {
        Header: "Time Order Preserved",
        accessor: "timeOrderPreserved",
        minWidth: 50,
      },
      {
        Header: "Ground Truth Source",
        accessor: "groundTruthSource",
        minWidth: 50,
      },
      {
        Header: "Negative Assessed",
        accessor: "negativeAssessed",
        minWidth: 50,
      },
      { Header: "Label", accessor: "label", minWidth: 100 },
      {
        Header: "Manually Curated",
        accessor: "manuallyCurated",
        minWidth: 50,
      },
      {
        Header: "Source Data Nature",
        accessor: "sourceDataNature",
        minWidth: 50,
      },
      {
        Header: "Entity Granularity",
        accessor: "entityGranularity",
        minWidth: 50,
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: () => <SmartButtonIcon />,
        minWidth: 50,
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: sortedData }, useBlockLayout, useResizeColumns);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        maxWidth: "1180px",
        margin: "0 auto",
        marginTop: "40px",
        fontFamily: "'Roboto', sans-serif",
        fontSize: "14px",
      }}
    >
      <SearchBar />
      <TableContainer
        className="tableContainer"
        component={Paper}
        style={{
          maxHeight: "100%",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          borderRadius: "8px",
        }}
      >
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
                    style={{
                      borderRight: "1px solid #ccc",
                      minWidth: column.minWidth,
                      backgroundColor: "#f5f5f5",
                      color: "#333",
                      fontWeight: "bold",
                      borderRadius:
                        cellIndex === 0
                          ? "8px 0 0 8px"
                          : cellIndex === headerGroup.headers.length - 1
                          ? "0 8px 8px 0"
                          : "0",
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
            {rows.map((row, rowIndex) => {
              prepareRow(row);
              const { key, ...rowProps } = row.getRowProps();
              return (
                <TableRow key={key} {...rowProps}>
                  {row.cells.map((cell, cellIndex) => {
                    const { key: cellKey, ...cellProps } = cell.getCellProps();
                    return (
                      <TableCell
                        key={cellKey || cellIndex} // Ensure each cell has a unique key
                        {...cellProps}
                        className={`${
                          cellIndex === 0
                            ? "sticky-column sticky-name-column"
                            : ""
                        } ${
                          cellIndex === row.cells.length - 1
                            ? "sticky-column sticky-action-column"
                            : ""
                        }`}
                        style={{
                          ...cell.getCellProps().style,
                          textOverflow: expandedCells[
                            `${rowIndex}-${cellIndex}`
                          ]
                            ? "visible"
                            : "ellipsis",
                          overflow: "hidden",
                          whiteSpace: expandedCells[`${rowIndex}-${cellIndex}`]
                            ? "normal"
                            : "nowrap",
                          cursor: "pointer",
                        }}
                        onClick={() => handleCellClick(rowIndex, cellIndex)}
                      >
                        {cell.render("Cell")}
                      </TableCell>
                    );
                  })}
                </TableRow>
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
                inputProps={{ name: "filter", id: "filter-select" }}
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
        <TablePagination
          component="div"
          count={totalPages * rowsPerPage}
          page={currentPage}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
};

export default TableComponent;
