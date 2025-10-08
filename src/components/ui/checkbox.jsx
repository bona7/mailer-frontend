import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef(
  ({ className, size = "default", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-2 w-2 [&>svg]:h-2 [&>svg]:w-2 rounded-xs",
      default: "h-4 w-4 [&>svg]:h-4 [&>svg]:w-4",
      lg: "h-6 w-6 [&>svg]:h-6 [&>svg]:w-6",
    };

    return (
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          "peer shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
          <Check className="h-full w-full" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  },
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
