// @ts-nocheck

import React from "react";
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

const LocalitiesAndSpeciesTable: React.FC<any> = ({
  localities,
  speciesNames,
}) => {
  const navigate = useNavigate();
  const { setCurrentLocality, setLocalityData } = useAppStateContext();

  const speciesNamesOptions = speciesNames
    .map((i: any) => ({
      value: i.key,
      label: i.speciesName,
    }))
    .sort(function (a, b) {
      if (a.label < b.label) {
        return -1;
      }
      if (a.label > b.label) {
        return 1;
      }
      return 0;
    });

  const speciesNamesOptionsAll = [
    { value: "add", label: "to be added" },
    ...speciesNamesOptions,
  ];

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

  const tableInstance = useTable(
    {
      columns,
      data: localities,
      defaultColumn: { Cell: DefaultCell, Filter: () => {} },
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
            {rows.map((row) => {
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
            data={selectedFlatRows.map((i) => {
              const item = {
                ...i.values,
                speciesName: speciesNamesOptionsAll.find(
                  (j) => j.value === i.values.speciesNameKey
                )?.label,
              };
              const { speciesNameKey, ...data } = item;
              return data;
            })}
            filename="localities-species.csv"
          >
            <div className="export">
              <ExportIcon />
              export CSV
            </div>
          </CSVLink>
        </div>
      </div>
    </div>
  );
};

export default LocalitiesAndSpeciesTable;
