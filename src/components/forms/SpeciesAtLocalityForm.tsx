// @ts-nocheck
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAppStateContext } from "../../AppStateContext";
import { backup } from "../../content/species";
import { writeSpeciesToLocalityData } from "../../firebase/firebase";
import SelectInput from "../SelectInput";
import TextInput from "../TextInput";
import { specificationOptions } from "../tables/LocalitiesAndSpeciesTable";
import "./NewSampleForm.scss";

const SpeciesAtLocalityForm: React.FC = ({
  compact = false,
  withLabels = true,
  speciesNames,
}) => {
  const { currentLocality } = useAppStateContext();

  const addItem = (data: any) => {
    writeSpeciesToLocalityData(data, currentLocality);
    toast.success("Species was added successfully");
  };

  const addItemsBackup = () => {
    backup.forEach((i: any) => writeSpeciesToLocalityData(i, 3));
    toast.success("ok");
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    watch,
    setValue,
    control,
  } = useForm<PrimersType>();

  const field1Value = watch("live");
  const field2Value = watch("empty");
  const field3Value = watch("undefined");
  const sum =
    parseInt(field1Value) + parseInt(field2Value) + parseInt(field3Value);

  const speciesNamesOptions = speciesNames
    .map((i: any) => ({
      value: i,
      label: i,
    }))
    .sort(function (a, b) {
      if (a.label < b.label) {
        return -1;
      }
      if (a.label > b.label) {
        return 1;
      }
      return 0;
    });

  const speciesNamesOptionsAll = [
    { value: "add", label: "to be added" },
    { value: "0", label: "0" },
    ...speciesNamesOptions,
  ];

  return (
    <form
      className="form compact species-table"
      onSubmit={handleSubmit(addItem)}
    >
      <div className="row">
        <Controller
          render={({ field: { onChange, value } }) => {
            return (
              <SelectInput
                options={speciesNamesOptionsAll}
                value={value ? { value, label: value } : null}
                onChange={(e: any) => {
                  onChange(e?.value);
                }}
                label={withLabels && "Species name"}
                error={errors.speciesName?.message}
                isSearchable
              />
            );
          }}
          control={control}
          name="speciesName"
          required="This field is required"
        />
        <Controller
          render={({ field: { onChange, value } }) => {
            return (
              <SelectInput
                options={specificationOptions}
                value={value ? { value, label: value } : null}
                onChange={(e: any) => {
                  onChange(e?.value);
                }}
                label={withLabels && "Specification"}
                error={errors.specification?.message}
                className="short"
                isSearchable
              />
            );
          }}
          control={control}
          name="specification"
        />
        <TextInput
          label={withLabels && "Live individuals"}
          name="live"
          error={errors.latitude?.message}
          register={register}
          onBlur={() => setValue("all", sum)}
          type="number"
          className="narrow"
          min={0}
          step="1"
        />
        <TextInput
          label={withLabels && "Empty shells"}
          name="empty"
          error={errors.longitude?.message}
          register={register}
          onBlur={() => setValue("all", sum)}
          type="number"
          className="narrow"
          min={0}
          step="1"
        />
        <TextInput
          label={withLabels && "Undefined"}
          name="undefined"
          error={errors.longitude?.message}
          register={register}
          onBlur={() => setValue("all", sum)}
          type="number"
          className="narrow"
          min={0}
          step="1"
        />
        <TextInput
          label={withLabels && "All"}
          name="all"
          error={errors.country?.message}
          register={register}
          readOnly={true}
          className="narrow"
          type="number"
          min={0}
          step="1"
        />
        <TextInput
          label={withLabels && "Lot number:"}
          name="lot"
          error={errors.country?.message}
          register={register}
          type="number"
          min={0}
          className="narrow"
          step="1"
        />
        <TextInput
          label={withLabels && "Vouchers"}
          name="vouchers"
          error={errors.country?.message}
          register={register}
          type="number"
          min={0}
          className="narrow"
          step="1"
        />
        <TextInput
          label={withLabels && "Note (species)"}
          name="noteSpecies"
          error={errors.country?.message}
          register={register}
        />
      </div>

      <button className="submit-btn" type="submit">
        Save
      </button>
      {/*       <button
        className="submit-btn"
        type="button"
        onClick={() => addItemsBackup()}
      >
        Backup
      </button> */}
    </form>
  );
};

export default SpeciesAtLocalityForm;
