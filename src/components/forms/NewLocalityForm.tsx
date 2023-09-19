// @ts-nocheck
import { getDatabase } from "firebase/database";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { backup } from "../../content/all";
import { writeLocalityData } from "../../firebase/firebase";
import TextInput from "../TextInput";
import "./NewSampleForm.scss";

const NewLocalityForm: React.FC = () => {
  const db = getDatabase();

  const addItem = (data: any) => {
    writeLocalityData(data);
    toast.success("Species was added to locality successfully");
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
    <form className="form locality" onSubmit={handleSubmit(addItem)}>
      <h5>Add new locality:</h5>
      <div className="row">
        <TextInput
          label="Site ID"
          name="siteId"
          error={errors.siteId?.message}
          register={register}
          required="This field is required"
          validate={() =>
            !siteIds.includes(getValues("siteId")) || "Duplicate site ID"
          }
        />
        <TextInput
          label="Field code"
          name="fieldCode"
          error={errors.fieldCode?.message}
          register={register}
        />
      </div>
      <div className="row">
        <TextInput
          label="Site name"
          name="siteName"
          error={errors.siteName?.message}
          register={register}
        />
        <TextInput
          label="Latitude (°N)"
          name="latitude"
          error={errors.latitude?.message}
          register={register}
        />
      </div>
      <div className="row">
        <TextInput
          label="Longitude (°E)"
          name="longitude"
          error={errors.longitude?.message}
          register={register}
          required="This field is required"
        />
        <TextInput
          label="Country"
          name="country"
          error={errors.country?.message}
          register={register}
        />
      </div>
      <div className="row">
        <TextInput
          label="State/Province/Region"
          name="state"
          error={errors.state?.message}
          register={register}
        />
        <TextInput
          label="Settlement"
          name="settlement"
          error={errors.settlement?.message}
          register={register}
        />
      </div>
      <div className="row">
        <TextInput
          label="Mapping grid"
          name="mapGrid"
          error={errors.mapGrid?.message}
          register={register}
        />
        <TextInput
          label="Site / habitat description"
          name="siteDescription"
          error={errors.siteDescription?.message}
          register={register}
        />
      </div>
      <div className="row">
        <TextInput
          label="Elevation (m a.s.l.)"
          name="elevation"
          error={errors.elevation?.message}
          register={register}
        />
        <TextInput
          label="Date of sampling"
          name="dateSampling"
          error={errors.dateSampling?.message}
          register={register}
        />
      </div>
      <div className="row">
        <TextInput
          label="Collector"
          name="collector"
          error={errors.collector?.message}
          register={register}
        />
        <TextInput
          label="Plot size (m 2 )"
          name="plotSize"
          error={errors.plotSize?.message}
          register={register}
        />
      </div>
      <div className="row">
        <TextInput
          label="Sample size (L)"
          name="sampleSize"
          error={errors.sampleSize?.message}
          register={register}
        />
        <TextInput
          label="Habitat size (m 2 )"
          name="habitatSize"
          error={errors.habitatSize?.message}
          register={register}
        />
      </div>
      <div className="row">
        <TextInput
          label="Distance forest (m)"
          name="distanceForest"
          error={errors.distance?.message}
          register={register}
        />
        <TextInput
          label="Sampling method"
          name="samplingMethod"
          error={errors.samplingMethod?.message}
          register={register}
        />
      </div>
      <div className="row">
        <TextInput
          label="Water pH"
          name="waterPH"
          error={errors.waterPH?.message}
          register={register}
        />
        <TextInput
          label="Water conductivity (µS/cm)"
          name="waterConductivity"
          error={errors.waterConductivity?.message}
          register={register}
        />
      </div>
      <div className="row">
        <TextInput
          label="Lot number"
          name="lotNumber"
          error={errors.lotNumber?.message}
          register={register}
        />
        <TextInput
          label="Releve number"
          name="releveNumber"
          error={errors.releveNumber?.message}
          register={register}
        />
      </div>
      <div className="row">
        <TextInput
          label="Data type"
          name="dataType"
          error={errors.dataType?.message}
          register={register}
        />
        <TextInput
          label="PLA/event"
          name="event"
          error={errors.event?.message}
          register={register}
        />
      </div>
      <div className="row">
        <TextInput
          label="Note (site)"
          name="noteSite"
          error={errors.noteSite?.message}
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

export default NewLocalityForm;
