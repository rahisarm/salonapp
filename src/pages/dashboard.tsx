import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CustDropDown } from "@/custom-components/custdropdown";
import { InsertDropDown } from "@/custom-components/InsertDropdown";
import { MainNav } from "@/custom-components/main-nav";
import { CustMenuBar } from "@/custom-components/menu-bar";
import { ModeToggle } from "@/custom-components/mode-toggle";
import { UserNav } from "@/custom-components/usernav";
import { ChevronDown, Menu } from "lucide-react";
import { Outlet } from "react-router-dom";

const handleValueChange=function(dataType:string,selectedValue:string){
  if(dataType=="brhid"){
    localStorage.setItem("brhid",selectedValue);
  }
};
export function Dashboard(){
    return (
      <>
        {/* <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-50">
          <CustDropDown dataLabel="Branch" dataType="brhid" onValueChange={handleValueChange}></CustDropDown>
          <CustMenuBar></CustMenuBar>
        </nav> */}


        <nav className="flex-col md:flex  fixed top-0 left-0 right-0 z-50">
          <div className="border-b">
            <div className="flex h-16 items-center px-4">
              <CustDropDown dataLabel="Branch" dataType="brhid" onValueChange={handleValueChange}></CustDropDown>
              <CustMenuBar className="mx-6"></CustMenuBar>
              <div className="ml-auto flex items-center space-x-4">
                <ModeToggle></ModeToggle>
                <UserNav></UserNav>
              </div>              

            </div>
          </div>
        </nav>
        <main>
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <Outlet></Outlet>
          </div>
        </main>
      </>
    )
}