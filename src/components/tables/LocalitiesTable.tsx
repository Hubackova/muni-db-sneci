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
import { MultiDate } from "../FilterDate";
import IndeterminateCheckbox from "../IndeterminateCheckbox";

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
      {
        Header: "Field code",
        accessor: "fieldCode",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "Site name",
        accessor: "siteName",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "Latitude (°N)",
        accessor: "latitude",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "Longitude (°E)",
        accessor: "longitude",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "Country",
        accessor: "country",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "State/Province/Region",
        accessor: "state",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "Settlement",
        accessor: "settlement",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "Mapping grid",
        accessor: "mapGrid",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "Site / habitat description",
        accessor: "siteDescription",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "Elevation (m a.s.l.)",
        accessor: "elevation",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "Date of sampling",
        accessor: "dateSampling",
        Filter: MultiDate,
        filter: multiSelectFilter,
      },
      {
        Header: "Collector",
        accessor: "collector",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "Plot size (m 2 )",
        accessor: "plotSize",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "Sample size (L)",
        accessor: "sampleSize",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "Habitat size (m 2 )",
        accessor: "habitatSize",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "Distance forest (m)",
        accessor: "distanceForest",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "Sampling method",
        accessor: "samplingMethod",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "Water pH",
        accessor: "waterPH",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "Water conduct. (µS/cm)",
        accessor: "waterConductivity",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "Lot number",
        accessor: "lotNumber",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "Releve number",
        accessor: "releveNumber",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "Data type",
        accessor: "dataType",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "PLA/event",
        accessor: "event",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "Note (site)",
        accessor: "noteSite",
        Filter: Multi,
        filter: multiSelectFilter,
      },
    ],
    [navigate, setCurrentLocality, setLocalityData]
  );

  const tableInstance = useTable(
    {
      columns,
      data: localities,
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

  const ITEMS_PER_PAGE = 200;
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
      {buttons}
    </div>
  );
};

export default LocalitiesTable;
