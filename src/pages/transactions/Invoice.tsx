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
interface TblStructure{
    docno:number;
    clientmobile:string;
    cldocno:string;
    empid:string;
    empname:string;
    description:string;
    paytype:string;
    paytypename:string;
    total:string;
    tax:string;
    discount:string;
    nettotal:string; 
    servicelist:[];
    service:string;
    date:Date;
}

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
});

export function Invoice(){
  const [tbldata,setTbldata]=useState([]);
  const [isOpen,setIsOpen]=useState(false);
  const [isCollapseOpen]=useState(false);
  const [mode,setMode]=useState("");
  const [modaltitle,setModalTitle]=useState("Add Invoice");
  const [modalDesc,setModalDesc]=useState("Make changes to add invoices. Click save when you're done.");
  const { showConfirm }=useConfirm();
  const [isSubmitting,setIsSubmitting]=useState(false);
  const [selectedServices,setSelectedServices]=useState<Service[]>([]);
  const [expandedCombos, setExpandedCombos] = useState<number[]>([]);

  // Toggle the visibility of combo details
  const toggleCombo = (docno: number) => {
    if (expandedCombos.includes(docno)) {
      setExpandedCombos(expandedCombos.filter(id => id !== docno));
    } else {
      setExpandedCombos([...expandedCombos, docno]);
    }
  };

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
    },
  });

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
        servicelist: selectedServices.map((service) => ({
            servicedocno:service.docno,
            servicetype:service.servicetype
        }))
    }

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

  function fetchData(){
    sendAPIRequest(null,"G","/invoice/all/"+localStorage.getItem("brhid"),"Invoice").then((response:any)=>{
      if(response?.data){
        console.log('Fetching Combo');
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
            // Assuming response.data is an array of the new service data
            const updatedServices = prevServices.concat(response.data);

            // Calculate the total amount including the newly fetched services
            const totalAmount = updatedServices.reduce((total: number, service: Service) => {
                return total + (service.amount || 0); // Default to 0 if amount is undefined
            }, 0);

            // Update the total in the form
            form.setValue("total", totalAmount+"");

            return updatedServices; // Return the updated services for state
        });
      }
    }).catch((error)=>{
        console.log(error);
    }).finally(()=>{

    });
  }
  function handleService(datatype:string,value:string,itemtype:string){
    console.log("Inside Select"+datatype+"::"+value+"::"+itemtype);
    const isSelected=selectedServices.some((service)=>(service.docno+"")==value && service.servicetype==itemtype);
    if(isSelected){
      toast({
        title: "Duplicate Service",
        description: `The selected service is already in the list.`,
        variant: "destructive",
      });
      return false;
    }
    else{
      form.setValue("service", value);
      fetchProduct(value,itemtype);
    }
    
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

        return updatedServices; // Return the updated service list
    });
  }

  const handleDelete = (row: TblStructure) => {
    setMode("D");
    
        showConfirm("Are you sure you want to delete this invoice?", () => {
            setIsSubmitting(true);
            sendAPIRequest(row,"D","/invoice","Invoice")
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
  };
  const handleEdit = (user: TblStructure) => {
    setModalTitle("Edit Combo");
    setModalDesc("Make changes to edit this combo.");
    setMode("E");
    form.setValue("docno", user.docno);
    form.setValue("date", user.date);
    form.setValue("cldocno", user.cldocno);
    form.setValue("description", user.description);
    form.setValue("total",user.total);
    form.setValue("tax",user.tax);
    form.setValue("discount",user.discount);
    form.setValue("nettotal",user.nettotal);
    setSelectedServices(user.servicelist);
    setIsOpen(true);
  };
  const actions:{label:string,onClick:(row:TblStructure)=>void}[] = [
    { label: "Edit", onClick: handleEdit },
    { label: "Delete", onClick: handleDelete },
    // Add more actions as needed
  ];
  const [openRows, setOpenRows] = useState<Record<number, boolean>>({});

const toggleCollapse = (docno: number) => {
  setOpenRows(prev => ({ ...prev, [docno]: !prev[docno] }));
};
  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between py-4">
          <h2 className="text-2xl">Invoices
            <Badge variant={"outline"} className="ml-2">{tbldata.length} Invoices</Badge>
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
                            <Button variant="outline" onClick={()=>{setMode("A");form.reset();setSelectedServices([])}}>Add Invoices</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[800px] lg:max-w-[1000px] w-full">
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
                                            <FormItem>
                                                <FormLabel>Tax</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Tax" {...field} type="text" inputMode="decimal"/>
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
                <Table>
                    <TableHeader>
                        <TableHead>Doc No</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer Mobile</TableHead>
                        <TableHead>Services</TableHead>
                        <TableHead>Payment Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Action</TableHead>
                    </TableHeader>
                    <TableBody>
                        {tbldata.map((invoice: any) => (
                            <React.Fragment key={invoice.docno}>
                                <TableRow>
                                    <TableCell>{invoice.docno}</TableCell>
                                    <TableCell>{invoice.date}</TableCell>
                                    <TableCell>{invoice.clientmobile}</TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm" onClick={() => toggleCombo(invoice.docno)}>
                                            {invoice.servicelist.length} Services
                                        </Button>
                                    </TableCell>
                                    <TableCell>{invoice.paytypename}</TableCell>
                                    <TableCell>{invoice.amount}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost"><DotsHorizontalIcon /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => handleEdit(invoice)}>Edit</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(invoice)}>Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>

                                {expandedCombos.includes(invoice.docno) && invoice.servicelist && invoice.servicelist.length > 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="p-0">
                                            <Table>
                                                <TableHeader>
                                                    <TableHead>Service Doc No</TableHead>
                                                    <TableHead>Service Name</TableHead>
                                                    <TableHead>Amount</TableHead>
                                                </TableHeader>
                                                <TableBody>
                                                    {invoice.servicelist.map((detail: any) => (
                                                        <TableRow key={detail.docno}>
                                                            <TableCell>{detail.docno}</TableCell>
                                                            <TableCell>{detail.refname}</TableCell>
                                                            <TableCell>{detail.amount}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    </>
  )
}
