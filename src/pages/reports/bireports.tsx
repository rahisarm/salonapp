
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettings } from "@/contexts/SettingsContext";
import { CustDropDown } from "@/custom-components/custdropdown";
import { CustomPieChart } from "@/custom-components/CustomPieChart";
import { DatePicker } from "@/custom-components/datepicker";
import { DateRangePicker } from "@/custom-components/DateRangePicker";
import { Icons } from "@/custom-components/icons";
import MultiBarChart from "@/custom-components/MultiBarChart";
import { NormalDropdown } from "@/custom-components/NormalDropdown";
import StatsCard from "@/custom-components/StatsCard";
import ValueCard from "@/custom-components/ValueCard";
import { sendAPIRequest } from "@/services/common";
import { HandCoinsIcon, UserPlus, UsersRound, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

interface dailybalProps{
    docno:number;
    openingbalance:number;
    dailyinvoice:number;
    dailyexpense:number;
    dailybalance:number;
    closingbalance:number;
}

interface PayrollProps{
    empdocno:number;
    empname:string;
    salary:number;
    nightbonus:number;
    workbonus:number;
    totalsalary:number;
}
interface PieChartData{
    refname:string;
    chartvalue:number;
    fill:string;
}

interface PieChartConfig {
    [key: string]: {
      label: string;
      color: string;
    };
}

export function BIReport(){
    
    const [selectedDateRange,setSelectedDateRange]=useState<DateRange | undefined>();
    const [reportBrhid,setReportBrhid]=useState<string>("");
    const [isSubmitting,setIsSubmitting]=useState<boolean>(false);
    const [dailyCounterDate,setDailyCounterDate]=useState<Date | undefined>(new Date);
    const [payrolldate,setPayrolldate]=useState<Date | undefined>(new Date);
    const [dailybaldate,setDailybaldate]=useState<Date | undefined>(new Date);
    const [totalInvoice, setTotalInvoice] = useState<number>(0);  // Revenue
    const [totalExpense, setTotalExpense] = useState<number>(0);  // Expense
    const [newCustomers, setNewCustomers] = useState<number>(0);  // New Customers
    const [activeEmployees, setActiveEmployees] = useState<number>(0);  // Active Employees
    const [multiChartData,setMultiChartData]=useState<Array<{ [key: string]: number | string }>>([]);
    const [pieChartData,setPieChartData]=useState<PieChartData[]>([]);
    const [payrollData,setPayrollData]=useState<PayrollProps[]>([]);
    const [dailybalData,setDailybalData]=useState<dailybalProps[]>([]);
    const [pieChartConfig,setPieChartConfig]=useState<PieChartConfig>({});
    const globalsettings=useSettings();
    const [dateRangeNames,setDateRangeNames]=useState({
        from:"",
        to:""
    });
    const [dailyData, setDailyData] = useState({
        dailyinvcash: 0.0,
        dailyinvcard: 0.0,
        dailyinvcredit: 0.0,
        dailyinvtotal: 0.0,
        dailyexpcash: 0.0,
        dailyexpcard: 0.0,
        dailyexpcredit: 0.0,
        dailyexptotal: 0.0,
    });

    
    

    /*const multiChartData = [
        { month: "January", income: 186, expense: 80 },
        { month: "February", income: 305, expense: 200 },
        { month: "March", income: 237, expense: 120 },
        { month: "April", income: 73, expense: 190 },
        { month: "May", income: 209, expense: 130 },
        { month: "June", income: 214, expense: 140 },
    ];
    */
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
    function loadDashboard(){
        setIsSubmitting(true);
        const data = {
            fromdate: selectedDateRange?.from ? new Date(selectedDateRange?.from).toISOString().split('T')[0] : null,
            todate: selectedDateRange?.to ? new Date(selectedDateRange?.to).toISOString().split('T')[0] : null,
            reportbrhid: reportBrhid
        };
        console.log(data);
        sendAPIRequest(data,"A","/dashboard","Dashboard").then((response)=>{
            console.log(response?.data);
            setTotalInvoice(response.data.totalInvoice || 0);
            setTotalExpense(response.data.totalExpense || 0);
            setNewCustomers(response.data.newCustomers || 0);
            setActiveEmployees(response.data.activeEmployees || 0);
            let multichartlist:Array<{ [key: string]: number | string }>=[];
            setMultiChartData([]);
            response.data.incomeexpensechart.map((item:any)=>{
                multichartlist.push({month:item.month,income:item.income,expense:item.expense});
            });
            setPieChartData([]);
            let temppiechartdata=new Array<PieChartData>();
            response.data.expTypeChart.map((item:any)=>{
                temppiechartdata.push({refname:item.refname,chartvalue:item.chartvalue,fill:"var(--color-"+item.refname.toLowerCase().replace(" ","_")});
            });
            setPieChartData(temppiechartdata);
            setMultiChartData(multichartlist);

            setPieChartConfig(createPieChartConfig(response.data.expTypeChart));

            console.log(multiChartData);
        }).catch((e)=>{
            console.log(e);
        }).finally(()=>{
            setIsSubmitting(false);
        })
    }
    
    const createPieChartConfig = (data: any[]): PieChartConfig => {
        const config: PieChartConfig = {};
    
        data.forEach((item, index) => {
            config[item.refname.toLowerCase().replace(" ","_")] = {
                label: item.refname.charAt(0).toUpperCase() + item.refname.slice(1), // Capitalize first letter
                color: `hsl(var(--chart-${index + 1}))`, // You can customize this based on your color scheme
            };
        });
    
        return config;
    };

    function getDailyCounterData(){
        const data={dailydate:dailyCounterDate};
        sendAPIRequest(data,"A","/dashboard/DailyCounter","Daily Counter").then((response)=>{
            setDailyData({
                dailyinvcash: response.data.dailyinvcash || 0.0,
                dailyinvcard: response.data.dailyinvcard || 0.0,
                dailyinvcredit: response.data.dailyinvcredit || 0.0,
                dailyinvtotal: response.data.dailyinvtotal || 0.0,
                dailyexpcash: response.data.dailyexpcash || 0.0,
                dailyexpcard: response.data.dailyexpcard || 0.0,
                dailyexpcredit: response.data.dailyexpcredit || 0.0,
                dailyexptotal: response.data.dailyexptotal || 0.0,
            });
        }).catch((error)=>{
            console.error(error);
        }).finally(()=>{
            
        });
    }

    function getPayrollData(){
        const data={payrolldate:payrolldate};
        sendAPIRequest(data,"A","/dashboard/PayrollProcess","Payroll Process").then((response)=>{
            if(response.data){
                setPayrollData(response.data.payrollList);
            }
        }).catch((error)=>{
            console.error(error);
        }).finally(()=>{
            
        });
    }

    function getDailyBalData(){
        const data={dailybaldate:dailybaldate};
        sendAPIRequest(data,"A","/dashboard/DailyBalance","Daily Balance").then((response)=>{
            if(response.data){
                setDailybalData(response.data.dailybalList);
            }
        }).catch((error)=>{
            console.error(error);
        }).finally(()=>{
            
        });
    }

    useEffect(()=>{
        if(selectedDateRange){
            const fromMonth = new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(selectedDateRange.from);
            const fromYear = (selectedDateRange.from || new Date()).getFullYear();
            const toMonth = new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(selectedDateRange.to);
            const toYear = (selectedDateRange.to || new Date()).getFullYear();
            setDateRangeNames({
                from:fromMonth+" "+fromYear,
                to:toMonth+" "+toYear
            });

            loadDashboard();
        }
    },[selectedDateRange,reportBrhid]);

    useEffect(()=>{
        if(dailyCounterDate){
            getDailyCounterData();
        }
    },[dailyCounterDate]);

    useEffect(()=>{
        if(payrolldate){
            getPayrollData();
        }
    },[payrolldate]);

    useEffect(()=>{
        if(dailybaldate){
            getDailyBalData();
        }
    },[dailybaldate]);

    
    
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md-p-8">
            <div className="grid grid-cols-3 grid-rows-1 gap-4">
                <div className="col-start-5 row-start-1">
                    <Button type="button" disabled={isSubmitting} onClick={loadDashboard}>
                        {isSubmitting && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                        Reload
                    </Button>
                </div>
                <div className="col-start-4 row-start-1">
                    <NormalDropdown dataLabel="Branch" dataType="brhid" onValueChange={handleDropDown}></NormalDropdown>
                </div>
                <div className="col-start-3 row-start-1"><DateRangePicker onDateChange={handleDateRange}></DateRangePicker></div>
            </div>
            
            
            <div className="grid gap-4 sm:grid-cols-2 md:gap-8 md:grid-cols-4 lg:grid-cols-4">
                <StatsCard label="Revenue" icon={HandCoinsIcon} value={globalsettings.formatAmount(totalInvoice+"")}></StatsCard>
                <StatsCard label="Expenditure" icon={Wallet} value={globalsettings.formatAmount(totalExpense+"")}></StatsCard>
                <StatsCard label="New Customers" icon={UserPlus} value={newCustomers}></StatsCard>
                <StatsCard label="Active Employees" icon={UsersRound} value={activeEmployees}></StatsCard>
            </div>
            <div className="grid grid-rows-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <div className="col-span-2 row-span-5"><MultiBarChart chartConfig={multiChartConfig} chartData={multiChartData} description="Income/Expense" title={"Financials of "+dateRangeNames.from+" to "+dateRangeNames.to}></MultiBarChart></div>
                <div className="">
                    <Card>
                        <CardHeader className="border-b p-4">
                            <div className="grid sm:grid-cols-1 grid-cols-2">
                                <CardTitle>Daily Counter</CardTitle>
                                <div className="sm:pt-3"><DatePicker value={dailyCounterDate} onChange={setDailyCounterDate}></DatePicker></div>
                            </div>
                        </CardHeader>
                        <Tabs defaultValue="dailyinv" className="ps-2 pe-2 pt-2 w-full text-center">
                            <TabsList className="w-auto" >
                                <TabsTrigger value="dailyinv">Invoice</TabsTrigger>
                                <TabsTrigger value="dailyexp">Expense</TabsTrigger>
                            </TabsList>
                            <TabsContent value="dailyinv" >
                                <CardContent className="p-3 pt-3 pb-3 text-start">
                                    <ValueCard label="Cash" value={dailyData.dailyinvcash} ></ValueCard>
                                    <ValueCard label="Card/UPI" value={dailyData.dailyinvcard}></ValueCard>
                                    <ValueCard label="Credit" value={dailyData.dailyinvcredit}></ValueCard>        
                                </CardContent>
                                <CardFooter className="justify-end border-t p-2">
                                    <p className=" pe-5">{globalsettings.formatAmount(dailyData.dailyinvtotal+"")}</p>
                                </CardFooter>
                            </TabsContent>
                            <TabsContent value="dailyexp">
                                <CardContent className="p-3 pt-3 pb-3 text-start">
                                    <ValueCard label="Cash" value={dailyData.dailyexpcash} ></ValueCard>
                                    <ValueCard label="Card/UPI" value={dailyData.dailyexpcard}></ValueCard>
                                    <ValueCard label="Credit" value={dailyData.dailyexpcredit}></ValueCard>        
                                </CardContent>
                                <CardFooter className="justify-end border-t p-2">
                                    <p className=" pe-5">{globalsettings.formatAmount(dailyData.dailyexptotal+"")}</p>
                                </CardFooter>
                            </TabsContent>
                        </Tabs>
                        
                    </Card>
                </div>
                <div className="col-span-2 md:col-span-1 lg:col-span-1">
                    <CustomPieChart data={pieChartData} chartconfig={pieChartConfig} description="Expense" totalLabel="Expense" title={"Expenses from "+dateRangeNames.from+" to "+dateRangeNames.to}></CustomPieChart></div>
                </div>
                <div className="grid grid-rows-1 gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
                    <div>
                        <Card>
                            <CardHeader className="pb-2">
                                <div className="flex align-middle justify-between">
                                    <p>Salary Processing</p>
                                    <div className="max[200-px]"><DatePicker value={payrolldate} onChange={setPayrolldate}></DatePicker></div>
                                </div> 
                            </CardHeader>
                            <CardContent>
                                <Table className="rounded">
                                    <TableHeader>
                                        <TableHead>Employee</TableHead>
                                        <TableHead>Base Salary</TableHead>
                                        <TableHead>Extra Bonus</TableHead>
                                        <TableHead>Night Bonus</TableHead>
                                        <TableHead>Total</TableHead>
                                    </TableHeader>
                                    <TableBody className="border-t-2">
                                        {payrollData.map((row)=>(
                                            <TableRow key={row.empdocno}>
                                                <TableCell>{row.empname}</TableCell>
                                                <TableCell>{globalsettings.formatAmount(row.salary+"")}</TableCell>
                                                <TableCell>{globalsettings.formatAmount(row.workbonus+"")}</TableCell>
                                                <TableCell>{globalsettings.formatAmount(row.nightbonus+"")}</TableCell>
                                                <TableCell>{globalsettings.formatAmount(row.totalsalary+"")}</TableCell>
                                            </TableRow>
                                        ))}
                                        
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                        <Card>
                            <CardHeader className="pb-2">
                                <div className="flex align-middle justify-between">
                                    <p>Daily Balance</p>
                                    <div className="max[200-px]"><DatePicker value={dailybaldate} onChange={setDailybaldate}></DatePicker></div>
                                </div> 
                            </CardHeader>
                            <CardContent>
                                <Table className="rounded">
                                    <TableHeader>
                                        <TableHead>Opening Balance</TableHead>
                                        <TableHead>Daily Invoice</TableHead>
                                        <TableHead>Daily Expense</TableHead>
                                        <TableHead>Balance</TableHead>
                                        <TableHead>Closing Balance</TableHead>
                                    </TableHeader>
                                    <TableBody className="border-t-2">
                                        {dailybalData.map((row)=>(
                                            <TableRow key={row.docno}>
                                                <TableCell>{globalsettings.formatAmount(row.openingbalance+"")}</TableCell>
                                                <TableCell>{globalsettings.formatAmount(row.dailyinvoice+"")}</TableCell>
                                                <TableCell>{globalsettings.formatAmount(row.dailyexpense+"")}</TableCell>
                                                <TableCell>{globalsettings.formatAmount(row.dailybalance+"")}</TableCell>
                                                <TableCell>{globalsettings.formatAmount(row.closingbalance+"")}</TableCell>
                                            </TableRow>
                                        ))}
                                        
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                {/* <div className="md:col-span-1 lg:col-span-1">
                    
                </div>

                <div className="col md:col-span-1 lg:col-span-1">
                    
                </div> */}
        </main>
    )
}