import * as React from "react";
import TablePagination from "@mui/material/TablePagination";
import PropTypes from "prop-types";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
} from "docx";
import { saveAs } from "file-saver";

import {
  Table as MUITable,
  TableBody,
  TableCell as MUITableCell,
  Select,
  TableContainer,
  TableHead,
  TableRow as MUITableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  ArrowDownward,
  ArrowUpward,
  MoreVert,
  GetApp,
} from "@mui/icons-material";
import { useTable, useBlockLayout, useResizeColumns } from "react-table";
import { DataContext } from "../context/DataContext";
import "./style.css";
import SearchBar from "./SearchBar";

// Download function
const downloadDOCX = (filename, data) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Table Data",
                bold: true,
                size: 24,
              }),
            ],
          }),
          // Create the table
          new Table({
            rows: [
              // Create table headers
              new TableRow({
                children: Object.keys(data[0] || {}).map(
                  (key) =>
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: key, bold: true })],
                        }),
                      ],
                    })
                ),
              }),
              // Create table rows
              ...data.map(
                (item) =>
                  new TableRow({
                    children: Object.keys(item).map(
                      (key) =>
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [new TextRun(item[key] || "")],
                            }),
                          ],
                        })
                    ),
                  })
              ),
            ],
          }),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, filename);
  });
};

// Custom cell renderer for the Action column
const ActionCell = ({ row }) => (
  <IconButton
    onClick={() => {
      if (row && row.SNo !== undefined) {
        downloadDOCX(`row-data-${row.SNo}.docx`, [row]); // Use the row's original data
        console.log("Download clicked for:", row);
      } else {
        console.error("Row data is undefined or missing SNo:", row);
      }
    }}
  >
    <GetApp />
  </IconButton>
);

ActionCell.propTypes = {
  row: PropTypes.object.isRequired,
};

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
    if (!Array.isArray(data)) {
      console.error("Data is not an array:", data);
      return [];
    }
    if (!filterConfig.key || !filterConfig.value) return data;

    const filterValue =
      typeof filterConfig.value === "string"
        ? filterConfig.value.toLowerCase()
        : "";

    return data.filter((item) => {
      const field = item[filterConfig.key];
      return field
        ? field.toString().toLowerCase().includes(filterValue)
        : false;
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
      {
        Header: "S-No",
        accessor: "SNo",
        minWidth: 70,
        maxWidth: 70,
        className: "compact-cell",
      },
      {
        Header: "Year",
        accessor: "Year",
        minWidth: 70,
        maxWidth: 70,
      },
      {
        Header: "DATASET",
        accessor: "DATASET",
        minWidth: 200,
      },
      {
        Header: "Kind of traffic",
        accessor: "KindOfTraffic",
        minWidth: 180,
      },
      {
        Header: "Publically available",
        accessor: "PublicallyAvailable",
        minWidth: 150,
      },
      {
        Header: "Count/records",
        accessor: "Count",
        minWidth: 180,
      },
      {
        Header: "Feature count",
        accessor: "FeatureCount",
        minWidth: 200,
      },
      {
        Header: "DOI",
        accessor: "DOI",
        minWidth: 200,
      },
      {
        Header: "DOWNLOAD LINKS",
        accessor: "DownloadLinks",
        minWidth: 220,
        Cell: DownloadLinkCell,
      },
      {
        Header: "Action",
        accessor: "Action",
        minWidth: "50",
        Cell: ({ row }) => <ActionCell row={row.original} />,
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
    <>
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          marginTop: "40px",
          fontFamily: "'Roboto', sans-serif",
          fontSize: "14px",
        }}
      >
        <SearchBar
          onChange={(value) => setFilterConfig({ ...filterConfig, value })}
        />
        <TableContainer
          className="tableContainer"
          component={Paper}
          style={{
            maxHeight: "100%",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            overflowX: "auto",
            overflowY: "auto",
          }}
        >
          <MUITable {...getTableProps()} stickyHeader>
            <TableHead>
              {headerGroups.map((headerGroup) => (
                <MUITableRow
                  {...headerGroup.getHeaderGroupProps()}
                  key={headerGroup.id}
                  className="compact-row" // Apply compact row style
                >
                  {headerGroup.headers.map((column, cellIndex) => (
                    <MUITableCell
                      key={column.id}
                      {...column.getHeaderProps()}
                      style={{
                        // backgroundColor: "gray",

                        borderRight:
                          cellIndex === headerGroup.headers.length - 1
                            ? "none"
                            : "1px solid rgba(224, 224, 224, 1)",
                        borderRadius:
                          cellIndex === 0
                            ? "8px 0 0 0"
                            : cellIndex === headerGroup.headers.length - 1
                            ? "0 8px 0 0"
                            : "0",
                        boxShadow:
                          cellIndex === 0
                            ? "-3px 0 5px -2px rgba(0,0,0,0.1)"
                            : cellIndex === headerGroup.headers.length - 1
                            ? "3px 0 5px -2px rgba(0,0,0,0.1)"
                            : "none",
                        padding:
                          cellIndex === headerGroup.headers.length - 1
                            ? "0 8px 8px 0"
                            : "0",
                        ...column.getHeaderProps().style,
                        zIndex:
                          cellIndex === 0 ||
                          cellIndex === headerGroup.headers.length - 1
                            ? 3
                            : 2,
                      }}
                      id={`header-${column.id}`}
                    >
                      <div
                        className={`header-content compact-cell ${
                          cellIndex === 0
                            ? "sticky-header sticky-name-header"
                            : ""
                        } ${
                          cellIndex === headerGroup.headers.length - 1
                            ? "sticky-header sticky-action-header"
                            : ""
                        }`}
                        // className="header-content "
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
                          onClick={(event) =>
                            handleFilterClick(event, column.id)
                          }
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
                    </MUITableCell>
                  ))}
                </MUITableRow>
              ))}
            </TableHead>
            <TableBody {...getTableBodyProps()}>
              {rows.map((row, rowIndex) => {
                prepareRow(row);
                const { key, ...rowProps } = row.getRowProps();
                return (
                  <MUITableRow key={key} {...rowProps}>
                    {row.cells.map((cell, cellIndex) => {
                      const { key: cellKey, ...cellProps } =
                        cell.getCellProps();
                      return (
                        <MUITableCell
                          key={cellKey || cellIndex} // Ensure each cell has a unique key
                          {...cellProps}
                          className={`compact-cell ${
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
                            whiteSpace: expandedCells[
                              `${rowIndex}-${cellIndex}`
                            ]
                              ? "normal"
                              : "nowrap",
                            cursor: "pointer",
                            zIndex:
                              cellIndex === 0 ||
                              cellIndex === row.cells.length - 1
                                ? 3
                                : 1,
                          }}
                          onClick={() => handleCellClick(rowIndex, cellIndex)}
                        >
                          {cell.render("Cell")}
                        </MUITableCell>
                      );
                    })}
                  </MUITableRow>
                );
              })}
            </TableBody>
          </MUITable>
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
    </>
  );
};

const DownloadLinkCell = ({ value }) => (
  <a
    href={value}
    target="_blank"
    rel="noopener noreferrer"
    className="download-link"
  >
    {value}
  </a>
);

DownloadLinkCell.propTypes = {
  value: PropTypes.string.isRequired,
};

export default TableComponent;
