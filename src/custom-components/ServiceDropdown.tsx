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
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axiosInstance from "@/services/axiosInstance";


type DataItems={
    docno:string;
    refname:string;
    type:string
}
// Define the prop types
interface CustDropDownProps {
  dataType: string; // Defines the type of data to fetch
  dataLabel: string;
  onValueChange: (datatype:string,value: string,itemtype:string) => void; // Callback to send the selected value to the parent
  value?: string; // Optional value set by the parent
  field?:any;
}

export function ServiceDropdown({ dataType,dataLabel, onValueChange, value: parentValue,field }: CustDropDownProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(parentValue || (field ? field.value+"" : "")); // Default to parent-provided value or internal state
  const [items, setItems] = React.useState<DataItems[]>([]); // Stores the fetched data
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");

  
  React.useEffect(() => {
    // This is the side effect, such as fetching data
    setLoading(true);
    axiosInstance
      .get("/product/servicecombo/"+localStorage.getItem("brhid"))
      .then((response) => {
        let subitem: DataItems[] = [];
        if (Array.isArray(response.data)) {
          response.data.map((obj) => {
            subitem.push({ docno: obj.docno+"", refname: obj.refname,type:obj.servicetype });
          });
          console.log(subitem);
          setItems(subitem);
        } else {
          setItems([]);
        }
      })
      .catch((error) => {
        console.error(`Error fetching ${dataType}:`, error);
        setError(`Failed to fetch ${dataLabel}. Please try again later.`);
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
        console.log('Parent Value Changed:'+parentValue);
        setValue(parentValue+"");
    } 
  }, [parentValue]);

  const handleSelect = (docno:string,refname: string,itemtype:string) => {
    const newValue = refname == value ? "" : refname;
    console.log(newValue);
    setValue(newValue);
    if (field) field.onChange(newValue);
    setOpen(false);
    onValueChange(dataType,docno,itemtype); // Pass the selected value to the parent
  };

  // const filteredItems = items.filter(item =>
  //   item.label.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const handleReset = () => {
    setValue(""); // Reset internal state
    onValueChange(dataType,"",""); // Notify parent that the value has been reset
  };

  const filteredItems = items.filter((item) =>
    item.refname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? items.find((item) => item.refname+"" == value)?.refname : `Select ${dataLabel}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        {loading ? (
          <div className="p-4">Loading...</div>
        ) : error ? (
          <div className="p-4 text-red-500">Error: {error}</div>
        ) : (
          <>
            <Command>
              <CommandInput placeholder={`Search ${dataLabel}...`} onValueChange={setSearchTerm} />
              <CommandList>
              {items.length === 0 ? (
      <CommandEmpty>No {dataLabel} found.</CommandEmpty>
    ) : (
      <>
        {/* Services Group */}
        {items.filter(item => item.type == "Service").length > 0 && (
          <CommandGroup heading="Services">
            {items
              .filter(item => item.type == "Service")
              .map((item) => (
                <CommandItem
                  key={`service-${item.docno}`}
                  value={item.refname}
                  onSelect={() => handleSelect(item.docno, item.refname, item.type)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value == item.refname + "" ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.refname}
                </CommandItem>
              ))}
          </CommandGroup>
        )}

        {/* Combos Group */}
        {items.filter(item => item.type === "Combo").length > 0 && (
          <CommandGroup heading="Combos">
            {items
              .filter(item => item.type === "Combo")
              .map((item) => (
                <CommandItem
                  key={`combo-${item.docno}`}
                  value={item.refname}
                  onSelect={() => handleSelect(item.docno, item.refname, item.type)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.refname + "" ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.refname}
                </CommandItem>
              ))}
          </CommandGroup>
        )}
      </>
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
