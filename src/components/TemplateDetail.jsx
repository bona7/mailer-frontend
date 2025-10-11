import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart } from "lucide-react";

const TemplateDetail = ({ templateName, authorName, aboutText }) => {
  return (
    <div className="relative bg-white rounded-lg w-[912px] h-[562px] overflow-hidden border">
      <div className="absolute top-4 left-4 font-st2 text-black">
        Template Name
      </div>
      <div className="p-14 flex h-full">
        {/* Left Column */}
        <div className="flex flex-col w-[280px]">
          <div className="mt-32">
            <h1 className="font-h5 text-black">
              {templateName || "Template Name"}
            </h1>
            <div className="flex items-center gap-1.5 mt-2">
              <Button className="bg-secondary-dark hover:bg-secondary-light text-gray-f0 font-button px-2 py-2 h-auto">
                Open in Compose
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-secondary-dark text-secondary-dark size-8"
              >
                <Heart className="size-3.5" />
              </Button>
            </div>
          </div>

          <div className="mt-auto space-y-4">
            <div>
              <h2 className="font-st1 text-black">Made by</h2>
              <div className="flex items-center gap-2 mt-1">
                <Avatar className="size-8">
                  <AvatarFallback>AN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-b1 text-black">
                    {authorName || "Author Name"}
                  </p>
                  <p className="font-overline text-black cursor-pointer hover:underline">
                    Go to other templates ‘{authorName || "Author Name"}’ made
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="font-st1 text-black">About</h2>
              <p className="font-b2 text-gray-8c mt-1">
                {aboutText || "Detailed description of the template goes here."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-grow bg-gray-d9 rounded-lg ml-8"></div>
      </div>
    </div>
  );
};

export default TemplateDetail;
