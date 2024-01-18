// @ts-nocheck
import moment from "moment";
import React, { useCallback, useMemo, useRef, useState } from "react";
import "./Filter.scss";
import { arrayRemoveArr } from "../helpers/utils";

export const FilterYear: React.FC<any> = ({
  setFilter,
  options,
  yearsAll,
  filterValue,
}) => {
  return (
    <div>
      {yearsAll
        .sort((a, b) => parseInt(b) - parseInt(a))
        .map((year, index) => {
          const yearFormat = moment(year).format("YYYY");

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

          const isChecked = filterValue?.some(
            (val) => moment(val).format("YYYY") === yearFormat
          );

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
    </div>
  );
};
