import { useState } from "react";
import { Button } from "@/components/ui/button";

const collections = [
  { id: "1", name: "korj03kory@snu.ac.kr" },
  { id: "2", name: "korj03kory@gmail.com" },
  { id: "3", name: "HCI2026@gmail.com" },
];

const CollectionDropdown = ({ onAdd }) => {
  const [selectedCollections, setSelectedCollections] = useState([]);

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
        <div className="mt-1 space-y-2">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-f5 cursor-pointer"
              onClick={() => handleSelect(collection.id)}
            >
              <p
                className={`font-b2 ${
                  selectedCollections.includes(collection.id)
                    ? "text-secondary-dark"
                    : "text-gray-8c"
                }`}
              >
                {collection.name}
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
      </div>
    </div>
  );
};

export default CollectionDropdown;
