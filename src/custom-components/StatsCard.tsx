import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { FC } from "react";
interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  changeText?: string;
  changeValue?: number;
}
const StatsCard: FC<StatsCardProps> = ({ label, value, icon: Icon, changeText, changeValue }) => {

    return (
      <Card x-chunk="dashboard-01-chunk-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{label}</CardTitle>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{changeText} {changeValue}</p>
        </CardContent>
      </Card>
    );
  };
  
  export default StatsCard;