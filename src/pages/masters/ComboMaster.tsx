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
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteIcon, TrashIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

interface Product{
  docno: number;
  refname: string;
  amount: number;
  status: number;
  userid: number;
  brhid: number;
  date: string;
  vocno: number;
}
interface TblStructure{
  docno:number;
  refname:string;
  description:string;
  amount:number; 
  comboDetailList:[];
  date:Date;
  fromdate:Date;
  todate:Date;

}

const formSchema = z.object({
  refname: z.string().min(1, {
      message: "Combo Name is required.",
  }),
  description: z.string().optional(), // Optional fields
  amount: z.number().optional(),
  docno: z.number().optional(),
  service: z.string().min(1, {
    message: "Atleast 1 service should be selected",
  }),
});

export function ComboMaster(){
  const [tbldata,setTbldata]=useState([]);
  const [isOpen,setIsOpen]=useState(false);
  const [isCollapseOpen,setIsCollapseOpen]=useState(false);
  const [mode,setMode]=useState("");
  const [modaltitle,setModalTitle]=useState("Add Combos");
  const [modalDesc,setModalDesc]=useState("Make changes to add combos. Click save when you're done.");
  const { showConfirm }=useConfirm();
  const [isSubmitting,setIsSubmitting]=useState(false);
  const [selectedServices,setSelectedServices]=useState<Product[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        docno: 0,
        refname: "",
        description: "",
        amount: 0.0,
        service:""
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {

    let formdata={
      ...values,
      comboDetailList: selectedServices.map((service) => ({
        psrno: service.docno
      }))
    }

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
        sendAPIRequest(formdata,mode,"/combo","Combo")
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
    sendAPIRequest(null,"G","/combo/all/"+localStorage.getItem("brhid"),"Combo").then((response:any)=>{
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

  function fetchProduct(psrno:string){
    sendAPIRequest(null,"G","/product/"+psrno,"Service").then((response:any)=>{
      if(response?.data){
        console.log('Fetching Product');
        console.log(response.data);
        setSelectedServices(selectedServices.concat(response.data));
      }
    }).catch((error)=>{
        console.log(error);
    }).finally(()=>{

    });
  }
  function handleService(type:string,value:string){
    form.setValue("service", value);
    fetchProduct(value);
  }

  function removeService(docno:number){
    setSelectedServices((prevServices) => {
      // Filter out the service with the matching docno
      return prevServices.filter((service) => service.docno !== docno);
    });
  }

  const handleDelete = (row: TblStructure) => {
   
  };
  const handleEdit = (row: TblStructure) => {
   
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
          <h2 className="text-2xl">Combos
            <Badge variant={"outline"} className="ml-2">{tbldata.length} Combos</Badge>
          </h2>
          <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Doc No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Services Count</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tbldata.map((row:any, index) => (
              <TableRow key={index}>
                <TableCell>{row.docno}</TableCell>
                <TableCell>{row.refname}</TableCell>
                <TableCell>
                  <Collapsible open={openRows[row.docno] ?? false}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" onClick={() => toggleCollapse(row.docno)}>
                        {row.comboDetailList.length} Services
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableCell>Service</TableCell>
                            <TableCell>Amount</TableCell>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {row.comboDetailList.map((detail:any) => (
                            <TableRow key={detail.psrno}>
                              <TableCell>{detail.refname}</TableCell>
                              <TableCell>{detail.amount}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CollapsibleContent>
                  </Collapsible>
                </TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost">
                        <DotsHorizontalIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleEdit(row)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(row)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

                    <Form {...form}>
                        <Dialog open={isOpen} onOpenChange={(open)=>{
                                setIsOpen(open);
                                if(!open){
                                    form.reset();
                                }
                            }
                        }>
                        <DialogTrigger asChild>
                            <Button variant="outline" onClick={()=>{setMode("A");form.reset();setSelectedServices([])}}>Add Combos</Button>
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
                                            <FormLabel>Combo Name</FormLabel>
                                            <FormControl>
                                              <Input placeholder="Combo Name" {...field} />
                                            </FormControl>
                                            <FormDescription>This is the name for your combo.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="description" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Description" {...field} />
                                            </FormControl>
                                            <FormDescription>This is the details about your combo.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="amount" render={({ field }) => (
                                      <FormItem>
                                <FormLabel>Amount</FormLabel>
    <FormControl>
      <Input
        placeholder="Amount"
        {...field}
        value={field.value ?? ''} // Ensure the field value is not `null` or `undefined`
        onChange={(e) => {
          const value = e.target.value.replace(/[^0-9.]/g, ''); // Restrict to numbers and decimal point
          field.onChange(value ? parseFloat(value) : ""); // Convert to float or empty string
        }}
        type="text" // Keep input type as text to avoid arrows
        inputMode="decimal" // Use decimal input mode for better UX on mobile devices
      />
    </FormControl>
    <FormDescription>This is the amount you charge for combo.</FormDescription>
    <FormMessage />
  </FormItem>
)} />
                                    <FormField control={form.control} name="service" render={({ field }) => (
                                        <FormItem >
                                            <FormLabel>Services</FormLabel>
                                            <FormControl>
                                              <CustDropDown dataLabel="Services" dataType="service" field={field} onValueChange={handleService} value={field.value}></CustDropDown>
                                            </FormControl>
                                            <FormDescription>Choose the services you want to add to your combo.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <div className="col-span-2">
                                      <Table>
                                        <TableHeader>
                                        <TableRow>
                                          <TableCell>Selected Services</TableCell>
                                          <TableCell>Amount</TableCell>
                                          <TableCell className="text-right">Actions</TableCell>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {selectedServices.map((product:Product) => (
                                          <TableRow key={product.docno}>
                                            <TableCell>{product.refname}</TableCell>
                                            <TableCell>{product.amount}</TableCell>
                                            <TableCell className="text-right">
                                              <Button variant={'destructive'} size={'icon'} type="button" onClick={() => removeService(product.docno)}>
                                                <TrashIcon></TrashIcon>
                                              </Button>
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
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
                
            </div>
        </div>
    </>
  )
}
