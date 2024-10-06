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
import { DataTable } from "@/custom-components/DataTable";
import { sendAPIRequest } from "@/services/common";
import { Checkbox } from "@/components/ui/checkbox";

interface TblStructure{
    docno:number;
    refname:string;
    email:string;
    mobile:string;
}

const formSchema = z.object({
    refname: z.string().min(1, {
        message: "Vendor Name is required.",
    }),
    mobile: z.string().optional(), // Optional fields
    email: z.string().optional(),
    docno: z.number().optional()
});

const tblcolumns = [
    { key: "docno", label: "Doc No" },
    { key: "refname", label: "Vendor Name" },
    { key: "email", label: "Email" },
    { key: "mobile", label: "Mobile" }
];
  
const tblHiddenColumns = [""];


  
export function VendorMaster(){

    const [isOpen,setIsOpen]=useState(false);
    const [tbldata,setTbldata]=useState([]);
    const [isSubmitting,setIsSubmitting]=useState(false);
    const [modaltitle,setModalTitle]=useState("Add Vendor");
    const [modalDesc,setModalDesc]=useState("Make changes to add vendor. Click save when you're done.");
    const [mode,setMode]=useState("");
    const { showConfirm }=useConfirm();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            docno: 0,
            refname: "",
            mobile: "",
            email: ""
        },
    });

    const fetchData=()=>{
        sendAPIRequest(null,"G","/vendor/all/"+localStorage.getItem("brhid"),"Vendor").then((response:any)=>{
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
        setModalTitle("Edit Vendor");
        setModalDesc("Make changes to edit this vendor.");
        setMode("E");
        form.setValue("docno", user.docno);
        form.setValue("refname", user.refname);
        form.setValue("email", user.email);
        form.setValue("mobile", user.mobile);
        setIsOpen(true);
        // Implement edit functionality
    };
    
    const handleDelete = (row: TblStructure) => {
        console.log("Deleting:", row);
        setMode("D");
    
        showConfirm("Are you sure you want to delete this Vendor?", () => {
            setIsSubmitting(true);
            sendAPIRequest(row,"D","/vendor","Vendor")
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
          confirmmsg="Are you sure you want to add this vendor?";
        }
        else if(mode=="E"){
          confirmmsg="Are you sure you want to edit this vendor?"
        }
        else if(mode=="D"){
          confirmmsg="Are you sure you want to delete this vendor?"
        }
        showConfirm(confirmmsg, () => {
            setIsSubmitting(true);
            sendAPIRequest(values,mode,"/vendor","Vendor")
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


    return (
        <>
            <div className="w-full">
                <div className="flex items-center justify-between py-4">
                    <h2 className="text-2xl">Vendors
                        <Badge variant={"outline"} className="ml-2">{tbldata.length} Vendors</Badge>
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
                            <Button variant="outline" onClick={()=>{setMode("A");form.reset();}}>Add Vendor</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[800px] lg:max-w-[1000px] w-full">
                            <DialogHeader>
                                <DialogTitle>{modaltitle}</DialogTitle>
                                <DialogDescription>{modalDesc}</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" autoComplete="off">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                                    <FormField control={form.control} name="refname" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Vendor Name" {...field} />
                                            </FormControl>
                                            <FormDescription>This is your vendor display name.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="mobile" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mobile</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Vendor Mobile" {...field} />
                                            </FormControl>
                                            <FormDescription>This is your vendor mobile number.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="email" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                            <Input placeholder="Email" {...field} />
                                            </FormControl>
                                            <FormDescription>This is your vendor Email ID.</FormDescription>
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