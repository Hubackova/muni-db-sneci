// @ts-nocheck
import cx from "classnames";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAsyncDebounce } from "react-table";
import { ReactComponent as FilterIcon } from "../images/filter.svg";
import "./Filter.scss";

function debounce(func, timeout = 3000) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

export function useOutsideAlerter(ref, opened, setOpened) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    if (!opened) return;
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpened(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [opened, ref, setOpened]);
}

// Component for Global Filter
export function GlobalFilter({ globalFilter, setGlobalFilter }) {
  const [value, setValue] = useState(globalFilter);

  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <div>
      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="Search Table:"
      />
    </div>
  );
}

export function multiSelectFilter(rows, columnIds, filterValue) {
  return filterValue.length === 0
    ? rows
    : rows.filter((row) => filterValue.includes(row.original[columnIds]));
}
const arrayRemove = (arr, value) => {
  return arr.filter((ele) => ele !== value);
};

const customSort = (a, b) => {
  const typeA = typeof a;
  const typeB = typeof b;

  // Porovnání podle typu
  if (typeA !== typeB) {
    return typeA.localeCompare(typeB);
  }

  // Pokud jsou oba typy čísla, porovnáme je přímo
  if (typeA === "number") {
    return a - b;
  }

  // Pokud jsou oba typy stringy, porovnáme je abecedně
  if (typeA === "string") {
    return a.localeCompare(b);
  }

  // Ostatní případy
  return 0;
};

export function Multi({
  column: { filterValue, setFilter, preFilteredRows, id },
  column,
}) {
  const [opened, setOpened] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [max, setMax] = useState("");
  const [min, setMin] = useState("");
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, opened, setOpened);

  const options = useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    const optValues = [...options.values()];
    const sortedArray = optValues.sort(customSort);

    return sortedArray;
  }, [id, preFilteredRows]);

  const [allMin, allMax] = React.useMemo(() => {
    let allMin = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let allMax = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row) => {
      allMin = Math.min(row.values[id], allMin);
      allMax = Math.max(row.values[id], allMax);
    });

    setMin(allMin);
    setMax(allMax);
    return [allMin, allMax];
  }, [id, preFilteredRows]);

  const selectOptions = searchValue
    ? options
        .filter((i) => {
          if (!i) return false;
          const lower = i.toString().toLowerCase();
          return lower.includes(searchValue);
        })
        .map((i) => ({ value: i, label: i }))
    : options.map((i) => ({ value: i, label: i }));

  // UI for Multi-Select box
  return (
    <div className="filter-wrapper">
      <button
        onClick={() => setOpened(!opened)}
        className={cx("filter-btn", {
          active: filterValue && filterValue.length,
        })}
      >
        <FilterIcon />
      </button>
      {opened && (
        <div className="filter-content" ref={wrapperRef}>
          <div
            {...column.getHeaderProps(column.getSortByToggleProps())}
            className="filter-link"
            style={{ fontWeight: 500 }}
          >
            {column.isSorted
              ? column.isSortedDesc
                ? "Unsort"
                : "Sort Z -> A "
              : "Sort A -> Z"}
          </div>

          <>
            <div
              onClick={() => setFilter(selectOptions.map((i) => i.value))}
              className="filter-link"
              style={{ marginBottom: 2 }}
            >
              Select all
            </div>
            <div
              onClick={() => setFilter([])}
              className="filter-link"
              style={{ marginBottom: 2, color: "red" }}
            >
              Unselect all
            </div>
            <input
              value={searchValue}
              onChange={(e) =>
                setSearchValue(
                  typeof e.target.value === "string"
                    ? e.target.value.toLowerCase()
                    : e.target.value
                )
              }
              placeholder={`Search records...`}
            />
            <hr />
            {(!Number.isNaN(allMin) ||
              column.id === "latitude" ||
              column.id === "longitude") && (
              <>
                <div className="normal">Filter by number</div>
                <input
                  value={min}
                  type="number"
                  placeholder={`Min (${allMin})`}
                  onChange={(e) => {
                    setMin(e.target.value);

                    const filter = () => {
                      const val = e.target.value;
                      const onlyNumbers = options.filter(
                        (element) =>
                          typeof parseFloat(element) === "number" &&
                          element >= parseFloat(val) &&
                          element <= parseFloat(max)
                      );

                      return setFilter(val ? onlyNumbers : []);
                    };

                    const processChange = debounce(() => filter());
                    processChange();
                  }}
                  style={{
                    width: "70px",
                    marginRight: "0.5rem",
                  }}
                />
                to
                <input
                  value={max}
                  type="number"
                  placeholder={`Max (${allMax})`}
                  onChange={(e) => {
                    setMax(e.target.value);
                    const filter = () => {
                      const val = e.target.value;
                      const onlyNumbers = options.filter(
                        (element) =>
                          typeof parseFloat(element) === "number" &&
                          element <= parseFloat(val) &&
                          element >= parseFloat(min)
                      );
                      return setFilter(val ? onlyNumbers : []);
                    };

                    const processChange = debounce(() => filter());
                    processChange();
                  }}
                  style={{
                    width: "80px",
                    marginLeft: "0.5rem",
                  }}
                />
              </>
            )}
          </>

          {selectOptions.map((i) => {
            const isChecked =
              filterValue?.length && filterValue.includes(i.value);

            return (
              <div
                key={i.value}
                className="filter-link"
                onClick={() => {
                  isChecked
                    ? setFilter(arrayRemove(filterValue, i.value))
                    : setFilter(
                        filterValue?.length
                          ? [...filterValue, i.value]
                          : [i.value]
                      );
                }}
              >
                <>
                  {isChecked ? "✅" : "⬜"} {i.value}
                </>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
