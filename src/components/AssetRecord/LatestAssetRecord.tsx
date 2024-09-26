import React from "react";
import { Typography } from "antd";
import useAssetStore from "store/asset_store";
import { formatNumberWithComma } from "utils/utils";

interface LatestAssetRecordProps {
  assetId: number;
}

const LatestAssetRecord: React.FC<LatestAssetRecordProps> = ({ assetId }) => {
  const { assetRecords } = useAssetStore();

  const filteredAssetRecords = React.useMemo(() => {
    return assetRecords.find((record) => record.asset_id === assetId);
  }, [assetRecords, assetId]);

  return filteredAssetRecords ? (
    <Typography.Text type="secondary">
      <Typography.Text>
        Value: {formatNumberWithComma(filteredAssetRecords.value)}
      </Typography.Text>
    </Typography.Text>
  ) : null;
};

export default LatestAssetRecord;
