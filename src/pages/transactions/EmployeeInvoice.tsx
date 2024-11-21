"use client"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm, useWatch } from "react-hook-form";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteIcon, TrashIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AccordionHeader } from "@radix-ui/react-accordion";
import React from "react";
import { toast } from "@/hooks/use-toast";
import { DatePicker } from "@/custom-components/datepicker";
import { InsertDropdown } from "@/custom-components/InsertDropdown";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ServiceDropdown } from "@/custom-components/ServiceDropdown";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/contexts/SettingsContext";
import { format } from "date-fns";

const formSchema = z.object({
    cldocno: z.string().min(1, {
        message: "Customer Mobile is required.",
    }),
    empid: z.string().min(1, {
        message: "Employee is required.",
    }),
    paytype: z.string().min(1, {
        message: "Payment Type is required.",
    }),
    date: z.date().nullable().refine((val) => val !== null, {
        message: "Date is required",
    }),
    description: z.string().optional(), // Optional fields
    total: z.string().regex(/^\d+(\.\d+)?$/, {
        message: "Total must be a valid number.",
    }),
    discount: z.string().regex(/^\d+(\.\d+)?$/, {
        message: "Discount must be a valid number.",
    }),
    tax: z.string().regex(/^\d+(\.\d+)?$/, {
        message: "Tax must be a valid number.",
    }),
    nettotal: z.string().regex(/^\d+(\.\d+)?$/, {
        message: "Net Total must be a valid number.",
    }),
    docno: z.number().optional(),
    service: z.string().optional(),
    chkworkbonus:z.boolean().optional(),
    chknightbonus:z.boolean().optional()
});

interface Service{
    docno: number;
    refname: string;
    amount: number;
    servicetype:string;
    status: number;
    userid: number;
    brhid: number;
    date: string;
    vocno: number;
}

