// @ts-nocheck
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAppStateContext } from "../../AppStateContext";
import { writeSpeciesToLocalityData } from "../../firebase/firebase";
import { getValueFromOptions } from "../../helpers/utils";
import CreatableSelectInput from "../CreatableSelectInput";
import SelectInput from "../SelectInput";
import TextInput from "../TextInput";
import "./NewForm.scss";
import { useTable } from "react-table";

const SpeciesAtLocalityForm: React.FC = ({
  withLabels = true,
  speciesNames,
  specificationOptions,
}) => {
  const { currentLocality } = useAppStateContext();
  const [disabled, setDisabled] = useState(false);
  const [species, setSpecies] = useState([]);
  const [speciesName, setSpeciesName] = useState("");
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    control,
  } = useForm<PrimersType>();

  const addItem = (data: any) => {
    if (!data.speciesNameKey) return toast.error("Species name is required");

    data.empty = data.empty ? parseInt(data.empty) : undefined;
    data.live = data.live ? parseInt(data.live) : undefined;
    data.undef = data.undef ? parseInt(data.undef) : undefined;

    const all =
      !data.live && !data.empty && !data.undef
        ? ""
        : parseInt(data.live || 0) +
          parseInt(data.empty || 0) +
          parseInt(data.undef || 0);
    setValue("speciesNameKey", "");
    setValue("specification", "");
    setValue("live", "");
    setValue("empty", "");
    setValue("undef", "");
    setValue("lot", "");
    setValue("vouchers", "");
    setValue("note", "");
    if (species.find((i) => i.speciesName === speciesName))
      return toast.error("This species is already on the list");
    setSpecies([...species, { ...data, speciesName, all }]);
  };

  const saveSpeciesToDb = () => {
    species.map((i) => {
      const { speciesName, all, ...rest } = i;
      return writeSpeciesToLocalityData(rest, currentLocality);
    });
    setSpeciesName("");
    setSpecies([]);
    toast.success("Species was added successfully");
  };

  const speciesNamesOptions = speciesNames
    .map((i: any) => {
      return {
        value: i.key,
        label: i.speciesName,
      };
    })
    .sort(function (a, b) {
      if (a.label < b.label) {
        return -1;
      }
      if (a.label > b.label) {
        return 1;
      }
      return 0;
    });

  const columns = React.useMemo(
    () => [
      {
        Header: "Species Name",
        accessor: "speciesName",
      },
      {
        Header: "Specification",
        accessor: "specification",
      },
      {
        Header: "Live",
        accessor: "live",
      },
      {
        Header: "Empty",
        accessor: "empty",
      },
      {
        Header: "Undef.",
        accessor: "undef",
      },
      {
        Header: "All",
        accessor: "all",
      },
      {
        Header: "Lot no.",
        accessor: "lot",
      },
      {
        Header: "Vouchers",
        accessor: "vouchers",
      },
      {
        Header: "Note",
        accessor: "note",
      },
    ],
    []
  );
  const tableInstance = useTable({ columns, data: species });
  const { getTableProps, getTableBodyProps, rows, prepareRow } = tableInstance;
  return (
    <>
      <table className="table wip" {...getTableProps()}>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.original.key}>
                <td role="cell" className="remove">
                  <button
                    onClick={() => {
                      const newArrayOfObjects = species.filter(
                        (obj) => obj.speciesName !== row.original.speciesName
                      );

                      setSpecies(newArrayOfObjects);
                    }}
                  >
                    X
                  </button>
                </td>
                {row.cells.map((cell) => {
                  return (
                    <td key={row.id + cell.column.id} {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <form
        className="form compact species-table"
        onSubmit={handleSubmit(addItem)}
      >
        <div className="row">
          <Controller
            render={({ field: { onChange, value } }) => {
              const item = getValueFromOptions(value, speciesNamesOptions);
              return (
                <SelectInput
                  options={speciesNamesOptions}
                  value={value ? { value, label: item?.label || "" } : null}
                  onChange={(e: any) => {
                    const item = getValueFromOptions(
                      e?.value,
                      speciesNamesOptions
                    );
                    setSpeciesName(item?.label);
                    onChange(e?.value);
                    if (e?.value === "0") setDisabled(true);
                  }}
                  label={withLabels && "Species name"}
                  error={errors.speciesName?.message}
                  isSearchable
                  className=""
                />
              );
            }}
            control={control}
            name="speciesNameKey"
            required="This field is required"
          />
          <Controller
            render={({ field: { onChange, value } }) => {
              return (
                <CreatableSelectInput
                  options={specificationOptions}
                  value={value ? { value, label: value } : null}
                  onChange={(e: any) => onChange(e?.value)}
                  label={withLabels && "Specification"}
                  error={errors.specification?.message}
                  isSearchable
                  className="short"
                  disabled={disabled}
                />
              );
            }}
            control={control}
            name="specification"
          />
          <TextInput
            label={withLabels && "Live"}
            name="live"
            register={register}
            type="number"
            className="ultra-narrow"
            min={0}
            step="1"
            disabled={disabled}
          />
          <TextInput
            label={withLabels && "Empty"}
            name="empty"
            register={register}
            type="number"
            className="ultra-narrow"
            min={0}
            step="1"
            disabled={disabled}
          />
          <TextInput
            label={withLabels && "Undefined"}
            name="undef"
            register={register}
            type="number"
            className="ultra-narrow"
            min={0}
            step="1"
            disabled={disabled}
          />
          <TextInput
            label={withLabels && "Lot no."}
            name="lot"
            register={register}
            type="number"
            min={0}
            className="ultra-narrow"
            step="1"
            disabled={disabled}
          />
          <TextInput
            label={withLabels && "Vouchers"}
            name="vouchers"
            register={register}
            type="number"
            min={0}
            className="narrow"
            step="1"
            disabled={disabled}
          />
          <TextInput
            className="double"
            label={withLabels && "Note (species)"}
            name="note"
            register={register}
            disabled={disabled}
          />
        </div>
        <div className="btn-wrapper">
          <button className="submit-btn" type="submit">
            Pre-save new
          </button>
          <button
            className="submit-btn"
            type="button"
            onClick={saveSpeciesToDb}
            disabled={species.length === 0}
          >
            Save species list
          </button>
        </div>
        {/* <button
        className="submit-btn"
        type="button"
        onClick={() => addItemsBackup()}
      >
        Backup
      </button> */}
      </form>
    </>
  );
};

export default SpeciesAtLocalityForm;
