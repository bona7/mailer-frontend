
import React, { useState, useRef, useEffect } from 'react';

function DomainDrop({ selectedDomain, onDomainChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const domains = ['gmail.com', 'naver.com', 'daum.net', 'snu.ac.kr', '직접 입력'];
  const dropdownRef = useRef(null);

  const handleOptionClick = (domain) => {
    onDomainChange(domain);
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
    <div className="relative w-36" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 sm:py-3 border rounded-xl bg-white border-primary-dark text-gray-500 h-11"
      >
        <span>{selectedDomain}</span>
        <svg className={`w-4 h-4 pl-1 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-primary-dark rounded-xl shadow-lg">
          <ul className="py-1 max-h-48 overflow-y-auto">
            {domains.map((domain) => (
              <li
                key={domain}
                onClick={() => handleOptionClick(domain)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                {domain}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DomainDrop;
