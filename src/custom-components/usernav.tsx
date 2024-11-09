import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { sendAPIRequest } from "@/services/common";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
export function UserNav(){
    const [username,setUsername]=useState<string>("");
    const [mail,setMail]=useState<string>("");
    const [initials,setInitials]=useState<string>("");
    const navigate=useNavigate();
    const handleLogout=()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('userdocno');
        navigate('/');
    }

    const getInitials = (name: string) => {
        if(name.trim().includes(" ")){

            const nameParts = name.trim().split(" ");
            const firstInitial = nameParts[0].charAt(0);
            const lastInitial = nameParts[nameParts.length - 1].charAt(0);
        
            return `${firstInitial}${lastInitial}`.toUpperCase();
        }
        else{
            return name.trim().charAt(0).toUpperCase();
        }
        
      };

    useEffect(()=>{
        if(localStorage.getItem("userdocno")){
            sendAPIRequest(null,"G","/user/"+localStorage.getItem("userdocno"),"User").then((response)=>{
                
                if(response.data){
                    setUsername(response.data.fullname);
                    setMail(response.data.email);
                    setInitials(getInitials(username));
                }
            }).catch((e)=>{
                console.error(e);
            })

        }
        else{
            handleLogout();
        }
    },[localStorage.getItem("userdocno")])
    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="@spot" />
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                    {mail}
                    </p>
                </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                <DropdownMenuItem>
                    <Link to="/dashboard/settings">Settings</Link>
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
                
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                Log out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
    )
}