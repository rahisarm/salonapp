// services/fetchSettings.ts
import axiosInstance from "./axiosInstance";

interface SettingItem {
    fieldname: string;
    method: string;
    configvalue: string;
    description:string;
    docno:any;
  }
  
  export const fetchSettings = async (): Promise<Record<string, { method: string; value: string }>> => {
    try {
      const response = await axiosInstance.get<SettingItem[]>("/config");
      const settings = response.data;
      console.log(settings);
      // Create a map that includes both method and config_value for each fieldname
      const settingsMap = settings.reduce<Record<string, { method: string; value: string }>>((acc, item) => {
        acc[item.fieldname] = { method: item.method, value: item.configvalue };
        return acc;
      }, {});
  
      return settingsMap;
    } catch (error) {
      console.error("Failed to fetch settings", error);
      return {};
    }
  };
