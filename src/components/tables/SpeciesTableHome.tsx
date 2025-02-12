// @ts-nocheck

import { getDatabase, ref, remove, update } from "firebase/database";
import React, { useState } from "react";
import {
  useFilters,
  useGlobalFilter,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table";
import { toast } from "react-toastify";
import { useAppStateContext } from "../../AppStateContext";
import { getOptions, getValueFromOptions } from "../../helpers/utils";
import { CreatableSelectCell, EditableCell, SelectCell } from "../Cell";
import ConfirmModal from "../ConfirmModal";
import { Multi, multiSelectFilter } from "../Filter";

const SpeciesTableHome: React.FC<any> = ({ species, speciesNames }) => {
  const db = getDatabase();
  const [showModal, setShowModal] = useState(null);
  const [showEditModal, setShowEditModal] = useState(null);
  const [last, setLast] = useState(false);
  const { currentLocality } = useAppStateContext();

  const removeItem = (id: string) => {
    setShowModal(id);
  };

  const customComparator = (prevProps, nextProps) => {
    return nextProps.value === prevProps.value;
  };

  const handleRevert = () => {
    update(ref(db, last.dbName + last.rowKey), {
      [last.cellId]: last.initialValue,
    });
    last.setValue &&
      last.setValue({ value: last.initialValue, label: last.initialValue });
    setLast(false);
  };

  const DefaultCell = React.memo<React.FC<any>>(({ value, row, cell }) => {
    const zeroSpecies = row.original.speciesName === "0";
    return (
      <EditableCell
        initialValue={value}
        row={row}
        cell={cell}
        dbName={`localities/${
          currentLocality || row.original.siteKey
        }/species/`}
        saveLast={setLast}
        updatekey={row.original.speciesKey}
        disabled={zeroSpecies}
      />
    );
  }, customComparator);

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
    { value: "to be added", label: "to be added" },
    ...speciesNamesOptions,
  ];

  const columns = React.useMemo(
    () => [
      {
        Header: "Species name",
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
              !(
                row.original.speciesNamesKeysinLocality?.length &&
                row.original.speciesNamesKeysinLocality.includes(i.value)
              ) || i.value === "add"
          );
          const isLocalityWithZero = row.original.speciesNameKey === "0";
          return (
            <SelectCell
              backValue={value}
              initialValue={isLocalityWithZero ? "0" : item?.label || ""}
              row={row}
              cell={cell}
              options={filteredOptions}
              saveLast={setLast}
              dbName={`localities/${
                currentLocality || row.original.siteKey
              }/species/`}
              updatekey={row.original.speciesKey}
              className="speciesNameKey"
              isDisabled={isLocalityWithZero}
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
          const isLocalityWithZero = row.original.speciesNameKey === "0";
          return (
            <CreatableSelectCell
              initialValue={value}
              row={row}
              cell={cell}
              options={getOptions(species, "specification")}
              saveLast={setLast}
              updatekey={row.original.speciesKey}
              dbName={`localities/${
                currentLocality || row.original.siteKey
              }/species/`}
              isDisabled={isLocalityWithZero}
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
        accessor: "undef",
        Filter: Multi,
        filter: multiSelectFilter,
      },
      {
        Header: "All",
        accessor: "all",
        Filter: Multi,
        filter: multiSelectFilter,
        Cell: React.memo<React.FC<any>>(
          ({ row: { original } }) => (
            <input
              value={original.speciesName === "0" ? 0 : [original.all] || ""}
              readOnly
              disabled={original.speciesName === "0"}
              className="ultra-narrow"
            ></input>
          ),
          customComparator
        ),
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

  const tableInstance = useTable(
    {
      columns,
      data: species,
      defaultColumn: {
        Cell: DefaultCell,
        Filter: () => {},
      },
      autoResetFilters: false,
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useRowSelect
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div>
      <div className="table-container compact">
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
        <table className="table home" {...getTableProps()}>
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
                                    `localities/${
                                      currentLocality || row.original.key
                                    }/species/` + row.original.speciesKey
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
    </div>
  );
};

export default SpeciesTableHome;
