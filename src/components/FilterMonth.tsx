// @ts-nocheck
import moment from "moment";
import React from "react";
import "./Filter.scss";
import { arrayRemoveArr } from "../helpers/utils";

export const FilterMonth: React.FC<any> = ({
  setFilter,
  options,
  monthsAll,
  filterValue,
}) => {
  return (
    <div>
      {monthsAll
        .sort((a, b) => a - b)
        .map((month, index) => {
          const local = moment.utc(month, "MM-DD-YYYY HH:mm:ss").local();
          const monthFormat = moment(local, "YYYY-MM-DD HH:mm:ss").format("MM");
          const isChecked = filterValue?.some((val) => {
            console.log(monthsAll, val, moment(val).format("mm"), month);
            return moment(val).format("MM") === month;
          });

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
