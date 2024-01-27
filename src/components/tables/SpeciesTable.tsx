// @ts-nocheck

import { getDatabase, ref, remove } from "firebase/database";
import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import {
  useFilters,
  useGlobalFilter,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table";
import { toast } from "react-toastify";
import { useAppStateContext } from "../../AppStateContext";

import { ReactComponent as ExportIcon } from "../../images/export.svg";
import ConfirmModal from "../ConfirmModal";
import { GlobalFilter, Multi, multiSelectFilter } from "../Filter";
import IndeterminateCheckbox from "../IndeterminateCheckbox";
import { useNavigate } from "react-router-dom";

const SpeciesTable: React.FC<any> = ({ species }) => {
  const db = getDatabase();
  const [showModal, setShowModal] = useState(null);
  const navigate = useNavigate();
  const { currentLocality, setCurrentLocality, setLocalityData } =
    useAppStateContext();
  const [currentPage, setCurrentPage] = useState(1);
  const removeItem = (id: string) => {
    setShowModal(id);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Site ID",
        accessor: "siteId",
        Cell: React.memo<React.FC<any>>(({ value, row }) => {
          return (
            <div
              className="siteId"
              onClick={() => {
                setCurrentLocality(row.original.siteKey);
                setLocalityData(row.original);
                navigate("/");
              }}
            >
              {value}
            </div>
          );
        }),
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "Species Name",
        accessor: "speciesName",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "Specification",
        accessor: "specification",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "Live",
        accessor: "live",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "Empty",
        accessor: "empty",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "Undef.",
        accessor: "undef",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "All",
        accessor: "all",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "Lot no.",
        accessor: "lot",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "Vouchers",
        accessor: "vouchers",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "Note",
        accessor: "noteSpecies",
        Filter: Multi,
        filter: multiSelectFilter,
      },
    ],
    []
  );

  const tableInstance = useTable(
    {
      columns: columns,
      data: species,
      defaultColumn: {
        Filter: () => {},
      },
      autoResetFilters: false,
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    state,
    rows,
    setGlobalFilter,
    preGlobalFilteredRows,
    selectedFlatRows,
    prepareRow,
  } = tableInstance;

  const ITEMS_PER_PAGE = 500;
  const totalPages = Math.ceil(rows.length / ITEMS_PER_PAGE);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Výpočet indexu první a poslední položky na aktuální stránce
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

  const rowsShow = rows.slice(indexOfFirstItem, indexOfLastItem);

  const buttons = (
    <div className="pagination">
      <div className="pg-buttons">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(index + 1)}
            title={`${index * ITEMS_PER_PAGE + 1} - ${Math.min(
              (index + 1) * ITEMS_PER_PAGE,
              rows.length
            )}`}
            className={index + 1 === currentPage ? "pg-btn active" : "pg-btn"}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div>
        {`${(currentPage - 1) * ITEMS_PER_PAGE + 1} - ${Math.min(
          currentPage * ITEMS_PER_PAGE,
          rows.length
        )} / ${rows.length}`}
      </div>
    </div>
  );

  useEffect(() => {
    if (Math.ceil(rows.length / 200) < currentPage) {
      setCurrentPage(1);
    }
  }, [currentPage, rows.length]);

  return (
    <div>
      <div className="table-container">
        {showModal && (
          <ConfirmModal
            title="Do you want to continue?"
            onConfirm={() => {
              setShowModal(null);
              remove(ref(db, showModal));
              toast.success("Species was removed successfully");
            }}
            onHide={() => setShowModal(null)}
          />
        )}
        <table className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                <th></th>
                {headerGroup.headers.map((column) => (
                  <th key={column.id}>
                    <span
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " ⬇️"
                            : " ⬆️"
                          : ""}
                      </span>
                    </span>
                    <div className="filter-wrapper">
                      {column.canFilter ? column.render("Filter") : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {rowsShow.map((row) => {
              prepareRow(row);

              return (
                <tr
                  {...row.getRowProps()}
                  key={row.original.key + row.original.speciesKey}
                >
                  <td role="cell" className="remove">
                    <button
                      onClick={() =>
                        removeItem(
                          `localities/${
                            currentLocality || row.original.siteKey
                          }/species/${row.original.speciesKey}`
                        )
                      }
                    >
                      X
                    </button>
                  </td>
                  {row.cells.map((cell) => {
                    return (
                      <React.Fragment key={cell.column.id}>
                        <td
                          key={row.id + cell.column.id}
                          {...cell.getCellProps()}
                        >
                          {cell.render("Cell")}
                        </td>
                      </React.Fragment>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="controls">
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <div className="download">
          <CSVLink data={selectedFlatRows} filename="species.csv">
            <div className="export">
              <ExportIcon />
              export CSV
            </div>
          </CSVLink>
        </div>
      </div>
      {buttons}
    </div>
  );
};

export default SpeciesTable;
