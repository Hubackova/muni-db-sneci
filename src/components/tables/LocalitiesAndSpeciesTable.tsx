// @ts-nocheck

import { getDatabase, ref, update } from "firebase/database";
import React, { useState } from "react";
import { CSVLink } from "react-csv";
import {
    useFilters,
    useGlobalFilter,
    useRowSelect,
    useSortBy,
    useTable,
} from "react-table";
import { useAppStateContext } from "../../AppStateContext";
import { dataTypeOptions, samplingOptions } from "../../helpers/options";
import { getOptions, getValueFromOptions } from "../../helpers/utils";
import { ReactComponent as ExportIcon } from "../../images/export.svg";
import {
    CreatableSelectCell,
    DateCell,
    EditableCell,
    SelectCell,
} from "../Cell";
import { GlobalFilter, Multi, multiSelectFilter } from "../Filter";
import IndeterminateCheckbox from "../IndeterminateCheckbox";

const LocalitiesAndSpeciesTable: React.FC<any> = ({
  localities,
  speciesNames,
}) => {
  const db = getDatabase();
  const { currentLocality } = useAppStateContext();
  const [last, setLast] = useState(false);

  const customComparator = (prevProps, nextProps) => {
    return nextProps.value === prevProps.value;
  };

  const speciesCells = [
    "specification",
    "live",
    "empty",
    "undef",
    "all",
    "lot",
    "vouchers",
    "noteSpecies",
    "speciesNameKey",
  ];

  const handleRevert = () => {
    update(ref(db, last.dbName + last.rowKey), {
      [last.cellId]: last.initialValue,
    });
    last.setValue &&
      last.setValue({ value: last.initialValue, label: last.initialValue });
    setLast(false);
  };

  const DefaultCell = React.memo<React.FC<any>>(({ value, row, cell }) => {
    const isSpeciesUpdate = speciesCells.includes(cell.column.id);

    const dbName = isSpeciesUpdate
      ? `localities/${currentLocality || row.original.siteKey}/species/`
      : "localities/";
    return (
      <EditableCell
        initialValue={value}
        row={row}
        cell={cell}
        dbName={dbName}
        saveLast={setLast}
        updatekey={
          isSpeciesUpdate ? row.original.speciesKey : row.original.siteKey
        }
      />
    );
  }, customComparator);

  const fieldCodes = localities.map((i) => i.fieldCode);

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
        Cell: React.memo<React.FC<any>>(
          ({ row: { original } }) => (
            <input
              defaultValue={[original.siteId] || ""}
              disabled
              className="narrow"
            ></input>
          ),
          customComparator
        ),
      },
      {
        Header: "Species Name",
        accessor: "speciesNameKey",
        Filter: Multi,
        filter: multiSelectFilter,
        Cell: ({ value, row, cell }) => {
          const item = getValueFromOptions(
            row.original.speciesNameKey,
            speciesNamesOptionsAll
          );
          const filteredOptions = speciesNamesOptionsAll.filter(
            (i) =>
              (row.original.speciesNamesKeysinLocality &&
                !row.original.speciesNamesKeysinLocality.includes(i.value)) ||
              i.value === "add"
          );
          return (
            <SelectCell
              backValue={value}
              initialValue={item?.label || ""}
              row={row}
              cell={cell}
              options={filteredOptions}
              saveLast={setLast}
              dbName={`localities/${row.original.siteKey}/species/`}
              updatekey={row.original.speciesKey}
            />
          );
        },
      },
      {
        Header: "Specification",
        accessor: "specification",
        Filter: Multi,
        filter: multiSelectFilter,
        Cell: ({ value, row, cell }) => {
          return (
            <CreatableSelectCell
              initialValue={value}
              row={row}
              cell={cell}
              options={getOptions(localities, "specification")}
              saveLast={setLast}
              updatekey={row.original.speciesKey}
              dbName={`localities/${row.original.siteKey}/species/`}
            />
          );
        },
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
        accessor: "undefined",
        Filter: Multi,
        filter: multiSelectFilter,
      },

      {
        Header: "All",
        accessor: "all",
        Filter: Multi,
        filter: multiSelectFilter,
        Cell: React.memo<React.FC<any>>(({ row: { original } }) => {
          return (
            <input
              value={[original.all] || ""}
              readOnly
              className="ultra-narrow"
            ></input>
          );
        }, customComparator),
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
      {
        Header: "Field code",
        accessor: "fieldCode",
        Filter: Multi,
        filter: multiSelectFilter,
        Cell: React.memo<React.FC<any>>(({ value, row, cell }) => (
          <EditableCell
            initialValue={value}
            row={row}
            cell={cell}
            saveLast={setLast}
            fieldCodes={fieldCodes}
          />
        )),
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
        Cell: ({ value, row, cell }) => {
          return (
            <CreatableSelectCell
              initialValue={value}
              row={row}
              cell={cell}
              options={getOptions(localities, "country")}
              saveLast={setLast}
              updatekey={row.original.siteKey}
            />
          );
        },
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
        Cell: React.memo<React.FC<any>>(
          ({ value: initialValue, row, cell }) => (
            <DateCell
              initialValue={initialValue}
              row={row}
              cell={cell}
              saveLast={setLast}
            />
          ),
          customComparator
        ),
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "Collector",
        accessor: "collector",
        Filter: Multi,
        filter: multiSelectFilter,
        Cell: ({ value, row, cell }) => {
          return (
            <CreatableSelectCell
              initialValue={value}
              row={row}
              cell={cell}
              options={getOptions(localities, "collector")}
              saveLast={setLast}
              updatekey={row.original.siteKey}
            />
          );
        },
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
        Cell: ({ value, row, cell }) => {
          return (
            <SelectCell
              initialValue={value}
              row={row}
              cell={cell}
              options={samplingOptions}
              saveLast={setLast}
              updatekey={row.original.siteKey}
            />
          );
        },
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
        Cell: ({ value, row, cell }) => {
          return (
            <CreatableSelectCell
              initialValue={value}
              row={row}
              cell={cell}
              options={dataTypeOptions}
              saveLast={setLast}
              updatekey={row.original.siteKey}
            />
          );
        },
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
    []
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
        {/*         {showModal && (
          <ConfirmModal
            title="Do you want to continue?"
            onConfirm={() => {
              setShowModal(null);
              remove(ref(db, "localities/" + showModal));
              toast.success("Program was removed successfully");
            }}
            onHide={() => setShowModal(null)}
          />
        )} */}
        <table className="table pcr" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {/* <th></th> */}
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
                  {/*                   <td role="cell" className="remove">
                    <button onClick={() => removeItem(row.original.key)}>
                      X
                    </button>
                  </td> */}
                  {row.cells.map((cell) => {
                    return (
                      <>
                        <td
                          key={row.original.key + cell.column.id}
                          {...cell.getCellProps()}
                        >
                          {cell.render("Cell")}
                        </td>
                      </>
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
        {last?.rowKey && last.cellId !== "localityCode" && (
          <button className="revert" onClick={handleRevert}>
            Back
          </button>
        )}
      </div>
    </div>
  );
};

export default LocalitiesAndSpeciesTable;
