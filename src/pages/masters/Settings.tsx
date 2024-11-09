import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useSettings } from "@/contexts/SettingsContext";
import { CustDropDown } from "@/custom-components/custdropdown";
import { Icons } from "@/custom-components/icons";
import { sendAPIRequest } from "@/services/common";
import { Save } from "lucide-react";
import React, { useEffect, useState } from "react";

interface ConfigProps{
    docno:number;
    fieldname:string;
    method:number;
    configvalue:string;
    description:string;
    uitype:string;
}
export function Settings(){
    
    const [configs,setConfigs]=useState<ConfigProps[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    
    const globalsettings=useSettings();
    useEffect(()=>{
        getConfigs();
    },[]);

    function getConfigs(){
        sendAPIRequest(null,"G","/config","Settings").then((response)=>{
            if(response.data){
                setConfigs(response.data);
            }
        })
        .catch((error)=>{

        }).finally(()=>{

        });
    }

    function handleConfigChange(
        docno: number,
        field: keyof ConfigProps,
        value: any
    ) {
        // Update the specific config row based on the field type (method, configvalue, etc.)
        setConfigs((prevConfigs) =>
            prevConfigs.map((config) =>
                config.docno === docno ? { ...config, [field]: value } : config
            )
        );
    }

    function updateConfigs(){
        setIsLoading(true);
        console.log(configs);
        sendAPIRequest(configs,"E","/config","Settings").then((response)=>{
            globalsettings.reloadSettings();
        }).then((e)=>{
            console.log(e);
        }).finally(()=>{
            setIsLoading(false);
        });
    }
    return(
        <>
            <Card>
                <CardHeader>
                    <h2 className="font-semibold text-4xl">Settings</h2>
                    <p>Manage your account settings and preferences</p>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableBody>
                            {configs.map((row)=>(
                                <TableRow key={row.docno}>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <Switch checked={row.method==1?true:false} onCheckedChange={(checked) =>
                                                handleConfigChange(row.docno, "method", checked ? 1 : 0)
                                            }></Switch>
                                            <div className="ms-6">
                                                <p>{row.fieldname}</p>
                                                <p className="text-muted-foreground">{row.description}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {row.uitype=='input'?<Input defaultValue={row.configvalue} onChange={(e) =>
                                                handleConfigChange(
                                                    row.docno,
                                                    "configvalue",
                                                    e.target.value
                                                )
                                            }></Input>:<CustDropDown dataLabel="Account" dataType="glaccount" onValueChange={(value) =>
                                                handleConfigChange(row.docno, "configvalue", value)
                                            } value={row.configvalue}></CustDropDown>}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter className="justify-end">
                <Button type="submit" disabled={isLoading} onClick={updateConfigs}>
                    {isLoading && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </CardFooter>
            </Card>
        </>
    )
}