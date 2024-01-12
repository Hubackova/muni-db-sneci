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
  step?: any;
  readOnly?: boolean;
  min?: any;
  placeholder?: string;
};

const TextInput = ({
  disabled = false,
  label,
  name,
  register,
  validate,
  required,
  error,
  onBlur,
  maxLength,
  type = "text",
  step,
  readOnly,
  className,
  placeholder,
  min,
}: InputProps) => (
  <div className={cx("container", className)}>
    <label className="label">{label}</label>

    <input
      className="input"
      type={type}
      step={step}
      disabled={disabled}
      readOnly={readOnly}
      placeholder={placeholder}
      min={min}
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

export default React.memo(TextInput);
