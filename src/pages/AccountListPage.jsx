import React from "react";
import { useAccounts } from "../api/hooks/useAccounts";

const AccountListPage = () => {
  const { data: accounts, isLoading, isError, error } = useAccounts();

  if (isLoading) {
    return <div>Loading accounts...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Linked Email Accounts</h1>
      {accounts.length === 0 ? (
        <p>No email accounts linked yet.</p>
      ) : (
        <ul className="space-y-2">
          {accounts.map((account) => (
            <li
              key={account.id}
              className="bg-white shadow rounded-lg p-3 flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-semibold">{account.address}</p>
                <p className="text-sm text-gray-500">
                  Domain: {account.domain}
                </p>
                <p className="text-sm text-gray-500">
                  Status: {account.is_valid ? "Valid" : "Invalid"}
                </p>
                {account.last_synced && (
                  <p className="text-sm text-gray-500">
                    Last Synced:{" "}
                    {new Date(account.last_synced).toLocaleString()}
                  </p>
                )}
              </div>
              {/* Add more details or actions here if needed */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AccountListPage;
