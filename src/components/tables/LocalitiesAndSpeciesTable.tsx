// @ts-nocheck

import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import {
  useFilters,
  useGlobalFilter,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table";
import { useAppStateContext } from "../../AppStateContext";
import { ReactComponent as ExportIcon } from "../../images/export.svg";
import { GlobalFilter, Multi, multiSelectFilter } from "../Filter";
import { MultiDate } from "../FilterDate";
import IndeterminateCheckbox from "../IndeterminateCheckbox";
import { useNavigate } from "react-router-dom";
import PaginationButtons from "../PaginationButtons";

export const DefaultCell = React.memo<React.FC<any>>(({ value, cell }) => (
  <div className={cell.column.id} title={value}>
    {value}
  </div>
));

export const localityColumns = [
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
    Header: () => <span title="Mapping grid">Grid</span>,
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
    Header: () => <span title="Elevation (m a.s.l.)">m a.s.l.</span>,
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
    Header: () => <span title="Plot size (m2)">Plot (m2)</span>,
    accessor: "plotSize",
    Filter: Multi,
    filter: multiSelectFilter,
  },
  {
    Header: () => <span title="Sample size (L)">Sample (L)</span>,
    accessor: "sampleSize",
    Filter: Multi,
    filter: multiSelectFilter,
  },
  {
    Header: () => <span title="Habitat size (m2)">Size (m2)</span>,
    accessor: "habitatSize",
    Filter: Multi,
    filter: multiSelectFilter,
  },
  {
    Header: () => <span title="Distance forest (m)">Dist. (m)</span>,
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
    Header: () => <span title="Water pH">pH</span>,
    accessor: "waterPH",
    Filter: Multi,
    filter: multiSelectFilter,
  },
  {
    Header: () => <span title="Water conduct. (µS/cm)">cond (μS/cm)</span>,
    accessor: "waterConductivity",
    Filter: Multi,
    filter: multiSelectFilter,
  },
  {
    Header: () => <span title="Lot number">Lot no.</span>,
    accessor: "lotNumber",
    Filter: Multi,
    filter: multiSelectFilter,
  },
  {
    Header: () => <span title="Releve number">Releve no.</span>,
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
    width: "500px",
  },
];

const LocalitiesAndSpeciesTable: React.FC<any> = ({ localities }) => {
  const navigate = useNavigate();
  const { setCurrentLocality, setLocalityData } = useAppStateContext();
  const [currentPage, setCurrentPage] = useState(1);

  const columns = React.useMemo(
    () => [
      {
        Header: "Site ID",
        accessor: "siteId",
        Filter: Multi,
        filter: multiSelectFilter,
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
      },
      {
        Header: "Species Name",
        accessor: "speciesName",
        Filter: Multi,
        filter: multiSelectFilter,
        Cell: DefaultCell,
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
      ...localityColumns,
    ],
    [navigate, setCurrentLocality, setLocalityData]
  );

  const sortByStorage = sessionStorage.getItem("locandspec");
  const sortByStorageData = JSON.parse(sortByStorage);

  const tableInstance = useTable(
    {
      columns,
      data: localities,
      defaultColumn: { Cell: DefaultCell, Filter: () => {} },
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
          {
            id: "speciesName",
            desc: false,
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

  const rowsForExport = selectedFlatRows.map((i) => {
    const {
      siteKey,
      speciesKey,
      speciesNameKey,
      species,
      speciesNamesKeysinLocality,
      key,
      ...rest
    } = i.original;
    return rest;
  });

  return (
    <div>
      <div className="table-container">
        <table className="table pcr" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={index}>
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
                <tr {...row.getRowProps()} key={row.original.key}>
                  {row.cells.map((cell) => {
                    return (
                      <td
                        key={row.original.key + cell.column.id}
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
          <CSVLink data={rowsForExport} filename="localities-species.csv">
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

export default LocalitiesAndSpeciesTable;
