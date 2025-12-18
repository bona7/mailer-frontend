import React, { useState, useRef, useEffect } from "react";

function Dropdown({
  title,
  required,
  options,
  selectedOption,
  onOptionChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleOptionClick = (option) => {
    onOptionChange(option);
    setIsOpen(false);
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
          className="flex justify-between items-center w-full px-4 py-3 sm:py-3 border rounded-xl bg-white border-primary-dark text-primary-dark h-10"
        >
          <svg
            className={`w-4 h-4 pr-1 text-gray-500 transition-transform ${
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
          <span className="flex-grow pl-2 items-center text-left font-b1">
            {selectedOption}
          </span>
        </button>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-primary-dark rounded-xl shadow-lg">
            <ul className="py-1 max-h-48 overflow-y-auto">
              {options.map((option) => (
                <li
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  className="px-4 py-2 text-sm text-primary-dark hover:bg-gray-100 cursor-pointer"
                >
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

export default Dropdown;
