"use client"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Icons } from "@/custom-components/icons";
import { useConfirm } from "@/custom-components/Confirm";
import { CustDropDown } from "@/custom-components/custdropdown";
import { DataTable } from "@/custom-components/DataTable";
import { sendAPIRequest } from "@/services/common";

interface TblStructure{
    docno:number;
    acname:string;
    account:string;
    actype:string;   
}

const formSchema = z.object({
    acname: z.string().min(1, {
        message: "Account Name is required.",
    }),
    account: z.string().optional(), // Optional fields
    actype: z.string().optional(),
    docno: z.number().optional(),
});

const tblcolumns = [
    { key: "docno", label: "Doc No" },
    { key: "account", label: "Account #" },
    { key: "acname", label: "Account Name" },
    { key: "actype", label: "Account Type" }
];
  
const tblHiddenColumns = [""];


export function AccountMaster(){

    const [isOpen,setIsOpen]=useState(false);
    const [tbldata,setTbldata]=useState([]);
    const [isSubmitting,setIsSubmitting]=useState(false);
    const [modaltitle,setModalTitle]=useState("Add Account");
    const [modalDesc,setModalDesc]=useState("Make changes to add accounts. Click save when you're done.");
    const [mode,setMode]=useState("");
    const { showConfirm }=useConfirm();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            docno: 0,
            acname: "",
            account: "",
            actype: "",
          
        },
    });

    const fetchData=()=>{
        sendAPIRequest(null,"G","/account/all/"+localStorage.getItem("brhid"),"Account").then((response:any)=>{
            if(response?.data){
                setTbldata(response.data);
            }
        }).catch((error)=>{
            console.log(error);
        }).finally(()=>{
    
        });
    }
    
    useEffect(()=>{
        fetchData();
    },[]);

    const handleEdit = (user: TblStructure) => {
        setModalTitle("Edit Account");
        setModalDesc("Make changes to edit this account.");
        setMode("E");
        form.setValue("docno", user.docno);
        form.setValue("acname", user.acname);
        form.setValue("account", user.account);
        form.setValue("actype", user.actype);
        setIsOpen(true);
        // Implement edit functionality
    };

    const handleDelete = (row: TblStructure) => {
        console.log("Deleting:", row);
        setMode("D");
    
        showConfirm("Are you sure you want to delete this account?", () => {
            setIsSubmitting(true);
            sendAPIRequest(row,"D","/account","Account")
            .then(()=>{
                fetchData();
            })
            .catch((error)=>{
                console.log(error);
            })
            .finally(()=>{
                setIsSubmitting(false);
            });
        });
        // Implement delete functionality
    };


    const actions:{label:string,onClick:(row:TblStructure)=>void}[] = [
        { label: "Edit", onClick: handleEdit },
        { label: "Delete", onClick: handleDelete },
        // Add more actions as needed
    ];
    
      
    function onSubmit(values: z.infer<typeof formSchema>) {
        let confirmmsg="";
        if(mode=="A"){
          confirmmsg="Are you sure you want to add this account?";
        }
        else if(mode=="E"){
          confirmmsg="Are you sure you want to edit this account?"
        }
        else if(mode=="D"){
          confirmmsg="Are you sure you want to delete this account?"
        }
        showConfirm(confirmmsg, () => {
            setIsSubmitting(true);
            sendAPIRequest(values,mode,"/account","Account")
            .then(()=>{
                setIsOpen(false);
                fetchData();
            })
            .catch((error)=>{
                console.log(error);
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
                    <h2 className="text-2xl">Accounts
                        <Badge variant={"outline"} className="ml-2">{tbldata.length} Accounts</Badge>
                    </h2>

                    <Form {...form}>
                        <Dialog open={isOpen} onOpenChange={(open)=>{
                                setIsOpen(open);
                                if(!open){
                                    form.reset();
                                }
                            }
                        }>
                        <DialogTrigger asChild>
                            <Button variant="outline" onClick={()=>{setMode("A");form.reset();}}>Add Account</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[800px] lg:max-w-[1000px] w-full">
                            <DialogHeader>
                                <DialogTitle>{modaltitle}</DialogTitle>
                                <DialogDescription>{modalDesc}</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" autoComplete="off">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                                    <FormField control={form.control} name="actype" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Account Type</FormLabel>
                                            <FormControl>
                                                <CustDropDown dataLabel="Account Type" dataType="actype" field={field} onValueChange={(type, value) => form.setValue("actype", value)} value={field.value}></CustDropDown>
                                            </FormControl>
                                            <FormDescription>This is your account type.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="account" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Account #</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Account Number" {...field} />
                                            </FormControl>
                                            <FormDescription>This is your display account number.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="acname" render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel>Account Name</FormLabel>
                                            <FormControl>
                                            <Input placeholder="Account Name" {...field} />
                                            </FormControl>
                                            <FormDescription>This is your display account name.</FormDescription>
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