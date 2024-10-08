"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
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
import axios from "axios"; // Import axios
import { sendAPIRequest } from "@/services/common";
import axiosInstance from "@/services/axiosInstance";

interface FrameworkBase{
  value:string;
  label:string;
}

interface FrameworkProps {
  dataType: string; // Defines the type of data to fetch
  dataLabel: string;
  onValueChange: (datatype:string,value: string) => void; // Callback to send the selected value to the parent
  value?: string; // Optional value set by the parent
  field?:any;
}

const getEndPoint = (dataType: string) => {
  switch (dataType) {
    case "exptype":
      return "/exptype/all/"+localStorage.getItem("brhid");
    case "paytype":
      return "/paytype/all";
    default:
      return "";
  }
};

export function InsertDropdown({ dataType,dataLabel, onValueChange, value: parentValue,field }: FrameworkProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(parentValue || (field ? field.value+"" : "")); 
  const [searchTerm, setSearchTerm] = React.useState("");
  const [frameworks, setFrameworks] = React.useState<FrameworkBase[]>([]);
  const [loading, setLoading] = React.useState(false); // Track loading state
  const [error, setError] = React.useState(""); // Track errors

  function fetchData(){
    setLoading(true);
    const endpoint = getEndPoint(dataType);
    axiosInstance
      .get(endpoint)
      .then((response) => {
        let subitem: FrameworkBase[] = [];
        if (Array.isArray(response.data)) {
          response.data.map((obj) => {
            if (dataType === "exptype" || dataType==="paytype") subitem.push({ value: obj.docno+"", label: obj.refname });
          });
          setFrameworks(subitem);
        } else {
          setFrameworks([]);
        }
      })
      .catch((error) => {
        console.error(`Error fetching ${dataType}:`, error);
        setError(`Failed to fetch ${dataLabel}. Please try again later.`);
        setFrameworks([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  React.useEffect(() => {
    // This is the side effect, such as fetching data
    fetchData();
    // No JSX return, just side effects
    // Optionally return a cleanup function
    return () => {
      // Cleanup logic if needed, such as canceling API requests
    };
  }, [dataType]); // Dependencies for the effect

  React.useEffect(() => {
    if (parentValue !== undefined) {
        console.log('Parent Value Changed:'+parentValue);
        setValue(parentValue+"");
    } 
  }, [parentValue]);
  
  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? "" : currentValue;
    setValue(newValue);
    if (field) field.onChange(newValue);
    setOpen(false);
    onValueChange(dataType,newValue); // Pass the selected value to the parent
  };

  const handleAddItem = async () => {
    if (searchTerm.trim() === "") return;

    const newItem = {
      value: searchTerm.toLowerCase().replace(/\s+/g, "-"),
      label: searchTerm,
    };

    const alreadyExists = frameworks.some(
      (framework) => framework.value === newItem.value
    );

    if (!alreadyExists) {
      try {
        setLoading(true);

        sendAPIRequest({refname:newItem.label},"A","/"+dataType,dataLabel)
            .then(()=>{
              setFrameworks((prevFrameworks) => [...prevFrameworks, newItem]);
              setOpen(false);
              setSearchTerm("");
                fetchData();
            })
            .catch((error)=>{
                console.log(error);
            })
            .finally(()=>{
                
            });
      } catch (error) {
        console.error(error);
        setError("An error occurred while saving the new framework.");
      } finally {
        setLoading(false);
      }
    } else {
      alert("This framework is already in the list.");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex items-center w-full justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select "+dataLabel+"..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search" 
            className="h-9"
            value={searchTerm}
            onValueChange={setSearchTerm} // Track input changes
          />
          <CommandList>
            <CommandEmpty>No {dataLabel} found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={handleSelect}
                >
                  {framework.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <Command>
          <CommandList>
            <CommandItem>
              <Button
                type="button"
                variant="default"
                className="w-full"
                onClick={handleAddItem}
                disabled={loading}
              >
                {loading ? "Saving..." : `Add "${searchTerm}"`}
              </Button>
            </CommandItem>
          </CommandList>
        </Command>
        {error && (
          <p className="text-red-500 text-sm mt-2 ml-2">Error: {error}</p>
        )}
      </PopoverContent>
    </Popover>
  );
}
