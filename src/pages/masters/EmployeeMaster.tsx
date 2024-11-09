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
import { useSettings } from "@/contexts/SettingsContext";

interface TblStructure{
    docno:number;
    refname:string;
    email:string;
    mobile:string;
    targetamt:string;
    active:boolean;
    salary:string;
}

const formSchema = z.object({
    refname: z.string().min(1, {
        message: "Employee Name is required.",
    }),
    mobile: z.string().optional(), // Optional fields
    email: z.string().optional(),
    docno: z.number().optional(),
    targetamt: z.string().regex(/^\d+(\.\d+)?$/, {
        message: "Target Amount must be a valid number.",
    }),
    /*targetamt: z.string()
        .min(1, { message: "Target amount is required." })
        .transform((value) => parseFloat(value)) // Transform to number
        .refine((value) => !isNaN(value), { message: "Invalid number." }), // Ensure it's a valid number
    */
    active:z.boolean().optional(),
    salary: z.string().regex(/^\d+(\.\d+)?$/, {
        message: "Salary must be a valid number.",
    }),
});

const tblcolumns = [
    { key: "docno", label: "Doc No" },
    { key: "refname", label: "Employee Name" },
    { key: "email", label: "Email" },
    { key: "mobile", label: "Mobile" },
    { key: "targetamt", label: "Target Amount" },
    { key: "active", label: "Active" },
    { key: "stractive", label: "Status" },
    { key: "salary",label:"Salary"}
];
  
const tblHiddenColumns = ["active"];


  
export function EmployeeMaster(){

    const [isOpen,setIsOpen]=useState(false);
    const [tbldata,setTbldata]=useState([]);
    const [isSubmitting,setIsSubmitting]=useState(false);
    const [modaltitle,setModalTitle]=useState("Add Employee");
    const [modalDesc,setModalDesc]=useState("Make changes to add employee. Click save when you're done.");
    const [mode,setMode]=useState("");
    const { showConfirm }=useConfirm();

    const globalsettings=useSettings();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            docno: 0,
            refname: "",
            mobile: "",
            email: "",
            targetamt:"0.0",
            active:true,
            salary:globalsettings.settings.DefaultSalary.value
        },
    });

    const fetchData=()=>{
        sendAPIRequest(null,"G","/employee/all/"+localStorage.getItem("brhid"),"Employee").then((response:any)=>{
            if(response?.data){
                const updatedata=response.data.map((item:any)=>({
                    ...item,
                    stractive:item.active?"Active":"Inactive",
                }));
                setTbldata(updatedata);
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
        setModalTitle("Edit Empployee");
        setModalDesc("Make changes to edit this employee.");
        setMode("E");
        form.setValue("docno", user.docno);
        form.setValue("refname", user.refname);
        form.setValue("email", user.email);
        form.setValue("mobile", user.mobile);
        form.setValue("targetamt", user.targetamt+"");
        form.setValue("active", user.active);
        form.setValue("salary",user.salary+"");
        setIsOpen(true);
        // Implement edit functionality
    };
    
    const handleDelete = (row: TblStructure) => {
        console.log("Deleting:", row);
        setMode("D");
    
        showConfirm("Are you sure you want to delete this Employee?", () => {
            setIsSubmitting(true);
            sendAPIRequest(row,"D","/employee","Employee")
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
          confirmmsg="Are you sure you want to add this employee?";
        }
        else if(mode=="E"){
          confirmmsg="Are you sure you want to edit this employee?"
        }
        else if(mode=="D"){
          confirmmsg="Are you sure you want to delete this employee?"
        }
        showConfirm(confirmmsg, () => {
            setIsSubmitting(true);
            sendAPIRequest(values,mode,"/employee","Employee")
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
                    <h2 className="text-2xl">Employees
                        <Badge variant={"outline"} className="ml-2">{tbldata.length} Employees</Badge>
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
                            <Button variant="outline" onClick={()=>{setMode("A");form.reset();}}>Add Employee</Button>
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
                                                <Input placeholder="Employee Name" {...field} />
                                            </FormControl>
                                            <FormDescription>This is your employee display name.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="mobile" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mobile</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Employee Mobile" {...field} />
                                            </FormControl>
                                            <FormDescription>This is your employee mobile number.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="email" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                            <Input placeholder="Email" {...field} />
                                            </FormControl>
                                            <FormDescription>This is your employee Email ID.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="salary" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Salary</FormLabel>
                                            <FormControl>
                                            <Input placeholder="Salary" {...field} />
                                            </FormControl>
                                            <FormDescription>This is your employee salary.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="targetamt" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Target Amount</FormLabel>
                                            <FormControl>
                                            <Input placeholder="Target Amount" {...field} />
                                            </FormControl>
                                            <FormDescription>This is your employee Target Amount per day.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="active" render={({ field }) => (
                                        <FormItem className="items-center">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <FormLabel className="mx-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Active</FormLabel>
                                            <FormDescription>This is your employee active status.</FormDescription>
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