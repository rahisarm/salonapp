import { toast } from "@/hooks/use-toast";
import axiosInstance from "./axiosInstance";

const getAction = (mode: string) => {
    switch(mode){
    case "A":
        return "Created";
    case "E":
        return "Updated";
    case "D":
        return "Deleted";
    default:
        return "Saved";
    }
  };

  const getMapping = (data:any,mode: string,endpoint:string) => {
    switch(mode){
    case "A":
        return axiosInstance.post(endpoint,data);
    case "E":
        return axiosInstance.put(endpoint,data);
    case "D":
        return axiosInstance.delete(endpoint,data);
    case "G":
        return axiosInstance.get(endpoint,data)
    default:
        console.error(`Unsupported mode: ${mode}`);
        return;
    }
  };
export function sendAPIRequest(data:any,mode:string,endpoint:string,label:string):Promise<void>{
    const action=getAction(mode);
    let axioscall=getMapping(data,mode,endpoint);

    return new Promise((resolve,reject)=>{
        if (!axioscall) {
            toast({
                title: "Invalid Action",
                description: `The operation for ${label} could not be completed due to an unsupported action mode.`,
                variant: "destructive",
            });
            reject();
            return;
        }

        axioscall
            .then((response) => {
                toast({
                    title: `${label} ${action}`,
                    description: `${label} has been ${action.toLowerCase()} successfully.`,
                    variant: "default", // You can choose "success", "error", etc.
                });
                resolve();
            })
            .catch((error) => {
                console.error(`Error fetching:`, error);
                toast({
                    title: `${label} ${action}`,
                    description: `${label} has been ${action.toLowerCase()} failed.`,
                    variant: "destructive", // You can choose "success", "error", etc.
                });
                reject(error);
            })
    })
    
    
}