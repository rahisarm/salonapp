
import { Button } from "@/components/ui/button";
import { CustDropDown } from "@/custom-components/custdropdown";
import CustomBarChart from "@/custom-components/CustomBarChart";
import { DateRangePicker } from "@/custom-components/DateRangePicker";
import { Icons } from "@/custom-components/icons";
import MultiBarChart from "@/custom-components/MultiBarChart";
import StatsCard from "@/custom-components/StatsCard";
import { sendAPIRequest } from "@/services/common";
import { HandCoinsIcon, UserPlus, UsersRound, Wallet } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";

export function BIReport(){
    
    const [selectedDateRange,setSelectedDateRange]=useState<DateRange | undefined>();
    const [reportBrhid,setReportBrhid]=useState<string>("");
    const [isSubmitting,setIsSubmitting]=useState<boolean>(false);
    const multiChartData = [
        { month: "January", income: 186, expense: 80 },
        { month: "February", income: 305, expense: 200 },
        { month: "March", income: 237, expense: 120 },
        { month: "April", income: 73, expense: 190 },
        { month: "May", income: 209, expense: 130 },
        { month: "June", income: 214, expense: 140 },
    ];

    const multiChartConfig = {
        income: {
          label: "Income",
          color: "hsl(var(--chart-1))",
        },
        expense: {
          label: "Expense",
          color: "hsl(var(--chart-2))",
        },
      };

    function handleDropDown(type:string,value:string){
        if(type=="brhid"){
            setReportBrhid(value);
        }
    }

    const handleDateRange=(range:DateRange | undefined)=>{
        setSelectedDateRange(range);
    }
      
    const handleData=()=>{
        setIsSubmitting(true);
        const data={fromdate:selectedDateRange?.from,todate:selectedDateRange?.to,reportbrhid:reportBrhid};
        console.log("Before Sending");
        console.log(data);
        sendAPIRequest(data,"G","/dashboard","Dashboard").then((response)=>{
            console.log(response?.data);
        }).catch((e)=>{

        }).finally(()=>{
            setIsSubmitting(false);
        })
    }
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md-p-8">
            <div className="grid grid-cols-5 grid-rows-1 gap-4">
                <div className="col-start-5 row-start-1">
                    <Button type="button" disabled={isSubmitting} onClick={handleData}>
                        {isSubmitting && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Reload
                    </Button>
                </div>
                <div className="col-start-4 row-start-1">
                    <CustDropDown dataLabel="Branch" dataType="brhid" onValueChange={handleDropDown}></CustDropDown>
                </div>
                <div className="col-start-3 row-start-1"><DateRangePicker onDateChange={handleDateRange}></DateRangePicker></div>
                
            </div>
            
            
            <div className="grid gap-4 sm:grid-cols-2 md:gap-8 md:grid-cols-4 lg:grid-cols-4">
                <StatsCard label="Revenue" icon={HandCoinsIcon} value={0}></StatsCard>
                <StatsCard label="Expense" icon={Wallet} value={0}></StatsCard>
                <StatsCard label="New Customers" icon={UserPlus} value={0}></StatsCard>
                <StatsCard label="Active Employees" icon={UsersRound} value={0}></StatsCard>
            </div>
            <div className="grid grid-cols-4 grid-rows-5 gap-4">
                <div className="col-span-2 row-span-5"><MultiBarChart chartConfig={multiChartConfig} chartData={multiChartData} description="Income/Expense" title="Last 6 months Financials"></MultiBarChart></div>
                <div className="col-span-2 row-span-5"><CustomBarChart chartData={multiChartData} chartConfig={multiChartConfig} title="Expenses" description="January - June 2024" barDataKey="desktop" labelPosition="top"></CustomBarChart></div>
            </div>
            <div className="grid grid-cols-4 gap-2">
                
            </div>
        </main>
    )
}