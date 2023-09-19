// @ts-nocheck
import { getDatabase } from "firebase/database";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { backup } from "../../content/all";
import { writeSpeciesData } from "../../firebase/firebase";
import TextInput from "../TextInput";
import "./NewSampleForm.scss";

const NewSpeciesForm: React.FC = () => {
  const db = getDatabase();

  const addItem = (data: any) => {
    writeSpeciesData(data);
    toast.success("Locality was added successfully");
  };

  const addItemsBackup = () => {
    backup.forEach((i: any) => writePrimersData(i));
    toast.success("ok");
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm<PrimersType>();

  const siteIds = [1, 2, 3]; /* primers.map((i) => i.name); */

  return (
    <form className="form" onSubmit={handleSubmit(addItem)}>
      <h5>Add new species:</h5>
      <div className="row">
        <TextInput
          label="Species name"
          name="speciesName"
          error={errors.siteId?.message}
          register={register}
          required="This field is required"
          validate={() =>
            !siteIds.includes(getValues("siteId")) || "Duplicate site ID"
          }
        />
        <TextInput
          label="Abbreviation"
          name="abbreviation"
          error={errors.fieldCode?.message}
          register={register}
        />

        <TextInput
          label="Group"
          name="group"
          error={errors.latitude?.message}
          register={register}
        />
        <TextInput
          label="Species and author"
          name="speciesAndAuthor"
          error={errors.longitude?.message}
          register={register}
        />
        <TextInput
          label="Note"
          name="note"
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

export default NewSpeciesForm;
