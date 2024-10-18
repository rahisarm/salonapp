"use client";

import { FC } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface CustomBarChartProps {
  chartData: Array<{ [key: string]: number | string }>;
  chartConfig: ChartConfig;
  title: string;
  description: string;
  footerText?: string;
  changePercentage?: number;
  barDataKey: string; // Data key for bar values (like 'desktop' in this case)
  labelPosition?: "top" | "inside"; // Label position (default to "top")
}

const CustomBarChart: FC<CustomBarChartProps> = ({
  chartData,
  chartConfig,
  title,
  description,
  footerText,
  changePercentage = 0,
  barDataKey,
  labelPosition = "top",
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <XAxis dataKey={barDataKey} type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey={barDataKey} layout="vertical" fill="var(--color-bar)" radius={4}>
              <LabelList
                dataKey={barDataKey}
                position={labelPosition === "top" ? "top" : "insideTop"}
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        {changePercentage !== 0 && (
          <div className="flex gap-2 font-medium leading-none">
            Trending up by {changePercentage}% this month <TrendingUp className="h-4 w-4" />
          </div>
        )}
        <div className="leading-none text-muted-foreground">
          {footerText}
        </div>
      </CardFooter> */}
    </Card>
  );
};

export default CustomBarChart;
