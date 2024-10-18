"use client";

import { FC } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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

// Define prop types
interface ReusableBarChartProps {
  chartData: Array<{ [key: string]: number | string }>;
  chartConfig: ChartConfig;
  title: string;
  description: string;
  footerText?: string;
  changePercentage?: number; // Optional change indicator
}

const MultiBarChart: FC<ReusableBarChartProps> = ({
  chartData,
  chartConfig,
  title,
  description,
  footerText,
  changePercentage = 0,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => (typeof value === "string" ? value.slice(0, 3) : value)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            {/* Render bars dynamically based on chart config */}
            {Object.keys(chartConfig).map((key) => (
              <Bar key={key} dataKey={key} fill={`var(--color-${key})`} radius={4} />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        {changePercentage !== 0 && (
          <div className="flex gap-2 font-medium leading-none">
            Trending up by {changePercentage}% <TrendingUp className="h-4 w-4" />
          </div>
        )}
        <div className="leading-none text-muted-foreground">
          {footerText}
        </div>
      </CardFooter> */}
    </Card>
  );
};

export default MultiBarChart;
