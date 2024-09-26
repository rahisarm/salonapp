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
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Transactions</MenubarTrigger>
          <MenubarContent>
            
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      </div>
      </>
    )
  }
  