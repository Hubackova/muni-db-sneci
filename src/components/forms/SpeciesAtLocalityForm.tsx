// @ts-nocheck
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAppStateContext } from "../../AppStateContext";
/* import { backup } from "../../content/species"; */
import { writeSpeciesToLocalityData } from "../../firebase/firebase";
import { getValueFromOptions } from "../../helpers/utils";
import CreatableSelectInput from "../CreatableSelectInput";
import SelectInput from "../SelectInput";
import TextInput from "../TextInput";
import "./NewSampleForm.scss";

const SpeciesAtLocalityForm: React.FC = ({
  withLabels = true,
  speciesNames,
  specificationOptions,
  withZero = false,
  localities,
}) => {
  const { currentLocality } = useAppStateContext();
  const [disabled, setDisabled] = useState(false);

  function processItems(items) {
    var index = 0;
    function processNextItem() {
      if (index < items.length) {
        processItem(items[index]);
        index++;
        setTimeout(processNextItem, 0); // Yield control
      }
    }
    processNextItem();
  }

  function processItem(i) {
    const { speciesName, siteId, ...data } = i;
    data.speciesNameKey = speciesNames.find(
      (species) => species.speciesName === i.speciesName
    )?.key;
    const localityKey = localities.find((loc) => loc.siteId === i.siteId)?.key;
    writeSpeciesToLocalityData(data, localityKey);
  }

  /*   const addItemsBackup = () => {
    processItems(backup.slice(501, 1000));
  };
 */
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
  } = useForm<PrimersType>();

  const addItem = (data: any) => {
    if (!data.speciesNameKey) return toast.error("Species name is required");
    const { hack, all, ...withoutAllData } = data;
    withoutAllData.empty = withoutAllData.empty
      ? parseInt(withoutAllData.empty)
      : undefined;
    withoutAllData.live = withoutAllData.live
      ? parseInt(withoutAllData.live)
      : undefined;
    withoutAllData.undef = withoutAllData.undef
      ? parseInt(withoutAllData.undef)
      : undefined;
    reset();
    writeSpeciesToLocalityData(withoutAllData, currentLocality);
    toast.success("Species was added successfully");
  };

  const field1Value = watch("live");
  const field2Value = watch("empty");
  const field3Value = watch("undef");
  const sum =
    parseInt(field1Value || 0) +
    parseInt(field2Value || 0) +
    parseInt(field3Value || 0);

  const speciesNamesOptions = speciesNames
    .map((i: any) => ({
      value: i.key,
      label: i.speciesName,
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

  const plusOptions = withZero
    ? [
        { value: "add", label: "to be added" },
        { value: "0", label: "0" },
      ]
    : [{ value: "add", label: "to be added" }];

  const speciesNamesOptionsAll = [...plusOptions, ...speciesNamesOptions];

  return (
    <form
      className="form compact species-table"
      onSubmit={handleSubmit(addItem)}
    >
      <div className="row">
        <Controller
          render={({ field: { onChange, value } }) => {
            const item = getValueFromOptions(value, speciesNamesOptionsAll);
            return (
              <SelectInput
                options={speciesNamesOptionsAll}
                value={value ? { value, label: item?.label || "" } : null}
                onChange={(e: any) => {
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
        <input {...register("hack")} style={{ display: "none" }} />
        <TextInput
          label={withLabels && "Live"}
          name="live"
          error={errors.latitude?.message}
          register={register}
          onBlur={() => setValue("all", sum)}
          type="number"
          className="ultra-narrow"
          min={0}
          step="1"
          disabled={disabled}
        />
        <TextInput
          label={withLabels && "Empty"}
          name="empty"
          error={errors.longitude?.message}
          register={register}
          onBlur={() => setValue("all", sum)}
          type="number"
          className="ultra-narrow"
          min={0}
          step="1"
          disabled={disabled}
        />
        <TextInput
          label={withLabels && "Undefined"}
          name="undef"
          error={errors.longitude?.message}
          register={register}
          onBlur={() => setValue("all", sum)}
          type="number"
          className="ultra-narrow"
          min={0}
          step="1"
          disabled={disabled}
        />
        <TextInput
          label={withLabels && "All"}
          name="all"
          register={register}
          readOnly={true}
          className="ultra-narrow"
          type="number"
          min={0}
          step="1"
          disabled={disabled}
        />
        <TextInput
          label={withLabels && "Lot no."}
          name="lot"
          error={errors.lot?.message}
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
          error={errors.vouchers?.message}
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
          name="noteSpecies"
          error={errors.noteSpecies?.message}
          register={register}
          disabled={disabled}
        />
      </div>

      <button className="submit-btn" type="submit">
        Save
      </button>

      {/* <button
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
