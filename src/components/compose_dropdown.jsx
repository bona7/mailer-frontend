import React, { useState, useRef, useEffect } from "react";

function ComposeDropdown({ title, options, selectedOption, onOptionChange }) {
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
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="h-8 flex items-center py-2 justify-between w-full rounded-xl"
        >
          <div className="flex">
            <label htmlFor="recipients" className="text-gray-8c font-st2">
              From.
            </label>
            <svg
              className={`w-4 h-4 pr-1 ml-2 text-gray-8c transition-transform ${
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
          </div>
          <span className="flex-grow text-left font-st2 px-3">
            {selectedOption}
          </span>
        </button>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 rounded-lg border bg-gray-fa border-secondary-dark">
            <ul className="py-1 max-h-48 overflow-y-auto">
              {options.map((option) => (
                <li
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  className="px-4 py-2 text-sm text-gray-26 hover:bg-gray-100 cursor-pointer"
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

export default ComposeDropdown;
