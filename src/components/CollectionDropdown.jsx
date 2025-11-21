import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAccounts } from "@/api/hooks/useAccounts";

const CollectionDropdown = ({ onAdd }) => {
  const [selectedCollections, setSelectedCollections] = useState([]);
  const { data: accounts = [], isLoading } = useAccounts();

  const handleSelect = (id) => {
    setSelectedCollections((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleAdd = () => {
    onAdd(selectedCollections);
  };

  return (
    <div className="absolute top-10 left-0 w-64 bg-white rounded-md shadow-lg z-10 border border-secondary-dark">
      <div className="py-1 px-2">
        {isLoading ? (
          <div className="p-4 text-center font-b2 text-gray-8c">로딩 중...</div>
        ) : accounts.length === 0 ? (
          <div className="p-4 text-center font-b2 text-gray-8c">
            등록된 계정이 없습니다
          </div>
        ) : (
          <>
            <div className="mt-1 space-y-2">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-f5 cursor-pointer"
                  onClick={() => handleSelect(account.id)}
                >
                  <p
                    className={`font-b2 ${
                      selectedCollections.includes(account.id)
                        ? "text-secondary-dark"
                        : "text-gray-8c"
                    }`}
                  >
                    {account.address}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-1 mr-2 mb-2 flex justify-end">
              <Button
                onClick={handleAdd}
                className="bg-secondary-dark hover:bg-secondary-light text-gray-f0 font-button px-2 py-2 h-auto"
              >
                Add
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CollectionDropdown;
