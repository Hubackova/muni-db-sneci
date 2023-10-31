// @ts-nocheck

import { getDatabase, ref, update } from "firebase/database";
import React, { useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";
import CreatableSelectInput from "./CreatableSelectInput";
import SelectInput from "./SelectInput";

export const useIsOverflow = (ref, callback) => {
  const [isOverflow, setIsOverflow] = React.useState(undefined);

  React.useLayoutEffect(() => {
    const { current } = ref;

    const trigger = () => {
      const hasOverflow = current.scrollWidth > current.clientWidth;

      setIsOverflow(hasOverflow);

      if (callback) callback(hasOverflow);
    };

    if (current) {
      trigger();
    }
  }, [callback, ref]);

  return isOverflow;
};

export const customComparator = (prevProps, nextProps) => {
  return nextProps.value === prevProps.value;
};

export const customLocalityComparator = (prevProps, nextProps) => {
  return (
    nextProps.value === prevProps.value &&
    prevProps.row.original.localityCode === nextProps.row.original.localityCode
  );
};

export const DateCell: React.FC<any> = ({
  initialValue = "",
  row,
  cell,
  saveLast = () => {},
  maxChars = 22,
}) => {
  const db = getDatabase();
  const [showEditModal, setShowEditModal] = useState(null);
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e: any) => {
    setValue(e.target.value);
    if (
      (initialValue?.toString() || "") !== (e.target.value?.toString() || "")
    ) {
      setShowEditModal({
        row,
        newValue: e.target.value,
        id: cell.column.id,
        initialValue,
        setValue,
        callback: () => {
          const key = row.original.updatekey || row.original.key;
          update(ref(db, "localities/" + key), {
            [cell.column.id]: e.target.value,
          });
          saveLast({
            rowKey: key, //check
            cellId: cell.column.id,
            initialValue,
          });
        },
      });
    }
  };
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <>
      {showEditModal?.row.id === cell.row.id &&
        showEditModal.id === cell.column.id && (
          <ConfirmModal
            title={`Do you want to change value from ${
              showEditModal.initialValue || "<empty>"
            } to ${showEditModal.newValue} ?`}
            onConfirm={async () => {
              await showEditModal.callback();
              setShowEditModal(null);
              toast.success("Field was edited successfully");
            }}
            onCancel={() => {
              showEditModal.setValue(showEditModal.initialValue);
            }}
            onHide={() => setShowEditModal(null)}
          />
        )}
      <input
        value={value}
        onChange={onChange}
        type="date"
        title={value.length > maxChars ? value : ""}
      />
    </>
  );
};

