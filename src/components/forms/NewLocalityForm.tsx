// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAppStateContext } from "../../AppStateContext";
/* import {
  backup,
  backup2,
  backup3,
  backup4,
  backup5,
  backup6,
  backup7,
  backup8,
  backup9,
  backup10,
} from "../../content/localities"; */
import { writeLocalityData } from "../../firebase/firebase";
import { dataTypeOptions, samplingOptions } from "../../helpers/options";
import CreatableSelectInput from "../CreatableSelectInput";
import SelectInput from "../SelectInput";
import TextArea from "../TextArea";
import TextInput from "../TextInput";
import "./NewSampleForm.scss";
import moment from "moment";

const FORM_DATA_KEY = "localityForm";

const NewLocalityForm: React.FC = ({ localities }) => {
  const { setCurrentLocality } = useAppStateContext();
  const [showModalCode, setShowModalCode] = useState(false);

  const getOptions = React.useCallback(
    (key: string) =>
      Object.values(
        localities.reduce(
          /* @ts-ignore */
          (acc, cur) => Object.assign(acc, { [cur[key]]: cur }),
          {}
        )
      )
        .map((i: any) => ({
          value: i[key],
          label: i[key],
        }))
        .sort(function (a, b) {
          if (a.label < b.label) {
            return -1;
          }
          if (a.label > b.label) {
            return 1;
          }
          return 0;
        }),
    [localities]
  );

  const addItem = (data: any) => {
    data.longitude = parseFloat(data.longitude || 0);
    data.latitude = parseFloat(data.latitude || 0);
    const localityKey = writeLocalityData(data);
    sessionStorage.removeItem(FORM_DATA_KEY);
    toast.success("New locality was added successfully");
    setCurrentLocality(localityKey);
  };

  /*   const addItemsBackup = () => {
    backup10.forEach((i: any) => {
      const dateSampling = !i.dateSampling
        ? ""
        : moment(i.dateSampling, "DD.MM.YYYY").format("YYYY-MM-DD");
      writeLocalityData({ ...i, dateSampling });
    });
    toast.success("ok");
  }; */

  const getSavedData = React.useCallback(() => {
    let data = sessionStorage.getItem(FORM_DATA_KEY);
    if (data) {
      // Parse it to a javaScript object
      try {
        data = JSON.parse(data);
      } catch (err) {
        console.log(err);
      }
      return data;
    }
    return {
      fieldcode: "",
      siteId: "",
      siteName: "",
      latitude: "",
      longitude: "",
      country: "",
      state: "",
      settlement: "",
      mapGrid: "",
      elevation: "",
      siteDescription: "",
      dateSampling: "",
      collector: "",
      plotSize: "",
      sampleSize: "",
      habitatSize: "",
      distanceForest: "",
      samplingMethod: "",
      waterPH: "",
      waterConductivity: "",
      lotNumber: "",
      releveNumber: "",
      dataType: "",
      event: "",
      noteSite: "",
    };
  }, []);

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
    control,
    watch,
  } = useForm<PrimersType>({
    mode: "all",
    defaultValues: getSavedData(),
  });

  useEffect(() => {
    const subscription = watch((value) =>
      sessionStorage.setItem(FORM_DATA_KEY, JSON.stringify(value))
    );
    return () => subscription.unsubscribe();
  }, [watch]);

  const siteIds = localities.map((locality) => locality.siteId);
  const fieldCodes = localities.map((locality) => locality.fieldCode);

  return (
    <form className="form locality" onSubmit={handleSubmit(addItem)}>
      <h5>Add new locality:</h5>
      <div className="row">
        <div>
          <TextInput
            label="Site ID *"
            name="siteId"
            error={errors.siteId?.message}
            register={register}
            required="This field is required"
            validate={() =>
              !siteIds.includes(getValues("siteId")) || "Duplicate site ID"
            }
          />

          <button
            type="button"
            onClick={() => setShowModalCode(true)}
            className="form-btn"
          >
            Show Site IDs
          </button>

          {showModalCode && (
            <div className="side-panel">
              <div className="body">
                <h5>Site IDs</h5>
                <div className="items">
                  {localities.map((i) => (
                    <div
                      className="item"
                      key={i.key}
                      onClick={() => {
                        setValue("fieldCode", i.fieldCode);
                        setValue("siteName", i.siteName);
                        setValue("latitude", i.latitude);
                        setValue("longitude", i.longitude);
                        setValue("country", i.country);
                        setValue("state", i.state);
                        setValue("settlement", i.settlement);
                        setValue("mapGrid", i.mapGrid);
                        setValue("elevation", i.elevation);
                        setValue("siteDescription", i.siteDescription);
                        setValue("dateSampling", i.dateSampling);
                        setValue("collector", i.collector);
                        setValue("plotSize", i.plotSize);
                        setValue("sampleSize", i.sampleSize);
                        setValue("habitatSize", i.habitatSize);
                        setValue("distanceForest", i.distanceForest);
                        setValue("samplingMethod", i.samplingMethod);
                        setValue("waterPH", i.waterPH);
                        setValue("waterConductivity", i.waterConductivity);
                        setValue("lotNumber", i.lotNumber);
                        setValue("releveNumber", i.releveNumber);
                        setValue("dataType", i.dataType);
                        setValue("event", i.event);
                        setValue("noteSite", i.noteSite);

                        setCurrentLocality(i.key);
                        setShowModalCode(false);
                      }}
                    >
                      {i.siteId}
                    </div>
                  ))}
                </div>

                <button
                  className="btn cancel-btn"
                  type="button"
                  onClick={() => setShowModalCode(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        <TextInput
          label="Field code"
          name="fieldCode"
          error={errors.fieldCode?.message}
          register={register}
          validate={() => {
            const fieldCode = getValues("fieldCode");
            return (
              !fieldCode ||
              !fieldCodes.includes(fieldCode) ||
              "Duplicate fieldCode"
            );
          }}
        />
      </div>
      <div className="row">
        <TextInput
          label="Site name *"
          name="siteName"
          error={errors.siteName?.message}
          register={register}
          required="This field is required"
        />
        <TextInput
          label="Latitude (°N) *"
          name="latitude"
          error={errors.latitude?.message}
          register={register}
          type="number"
          step={0.00001}
          required="This field is required"
        />
      </div>
      <div className="row">
        <TextInput
          label="Longitude (°E) *"
          name="longitude"
          error={errors.longitude?.message}
          register={register}
          type="number"
          step={0.00001}
          required="This field is required"
        />
        <Controller
          render={({ field: { onChange, value } }) => (
            <CreatableSelectInput
              options={getOptions("country")}
              value={value ? { value, label: value } : null}
              onChange={(e: any) => onChange(e?.value)}
              label="Country *"
              error={errors.country?.message}
              isSearchable
              required="This field is required"
            />
          )}
          rules={{ required: "This field is required" }}
          control={control}
          name="country"
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
          type="number"
        />
        <TextInput
          label="Elevation (m a.s.l.)"
          name="elevation"
          error={errors.elevation?.message}
          register={register}
          type="number"
        />
      </div>
      <div className="row">
        <TextArea
          label="Site / habitat description *"
          name="siteDescription"
          error={errors.siteDescription?.message}
          register={register}
          required="This field is required"
        />
      </div>
      <div className="row">
        <TextInput
          label="Date of sampling *"
          name="dateSampling"
          error={errors.dateSampling?.message}
          register={register}
          type="date"
          required="This field is required"
        />{" "}
        <Controller
          render={({ field: { onChange, value } }) => (
            <CreatableSelectInput
              options={getOptions("collector")}
              value={value ? { value, label: value } : null}
              onChange={(e: any) => {
                if (e?.value !== getValues("collector")) {
                  onChange(e?.value);
                }
              }}
              label="Collector *"
              error={errors.collector?.message}
              isSearchable
              required="This field is required"
            />
          )}
          control={control}
          name="collector"
          rules={{ required: "This field is required" }}
        />
      </div>
      <div className="row">
        <TextInput
          label="Plot size (m 2 )"
          name="plotSize"
          error={errors.plotSize?.message}
          register={register}
          type="number"
        />
        <TextInput
          label="Sample size (L)"
          name="sampleSize"
          error={errors.sampleSize?.message}
          register={register}
          type="number"
        />
      </div>
      <div className="row">
        <TextInput
          label="Habitat size (m 2 )"
          name="habitatSize"
          error={errors.habitatSize?.message}
          register={register}
          type="number"
        />
        <TextInput
          label="Distance forest (m)"
          name="distanceForest"
          error={errors.distance?.message}
          register={register}
          type="number"
        />
      </div>
      <div className="row">
        <Controller
          render={({ field: { onChange, value } }) => (
            <SelectInput
              options={samplingOptions}
              value={value ? { value, label: value } : null}
              onChange={(e: any) => onChange(e?.value)}
              label="Sampling method *"
              error={errors.samplingMethod?.message}
              isSearchable
              required="This field is required"
            />
          )}
          control={control}
          rules={{ required: "This field is required" }}
          name="samplingMethod"
        />{" "}
        <TextInput
          label="Water pH"
          name="waterPH"
          error={errors.waterPH?.message}
          register={register}
          type="number"
          step={0.01}
        />
      </div>
      <div className="row">
        <TextInput
          label="Water conductivity (µS/cm)"
          name="waterConductivity"
          error={errors.waterConductivity?.message}
          register={register}
          type="number"
        />{" "}
        <TextInput
          label="Lot number"
          name="lotNumber"
          error={errors.lotNumber?.message}
          register={register}
        />
      </div>
      <div className="row">
        <TextInput
          label="Releve number"
          name="releveNumber"
          error={errors.releveNumber?.message}
          register={register}
          type="number"
        />{" "}
        <Controller
          render={({ field: { onChange, value } }) => (
            <CreatableSelectInput
              options={dataTypeOptions}
              value={value ? { value, label: value } : null}
              onChange={(e: any) => onChange(e?.value)}
              label="Data type *"
              error={errors.dataType?.message}
              isSearchable
              required="This field is required"
            />
          )}
          control={control}
          rules={{ required: "This field is required" }}
          name="dataType"
        />
      </div>

      <div className="row">
        <TextInput
          label="PLA/event"
          name="event"
          error={errors.event?.message}
          register={register}
        />
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

export default NewLocalityForm;
