// @ts-nocheck

import { getDatabase, ref, remove, update } from "firebase/database";
import React, { useState } from "react";
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
import { dataTypeOptions, samplingOptions } from "../../helpers/options";
import { ReactComponent as ExportIcon } from "../../images/export.svg";
import {
  CreatableSelectCell,
  DateCell,
  EditableCell,
  SelectCell,
} from "../Cell";
import ConfirmModal from "../ConfirmModal";
import { GlobalFilter, Multi, multiSelectFilter } from "../Filter";
import IndeterminateCheckbox from "../IndeterminateCheckbox";

const LocalitiesTable: React.FC<any> = ({ localities }) => {
  const db = getDatabase();
  const [showModal, setShowModal] = useState(null);
  const [showEditModal, setShowEditModal] = useState(null);
  const [last, setLast] = useState(false);
  const fieldCodes = localities.map((i) => i.fieldCode);
  const navigate = useNavigate();
  const { setCurrentLocality } = useAppStateContext();

  const [currentPage, setCurrentPage] = useState(1);

  const getOptions = React.useCallback(
    (key: string) =>
      Object.values(
        localities.reduce(
          /* @ts-ignore */
          (acc, cur) => Object.assign(acc, { [cur[key]]: cur }),
          {}
        )
      )
        .map((i: any) => ({
          value: i[key],
          label: i[key],
        }))
        .sort(function (a, b) {
          if (a.label < b.label) {
            return -1;
          }
          if (a.label > b.label) {
            return 1;
          }
          return 0;
        }),
    [localities]
  );

  const removeItem = (id: string) => {
    setShowModal(id);
  };

  const customComparator = (prevProps, nextProps) => {
    return nextProps.value === prevProps.value;
  };
  const handleRevert = () => {
    update(ref(db, "localities/" + last.rowKey), {
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
        dbName="localities/"
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
        Cell: React.memo<React.FC<any>>(({ value, row, cell }) => (
          <div>
            <span
              className="plus"
              onClick={() => {
                setCurrentLocality(row.original.key);
                navigate("/");
              }}
            >
              <b title="Add species">+</b>
            </span>
            <EditableCell
              initialValue={value}
              row={row}
              cell={cell}
              dbName="localities/"
              saveLast={setLast}
            />
          </div>
        )),
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
            dbName="localities/"
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
              options={getOptions("country")}
              saveLast={setLast}
              updatekey={row.original.key}
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
              options={getOptions("collector")}
              saveLast={setLast}
              updatekey={row.original.key}
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
              updatekey={row.original.key}
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
              updatekey={row.original.key}
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
                      <React.Fragment key={cell.column.id}>
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
                                    "localities/" +
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
        {last?.rowKey && last.cellId !== "localityCode" && (
          <button className="revert" onClick={handleRevert}>
            Back
          </button>
        )}
      </div>
      {buttons}
    </div>
  );
};

export default LocalitiesTable;
