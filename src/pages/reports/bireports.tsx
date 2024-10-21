
import { CustDropDown } from "@/custom-components/custdropdown";
import CustomBarChart from "@/custom-components/CustomBarChart";
import { DateRangePicker } from "@/custom-components/DateRangePicker";
import MultiBarChart from "@/custom-components/MultiBarChart";
import StatsCard from "@/custom-components/StatsCard";
import { HandCoinsIcon, UserPlus, UsersRound, Wallet } from "lucide-react";

export function BIReport(){
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
          color: "hsl(var(--chart-3))",
        },
        expense: {
          label: "Expense",
          color: "hsl(var(--chart-4))",
        },
      };

      function handleDropDown(type:string,value:string){

      }
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md-p-8">
            <div className="grid grid-cols-5 grid-rows-1 gap-4">
                <div className="col-start-5 row-start-1"><CustDropDown dataLabel="Branch" dataType="brhid" onValueChange={handleDropDown}></CustDropDown></div>
                <div className="col-start-4 row-start-1"><DateRangePicker></DateRangePicker></div>
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