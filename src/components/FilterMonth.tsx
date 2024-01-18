// @ts-nocheck
import moment from "moment";
import React, { useCallback, useMemo, useRef, useState } from "react";
import "./Filter.scss";

export const FilterMonth: React.FC<any> = ({
  setFilter,
  options,
  monthsAll,
  filterValue,
}) => {
  return (
    <div>
      {monthsAll
        .sort((a, b) => moment(a).format("MM") - moment(b).format("MM"))
        .map((month, index) => {
          const monthFormat = moment(month).format("MM");
          const isChecked = filterValue?.some(
            (val) => moment(val).format("MM") === monthFormat
          );
          const selectedOptions = options.get(monthFormat) || [];

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
    </div>
  );
};
