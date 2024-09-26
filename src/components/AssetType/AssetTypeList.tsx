import React, { useState } from "react";
import { Collapse, Typography, Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AssetList from "components/Asset/AssetList";
import useAssetStore from "store/asset_store";
import AddAssetForm from "components/Asset/AddAssetForm";

const { Panel } = Collapse;
const { Title, Text } = Typography;

const AssetTypeList: React.FC = () => {
  const { assetTypes, assets } = useAssetStore();

  const [openAddAssetForm, setOpenAddAssetForm] = useState(false);
  const [selectedAssetType, setSelectedAssetType] = useState<number | null>(
    null
  );

  const selectAssetsByAssetTypeId = React.useCallback(
    (assetTypeId: number) => {
      return assets.filter((asset) => asset.asset_type_id === assetTypeId);
    },
    [assets]
  );

  const handleAddAsset = (assetTypeId: number) => {
    setSelectedAssetType(assetTypeId);
    setOpenAddAssetForm(true);
  };

  return (
    <div>
      <Title level={4}>Asset Types</Title>
      {assetTypes.length > 0 ? (
        <Collapse
          defaultActiveKey={assetTypes.map((type) =>
            type.asset_type_id.toString()
          )}
        >
          {assetTypes.map((type) => (
            <Panel header={type.name} key={type.asset_type_id.toString()}>
              {selectAssetsByAssetTypeId(type.asset_type_id).length > 0 && (
                <AssetList assetTypeId={type.asset_type_id} />
              )}
              <Button
                type="primary"
                onClick={() => handleAddAsset(type.asset_type_id)}
                icon={<PlusOutlined />}
              >
                Asset
              </Button>
            </Panel>
          ))}
        </Collapse>
      ) : (
        <Text>No asset types available.</Text>
      )}
      <Modal
        title="Add New Asset"
        open={openAddAssetForm}
        onCancel={() => setOpenAddAssetForm(false)}
        footer={null}
      >
        <AddAssetForm
          onClose={() => setOpenAddAssetForm(false)}
          selectedAssetType={selectedAssetType}
        />
      </Modal>
    </div>
  );
};

export default AssetTypeList;
