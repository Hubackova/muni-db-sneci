// @ts-nocheck
import cx from "classnames";
import moment from "moment";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { ReactComponent as FilterIcon } from "../images/filter.svg";
import { useOutsideAlerter } from "./Filter";
import "./Filter.scss";

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

  const [selectedYear, setSelectedYear] = React.useState(null);
  const [selectedMonth, setSelectedMonth] = React.useState(null);

  const options = useMemo(() => {
    const uniqueOptions = new Set(preFilteredRows.map((row) => row.values[id]));
    return [...uniqueOptions];
  }, [id, preFilteredRows]);

  const allDate = useMemo(() => options.map((date) => moment(date)), [options]);

  const getUniqueValues = useCallback(
    (formatter) => {
      const uniqueValues = new Set(
        allDate.filter((row) => row.isValid()).map(formatter)
      );
      return [...uniqueValues.values()];
    },
    [allDate]
  );

  const yearsAll = useMemo(
    () => getUniqueValues((row) => row.format("YYYY")),
    [getUniqueValues]
  );

  const monthsAll = useMemo(
    () => getUniqueValues((row) => row.format("MM")),
    [getUniqueValues]
  );

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
              <div className="normal">
                <b>Filter by year</b>
              </div>
              {yearsAll
                .sort((a, b) => parseInt(b) - parseInt(a))
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
              <div className="normal">
                <b>Filter by month</b>
              </div>
              {monthsAll
                .sort((a, b) => moment(a).format("MM") - moment(b).format("MM"))
                .map((month, index) => {
                  const monthFormat = moment(month, "MM").format("MMMM");
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
                <div className="normal">
                  <b>Filter by date</b>
                </div>
                <div>
                  {yearsAll
                    .sort((a, b) => parseInt(b) - parseInt(a))
                    .map((year, index) => {
                      const yearFormat = moment(year).format("YYYY");

                      const handleYearClick = () => {
                        setSelectedYear(
                          selectedYear === yearFormat ? null : yearFormat
                        );
                        setSelectedMonth(null);
                      };

                      const monthsWithDays = Array.from(
                        new Set(
                          options
                            .filter(
                              (opt) => moment(opt).format("YYYY") === yearFormat
                            )
                            .map((opt) => moment(opt).format("MM"))
                        )
                      ).sort((a, b) => parseInt(a) - parseInt(b));

                      return (
                        <div key={index} className="filter-link">
                          <span onClick={handleYearClick}>{yearFormat}</span>

                          {selectedYear === yearFormat && (
                            <div>
                              {monthsWithDays.map((month, index) => {
                                const monthFormat = moment(month, "MM").format(
                                  "MMMM"
                                );

                                const handleMonthClick = () => {
                                  setSelectedMonth(
                                    selectedMonth === month ? null : month
                                  );
                                };

                                return (
                                  <div
                                    key={index}
                                    className="filter-link month"
                                  >
                                    <span onClick={handleMonthClick}>
                                      {monthFormat}
                                    </span>

                                    {selectedMonth === month && (
                                      <div>
                                        {Array.from(
                                          new Set(
                                            options
                                              .filter(
                                                (opt) =>
                                                  moment(opt).format(
                                                    "YYYY-MM"
                                                  ) === `${yearFormat}-${month}`
                                              )
                                              .map((day) =>
                                                moment(day).format("DD")
                                              )
                                          )
                                        )
                                          .sort(
                                            (a, b) => parseInt(a) - parseInt(b)
                                          )
                                          .map((dayFormat, index) => {
                                            const isCheckedDay =
                                              filterValue?.some(
                                                (val) =>
                                                  moment(val).format(
                                                    "YYYY-MM-DD"
                                                  ) ===
                                                  `${yearFormat}-${month}-${dayFormat}`
                                              );

                                            const handleDayClick = () => {
                                              const selectedOptionsDay =
                                                options.filter(
                                                  (opt) =>
                                                    moment(opt).format(
                                                      "YYYY-MM-DD"
                                                    ) ===
                                                    `${yearFormat}-${month}-${dayFormat}`
                                                );

                                              isCheckedDay
                                                ? setFilter(
                                                    arrayRemoveArr(
                                                      filterValue,
                                                      selectedOptionsDay
                                                    )
                                                  )
                                                : setFilter(
                                                    filterValue?.length
                                                      ? [
                                                          ...filterValue,
                                                          ...selectedOptionsDay,
                                                        ]
                                                      : selectedOptionsDay
                                                  );
                                            };

                                            return (
                                              <div
                                                key={index}
                                                className="filter-link day"
                                              >
                                                <span onClick={handleDayClick}>
                                                  {isCheckedDay ? "✅" : "⬜"}
                                                  {dayFormat}
                                                </span>
                                              </div>
                                            );
                                          })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            </>
          </>
        </div>
      )}
    </div>
  );
}
