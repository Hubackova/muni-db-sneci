// @ts-nocheck

import { getDatabase, ref, remove } from "firebase/database";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useNavigate } from "react-router-dom";
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
import { localityColumns, DefaultCell } from "./LocalitiesAndSpeciesTable";
import PaginationButtons from "../PaginationButtons";

const LocalitiesTable: React.FC<any> = ({ localities }) => {
  const db = getDatabase();
  const [showModal, setShowModal] = useState(null);
  const navigate = useNavigate();
  const { setCurrentLocality, setLocalityData } = useAppStateContext();
  const [currentPage, setCurrentPage] = useState(1);

  const removeItem = (id: string) => {
    setShowModal(id);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Site ID",
        accessor: "siteId",
        Filter: Multi,
        filter: multiSelectFilter,
        Cell: React.memo<React.FC<any>>(({ value, row }) => (
          <div
            className="siteId"
            onClick={() => {
              setCurrentLocality(row.original.key);
              setLocalityData(row.original);
              navigate("/");
            }}
          >
            {value}
          </div>
        )),
      },
      ...localityColumns,
    ],
    [navigate, setCurrentLocality, setLocalityData]
  );

  const tableInstance = useTable(
    {
      columns,
      data: localities,
      defaultColumn: { Cell: DefaultCell, Filter: () => {} },
      autoResetFilters: false,
      initialState: {
        sortBy: [
          {
            id: "dateSampling",
            desc: true,
          },
          {
            id: "siteId",
            desc: false,
          },
        ],
      },
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
  // Výpočet indexu první a poslední položky na aktuální stránce
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

  const rowsShow = rows.slice(indexOfFirstItem, indexOfLastItem);

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
              remove(ref(db, "localities/" + showModal));
              toast.success("Locality was removed successfully");
            }}
            onHide={() => setShowModal(null)}
          />
        )}
        <table className="table localities" {...getTableProps()}>
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
            {rowsShow.map((row, index) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={row.original.key + "-" + index}>
                  <td role="cell" className="remove">
                    <button onClick={() => removeItem(row.original.key)}>
                      X
                    </button>
                  </td>
                  {row.cells.map((cell) => {
                    return (
                      <td
                        key={row.id + cell.column.id}
                        {...cell.getCellProps()}
                      >
                        {cell.render("Cell")}
                      </td>
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
          <CSVLink
            data={selectedFlatRows.map((i) => i.values)}
            filename="localities.csv"
          >
            <div className="export">
              <ExportIcon />
              export CSV
            </div>
          </CSVLink>
        </div>
      </div>
      <PaginationButtons
        setCurrentPage={setCurrentPage}
        ITEMS_PER_PAGE={ITEMS_PER_PAGE}
        currentPage={currentPage}
        rows={rows}
      />
    </div>
  );
};

export default LocalitiesTable;
