import React from "react";
import Dropdown from "./Dropdown";
import { accountEmails } from "@/data/dummy_MainPage";
import { getAccountColor } from "@/lib/utils";

function AccountDropdown({ selectedOption, onOptionChange }) {
  const optionsWithColor = accountEmails.map((account) => ({
    label: (
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${getAccountColor(account.type)}`}
        />
        <span>{account.email}</span>
      </div>
    ),
    value: account.email,
    type: account.type,
  }));

  const currentSelectedOption = optionsWithColor.find(
    (option) => option.value === selectedOption,
  );

  const handleOptionSelect = (value) => {
    onOptionChange(value);
  };

  return (
    <Dropdown
      title="From."
      required={true}
      options={optionsWithColor.map((option) => option.label)}
      selectedOption={currentSelectedOption ? currentSelectedOption.label : ""}
      onOptionChange={(label) => {
        const selected = optionsWithColor.find(
          (option) => option.label === label,
        );
        if (selected) {
          handleOptionSelect(selected.value);
        }
      }}
    />
  );
}

export default AccountDropdown;