export function EmployeeInvoice(){
    const [tbldata,setTbldata]=useState([]);
    const [isOpen,setIsOpen]=useState(false);
    const [isCollapseOpen]=useState(false);
    const [mode,setMode]=useState("A");
    const [modaltitle,setModalTitle]=useState("Add Invoice");
    const [modalDesc,setModalDesc]=useState("Make changes to add invoices. Click save when you're done.");
    const { showConfirm }=useConfirm();
    const [isSubmitting,setIsSubmitting]=useState(false);
    const [selectedServices,setSelectedServices]=useState<Service[]>([]);
    const [expandedCombos, setExpandedCombos] = useState<number[]>([]);
    const [empTargetPay,setEmpTargetPay]=useState(0.0);
    const [emprole,setEmprole]=useState<boolean>(false);
  const globalsettings=useSettings();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            docno: 0,
            cldocno: "",
            description: "",
            total: "0.0",
            discount: "0.0",
            tax: "0.0",
            nettotal: "0.0",
            service:"",
            empid:"",
            date:new Date,
            paytype:"",
            chkworkbonus:false,
            chknightbonus:false
        },
    });

    useEffect(()=>{
        if(localStorage.getItem("userrole")=="5"){
            setEmprole(true);
        }
    },[localStorage.getItem("userrole")])
    function onSubmit(values: z.infer<typeof formSchema>) {
        if(selectedServices.length==0){
          toast({
            title: "Services are mandatory",
            description: `Minimum 1 service is needed.`,
            variant: "destructive",
          });
          return false;
        }
        let formdata={
            ...values,
            details: selectedServices.map((service) => ({
                serviceid:service.docno,
                servicetype:service.servicetype,
                amount:service.amount
            })),
            taxpercent:globalsettings.settings.tax.value
        }
        console.log(formdata);
        let confirmmsg="";
        if(mode=="A"){
          confirmmsg="Are you sure you want to add this invoice?";
        }
        else if(mode=="E"){
          confirmmsg="Are you sure you want to edit this invoice?"
        }
        else if(mode=="D"){
          confirmmsg="Are you sure you want to delete this invoice?"
        }
        showConfirm(confirmmsg, () => {
            setIsSubmitting(true);
            sendAPIRequest(formdata,mode,"/invoice","Invoice")
            .then(()=>{
                setIsOpen(false);
                form.reset();
                setSelectedServices([]);
            })
            .catch((error)=>{
                console.log(error);
            })
            .finally(()=>{
                setIsSubmitting(false);
            });
        });
    }

    function fetchProduct(psrno:string,itemtype:string){
        let endpoint="";
        console.log("fetch :"+itemtype);
        if(itemtype=="Service"){
            endpoint="/product/"+psrno;
        }
        else if(itemtype=="Combo"){
            endpoint="/combo/"+psrno;
        }
        sendAPIRequest(null,"G",endpoint,itemtype).then((response:any)=>{
            if(response?.data){
                console.log(response.data);
                setSelectedServices((prevServices) => {
                    console.log("Fetching Details");
                    console.log(response.data);
                    // Assuming response.data is an array of the new service data
                    const updatedServices = prevServices.concat(response.data);
    
                    // Calculate the total amount including the newly fetched services
                    const totalAmount = updatedServices.reduce((total: number, service: Service) => {
                        return total + (service.amount || 0); // Default to 0 if amount is undefined
                    }, 0);
    
                    // Update the total in the form
                    form.setValue("total", totalAmount+"");
                    calculateNet();
                    return updatedServices; // Return the updated services for state
                });
            }
        }).catch((error)=>{
            console.log(error);
        }).finally(()=>{
    
        });
    }

    function handleService(datatype:string,value:string,itemtype:string){
        form.setValue("service", value);
        fetchProduct(value,itemtype);
    }

    function removeService(docno:number,servicetype:string){
        console.log('Remove Item:'+docno+'::'+servicetype);
        setSelectedServices((prevServices) => {
            // Filter out the service/combo with the matching docno and itemtype
            const updatedServices = prevServices.filter(
                service => !(service.docno == docno && service.servicetype == servicetype)
            );
    
            // Recalculate the total after removal
            const totalAmount = updatedServices.reduce((total: number, service: Service) => {
                return total + (service.amount || 0);
            }, 0);
    
            form.setValue("total", totalAmount+""); // Update the form's total value
    
            calculateNet();
            return updatedServices; // Return the updated service list
        });
    }

    function calculateNet(){
        var amount=form.getValues("total");
        var discount=form.getValues("discount");
        var tax=form.getValues("tax");
    
        if(discount=="" || discount=="undefined" || discount==null){
            discount="0.0";
        }
        if(amount=="" || amount=="undefined" || amount==null){
            amount="0.0";
        }
        if(tax=="" || tax=="undefined" || tax==null){
            tax="0.0";
        }
    
        if(globalsettings.settings.tax.method=="1"){
            var taxable=(parseFloat(amount)-parseFloat(discount));
            if(globalsettings.settings.tax.value!=null && globalsettings.settings.tax.value!="" && parseFloat(globalsettings.settings.tax.value)>0.0){
                var taxvalue=parseFloat(globalsettings.settings.tax.value)/100;
                var taxamt=(taxable*taxvalue).toFixed(2);
                tax=taxamt+"";
    
            }
        }
        console.log(empTargetPay+"::"+amount);
        if(empTargetPay>0.0 && parseFloat(amount)>empTargetPay){
            form.setValue("chkworkbonus",true)
        }
        var nettotal=(parseFloat(amount)-parseFloat(discount))+parseFloat(tax);
        form.setValue("nettotal",nettotal+"");
        form.setValue("tax",tax);
    }

    function changeDropdownData(field:any,value:string){
        form.setValue(field,value);
        console.log('inside dropdown'+field);
        if(field=="empid"){
            sendAPIRequest(null,"G","/employee/"+value,"Employee").then((response:any)=>{
                if(response?.data){
                    console.log(response.data);
                    setEmpTargetPay(response.data.targetamt);    
                }
            }).catch((error)=>{
                console.log(error);
            });
        }
    }

    return(
        
        <Form {...form}>
            <h2 className="text-2xl">Add Invoice</h2>
            <ScrollArea className="overflow-y-auto max-h-svh">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2" autoComplete="off">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                        <FormField control={form.control} name="date" render={({ field }) => (
                            <FormItem >
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                    <DatePicker value={field.value} onChange={field.onChange}></DatePicker>
                                </FormControl>
                                <FormDescription>This is your invoice date.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="cldocno" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mobile</FormLabel>
                                <FormControl>
                                    <InsertDropdown dataLabel="Customer Mobile" dataType="clientmobile" field={field} onValueChange={(type, value) => form.setValue("cldocno", value)} value={field.value}></InsertDropdown>
                                </FormControl>
                                <FormDescription>This is the customer mobile number.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div>
                            <div className="grid grid-cols-2 gap-2">
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
                                <FormField control={form.control} name="empid" render={({ field }) => (
                                    <FormItem >
                                        <FormLabel>Employee</FormLabel>
                                        <FormControl>
                                            <CustDropDown dataLabel="Employee" dataType="employee" field={field} onValueChange={(type, value) => changeDropdownData("empid",value)} value={field.value}></CustDropDown>
                                        </FormControl>
                                        <FormDescription>This is your employee.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </div>
                                    
                        <FormField control={form.control} name="service" render={({ field }) => (
                            <FormItem >
                                <FormLabel>Services</FormLabel>
                                <FormControl>
                                    {/* <CustDropDown dataLabel="Services" dataType="service" field={field} onValueChange={handleService} value={field.value}></CustDropDown> */}
                                    <ServiceDropdown dataLabel="Service|Combo" dataType="servicecombo" field={field} onValueChange={handleService}></ServiceDropdown>
                                </FormControl>
                                <FormDescription>Choose the services you want to add to your combo.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="border rounded">
                            <ScrollArea className="h-[400px] w-full overflow-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableCell>Selected Services</TableCell>
                                            <TableCell>Amount</TableCell>
                                            <TableCell className="text-right">Actions</TableCell>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {selectedServices.map((service:Service) => (
                                            <TableRow key={service.servicetype+"-"+service.docno}>
                                                <TableCell>{service.refname}</TableCell>
                                                <TableCell>{service.amount}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant={'destructive'} size={'icon'} type="button" onClick={() => removeService(service.docno,service.servicetype)}>
                                                        <TrashIcon></TrashIcon>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <ScrollBar></ScrollBar>
                            </ScrollArea>
                            
                        </div>
                        <div className="border rounded px-2 py-2">
                            <FormField control={form.control} name="total" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Total</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Total" {...field} type="text" inputMode="decimal"/>
                                    </FormControl>
                                    <FormDescription>This is the total invoice amount.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="discount" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Discount" {...field} type="text" inputMode="decimal"/>
                                    </FormControl>
                                    <FormDescription>This is your discount over total bill amount.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="tax" render={({ field }) => (
                                <FormItem style={{"display":globalsettings.settings.tax.method=="1"?"block":"none"}}>
                                    <FormLabel>Tax</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Tax" {...field} type="text" inputMode="decimal" readOnly/>
                                    </FormControl>
                                    <FormDescription>This is your tax over invoice amount.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="nettotal" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Net Total</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Net Total" {...field} type="text" inputMode="decimal"/>
                                    </FormControl>
                                    <FormDescription>This is your net total amount.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{display:emprole?"none":"grid"}}>
                        <FormField control={form.control} name="chkworkbonus" render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Daily Work Bonus</FormLabel>
                                    <FormDescription>
                                        Daily Work bonus applied based on daily target pay
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange}/>
                                </FormControl>
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="chknightbonus" render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Night Work Bonus</FormLabel>
                                    <FormDescription>
                                        Night Work bonus applied based on extra night time worked
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange}/>
                                </FormControl>
                            </FormItem>
                        )}/>
                    </div>
                    <div className="text-end">
                        <Button variant={'outline'} onClick={()=>{form.reset();setIsOpen(false);}} className="mr-2">Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Save changes
                        </Button>
                    </div>
                    
                </form>
                <ScrollBar orientation="vertical"></ScrollBar>
            </ScrollArea>                    
        </Form>
    )
}