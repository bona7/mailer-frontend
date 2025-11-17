import React, { useState, useRef, useEffect } from "react";

function MultiSelectDropdown({
  title,
  required,
  options,
  selectedOptions,
  onOptionsChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleOptionClick = (option) => {
    if (selectedOptions.includes(option)) {
      onOptionsChange(selectedOptions.filter((item) => item !== option));
    } else {
      onOptionsChange([...selectedOptions, option]);
    }
  };

  const removeOption = (option) => {
    onOptionsChange(selectedOptions.filter((item) => item !== option));
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="w-full">
      <label className="block mb-1 ml-2 font-b2 text-gray-8c">
        {title}
        {required ? (
          <span className="text-notice"> (필수)</span>
        ) : (
          <span className="text-gray-8c"> (선택)</span>
        )}
      </label>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-4 py-3 sm:py-3 border rounded-xl bg-white border-primary-dark text-primary-light min-h-[40px]"
        >
          <div className="flex flex-wrap gap-2 items-center flex-1">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <span
                  key={option}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-dark text-white rounded-lg text-sm font-b2"
                >
                  {option}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeOption(option);
                    }}
                    className="hover:bg-primary rounded"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </span>
              ))
            ) : (
              <span className="text-gray-bf font-b1">선택하세요</span>
            )}
          </div>
          <svg
            className={`w-4 h-4 ml-2 text-gray-500 transition-transform flex-shrink-0 ${
              isOpen ? "transform rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-primary-dark rounded-xl shadow-lg">
            <ul className="py-1 max-h-48 overflow-y-auto">
              {options.map((option) => (
                <li
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  className={`px-4 py-2 text-sm cursor-pointer flex items-center gap-2 ${
                    selectedOptions.includes(option)
                      ? "bg-gray-100 text-primary-dark font-semibold"
                      : "text-gray-26 hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option)}
                    onChange={() => {}}
                    className="w-4 h-4"
                  />
                  {option}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default MultiSelectDropdown;
