import React, { useMemo } from "react";
import { AxisOptions, Chart } from "react-charts";
import useAssetStore from "store/asset_store";
import { getAssetTypeName } from "utils/asset";
import { generateGradientColor, HUES } from "utils/color";
import { Typography } from "antd";

type AssetTypeData = {
  typeName: string;
  value: number;
};

const AssetTypeValueBarChart: React.FC = () => {
  const { assets, assetRecords } = useAssetStore();

  const chartData = useMemo(() => {
    const groupedData = assetRecords.reduce((acc, record) => {
      const asset = assets.find((a) => a.asset_id === record.asset_id);
      const typeName = asset
        ? getAssetTypeName(asset.asset_type_id) || "Unknown"
        : "Unknown";

      if (!acc[typeName]) {
        acc[typeName] = 0;
      }
      acc[typeName] += record.value;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(groupedData)
      .map(([typeName, value]) => ({
        typeName,
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [assetRecords, assets]);

  const primaryAxis = useMemo<AxisOptions<AssetTypeData>>(
    () => ({
      getValue: (datum) => datum.typeName,
    }),
    []
  );

  const secondaryAxes = useMemo<AxisOptions<AssetTypeData>[]>(
    () => [
      {
        getValue: (datum) => datum.value,
        elementType: "bar",
      },
    ],
    []
  );

  return (
    <div>
      <div style={{ height: "400px" }}>
        <Typography.Title level={4}>Asset Type Overview</Typography.Title>
        <Chart
          options={{
            data: [{ data: chartData }],
            primaryAxis,
            secondaryAxes,
            getDatumStyle: (series) => ({
              color: generateGradientColor(
                series.index,
                chartData.length,
                HUES.BLUE
              ),
            }),
          }}
        />
      </div>
    </div>
  );
};

export default AssetTypeValueBarChart;
