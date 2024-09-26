import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react"
import { useFormContext } from "react-hook-form";

interface TextInputProps{
    name:string,
    label:string,
    type?:string,
    required?:boolean
}

const TextInput:React.FC<TextInputProps>=({name,label,type="text",required=false})=>{
    const {register,formState:{errors}}=useFormContext();

    return(
        <>
            <Label htmlFor={name}>{label}</Label>
            <Input id={name} type={type} {...register(name,required?{required:`${label} is required`}:{})}></Input>
            {errors[name] && <span>{errors[name]?.message as string}</span>}
        </>
    )
}

export default TextInput;