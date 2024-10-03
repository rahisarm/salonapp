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
import { Table } from "lucide-react";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

const columns=[
    { key: "docno", label: "Doc No",type:"text" },
    { key: "refname", label: "Combo Name",type:"text" },
    { key: "services", label: "Services",type:"button" },
    { key: "amount", label: "Amount",type:"text" }
]
const data=[
    {
      "docno": 1,
      "refname": "Combo1",
      "fromdate": "2024-10-01",
      "todate": "2024-10-31",
      "amount": 600,
      "description": "Just a Combo",
      "status": 3,
      "comboDetailList": [
        {
          "docno": 1,
          "product": {
            "docno": 1,
            "refname": "Haircut",
            "amount": 100,
            "status": 3
          }
        },
        {
          "docno": 2,
          "product": {
            "docno": 2,
            "refname": "Shaving",
            "amount": 80,
            "status": 3
          }
        }
      ]
    }
  ];
const hiddenColumns=[""]
export function ComboMaster(){
    
    const [isOpen,setIsOpen]=useState(false);
    const [tbldata,setTbldata]=useState([]);
    const [isSubmitting,setIsSubmitting]=useState(false);
    const [modaltitle,setModalTitle]=useState("Add Account");
    const [modalDesc,setModalDesc]=useState("Make changes to add accounts. Click save when you're done.");
    const [mode,setMode]=useState("");
    const { showConfirm }=useConfirm();


    const handleEdit = (user: any) => {
        
        // Implement edit functionality
    };

    const handleDelete = (row: any) => {
        console.log("Deleting:", row);
        
    };

    const actions:{label:string,onClick:(row:any)=>void}[] = [
        { label: "Edit", onClick: handleEdit },
        { label: "Delete", onClick: handleDelete },
        // Add more actions as needed
    ];
    
    return (
        
        <>
            
        </>
    )
}