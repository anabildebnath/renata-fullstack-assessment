import React from "react";

export function MultiSelect({ options, selected, onChange, placeholder }) {
  const toggleOption = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="multi-select">
      <div className="selected-options">
        {selected.length > 0 ? selected.join(", ") : placeholder}
      </div>
      <div className="options">
        {options.map((option) => (
          <label key={option} className="option">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => toggleOption(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}
