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
import { toast } from "react-toastify";
import { ReactComponent as ExportIcon } from "../../images/export.svg";
import { EditableCell, SelectCell } from "../Cell";
import ConfirmModal from "../ConfirmModal";
import { GlobalFilter, Multi, multiSelectFilter } from "../Filter";
import IndeterminateCheckbox from "../IndeterminateCheckbox";

const SpeciesNamesTable: React.FC<any> = ({ species, localities }) => {
  const db = getDatabase();
  const [showEditModal, setShowEditModal] = useState(null);
  const [last, setLast] = useState(false);

  const customComparator = (prevProps, nextProps) => {
    return nextProps.value === prevProps.value;
  };
  const handleRevert = () => {
    update(ref(db, "species/" + last.rowKey), {
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
        dbName="species/"
        saveLast={setLast}
      />
    ),
    customComparator
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Species name",
        accessor: "speciesName",
        Filter: Multi,
        filter: multiSelectFilter,
        Cell: React.memo<React.FC<any>>(
          ({ value: initialValue, row, cell }) => {
            const [showEditModal, setShowEditModal] = useState(null);
            const [value, setValue] = React.useState(initialValue);
            const onChange = (e: any) => {
              setValue(e.target.value);
            };
            const onBlur = (e: any) => {
              if (
                (initialValue?.toString() || "") !==
                (e.target.value?.toString() || "")
              ) {
                if (!e.target.value)
                  return toast.error("Species name cannot be empty");
                if (species.find((i) => i.speciesName === e.target.value))
                  return toast.error("Species name already exists");
                const localitiesWithSpecies = localities.filter(
                  (i) => i.speciesName === initialValue
                );
                if (localitiesWithSpecies.length) {
                  localitiesWithSpecies.forEach((locality) => {
                    const speciesKey = Object.keys(locality.species).find(
                      (key) =>
                        locality.species[key].speciesName === initialValue
                    );
                    if (speciesKey) {
                      update(
                        ref(
                          db,
                          "localities/" +
                            locality.siteKey +
                            "/species/" +
                            speciesKey
                        ),
                        {
                          speciesName: e.target.value,
                        }
                      );
                    }
                  });
                }

                setShowEditModal({
                  row,
                  newValue: e.target.value,
                  id: cell.column.id,
                  initialValue,
                  setValue,
                  callback: () => {
                    update(ref(db, "species/" + row.original.key), {
                      [cell.column.id]: e.target.value,
                    });
                  },
                });
              }
            };
            return (
              <>
                <input value={value} onChange={onChange} onBlur={onBlur} />
                {showEditModal?.row.id === cell.row.id &&
                  showEditModal.id === cell.column.id && (
                    <ConfirmModal
                      title={`Do you want to change value from ${
                        showEditModal.initialValue || "<empty>"
                      } to ${
                        showEditModal.newValue
                      } ? (the species name will be modified in all locations, the change is irreversible using the Back button!)`}
                      onConfirm={async () => {
                        await showEditModal.callback();
                        setShowEditModal(null);
                        toast.success("Field was edited successfully");
                      }}
                      onCancel={() => {
                        showEditModal.setValue(showEditModal.initialValue);
                      }}
                      onHide={() => setShowEditModal(null)}
                    />
                  )}
              </>
            );
          },
          customComparator
        ),
      },
      {
        Header: "Abbreviation",
        accessor: "abbreviation",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "Group",
        accessor: "group",
        Filter: Multi,
        filter: multiSelectFilter,
        Cell: ({ value, row, cell }) => {
          return (
            <SelectCell
              initialValue={value}
              row={row}
              cell={cell}
              options={[
                { label: "Aquatic", value: "aquatic" },
                { label: "Terrestrial", value: "terrestrial" },
              ]}
              saveLast={setLast}
              dbName="species/"
            />
          );
        },
      },
      {
        Header: "Species and author",
        accessor: "speciesAndAuthor",
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

  const tableInstance = useTable(
    {
      columns,
      data: species,
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
        <table className="table" {...getTableProps()}>
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
                  {/*                   <td role="cell" className="remove">
                    <button onClick={() => removeItem(row.original.key)}>
                      X
                    </button>
                  </td> */}
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
                                    "species/" + showEditModal.row.original.key
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
            filename="species-names.csv"
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

export default SpeciesNamesTable;
