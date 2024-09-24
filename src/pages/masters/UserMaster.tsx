import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { CustDropDown } from "@/custom-components/custdropdown";
import { DataTable } from "@/custom-components/DataTable";
import FileUpload from "@/custom-components/FileUpload";
import { toast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import {DotsHorizontalIcon} from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useConfirm } from "@/custom-components/Confirm";

interface Users{
    docno:number,
    userid:string,
    username:string,
    email:string,
    mobile:string,
    activestatus:string
}


  const tabledata = [
    {
      docno: 1,
      userid: "ken99",
      username: "Ken99",
      email: "ken99@yahoo.com",
      mobile: "1234567890",
      activestatus: "Active",
    },
    // Add more data as needed
  ];

  
  export function UserMaster(){
    const [isOpen,setIsOpen]=useState(false);
    const [userid, setUserId] = useState("");
    const [docno, setDocno] = useState(0);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [alertDesc,setAlertDesc]=useState("Do you want to update changes?");
    const [modaltitle,setModalTitle]=useState("Add User");
    const [modalDesc,setModalDesc]=useState("Make changes to add users. Click save when you're done.");
    const [userlevel,setUserLevel]=useState(0);
    const [showAttach,setShowAttach]=useState(false);
    const [refdocno,setRefdocno]=useState("");
    const [refdtype,setRefdtype]=useState("");

    const { show }=useConfirm();

const columns:ColumnDef<Users>[] = [
    {
      accessorKey: "docno",
      header: "User #",
    },
    {
      accessorKey: "userid",
      header: "User ID",
    },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "mobile",
      header: "Mobile",
    },
    {
      accessorKey: "activestatus",
      header: "Active Status",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <DropdownMenu>
              <DropdownMenuTrigger>
              <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(row.original)}>
                  Delete
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAttach(row.original)}>
                  Attach
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ),
      },
  ];

    const handleEdit = (user:Users) => {
        //setIsOpen(true);
        console.log("Editing user:", user);
        //setDocno(user.docno); // Set docno from the user
        setModalTitle("Edit User");
        setModalDesc("Make changes to existing users. Click save when you're done.")
        setUserId(user.userid);
        setUsername(user.username);
        setPassword(""); // Optionally clear password for security reasons
        setEmail(user.email);
        setMobile(user.mobile);
        setIsOpen(true);
        setDocno(user.docno);
        
        // Open a modal or redirect to edit page
      };
      
      const handleDelete = (user:Users) => {
        toast({
          title: "User Deleted",
          description: `${user.username} has been deleted successfully.`,
          variant: "default", // You can choose "success", "error", etc.
        });
        console.log("Deleting user:", user);
        // Trigger the delete action
      };
      
      const handleFileUpload=()=>{

      }
      const handleAttach = (user:Users) => {
        setShowAttach(true);
        setRefdocno(user.docno+"");
        setRefdtype("USR");

      };
      const handleForm=()=>{
        show("Are you sure you want to delete this item?", submitForm);
      }
      const submitForm=()=>{

      }
      const handleDropdownChange=function(dataType:string,selectedValue:string){
        if(dataType=="userlevel"){
            setUserLevel(parseInt(selectedValue));
        }
      };
    return (
        <>
        <div className="w-full">
            <div className="flex items-center justify-between py-4">
                <h2 className="text-2xl">Users<Badge variant={"outline"} className="ml-2">4 Users</Badge></h2>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline">Add User</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{modaltitle}</DialogTitle>
                            <DialogDescription>
                                {modalDesc}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4 hidden">
                                <Label htmlFor="docno" className="text-right">Doc No</Label>
                                <Input id="docno" value={docno} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="username" className="text-right">Username</Label>
                                <Input id="username" value={userid} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="fullname" className="text-right">Full Name</Label>
                                <Input id="fullname" value={username} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="password" className="text-right">Password</Label>
                                <Input id="password" value={password} className="col-span-3" type="password"/>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input id="email" value={email} className="col-span-3" type="email"/>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="mobile" className="text-right">Mobile</Label>
                                <Input id="mobile" value={mobile} className="col-span-3"/>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="userlevel" className="text-right">User Level</Label>
                                <CustDropDown dataLabel="User Level" dataType="userlevel" onValueChange={handleDropdownChange}></CustDropDown>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={handleForm}>Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="rounded-md border">
                <DataTable columns={columns} data={tabledata}></DataTable>
            </div>
        </div>
        
        {
          showAttach && (
            <FileUpload refdocno="" refdtype="" onFileUpload={handleFileUpload} openstatus={showAttach}></FileUpload>
          )
        }

        </>
    )
  }