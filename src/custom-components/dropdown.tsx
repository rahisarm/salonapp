import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axiosInstance from "@/services/axiosInstance";

// Function to get the API URL based on the data type
const getEndPoint = (dataType: string) => {
  switch (dataType) {
    case "brhid":
      return "/branch"; // Replace with actual API URL for branches
    case "user":
      return "/getUser"; // Replace with actual API URL for locations
    default:
      return "";
  }
};

type DataItems={
    value:string,
    label:string
}
// Define the prop types
interface CustDropDownProps {
  dataType: "brhid" | "user"; // Defines the type of data to fetch
  dataLabel: "Branch" | "User";
  onValueChange: (datatype:string,value: string) => void; // Callback to send the selected value to the parent
  value?: string; // Optional value set by the parent
}

export function CustDropDown({ dataType,dataLabel, onValueChange, value: parentValue }: CustDropDownProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(parentValue || ""); // Default to parent-provided value or internal state
  const [items, setItems] = React.useState<DataItems[]>([]); // Stores the fetched data
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // This is the side effect, such as fetching data
    setLoading(true);
    
    const endpoint = getEndPoint(dataType);
  
    axiosInstance
      .get(endpoint)
      .then((response) => {
        setItems(Array.isArray(response.data) ? response.data : []); // Assuming response.data is an array of data
      })
      .catch((error) => {
        console.error(`Error fetching ${dataType}:`, error);
        setItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  
    // No JSX return, just side effects
    // Optionally return a cleanup function
    return () => {
      // Cleanup logic if needed, such as canceling API requests
    };
  }, [dataType]); // Dependencies for the effect


  // Update internal state when parent changes the value explicitly
  React.useEffect(() => {
    if (parentValue !== undefined) {
      setValue(parentValue); // Only set value from parent if it's passed
    }
  }, [parentValue]);

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? "" : currentValue;
    setValue(newValue);
    setOpen(false);
    onValueChange(dataType,newValue); // Pass the selected value to the parent
  };

  const handleReset = () => {
    setValue(""); // Reset internal state
    onValueChange(dataType,""); // Notify parent that the value has been reset
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ? items.find((item) => item.value === value)?.label : `Select ${dataLabel}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        {loading ? (
          <div className="p-4">Loading...</div>
        ) : error ? (
          <div className="p-4 text-red-500">Error: {error}</div>
        ) : (
          <>
            <Command>
              <CommandInput placeholder={`Search ${dataLabel}...`} />
              <CommandList>
                {items.length === 0 ? (
                  <CommandEmpty>No {dataLabel} found.</CommandEmpty>
                ) : (
                  <CommandGroup>
                    {items.map((item) => (
                      <CommandItem
                        key={item.value}
                        value={item.value}
                        onSelect={handleSelect}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === item.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {item.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
            {/* <div className="p-2 border-t">
                <Button onClick={handleReset} variant={"outline"}>Clear Selection</Button>
            </div> */}
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
