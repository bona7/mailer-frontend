import React from "react";
import Dropdown from "./Dropdown";
import { getAccountColor } from "@/lib/utils";
import { useAccounts } from "@/api/hooks/useAccounts";

function AccountDropdown({ selectedOption, onOptionChange }) {
  const { data: accounts = [] } = useAccounts();

  const optionsWithColor = accounts.map((account) => ({
    label: (
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${getAccountColor(account.address)}`}
        />
        <span>{account.address}</span>
      </div>
    ),
    value: account.address,
    type: account.address,
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
