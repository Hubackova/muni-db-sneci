// @ts-nocheck
import cx from "classnames";
import moment from "moment";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { ReactComponent as FilterIcon } from "../images/filter.svg";
import { useOutsideAlerter } from "./Filter";
import { FilterYear } from "./FilterYear";
import { FilterMonth } from "./FilterMonth";
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
  const [specificFilter, setSpecificFliter] = useState(null);
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

  const { yearsAll, monthsAll } = useMemo(() => {
    return {
      yearsAll: getUniqueValues((row) => row.format("YYYY")),
      monthsAll: getUniqueValues((row) => row.format("MM")),
    };
  }, [getUniqueValues]);

  const monthOptionsMap = useMemo(() => {
    const map = new Map();
    options.forEach((opt) => {
      const monthKey = moment(opt).format("MM");
      if (!map.has(monthKey)) {
        map.set(
          monthKey,
          options.filter((o) => moment(o).format("MM") === monthKey)
        );
      }
    });
    return map;
  }, [options]);

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

            <div
              className="normal clickable"
              onClick={() => setSpecificFliter("year")}
            >
              <b>Filter by year</b>
            </div>
            {specificFilter === "year" && (
              <FilterYear
                setFilter={setFilter}
                options={options}
                yearsAll={yearsAll}
                filterValue={filterValue}
              />
            )}
            <hr />

            <div
              className="normal clickable"
              onClick={() => setSpecificFliter("month")}
            >
              <b>Filter by month</b>
            </div>
            {specificFilter === "month" && (
              <FilterMonth
                setFilter={setFilter}
                options={monthOptionsMap}
                monthsAll={monthsAll}
                filterValue={filterValue}
              />
            )}
            <hr />

            <div>
              <div
                className="normal clickable"
                onClick={() => setSpecificFliter("day")}
              >
                <b>Filter by date</b>
              </div>
              {specificFilter === "day" && (
                <FilterDay
                  setFilter={setFilter}
                  options={options}
                  yearsAll={yearsAll}
                  filterValue={filterValue}
                />
              )}
              <hr />
            </div>
          </>
        </div>
      )}
    </div>
  );
}
