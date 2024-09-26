import React from "react";
import { Chart, AxisOptions } from "react-charts";
import { Typography } from "antd";
import { generateGradientColor, HUES } from "utils/color";

interface AssetValueBarChartProps {
  chartData: Array<{ name: string; value: number; percentage: number }>;
  scaleType?: "band" | "linear" | "point";
}

const AssetValueBarChart: React.FC<AssetValueBarChartProps> = ({
  chartData,
}) => {
  const data = [
    {
      label: "Assets",
      data: chartData.map((item) => ({
        primary: item.name,
        secondary: item.value,
        percentage: item.percentage,
      })),
    },
  ];

  const primaryAxis = React.useMemo(
    () => ({
      getValue: (datum: any) =>
        `${datum.primary} (${datum.percentage.toFixed(1)}%)`,
      showGrid: false,
    }),
    []
  );

  const secondaryAxes = React.useMemo(
    () => [
      {
        getValue: (datum: { secondary: number }) => datum.secondary,
        elementType: "bar" as const,
      } as AxisOptions<{
        primary: string;
        secondary: number;
        percentage: number;
      }>,
    ],
    []
  );

  return (
    <div style={{ width: "100%", height: 400 }}>
      <Typography.Title level={4}>Asset Overview</Typography.Title>
      <Chart
        options={{
          data,
          primaryAxis,
          secondaryAxes,
          dark: false,
          getDatumStyle: (series) => ({
            color: generateGradientColor(
              series.index,
              data[0].data.length,
              HUES.BLUE
            ),
          }),
        }}
      />
    </div>
  );
};

export default AssetValueBarChart;
