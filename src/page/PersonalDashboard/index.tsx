import React, { useMemo } from "react";
import useAssetStore from "store/asset_store";
import useUserStore from "store/user_store";
import AssetValueBarChart from "components/Charts/AssetValueBarChart";
import AssetTypeValueBarChart from "components/Charts/AssetTypeValueBarChart";
import { Typography } from "antd";
import { formatNumberWithComma } from "utils/utils";

const AssetRecordComponent = () => {
  const { isLoading: isLoadingUser, error: userError } = useUserStore();
  const { assetRecords, isLoadingAssets, errorAssets, isLoadingAssetTypes } =
    useAssetStore();

  const totalValue = useMemo(
    () => assetRecords.reduce((sum, record) => sum + record.value, 0),
    [assetRecords]
  );

  const chartData = useMemo(() => {
    console.log(assetRecords);
    return assetRecords
      .map((record) => ({
        name: record.asset_name,
        value: record.value,
        percentage: (record.value / totalValue) * 100,
      }))
      .sort((a, b) => b.value - a.value);
  }, [assetRecords, totalValue]);

  if (isLoadingUser || isLoadingAssetTypes || isLoadingAssets) {
    return <div>Loading...</div>;
  }

  if (errorAssets || userError) {
    return <div>Error: {errorAssets || userError}</div>;
  }

  return (
    <div>
      <div>
        <Typography.Title level={3}>
          Total Value: ${formatNumberWithComma(totalValue)}
        </Typography.Title>
      </div>

      {chartData.length > 0 ? (
        <>
          <AssetValueBarChart chartData={chartData} />
          <div style={{ marginBottom: "20px" }}></div>
          <AssetTypeValueBarChart />
        </>
      ) : (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "10px" }}>📊</div>
          <div>
            No asset records available. Add some asset records to see your
            overview.
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetRecordComponent;
