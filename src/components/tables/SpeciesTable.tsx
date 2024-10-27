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
import PaginationButtons from "../PaginationButtons";

const SpeciesTable: React.FC<any> = ({ species }) => {
  const db = getDatabase();
  const [showModal, setShowModal] = useState(null);
  const { currentLocality } = useAppStateContext();
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
      },
      {
        Header: "Species name",
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
        accessor: "note",
        Filter: Multi,
        filter: multiSelectFilter,
      },
    ],
    []
  );

  const sortByStorage = sessionStorage.getItem("locandspec");
  const sortByStorageData = JSON.parse(sortByStorage);

  const tableInstance = useTable(
    {
      columns: columns,
      data: species,
      defaultColumn: {
        Filter: () => {},
      },
      autoResetFilters: false,
      initialState: {
        sortBy: sortByStorageData || [
          {
            id: "dateSampling",
            desc: true,
          },
          {
            id: "siteId",
            desc: true,
          },
        ],
      },
      stateReducer: (newState, action, prevState) => {
        if (
          JSON.stringify(newState.sortBy) !== JSON.stringify(prevState.sortBy)
        ) {
          sessionStorage.setItem(
            "locandspec",
            JSON.stringify(newState?.sortBy)
          );
        }
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

  function findAndLogDuplicateSiteAndSpecies(array) {
    const duplicatePairs = [];
    const uniquePairs = new Set();

    for (const obj of array) {
      const key = `${obj.siteId}-${obj.speciesName}-${obj.specification}`;
      if (uniquePairs.has(key)) {
        duplicatePairs.push({
          siteId: obj.siteId,
          speciesName: obj.speciesName,
          speciesKey: obj.speciesKey,
          siteKey: obj.siteKey,
        });
      } else {
        uniquePairs.add(key);
      }
    }

    if (duplicatePairs.length > 0) {
      const duplicates = duplicatePairs.map(
        (pair) => `SiteId: ${pair.siteId}, SpeciesName: ${pair.speciesName}`
      );
      alert(`Duplicity nalezeny:\n${duplicates.join("\n")}`);
    } else {
      alert("Žádné duplicity nenalezeny.");
    }
  }

  const rowsForExport = selectedFlatRows.map((i) => {
    const {
      siteKey,
      speciesKey,
      speciesNameKey,
      speciesNamesKeysinLocality,
      key,
      ...rest
    } = i.original;
    return rest;
  });

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
          <CSVLink data={rowsForExport} filename="species.csv">
            <div className="export">
              <ExportIcon />
              export CSV
            </div>
          </CSVLink>
        </div>
        <button onClick={() => findAndLogDuplicateSiteAndSpecies(species)}>
          Find duplicities
        </button>
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

export default SpeciesTable;
