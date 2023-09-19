// @ts-nocheck

import { getDatabase, ref, remove, update } from "firebase/database";
import React, { useState } from "react";
import { CSVLink } from "react-csv";
import {
  useFilters,
  useGlobalFilter,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table";
import { toast } from "react-toastify";
import { ReactComponent as ExportIcon } from "../../images/export.svg";
import { EditableCell } from "../Cell";
import ConfirmModal from "../ConfirmModal";
import { GlobalFilter, Multi, multiSelectFilter } from "../Filter";
import IndeterminateCheckbox from "../IndeterminateCheckbox";

const LocalitiesTable: React.FC<any> = ({ localities }) => {
  const db = getDatabase();
  const [showModal, setShowModal] = useState(null);
  const [showEditModal, setShowEditModal] = useState(null);
  const [last, setLast] = useState(false);

  const removeItem = (id: string) => {
    setShowModal(id);
  };

  const customComparator = (prevProps, nextProps) => {
    return nextProps.value === prevProps.value;
  };
  const handleRevert = () => {
    update(ref(db, "locations/" + last.rowKey), {
      [last.cellId]: last.initialValue,
    });
    last.setValue &&
      last.setValue({ value: last.initialValue, label: last.initialValue });
    setLast(false);
  };

  const DefaultCell = React.memo<React.FC<any>>(
    ({ value, row, cell }) => (
      <EditableCell
        initialValue={value}
        row={row}
        cell={cell}
        dbName="locations/"
        saveLast={setLast}
      />
    ),
    customComparator
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Site ID",
        accessor: "siteId",
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
        Header: "Live individual",
        accessor: "live",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "Empty shells",
        accessor: "empty",
        Filter: Multi,
        filter: multiSelectFilter,
      },

      {
        Header: "All shells",
        accessor: "all",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "Lot number",
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
        Header: "Final Extension",
        accessor: "finalExtension",
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
        Filter: Multi,
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
        Header: "Water conductivity (µS/cm)",
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
        {showModal && (
          <ConfirmModal
            title="Do you want to continue?"
            onConfirm={() => {
              setShowModal(null);
              remove(ref(db, "locations/" + showModal));
              toast.success("Program was removed successfully");
            }}
            onHide={() => setShowModal(null)}
          />
        )}
        <table className="table pcr" {...getTableProps()}>
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
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={row.original.key}>
                  <td role="cell" className="remove">
                    <button onClick={() => removeItem(row.original.key)}>
                      X
                    </button>
                  </td>
                  {row.cells.map((cell) => {
                    return (
                      <>
                        {showEditModal?.row.id === cell.row.id &&
                          showEditModal.id === cell.column.id && (
                            <ConfirmModal
                              title={`Do you want to change value from ${
                                showEditModal.initialValue || "<empty>"
                              } to ${showEditModal.newValue} ?`}
                              onConfirm={() => {
                                setShowEditModal(null);
                                update(
                                  ref(
                                    db,
                                    "locations/" +
                                      showEditModal.row.original.key
                                  ),
                                  {
                                    [showEditModal.id]: showEditModal.newValue,
                                  }
                                );
                                toast.success("Field was edited successfully");
                              }}
                              onCancel={() => {
                                showEditModal.setValue(
                                  showEditModal.initialValue
                                );
                              }}
                              onHide={() => setShowEditModal(null)}
                            />
                          )}
                        <td
                          key={row.id + cell.column.id}
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
            data={selectedFlatRows.map((i) => i.values)}
            filename="pcr-programs.csv"
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

export default LocalitiesTable;
