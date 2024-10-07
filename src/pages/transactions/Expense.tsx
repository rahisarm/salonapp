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
import { DatePicker } from "@/custom-components/datepicker";
import { InsertDropdown } from "@/custom-components/InsertDropdown";
import { number } from "yup";



interface TblStructure{
    docno:number;
    date:Date;
    acname:string;
    acno:string;
    exptype:string;
    exptypeno:string;
    paytype:string;
    paytypeno:string;
    amount:number;
    vendor:string;
    tax:number;
    nettotal:number;
    billno:string;
    remarks:string;   
}

const formSchema = z.object({
    account: z.string().min(1, {
        message: "Account is required.",
    }),
    date: z.date().nullable().refine((val) => val !== null, {
        message: "Date is required",
    }),
    exptype: z.string().min(1, {
        message: "Type is required.",
    }),
    paytype: z.string().min(1, {
        message: "Payment Type is required.",
    }),
    amount: z.string().regex(/^\d+(\.\d+)?$/, {
        message: "Amount must be a valid number.",
    }),
    nettotal: z.string().regex(/^\d+(\.\d+)?$/, {
        message: "Total must be a valid number.",
      }),
    paytypeno: z.string().optional(),
    billno: z.string().optional(),
    vendor: z.string().optional(),
    remarks: z.string().optional(),
    tax: z.string().regex(/^\d+(\.\d+)?$/).optional(),
    docno: z.number().optional(),
});

const tblcolumns = [

    { key: "docno", label: "Doc No" },
    { key: "date", label: "Date"},
    { key: "acno", label: "Account #" },
    { key: "acname", label: "Account Name" },
    { key: "exptype", label: "Expense Type" },
    { key: "exptypename", label: "Expense Type" },
    { key: "paytype", label: "Payment Type" },
    { key: "paytypename", label: "Payment Type" },
    { key: "paytypeno", label: "Payment Ref #" },
    { key: "vendor", label: "Vendor" },
    { key: "vendorname", label: "Vendor" },
    { key: "amount", label: "Amount" },
    { key: "tax", label: "Tax" },
    { key: "nettotal", label: "Net Total" },
    { key: "billno", label: "Bill No" },
    { key: "remarks", label: "Remarks" },

];
  
const tblHiddenColumns = ["acno","tax","billno","remarks","exptype","paytype","vendor"];


