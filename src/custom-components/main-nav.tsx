
import { cn } from "@/lib/utils"
import { CustDropDown } from "./dropdown"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {

    const handleValueChange=(dataType:string,selectedValue:string)=>{

    }

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
        <CustDropDown dataType="brhid" dataLabel="Branch" onValueChange={handleValueChange}></CustDropDown>
      
    </nav>
  )
}