export const EditableCell: React.FC<any> = ({
  initialValue = "",
  row,
  cell,
  disabled = false,
  maxChars = 22,
  dbName = "localities/",
  saveLast = () => {},
  updatekey,
  fieldCodes = [],
  ...props
}) => {
  const db = getDatabase();
  const [showEditModal, setShowEditModal] = useState(null);
  const [value, setValue] = useState(initialValue);

  const isNumber = [
    "all",
    "live",
    "empty",
    "undefined",
    "lot",
    "vouchers",
    "latitude",
    "longitude",
    "mapGrid",
    "waterPH",
    "waterConductivity",
    "elevation",
    "plotSize",
    "sampleSize",
    "habitatSize",
    "distanceForest",
    "releveNumber",
  ].includes(cell.column.id);
  const onChange = (e: any) => {
    setValue(isNumber ? parseFloat(e.target.value) : e.target.value);
  };

  const onBlur = (e: any) => {
    if (
      (initialValue?.toString() || "") !== (e.target.value?.toString() || "")
    ) {
      if (
        e.target.value &&
        !!fieldCodes.length &&
        fieldCodes.includes(e.target.value)
      ) {
        const errValue = e.target.value;
        setValue(initialValue);
        return toast.error("Duplicate Field code - " + errValue);
      }

      setShowEditModal({
        row,
        newValue: isNumber ? parseFloat(e.target.value) : e.target.value,
        id: cell.column.id,
        initialValue,
        setValue,
        callback: () => {
          const key = updatekey || row.original.key;
          update(ref(db, dbName + key), {
            [cell.column.id]: isNumber
              ? parseFloat(e.target.value)
              : e.target.value,
          });

          saveLast({
            rowKey: key,
            cellId: cell.column.id,
            initialValue,
            dbName,
          });
        },
      });
    }
  };

  const inputRef = React.useRef();
  const isOverflow = useIsOverflow(inputRef);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  if (!cell) return;

  const isUltraNarrow = ["lot", "all", "live", "empty", "undefined"].includes(
    cell.column.id
  );

  const minIszero = ["live", "empty", "undefined"].includes(cell.column.id);

  const isNarrow = [
    "abbreviation",
    "vouchers",
    "specification",
    "fieldCode",
    "siteId",
  ].includes(cell.column.id);
  const isSemiNarrow = ["latitude", "longitude"].includes(cell.column.id);
  const isWide = ["note"].includes(cell.column.id);
  const isSemiWide = ["sequence"].includes(cell.column.id);
  const isHyperWide = ["siteDescription"].includes(cell.column.id);

  return (
    <>
      {showEditModal?.row.id === cell.row.id &&
        showEditModal.id === cell.column.id && (
          <ConfirmModal
            title={`Do you want to change value from ${
              showEditModal.initialValue || "<empty>"
            } to ${showEditModal.newValue} ?`}
            onConfirm={async () => {
              await showEditModal.callback();
              setShowEditModal(null);
              toast.success("Field was edited successfully");
            }}
            onCancel={() => {
              showEditModal.setValue(showEditModal.initialValue);
            }}
            onHide={() => setShowEditModal(null)}
          />
        )}
      <input
        value={value}
        ref={inputRef}
        title={isOverflow ? value : ""}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        min={minIszero ? 0 : null}
        type={isNumber ? "number" : "text"}
        className={
          isUltraNarrow
            ? "ultra-narrow"
            : isNarrow
            ? "narrow"
            : isWide
            ? "wide"
            : isSemiWide
            ? "semi-wide"
            : isSemiNarrow
            ? "semi-narrow"
            : isHyperWide
            ? "hyper-wide"
            : ""
        }
        {...props}
      />
    </>
  );
};

export const EditableNoConfirmCell: React.FC<any> = ({
  initialValue = "",
  row,
  cell,
  disabled = false,
  dbName = "localities/",
  saveLast = () => {},
  maxChars = 22,
  ...props
}) => {
  const db = getDatabase();
  const [value, setValue] = useState(initialValue);
  const onChange = (e: any) => {
    setValue(e.target.value);
  };
  const onBlur = (e: any) => {
    if (
      (initialValue?.toString() || "") !== (e.target.value?.toString() || "")
    ) {
      const key = row.original.updatekey || row.original.key;
      update(ref(db, dbName + key), {
        [cell.column.id]: e.target.value,
      });
      saveLast({
        rowKey: key,
        cellId: cell.column.id,
        initialValue,
      });
    }
  };
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const inputRef = React.useRef();
  const isOverflow = useIsOverflow(inputRef);
  const isNarrow = [
    "cytB",
    "16S",
    "COI",
    "COII",
    "ITS1",
    "ITS2",
    "ELAV",
  ].includes(cell.column.id);
  return (
    <input
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      {...props}
      ref={inputRef}
      title={isOverflow ? value : ""}
      className={isNarrow ? "narrow" : ""}
    />
  );
};

