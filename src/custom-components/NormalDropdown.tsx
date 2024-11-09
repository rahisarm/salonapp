"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { sendAPIRequest } from "@/services/common"

interface dataProps{
    value:string;
    label:string;
}

interface NormalDropDownProps {
    dataType: string; // Defines the type of data to fetch
    dataLabel: string;
    onValueChange?: (datatype:string,value: string) => void; // Callback to send the selected value to the parent
    value?: string; // Optional value set by the parent
}
export function NormalDropdown({dataType,dataLabel,onValueChange}:NormalDropDownProps) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    const [label, setLabel] = React.useState("")
    const [frameworks,setFrameworks]=React.useState<dataProps[]>([]);
    React.useEffect(()=>{
        if(dataType=="brhid"){
            sendAPIRequest(null,"G","/branch","Branch").then((response)=>{
                let subitems:dataProps[]=[];
                console.log(response);
                response.data.map((item:any)=>{
                    subitems.push({value:item.docno+"",label:item.branchname+""});
                });
                setFrameworks(subitems);
            }).catch((e)=>{
                console.log(e);
            }).finally(()=>{

            });
        }
    },[dataType]);

    function handleSelect(framework:dataProps){
        setValue(framework.value);
        setLabel(framework.label);
        if(onValueChange){
            onValueChange(dataType,framework.value);
        }        
        setOpen(false);
    }
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                {value
                    ? frameworks.find((framework) => framework.label === label)?.label
                    : "Select "+dataLabel+"..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search framework..." />
                    <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            {frameworks.map((framework) => (
                                <CommandItem
                                    key={framework.value}
                                    value={framework.label}
                                    onSelect={()=>{handleSelect(framework)}}
                                >
                                    <Check className={cn("mr-2 h-4 w-4",value === framework.value ? "opacity-100" : "opacity-0")}/>
                                    {framework.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
