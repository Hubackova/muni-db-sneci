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

const headers = [
  { label: "Species name", key: "speciesName" },
  { label: "Specification", key: "specification" },
  { label: "Live", key: "live" },
  { label: "Empty", key: "empty" },
  { label: "All", key: "all" },
  { label: "Vouchers", key: "vouchers" },
  { label: "Latitude (°N)", key: "latitude" },
  { label: "Longitude (°E)", key: "longitude" },
  { label: "Country", key: "country" },
  { label: "State/Province/Region", key: "state" },
  { label: "Settlement", key: "settlement" },
  { label: "Grid", key: "mapGrid" },
  { label: "Site name", key: "siteName" },
  { label: "Site/Habitat description", key: "siteDescription" },
  { label: "m a.s.l.", key: "elevation" },
  { label: "Date of sampling", key: "dateSampling" },
  { label: "Collector", key: "collector" },
  { label: "Field code", key: "fieldCode" },
  { label: "PLA/Event", key: "event" },
  { label: "Data type", key: "dataType" },
  { label: "Sampling method", key: "samplingMethod" },
  { label: "Note", key: "note" },
  { label: "pH", key: "waterPH" },
  { label: "Cond (μS/cm)", key: "waterConductivity" },
  { label: "Lot no.", key: "lotNumber" },
  { label: "Releve no.", key: "releveNumber" },
  { label: "Note (site)", key: "noteSpecies" },
  { label: "Plot (m2)", key: "plotSize" },
  { label: "Undef.", key: "undef" },
  { label: "Sample (L)", key: "sampleSize" },
  { label: "Size (m2)", key: "habitatSize" },
  { label: "Dist. (m)", key: "distanceForest" },
  { label: "Site ID", key: "siteId" },
];

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
    Header: "Site/Habitat description",
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
    accessor: "note",
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
        Header: "Species name",
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
    return {
      speciesName: i.original.speciesName,
      specification: i.original.specification,
      live: i.original.live,
      all: i.original.all,
      empty: i.original.empty,
      vouchers: i.original.vouchers,
      latitude: i.original.latitude,
      longitude: i.original.longitude,
      country: i.original.country,
      state: i.original.state,
      settlement: i.original.settlement,
      mapGrid: i.original.mapGrid,
      siteName: i.original.siteName,
      siteDescription: i.original.siteDescription,
      elevation: i.original.elevation,
      dateSampling: i.original.dateSampling,
      collector: i.original.collector,
      fieldCode: i.original.fieldCode,
      event: i.original.event,
      dataType: i.original.dataType,
      samplingMethod: i.original.samplingMethod,
      note: i.original.note,
      waterPH: i.original.waterPH,
      waterConductivity: i.original.waterConductivity,
      lotNumber: i.original.lotNumber,
      releveNumber: i.original.releveNumber,
      noteSpecies: i.original.noteSpecies,
      plotSize: i.original.plotSize,
      undef: i.original.undef,
      sampleSize: i.original.sampleSize,
      habitatSize: i.original.habitatSize,
      distanceForest: i.original.distanceForest,
      siteId: i.original.siteId,
    };
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
          <CSVLink
            data={rowsForExport}
            headers={headers}
            filename="localities-species.csv"
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

export default LocalitiesAndSpeciesTable;
