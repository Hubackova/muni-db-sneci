// @ts-nocheck
import cx from "classnames";
import moment from "moment";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { ReactComponent as FilterIcon } from "../images/filter.svg";
import { useOutsideAlerter } from "./Filter";

import { FilterDay } from "./FilterDay";
import "./Filter.scss";

export function MultiDate({
  column: { filterValue, setFilter, preFilteredRows, id },
  column,
}) {
  const now = moment().format("YYYY-MM-DD");
  const [opened, setOpened] = useState(false);
  const [maxDate, setMaxDate] = useState(now);
  const [minDate, setMinDate] = useState(now);

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, opened, setOpened);

  const options = useMemo(() => {
    const uniqueOptions = new Set(preFilteredRows.map((row) => row.values[id]));
    return [...uniqueOptions];
  }, [id, preFilteredRows]);

  const getMomentArray = useMemo(() => {
    const momentMap = new Map();
    return (dates) => {
      return dates.map((date) => {
        if (!momentMap.has(date)) {
          momentMap.set(date, moment(date));
        }
        return momentMap.get(date);
      });
    };
  }, []);

  const allDate = useMemo(
    () => getMomentArray(options),
    [getMomentArray, options]
  );

  const getUniqueValues = useCallback(
    (formatter) => {
      const uniqueValues = new Set(
        allDate.filter((row) => row.isValid()).map(formatter)
      );
      return [...uniqueValues.values()];
    },
    [allDate]
  );

  const { yearsAll } = useMemo(() => {
    return {
      yearsAll: getUniqueValues((row) => row.format("YYYY")),
    };
  }, [getUniqueValues]);

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
              onClick={() => setFilter(options)}
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
            <hr />
            <button
              onClick={() => {
                let dates = options.filter(
                  (element) =>
                    moment(element).isSameOrAfter(moment(minDate)) &&
                    moment(element).isSameOrBefore(moment(maxDate))
                );
                setFilter(dates);
              }}
            >
              Filter from - to
            </button>
            <div className="normal">Date from</div>
            <input
              type="date"
              value={minDate}
              onChange={(e) => {
                setMinDate(e.target.value);
              }}
            />
            <div className="normal">Date to</div>
            <input
              type="date"
              value={maxDate}
              onChange={(e) => {
                setMaxDate(e.target.value);
              }}
            />

            <hr />

            <div>
              <div>
                <b>Filter by date</b>
              </div>

              <FilterDay
                setFilter={setFilter}
                options={options}
                yearsAll={yearsAll}
                filterValue={filterValue}
              />

              <hr />
            </div>
          </>
        </div>
      )}
    </div>
  );
}
