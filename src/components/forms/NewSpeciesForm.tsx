// @ts-nocheck
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAppStateContext } from "../../AppStateContext";
import { writeSpeciesNameData } from "../../firebase/firebase";
import SelectInput from "../SelectInput";
import TextInput from "../TextInput";
import "./NewForm.scss";

const NewSpeciesForm: React.FC = ({ speciesNames }) => {
  const { setCurrentLocality } = useAppStateContext();
  const speciesNamesValues = speciesNames.map((i: any) => i.speciesName).sort();
  const addItem = (data: any) => {
    if (speciesNamesValues.includes(data.speciesName))
      return toast.error("Species already exists");
    const checkedData = { ...data, group: data.group || "" };
    writeSpeciesNameData(checkedData);
    setCurrentLocality("");
    toast.success("Species was added successfully");
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    setValue,
  } = useForm<PrimersType>();

  const speciesNamesOptions = speciesNamesValues.map((i: any) => ({
    value: i,
    label: i,
  }));

  console.log(speciesNamesOptions);
  return (
    <form className="form compact new-species" onSubmit={handleSubmit(addItem)}>
      <h5>Add new species:</h5>
      <div className="row">
        <SelectInput
          options={speciesNamesOptions}
          onChange={(e: any) => {
            setValue("speciesName", e?.value);
            setValue("speciesAndAuthor", e?.value);
          }}
          className="onlyArrow"
        />
        <TextInput
          label="Species name"
          name="speciesName"
          error={errors.speciesName?.message}
          register={register}
          onBlur={(e: any) => {
            setValue("speciesAndAuthor", e?.target.value);
          }}
          required="This field is required"
        />

        <TextInput
          label="Abbreviation"
          name="abbreviation"
          error={errors.abbreviation?.message}
          register={register}
          className="narrow"
        />
        <Controller
          render={({ field: { onChange, value } }) => {
            return (
              <SelectInput
                options={[
                  { value: "terrestrial", label: "Terrestrial" },
                  { value: "aquatic", label: "Aquatic" },
                ]}
                value={value ? { value, label: value } : null}
                onChange={(e: any) => {
                  onChange(e?.value);
                }}
                label="Group"
                error={errors.group?.message}
                isSearchable
              />
            );
          }}
          control={control}
          name="group"
        />
        <TextInput
          label="Species and author"
          name="speciesAndAuthor"
          error={errors.speciesAndAuthor?.message}
          register={register}
        />
        <TextInput
          label="Note"
          name="note"
          error={errors.note?.message}
          register={register}
        />
        <button className="submit-btn" type="submit">
          Save
        </button>
      </div>
    </form>
  );
};

export default NewSpeciesForm;
