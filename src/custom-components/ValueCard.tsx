import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettings } from "@/contexts/SettingsContext";
import { LucideIcon } from "lucide-react";
import { FC } from "react";
interface ValueCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  changeText?: string;
  changeValue?: number;
}
const ValueCard: FC<ValueCardProps> = ({ label, value, icon: Icon, changeText, changeValue }) => {
    const globalsettings=useSettings();
    return (
      <Card x-chunk="dashboard-01-chunk-1" className="mb-2">
        <CardContent className="p-2">
          <div className=" flex items-center space-x-4  p-2">
            {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                {label}
              </p>
            </div>
            <div className="text-2xl font-bold">{globalsettings.formatAmount(value+"")}</div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  export default ValueCard;