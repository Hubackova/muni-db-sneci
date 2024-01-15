// @ts-nocheck
import cx from "classnames";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ReactComponent as FilterIcon } from "../images/filter.svg";
import "./Filter.scss";

function useOutsideAlerter(ref, opened, setOpened) {
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

export function MultiDate({
  column: { filterValue, setFilter, preFilteredRows, id },
  column,
}) {
  const now = moment().format("YYYY-MM-DD");
  const [opened, setOpened] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [maxDate, setMaxDate] = useState(now);
  const [minDate, setMinDate] = useState(now);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, opened, setOpened);

  const options = useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    const optValues = [...options.values()];

    return optValues;
  }, [id, preFilteredRows]);

  const allDate = useMemo(() => {
    return options.filter((i) => !!i).map((date) => moment(date));
  }, [options]);

  React.useMemo(() => {
    const calculatedMinDate = moment.min(allDate).format("YYYY-MM-DD");
    const calculatedMaxDate = moment.max(allDate).format("YYYY-MM-DD");

    setMinDate(calculatedMinDate);
    setMaxDate(calculatedMaxDate);
  }, [allDate]);

  const selectOptions = searchValue
    ? options
        .filter((i) => {
          if (!i) return false;
          const lower = i.toString().toLowerCase();
          return lower.includes(searchValue);
        })
        .map((i) => ({ value: i, label: i }))
    : options.map((i) => ({ value: i, label: i }));

  const yearsAll = useMemo(() => {
    const years = new Set();
    allDate.forEach((row) => {
      if (row.isValid()) years.add(row.format("YYYY"));
    });
    return [...years.values()];
  }, [allDate]);

  const monthsAll = useMemo(() => {
    const months = new Set();
    allDate.forEach((row) => {
      if (row.isValid()) months.add(row.format("MM"));
    });
    return [...months.values()];
  }, [allDate]);

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

            <>
              <div className="normal">Date from</div>
              <input
                type="date"
                value={minDate}
                onChange={(e) => {
                  setMinDate(e.target.value);
                  const val = e.target.value;
                  let dates = options.filter(
                    (element) =>
                      moment(element).isSameOrAfter(moment(val)) &&
                      moment(element).isSameOrBefore(moment(maxDate))
                  );

                  setFilter(val ? dates : []);
                }}
              />
              <div className="normal">Date to</div>
              <input
                type="date"
                value={maxDate}
                onChange={(e) => {
                  setMaxDate(e.target.value);
                  const val = e.target.value;
                  let dates = options.filter(
                    (element) =>
                      moment(element).isSameOrBefore(moment(val)) &&
                      moment(element).isSameOrAfter(moment(minDate))
                  );

                  setFilter(val ? dates : []);
                }}
              />

              <div className="normal">Filter by year</div>
              {yearsAll
                .sort((a, b) => parseInt(b) - parseInt(a)) // Seřadí roky od nejnovějšího po nejstarší
                .map((year, index) => {
                  const yearFormat = moment(year).format("YYYY");
                  const isChecked = filterValue?.some(
                    (val) => moment(val).format("YYYY") === yearFormat
                  );
                  const selectedOptions = options.filter(
                    (opt) => moment(opt).format("YYYY") === yearFormat
                  );

                  const handleFilterClick = () => {
                    isChecked
                      ? setFilter(arrayRemoveArr(filterValue, selectedOptions))
                      : setFilter(
                          filterValue?.length
                            ? [...filterValue, ...selectedOptions]
                            : selectedOptions
                        );
                  };

                  return (
                    <div
                      key={index}
                      className="filter-link"
                      onClick={handleFilterClick}
                    >
                      {isChecked ? "✅" : "⬜"} {yearFormat}
                    </div>
                  );
                })}

              <div className="normal">Filter by month</div>
              {monthsAll
                .sort((a, b) => moment(a).format("MM") - moment(b).format("MM"))
                .map((month, index) => {
                  const monthFormat = moment(month).format("MM");
                  const isChecked = filterValue?.some(
                    (val) => moment(val).format("MM") === monthFormat
                  );
                  const selectedOptions = options.filter(
                    (opt) => moment(opt).format("MM") === monthFormat
                  );

                  const handleFilterClick = () => {
                    isChecked
                      ? setFilter(arrayRemoveArr(filterValue, selectedOptions))
                      : setFilter(
                          filterValue?.length
                            ? [...filterValue, ...selectedOptions]
                            : selectedOptions
                        );
                  };

                  return (
                    <div
                      key={index}
                      className="filter-link"
                      onClick={handleFilterClick}
                    >
                      {isChecked ? "✅" : "⬜"} {monthFormat}
                    </div>
                  );
                })}

              <hr />

              <div>
                <div className="normal">Filter by date</div>
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
            </>
          </>
        </div>
      )}
    </div>
  );
}
