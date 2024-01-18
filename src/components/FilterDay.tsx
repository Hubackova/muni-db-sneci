// @ts-nocheck
import moment from "moment";
import React, { useCallback, useMemo, useRef, useState } from "react";
import "./Filter.scss";

export const FilterDay: React.FC<any> = ({
  setFilter,
  options,
  yearsAll,
  filterValue,
}) => {
  const [selectedYear, setSelectedYear] = React.useState(null);

  return (
    <div>
      {yearsAll
        .sort((a, b) => parseInt(b) - parseInt(a))
        .map((year, index) => {
          const yearFormat = moment(year).format("YYYY");

          const handleYearClick = () => {
            setSelectedYear(selectedYear === yearFormat ? null : yearFormat);
          };

          const monthsWithDays = Array.from(
            new Set(
              options
                .filter((opt) => moment(opt).format("YYYY") === yearFormat)
                .map((opt) => moment(opt).format("MM"))
            )
          ).sort((a, b) => parseInt(a) - parseInt(b));

          return (
            <div key={index} className="filter-link">
              <span onClick={handleYearClick}>{yearFormat}</span>

              {selectedYear === yearFormat && (
                <div>
                  {monthsWithDays.map((month, index) => {
                    const monthFormat = moment(month, "MM").format("MMMM");

                    return (
                      <div key={index} className="filter-link month">
                        <span>{monthFormat}</span>

                        <div>
                          {Array.from(
                            new Set(
                              options
                                .filter(
                                  (opt) =>
                                    moment(opt).format("YYYY-MM") ===
                                    `${yearFormat}-${month}`
                                )
                                .map((day) => moment(day).format("DD"))
                            )
                          )
                            .sort((a, b) => parseInt(a) - parseInt(b))
                            .map((dayFormat, index) => {
                              const isCheckedDay = filterValue?.some(
                                (val) =>
                                  moment(val).format("YYYY-MM-DD") ===
                                  `${yearFormat}-${month}-${dayFormat}`
                              );

                              const handleDayClick = () => {
                                const selectedOptionsDay = options.filter(
                                  (opt) =>
                                    moment(opt).format("YYYY-MM-DD") ===
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
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};
