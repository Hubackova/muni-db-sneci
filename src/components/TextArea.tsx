import React from "react";
// import { UseFormRegister } from "react-hook-form";
import cx from "classnames";
import "./TextInput.scss";

type InputProps = {
  label: string;
  name: string;
  register: any; // UseFormRegister<any>;
  required?: string;
  disabled?: boolean;
  error?: string;
  type?: string;
  onBlur?: any;
  className?: string;
  validate?: any;
  maxLength?: any;
};

const Textarea = ({
  disabled = false,
  label,
  name,
  register,
  validate,
  required,
  error,
  onBlur,
  maxLength,
  className,
}: InputProps) => (
  <div className={cx("container double", className)}>
    <label className="label">{label}</label>

    <textarea
      className="input"
      disabled={disabled}
      {...register(name, {
        required,
        maxLength,
        onBlur,
        validate,
      })}
    />

    {!!error && <div className="error-message">{error}</div>}
  </div>
);

export default React.memo(Textarea);
