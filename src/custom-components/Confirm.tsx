import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import React, { useState } from "react";

interface ConfirmProps {
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel?: () => void;
}

const Confirm:React.FC<ConfirmProps>=({title,description,onConfirm,onCancel})=>{
    const [isOpen,setIsOpen]=useState(true);

    const handleConfirm=()=>{
        onConfirm();
        setIsOpen(false);
    }

    const handleCancel=()=>{
        if(onCancel) onCancel();
        setIsOpen(false);
    }

    return(
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>{title}</AlertDialogTitle>
                <AlertDialogDescription>
                    {description}
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
};

export default Confirm;