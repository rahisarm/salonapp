import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
  } from "@/components/ui/menubar"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"
  
  export function CustMenuBar({
    className,
    ...props
  }: React.HTMLAttributes<HTMLElement>){
    return (
        <>
        <div className={cn("",className)}>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Masters</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Link to={"UserMaster"}>User Master</Link>
            </MenubarItem>
            <MenubarItem>
              <Link to={"ClientMaster"}>Client Master</Link>
            </MenubarItem>
            <MenubarItem>
              <Link to={"EmployeeMaster"}>Employee Master</Link>
            </MenubarItem>
            <MenubarItem>
              <Link to={"AccountMaster"}>Account Master</Link>
            </MenubarItem>
            <MenubarItem>
              <Link to={"VendorMaster"}>Vendor Master</Link>
            </MenubarItem>
            <MenubarItem>
              <Link to={"ProductMaster"}>Service Master</Link>
            </MenubarItem>
            <MenubarItem>
              <Link to={"ComboMaster"}>Combo Master</Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Transactions</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Link to={"Expense"}>Expense</Link>
            </MenubarItem>
            <MenubarItem>
              <Link to={"Invoice"}>Invoice</Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu><MenubarTrigger><Link to={"BIReport"}>Dashboard</Link></MenubarTrigger></MenubarMenu>
      </Menubar>
      </div>
      </>
    )
  }
  