export function Expense(){

    const [isOpen,setIsOpen]=useState(false);
    const [tbldata,setTbldata]=useState([]);
    const [isSubmitting,setIsSubmitting]=useState(false);
    const [modaltitle,setModalTitle]=useState("Add Expense");
    const [modalDesc,setModalDesc]=useState("Make changes to add expenses. Click save when you're done.");
    const [mode,setMode]=useState("");
    const { showConfirm }=useConfirm();

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            docno: 0,
            date:new Date(),
            account: "",
            exptype: "",
            paytype: "",
            paytypeno:"",
            amount:"0.0",
            tax:"0.0",
            vendor:"",
            nettotal:"0.0",
            billno:"",
            remarks:""  
        },
    });

    const amount=form.watch('amount');
    const tax=form.watch('tax');

    useEffect(() => {
        
    }, [amount, tax, form]);

    const fetchData=()=>{
        sendAPIRequest(null,"G","/expense/all/"+localStorage.getItem("brhid"),"Expense").then((response:any)=>{
            if(response?.data){
                console.log(response.data);
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
        setModalTitle("Edit Expense");
        setModalDesc("Make changes to edit this expense.");
        setMode("E");
        setIsOpen(true);
        // Implement edit functionality
    };

    const handleDelete = (row: TblStructure) => {
        console.log("Deleting:", row);
        setMode("D");
    
        showConfirm("Are you sure you want to delete this expense?", () => {
            setIsSubmitting(true);
            sendAPIRequest(row,"D","/expense","Expense")
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
          confirmmsg="Are you sure you want to add this expense?";
        }
        else if(mode=="E"){
          confirmmsg="Are you sure you want to edit this expense?"
        }
        else if(mode=="D"){
          confirmmsg="Are you sure you want to delete this expense?"
        }
        showConfirm(confirmmsg, () => {
            console.log(values);
            setIsSubmitting(true);
            sendAPIRequest(values,mode,"/expense","Expense")
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
                    <h2 className="text-2xl">Expenses
                        <Badge variant={"outline"} className="ml-2">{tbldata.length} Expenses</Badge>
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
                            <Button variant="outline" onClick={()=>{setMode("A");form.reset();}}>Add Expense</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[800px] lg:max-w-[1000px] w-full overflow-y-auto max-h-screen">
                            <DialogHeader>
                                <DialogTitle>{modaltitle}</DialogTitle>
                                <DialogDescription>{modalDesc}</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" autoComplete="off">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                                    <FormField control={form.control} name="date" render={({ field }) => (
                                        <FormItem >
                                            <FormLabel>Date</FormLabel>
                                            <FormControl>
                                                <DatePicker value={field.value} onChange={field.onChange}></DatePicker>
                                            </FormControl>
                                            <FormDescription>This is your expense date.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="account" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Account</FormLabel>
                                            <FormControl>
                                                <CustDropDown dataLabel="Accounts" dataType="glaccount" field={field} onValueChange={(type, value) => form.setValue("account", value)} value={field.value}></CustDropDown>
                                            </FormControl>
                                            <FormDescription>This is your account.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="exptype" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Expense Type</FormLabel>
                                            <FormControl>
                                                <InsertDropdown dataLabel="Expense Type" dataType="exptype" field={field} onValueChange={(type, value) => form.setValue("exptype", value)} value={field.value}></InsertDropdown>
                                            </FormControl>
                                            <FormDescription>This is your additional expense type.You can add if you need a new type.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="paytype" render={({ field }) => (
                                        <FormItem >
                                            <FormLabel>Payment Type</FormLabel>
                                            <FormControl>
                                                <CustDropDown dataLabel="Payment Type" dataType="paytype" field={field} onValueChange={(type, value) => form.setValue("paytype", value)} value={field.value}></CustDropDown>
                                            </FormControl>
                                            <FormDescription>This is your payment type like Cash/Card/Cheque/UPI.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="paytypeno" render={({ field }) => (
                                        <FormItem >
                                            <FormLabel>Payment Ref #</FormLabel>
                                            <FormControl>
                                            <Input placeholder="Payment Ref No" {...field} />
                                            </FormControl>
                                            <FormDescription>This is your payment ref.number like cheque/card/transaction number.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="vendor" render={({ field }) => (
                                        <FormItem >
                                            <FormLabel>Vendor</FormLabel>
                                            <FormControl>
                                            <CustDropDown dataLabel="Vendor" dataType="vendor" field={field} onValueChange={(type, value) => form.setValue("vendor", value)} value={field.value}></CustDropDown>
                                            </FormControl>
                                            <FormDescription>This is your vendor you paid.You can choose General if you cannot specify.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="amount" render={({ field }) => (
                                        <FormItem >
                                            <FormLabel>Amount</FormLabel>
                                            <FormControl>
                                            <Input placeholder="Amount" {...field} />
                                            </FormControl>
                                            <FormDescription>This is your expense amount.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="tax" render={({ field }) => (
                                        <FormItem >
                                            <FormLabel>Tax Amount</FormLabel>
                                            <FormControl>
                                            <Input placeholder="Tax Amount" {...field}/>
                                            </FormControl>
                                            <FormDescription>This is your tax amount you paid to vendor.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="nettotal" render={({ field }) => (
                                        <FormItem >
                                            <FormLabel>Total Amount</FormLabel>
                                            <FormControl>
                                            <Input placeholder="Net Total" {...field} />
                                            </FormControl>
                                            <FormDescription>This is your total amount you paid</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    
                                    <FormField control={form.control} name="billno" render={({ field }) => (
                                        <FormItem >
                                            <FormLabel>Bill No</FormLabel>
                                            <FormControl>
                                            <Input placeholder="Bill No" {...field} />
                                            </FormControl>
                                            <FormDescription>You can specify any bill number for this expense.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="remarks" render={({ field }) => (
                                        <FormItem className="col-span-full">
                                            <FormLabel>Remarks</FormLabel>
                                            <FormControl>
                                            <Input placeholder="Remarks" {...field} />
                                            </FormControl>
                                            <FormDescription>This is your additional notes associated with this expense.</FormDescription>
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