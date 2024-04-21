// @ts-nocheck
import moment from "moment";
import React from "react";
import "./Filter.scss";
import { arrayRemoveArr } from "../helpers/utils";

const getFilterStatusByYear = (originalDates, filteredDates) => {
  let years = {};

  // Rozdělení dat do skupin podle roku
  originalDates.forEach((date) => {
    if (!date) return;
    const year = date.toString().split("-")[0];
    if (!years[year]) {
      years[year] = { total: 0, filtered: 0 };
    }
    years[year].total++;
  });

  // Určení počtu vyfiltrovaných dat pro každý rok
  filteredDates.forEach((date) => {
    if (!date) return;
    const year = date.toString().split("-")[0];
    if (years[year]) {
      years[year].filtered++;
    }
  });

  // Porovnání a určení stavu pro každý rok
  let result = {};
  Object.keys(years).forEach((year) => {
    const { total, filtered } = years[year];
    if (filtered === total) {
      result[year] = "all";
    } else if (filtered > 0) {
      result[year] = "some";
    } else {
      result[year] = "none";
    }
  });

  return result;
};

// Funkce pro zjištění, zda máte vyfiltrované všechny, některé nebo žádné měsíce pro daný rok
const getFilterStatusByYearAndMonth = (originalDates, filteredDates) => {
  const yearsMonths = {};

  // Rozdělení dat do skupin podle roku a měsíce
  originalDates.forEach((date) => {
    if (!date) return;
    const [year, month] = date.toString().split("-").slice(0, 2);
    const key = `${year}-${month}`;

    if (!yearsMonths[key]) {
      yearsMonths[key] = { total: 0, filtered: 0 };
    }
    yearsMonths[key].total++;
  });

  // Určení počtu vyfiltrovaných dat pro každý rok a měsíc
  filteredDates.forEach((date) => {
    if (!date) return;
    const [year, month] = date.toString().split("-").slice(0, 2);
    const key = `${year}-${month}`;

    if (yearsMonths[key]) {
      yearsMonths[key].filtered++;
    }
  });

  // Porovnání a určení stavu pro každý rok a měsíc
  const result = {};
  Object.keys(yearsMonths).forEach((key) => {
    const { total, filtered } = yearsMonths[key];
    if (filtered === total) {
      result[key] = "all";
    } else if (filtered > 0) {
      result[key] = "some";
    } else {
      result[key] = "none";
    }
  });

  return result;
};

export const FilterDay: React.FC<any> = ({
  setFilter,
  options,
  yearsAll,
  filterValue = options,
}) => {
  const [selectedYear, setSelectedYear] = React.useState(null);
  const [selectedMonth, setSelectedMonth] = React.useState(null);

  if (!options) return null;

  const filterStatusByYear = getFilterStatusByYear(options, filterValue);
  const filterStatusByYearAndMonth = getFilterStatusByYearAndMonth(
    options,
    filterValue
  );

  const handleYearOpen = (yearFormat: string) => {
    setSelectedYear(selectedYear === yearFormat ? null : yearFormat);
    setSelectedMonth(null);
  };
  const handleYearFilter = (year: string, yearStatus: string) => {
    const selectedOptionsYear = options.filter(
      (opt) => moment(opt).format("YYYY") === year
    );
    yearStatus !== "none"
      ? setFilter(arrayRemoveArr(filterValue, selectedOptionsYear))
      : setFilter(
          filterValue?.length
            ? [...filterValue, ...selectedOptionsYear]
            : selectedOptionsYear
        );
  };

  const handleMonthOpen = (month: string) => {
    setSelectedMonth(selectedMonth === month ? null : month);
  };

  const handleMonthFilter = (month: string, monthStatus: string) => {
    const selectedOptionsMonth = options.filter(
      (opt) => moment(opt).format("YYYY-MM") === `${selectedYear}-${month}`
    );
    monthStatus !== "none"
      ? setFilter(arrayRemoveArr(filterValue, selectedOptionsMonth))
      : setFilter(
          filterValue?.length
            ? [...filterValue, ...selectedOptionsMonth]
            : selectedOptionsMonth
        );
  };
  const handleNaClick = (active: boolean) => {
    if (active) setFilter([...filterValue, "na"]);
    if (!active) {
      const newFilterValues = filterValue.filter((i) => i !== "na");
      setFilter(newFilterValues);
    }
  };
  const isCheckedNa = filterValue.find((i) => i === "na");
  return (
    <div>
      {yearsAll
        .sort((a, b) => parseInt(b) - parseInt(a))
        .map((year, index) => {
          const yearStatus = filterStatusByYear[year];
          const monthsWithDays = Array.from(
            new Set(
              options
                .filter((opt) => moment(opt).format("YYYY") === year)
                .map((opt) => moment(opt).format("MM"))
            )
          ).sort((a, b) => parseInt(a) - parseInt(b));

          return (
            <div key={index} className="filter-link">
              <span onClick={() => handleYearFilter(year, yearStatus)}>
                {yearStatus === "all"
                  ? "✅"
                  : yearStatus === "some"
                  ? "⏺️"
                  : "⬜"}
              </span>
              <span onClick={() => handleYearOpen(year)}>{year}</span>

              {selectedYear === year && (
                <div>
                  {monthsWithDays.map((month, monthIndex) => {
                    const yearmonth = `${year}-${month}`;
                    const monthStatus = filterStatusByYearAndMonth[yearmonth];
                    return (
                      <div key={monthIndex} className="filter-link month">
                        <span
                          onClick={() => handleMonthFilter(month, monthStatus)}
                        >
                          {monthStatus === "all"
                            ? "✅"
                            : monthStatus === "some"
                            ? "⏺️"
                            : "⬜"}
                        </span>
                        <span onClick={() => handleMonthOpen(month)}>
                          {month}
                        </span>
                        {selectedMonth === month && (
                          <div>
                            {Array.from(
                              new Set(
                                options
                                  .filter(
                                    (opt) =>
                                      moment(opt).format("YYYY-MM") ===
                                      `${selectedYear}-${month}`
                                  )
                                  .map((day) => moment(day).format("DD"))
                              )
                            )
                              .sort((a, b) => parseInt(a) - parseInt(b))
                              .map((dayFormat, dayIndex) => {
                                const isCheckedDay = filterValue?.some(
                                  (val) =>
                                    moment(val).format("YYYY-MM-DD") ===
                                    `${selectedYear}-${month}-${dayFormat}`
                                );

                                const handleDayClick = () => {
                                  const selectedOptionsDay = options.filter(
                                    (opt) =>
                                      moment(opt).format("YYYY-MM-DD") ===
                                      `${selectedYear}-${month}-${dayFormat}`
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
                                    key={dayIndex}
                                    onClick={handleDayClick}
                                    className="filter-link day"
                                  >
                                    <span>
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
      <div onClick={() => handleNaClick(!isCheckedNa)} className="filter-link">
        <span>
          {isCheckedNa ? "✅" : "⬜"}
          na
        </span>
      </div>
    </div>
  );
};