export const SelectCell: React.FC<any> = ({
  initialValue = "",
  row,
  cell,
  options,
  saveLast = () => {},
  dbName = "localities/",
  updatekey,
  backValue = "",
}) => {
  const db = getDatabase();
  const { original } = row;
  const [showEditModal, setShowEditModal] = useState(null);
  const [value, setValue] = React.useState(
    original[cell.column.id]
      ? { value: initialValue, label: initialValue }
      : null
  );
  const onChange = (value: any) => {
    setValue({ value: value.value, label: value.label });
    if ((initialValue?.toString() || "") !== (value.value?.toString() || "")) {
      setShowEditModal({
        row,
        newValue: value.value,
        id: cell.column.id,
        initialValue,
        setValue,
        callback: () => {
          update(ref(db, dbName + updatekey), {
            [cell.column.id]: value.value,
          });
          saveLast({
            rowKey: updatekey,
            cellId: cell.column.id,
            initialValue: backValue || initialValue,
            dbName,
            setValue: () =>
              setValue({ value: initialValue, label: initialValue }),
          });
        },
      });
    }
  };

  const inputRef = React.useRef();
  const isOverflow = useIsOverflow(inputRef);

  const isWide = ["speciesNameKey"].includes(cell.column.id);

  return (
    <>
      {showEditModal?.row.id === cell.row.id &&
        showEditModal.id === cell.column.id && (
          <ConfirmModal
            title={`Do you want to change value from ${
              initialValue || "<empty>"
            } to ${value.label} ?`}
            onConfirm={async () => {
              await showEditModal.callback();
              setShowEditModal(null);
              toast.success("Field was edited successfully");
            }}
            onCancel={() => {
              showEditModal.setValue({
                value: initialValue,
                label: initialValue,
              });
            }}
            onHide={() => setShowEditModal(null)}
          />
        )}
      <SelectInput
        options={options}
        value={value}
        onChange={onChange}
        isSearchable
        className={isWide ? "custom wide" : "custom"}
        title={isOverflow ? value : ""}
        ref={inputRef}
      />
    </>
  );
};

export const CreatableSelectCell: React.FC<any> = ({
  initialValue = "",
  row,
  cell,
  options,
  dbName = "localities/",
  saveLast = () => {},
  maxChars = 22,
  updatekey,
  backValue = "",
}) => {
  const db = getDatabase();
  const { original } = row;
  const [showEditModal, setShowEditModal] = useState(null);
  const [value, setValue] = React.useState(
    original[cell.column.id]
      ? { value: initialValue, label: initialValue }
      : null
  );
  const onChange = (value: any) => {
    setValue({ value: value.value, label: value.label });
    if ((initialValue?.toString() || "") !== (value.value?.toString() || "")) {
      setShowEditModal({
        row,
        newValue: value.value,
        id: cell.column.id,
        initialValue,
        setValue,
        callback: () => {
          update(ref(db, dbName + updatekey), {
            [cell.column.id]: value.value,
          });
          saveLast({
            rowKey: updatekey,
            cellId: cell.column.id,
            initialValue: backValue || initialValue,
            dbName,
            setValue: () =>
              setValue({ value: initialValue, label: initialValue }),
          });
        },
      });
    }
  };
  const inputRef = React.useRef();
  const isOverflow = useIsOverflow(inputRef);
  return (
    <>
      {showEditModal?.row.id === cell.row.id &&
        showEditModal.id === cell.column.id && (
          <ConfirmModal
            title={`Do you want to change value from ${
              initialValue || "<empty>"
            } to ${value.label} ?`}
            onConfirm={async () => {
              await showEditModal.callback();
              setShowEditModal(null);
              toast.success("Field was edited successfully");
            }}
            onCancel={() => {
              showEditModal.setValue({
                value: initialValue,
                label: initialValue,
              });
            }}
            onHide={() => setShowEditModal(null)}
          />
        )}

      <CreatableSelectInput
        ref={inputRef}
        options={options}
        value={value}
        onChange={onChange}
        isSearchable
        className="custom"
        title={isOverflow ? value : ""}
      />
    </>
  );
};
