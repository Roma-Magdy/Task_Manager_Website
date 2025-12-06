import React from "react";
import clsx from "clsx";

const Textbox = React.forwardRef(
  (
    {
      type,
      placeholder,
      label,
      className,
      register,
      name,
      error,   
    },
    ref
  ) => {
    return (
      <div className="w-full flex flex-col gap-1">
        {label && (
          <label htmlFor={name} className="text-slate-800 font-medium">
            {label}
          </label>
        )}

        <div>
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            ref={ref}
            {...register}
            aria-invalid={error ? "true" : "false"}
            className={clsx(
              "w-full px-4 py-2 border rounded-md outline-none transition-all duration-200",
              "focus:ring-2 focus:ring-blue-500",
              error
                ? "border-red-500 focus:ring-red-400 focus:border-red-500"
                : "border-slate-300",
              className
            )}
          />
        </div>

        {error && (
          <span className="text-xs text-red-500 mt-0.5 animate-fadeIn">
            {error}
          </span>
        )}
      </div>
    );
  }
);

export default Textbox;
