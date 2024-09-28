"use client"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Icons } from "@/custom-components/icons";
import { useConfirm } from "@/custom-components/Confirm";
import { CustDropDown } from "@/custom-components/custdropdown";
import { DataTable } from "@/custom-components/DataTable";
import axiosInstance from "@/services/axiosInstance";
import { sendAPIRequest } from "@/services/common";

const formSchema = z.object({
  username: z.string().min(1, {
    message: "Username is required.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
  fullname: z.string().optional(), // Optional fields
  email: z.string().optional(),
  mobile: z.string().optional(),
  userlevel: z.string().min(1, {
    message: "Userlevel is required.",
  }),
  docno: z.number().optional(),
});

const tblcolumns = [
  { key: "docno", label: "Doc No" },
  { key: "username", label: "Username" },
  { key: "fullname", label: "Full Name" },
  { key: "email", label: "Email" },
  { key: "mobile", label: "Mobile" },
  { key: "userlevel",label: "User Level"},
  { key: "userleveldocno",label: "User Level Doc No"}
];
const tbldata = [
  { docno: 1, username: "john_doe", fullname: "John Doe", email: "john@example.com", mobile: "1234567890" ,userlevel:"Accounts",userleveldocno:"3"},
  { docno: 2, username: "admin", fullname: "Sys.Admin", email: "admin@example.com", mobile: "1234567890" ,userlevel:"First Level",userleveldocno:"1"}
  // Add more user data here
];

const tblHiddenColumns = ["userleveldocno"];





// Define actions for the dropdown

export function UserMaster(){
  const [isOpen,setIsOpen]=useState(false);
  const [isSubmitting,setIsSubmitting]=useState(false);
  const [modaltitle,setModalTitle]=useState("Add User");
  const [modalDesc,setModalDesc]=useState("Make changes to add users. Click save when you're done.");
  const [mode,setMode]=useState("A");
  const { showConfirm }=useConfirm();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      docno: 0,
      password: "",
      fullname: "",
      username: "",
      email: "",
      mobile: "",
      userlevel: ""
    },
  });

  const handleEdit = (user: typeof tbldata[0]) => {
    setModalTitle("Edit User");
    setModalDesc("Make changes to edit this user.");
    setMode("E");
    form.setValue("docno", user.docno);
    form.setValue("username", user.username);
    form.setValue("fullname", user.fullname);
    form.setValue("email", user.email);
    form.setValue("mobile", user.mobile);
    form.setValue("userlevel", user.userleveldocno);
    setIsOpen(true);
    // Implement edit functionality
  };

  const handleDelete = (row: typeof tbldata[0]) => {
    console.log("Deleting:", row);
    setMode("D");
    // Implement delete functionality
  };

  const actions = [
    { label: "Edit", onClick: handleEdit },
    { label: "Delete", onClick: handleDelete },
    // Add more actions as needed
  ];

  
  function onSubmit(values: z.infer<typeof formSchema>) {
    showConfirm("Are you sure you want to add this user?", () => {
      setIsSubmitting(true);
      sendAPIRequest(values,mode,"/user","User")
        .then(()=>{
          setIsOpen(false);
        })
        .catch((error)=>{
          
        })
        .finally(()=>{
          setIsSubmitting(false);
        });
    });
  }

  return(
    <>
      <div className="w-full">
        <div className="flex items-center justify-between py-4">
          <h2 className="text-2xl">Users
            <Badge variant={"outline"} className="ml-2">{tbldata.length} Users</Badge>
          </h2>

          <Form {...form}>
            <Dialog open={isOpen} onOpenChange={(open)=>{
              setIsOpen(open);
              if(!open){
                form.reset();
              }
            }}>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={()=>{setMode("A")}}>Add User</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] lg:max-w-[1000px] w-full">
                <DialogHeader>
                  <DialogTitle>{modaltitle}</DialogTitle>
                  <DialogDescription>
                    {modalDesc}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                    <FormField control={form.control} name="username" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Username" {...field} />
                        </FormControl>
                        <FormDescription>This is your username for login.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="fullname" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Fullname" {...field} />
                        </FormControl>
                        <FormDescription>This is your display name.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormDescription>This is your Email ID.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="mobile" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile</FormLabel>
                        <FormControl>
                          <Input placeholder="Mobile No" {...field} />
                        </FormControl>
                        <FormDescription>This is your mobile number.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="password" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Password" {...field} />
                        </FormControl>
                        <FormDescription>This is your password for login.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="userlevel" render={({ field }) => (
                      <FormItem>
                        <FormLabel>User Level</FormLabel>
                        <FormControl>
                          <CustDropDown dataLabel="User Level" dataType="userlevel" field={field} onValueChange={(type, value) => form.setValue("userlevel", value)}></CustDropDown>
                        </FormControl>
                        <FormDescription>This is your permission level.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <DialogFooter>
                    <Button variant={'outline'} onClick={()=>{form.reset();setIsOpen(false);}}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save changes
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </Form>
        </div>
        <div className="rounded-md border">
          <DataTable columns={tblcolumns} data={tbldata} actions={actions} hiddenColumns={tblHiddenColumns}/>
        </div>
      </div>
    </>

  )
}