
import { CustMenuBar } from "@/custom-components/menu-bar";
import { ModeToggle } from "@/custom-components/mode-toggle";
import { NormalDropdown } from "@/custom-components/NormalDropdown";
import { UserNav } from "@/custom-components/usernav";
import { Link, Outlet } from "react-router-dom";
import { EmployeeInvoice } from "./transactions/EmployeeInvoice";
import { useEffect, useState } from "react";
import { sendAPIRequest } from "@/services/common";

const handleValueChange=function(dataType:string,selectedValue:string){
  if(dataType=="brhid"){
    localStorage.setItem("brhid",selectedValue);
  }
};

export function Dashboard(){
    const [userRole,setUserRole]=useState<string | null>(null);

    useEffect(() => {
      const cachedRole = localStorage.getItem("userrole");
      if (cachedRole) {
        setUserRole(cachedRole);
      } else {
        sendAPIRequest(null, "G", "/user/" + localStorage.getItem("userdocno"), "User Details")
          .then((response: any) => {
            if (response?.data) {
              const role = response.data.roleid;
              localStorage.setItem("userrole", role);
              setUserRole(role);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }, []);
    return (
      <>
        {/* <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-50">
          <CustDropDown dataLabel="Branch" dataType="brhid" onValueChange={handleValueChange}></CustDropDown>
          <CustMenuBar></CustMenuBar>
        </nav> */}


        <nav className="flex-col md:flex  fixed top-0 left-0 right-0 z-50 bg-background">
          <div className="border-b">
            <div className="flex h-16 items-center px-4">
              <div className="flex items-center justify-between">
              <NormalDropdown dataLabel="Branch" dataType="brhid" onValueChange={handleValueChange}></NormalDropdown>
              {userRole!="5" && <CustMenuBar className="mx-6"></CustMenuBar>}
              </div>
              
              <div className="ml-auto flex items-center space-x-4">
                <ModeToggle></ModeToggle>
                <UserNav></UserNav>
              </div>              

            </div>
          </div>
        </nav>
        <main>
          <div className="mx-auto px-4 py-6 pt-20 sm:px-6 lg:px-8 pb-20">
            <Outlet></Outlet>
          </div>
        </main>
      </>
    )
}