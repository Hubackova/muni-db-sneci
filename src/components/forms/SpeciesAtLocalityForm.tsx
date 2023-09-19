// @ts-nocheck
import { getDatabase } from "firebase/database";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { backup } from "../../content/all";
import { writeSpeciesToLocalityData } from "../../firebase/firebase";
import TextInput from "../TextInput";
import "./NewSampleForm.scss";

const SpeciesAtLocalityForm: React.FC = () => {
  const db = getDatabase();

  const addItem = (data: any) => {
    console.log(data);
    console.log("ddddddddddddddddddddd");
    writeSpeciesToLocalityData(data);
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
      <h5>Species at locality:</h5>
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
          label="Specification"
          name="specification"
          error={errors.fieldCode?.message}
          register={register}
        />
        <TextInput
          label="Live individuals"
          name="live"
          error={errors.latitude?.message}
          register={register}
        />
        <TextInput
          label="Empty shells"
          name="empty"
          error={errors.longitude?.message}
          register={register}
        />
        <TextInput
          label="All"
          name="all"
          error={errors.country?.message}
          register={register}
        />
        <TextInput
          label="Lot number:"
          name="lot"
          error={errors.country?.message}
          register={register}
        />
        <TextInput
          label="Vouchers"
          name="vouchers"
          error={errors.country?.message}
          register={register}
        />
        <TextInput
          label="Note (species)"
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
