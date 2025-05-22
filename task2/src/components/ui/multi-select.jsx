import * as React from "react";

export function MultiSelect({ options, selected, onChange, placeholder, className }) {
  return (
    <div className={`multi-select-container ${className}`}>
      {/* Selected Options Section */}
      <div className="selected-section min-h-[42px] p-2 border-b border-gray-600">
        {selected?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selected.map((value) => (
              <span
                key={value}
                className="px-2 py-1 bg-primary text-primary-foreground rounded-md text-sm"
              >
                {value}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
      </div>

      {/* Options Section */}
      <div className="options-section p-2">
        <div className="options-group">
          <div className="flex flex-wrap gap-2">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  const newSelected = selected.includes(option)
                    ? selected.filter((item) => item !== option)
                    : [...selected, option];
                  onChange(newSelected);
                }}
                className={`px-2 py-1 rounded-md text-sm transition-colors ${
                  selected.includes(option)
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent hover:bg-accent text-foreground"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
